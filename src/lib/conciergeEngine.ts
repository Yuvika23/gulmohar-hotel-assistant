import { checkAvailability, AvailableRoom } from "@/lib/availabilityService";
import { callGemini } from "@/lib/geminiClient";
import { Room } from "@/data/hotelKnowledge";

// ─── Public Types ────────────────────────────────────────────────────────────

export interface ChatMessageData {
  id: string;
  sender: "guest" | "concierge";
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  availabilityData?: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    rooms: AvailableRoom[];
  };
  highlightedRoom?: Room;
}

export interface ChatRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  suggestedActions: string[];
  intent: string;
  availabilityData?: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    rooms: AvailableRoom[];
  };
  highlightedRoom?: Room;
}

// ─── NL Extraction Helpers ───────────────────────────────────────────────────
// These remain deterministic. They are used ONLY to extract structured data
// (dates, guest counts) from natural language BEFORE calling the LLM, so that
// the availability service can stay fully deterministic.

/**
 * Extracts a numeric guest count from a message string.
 * Handles word forms ("three guests"), numeric forms ("3 people"),
 * and contextual forms ("for 2", "party of 4").
 */
export function extractGuestCount(text: string): number | null {
  const lower = text.toLowerCase();

  const wordMap: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, solo: 1, couple: 2,
  };

  for (const [word, count] of Object.entries(wordMap)) {
    const regex = new RegExp(`\\b(${word})\\s*(guests?|people|persons?|adults?)?\\b`, "i");
    if (regex.test(lower)) return count;
  }

  const explicitMatch =
    lower.match(/\b(\d+)\s+(?:guests?|people|persons?|adults?|pax)\b/i) ||
    lower.match(/\bfor\s+(\d+)(?:\s+(?:guests?|people|persons?|adults?|pax))?\b/i) ||
    lower.match(/\b(?:party|group)\s+of\s+(\d+)\b/i);

  if (explicitMatch?.[1]) {
    const num = parseInt(explicitMatch[1], 10);
    if (num > 0 && num <= 10) return num;
  }

  return null;
}

/**
 * Extracts check-in and check-out dates from natural language.
 * Supports ISO (2026-10-10), month-day (Dec 20 to Dec 23), and ordinal forms.
 */
export function extractStayDates(text: string): { checkIn: string | null; checkOut: string | null } {
  // Pattern 1: ISO
  const isoMatch = text.match(/(\d{4}-\d{2}-\d{2})\s*(?:to|until|-|through|and)\s*(\d{4}-\d{2}-\d{2})/i);
  if (isoMatch) return { checkIn: isoMatch[1], checkOut: isoMatch[2] };

  // Pattern 2: "Dec 20 to Dec 23" or "December 20 to December 23"
  const months = "jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?";
  const monthDayRegex = new RegExp(
    `(${months})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:to|-|until|through)\\s*(?:(${months})\\s+)?(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`,
    "i"
  );
  const mdMatch = text.match(monthDayRegex);
  if (mdMatch) {
    const monthIndex = (m: string) => new Date(`${m} 1, 2000`).getMonth();
    const m1 = monthIndex(mdMatch[1]);
    const m2 = monthIndex(mdMatch[3] || mdMatch[1]);
    const day1 = parseInt(mdMatch[2], 10);
    const day2 = parseInt(mdMatch[4], 10);
    const year = mdMatch[5] ? parseInt(mdMatch[5], 10) : new Date().getFullYear();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return {
      checkIn: `${year}-${pad(m1 + 1)}-${pad(day1)}`,
      checkOut: `${year}-${pad(m2 + 1)}-${pad(day2)}`,
    };
  }

  return { checkIn: null, checkOut: null };
}

/**
 * Heuristic to detect whether a message is asking about room availability.
 * This is intentionally broad — the LLM handles everything else.
 */
function isAvailabilityIntent(message: string, history: { role: string; content: string }[]): boolean {
  const lower = message.toLowerCase();

  // Direct availability keywords
  const directKeywords = [
    "available", "availability", "book a room", "reserve", "check dates",
    "vacant", "any rooms", "do you have rooms", "check availability",
    "room for", "rooms for", "stay from", "stay between", "check in on",
    "nights from", "book for", "book from",
  ];
  if (directKeywords.some((kw) => lower.includes(kw))) return true;

  // Stay + date pattern
  if ((lower.includes("stay") || lower.includes("visit")) && extractStayDates(message).checkIn) {
    return true;
  }

  // Has a date range — very likely an availability question
  if (extractStayDates(message).checkIn && extractStayDates(message).checkOut) {
    return true;
  }

  // Follow-up: "what about two adults instead?" — check recent history for availability context
  const recentContext = history.slice(-3).map((h) => h.content).join(" ").toLowerCase();
  const isFollowUpAvailability =
    recentContext.includes("availability") ||
    recentContext.includes("available") ||
    recentContext.includes("checking") ||
    recentContext.includes("nights");

  if (isFollowUpAvailability && (extractGuestCount(message) !== null || lower.includes("instead") || lower.includes("what about"))) {
    return true;
  }

  return false;
}

// ─── Main Concierge Router ───────────────────────────────────────────────────

/**
 * The main entry point for all chat requests.
 *
 * Flow:
 *  1. Check if this is an availability intent (deterministic detection)
 *  2a. YES → extract dates/guests → call checkAvailability() → return structured data
 *  2b. NO  → call Gemini LLM with system prompt + hotel KB + history
 *  3. Return ChatResponse
 *
 * The LLM is NEVER asked to calculate or invent availability.
 * The availability service is NEVER replaced by the LLM.
 */
export async function processConciergeMessage(request: ChatRequest): Promise<ChatResponse> {
  const { message, history = [] } = request;
  const lowerMsg = message.toLowerCase().trim();

  // ── AVAILABILITY PATH (fully deterministic, no LLM) ──────────────────────
  if (isAvailabilityIntent(message, history)) {
    // Extract dates from current message first, then fall back to recent history
    let dates = extractStayDates(message);
    const recentHistoryText = history.slice(-4).map((h) => h.content).join(" ");

    if (!dates.checkIn || !dates.checkOut) {
      // Try to find dates from history (e.g., follow-up: "what about two adults instead?")
      const historyDates = extractStayDates(recentHistoryText);
      if (historyDates.checkIn && historyDates.checkOut) {
        dates = historyDates;
      }
    }

    // Try to get guest count from current message first, then fall back to recent history
    let guests = extractGuestCount(message);
    if (!guests) {
      guests = extractGuestCount(recentHistoryText) ?? 2;
    }

    if (dates.checkIn && dates.checkOut) {
      // We have all info — run deterministic availability check
      const availability = checkAvailability(dates.checkIn, dates.checkOut, guests);

      if (!availability.success) {
        return {
          reply: `I'd be happy to help with your stay. There was a small issue with the dates provided: ${availability.summary} Could you clarify your travel dates?`,
          suggestedActions: ["Adjust Dates", "Explore All Suites", "Contact Front Desk"],
          intent: "availability_invalid_dates",
        };
      }

      const nightLabel = availability.nights === 1 ? "night" : "nights";
      const guestLabel = guests === 1 ? "guest" : "guests";
      const roomCount = availability.rooms.length;

      const reply = `I've checked our room ledger for ${availability.nights} ${nightLabel} (${dates.checkIn} to ${dates.checkOut}) for ${guests} ${guestLabel}. We have ${roomCount} room option${roomCount !== 1 ? "s" : ""} available that match your party size. You can review room details and rates below.`;

      return {
        reply,
        suggestedActions: ["Check Cancellation Policy", "Is Breakfast Included?", "View Amenities"],
        intent: "availability_results",
        availabilityData: {
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
          guests,
          nights: availability.nights,
          rooms: availability.rooms,
        },
      };
    } else {
      // Missing dates — ask the guest, but check if we at least have guests
      const guestPart = guests ? ` for ${guests} guest${guests > 1 ? "s" : ""}` : "";
      return {
        reply: `I'd be delighted to check our availability${guestPart}. Could you let me know your preferred check-in and check-out dates?`,
        suggestedActions: [
          "Check Oct 10 – 14 (2 guests)",
          "Check Dec 20 – 23 (3 guests)",
          "Explore All Rooms",
        ],
        intent: "availability_missing_dates",
      };
    }
  }

  // ── LLM PATH (Gemini with hotel knowledge base) ───────────────────────────
  try {
    const reply = await callGemini(message, history);

    return {
      reply,
      suggestedActions: generateContextualSuggestions(lowerMsg),
      intent: "llm_response",
    };
  } catch (error: unknown) {
    console.error("[ConciergeEngine] Gemini API error:", error);

    const isKeyMissing =
      error instanceof Error && error.message.includes("GEMINI_API_KEY");

    const friendlyError = isKeyMissing
      ? "The concierge assistant is not configured yet. Please ensure the GEMINI_API_KEY is set in .env.local."
      : "I'm temporarily unable to respond to that right now. Please try again in a moment. I can still help you check room availability.";

    return {
      reply: friendlyError,
      suggestedActions: ["Check Availability", "What time is check-in?", "Is breakfast included?"],
      intent: "llm_error",
    };
  }
}

// ─── Contextual Suggestion Generator ────────────────────────────────────────
// Produces relevant quick-action chips based on what the guest just asked.
// This is lightweight UX polish — not intent classification.

function generateContextualSuggestions(lowerMsg: string): string[] {
  if (lowerMsg.includes("breakfast") || lowerMsg.includes("dining")) {
    return ["What time is breakfast?", "Explore Dining Venues", "Check Availability"];
  }
  if (lowerMsg.includes("pool") || lowerMsg.includes("spa") || lowerMsg.includes("wellness")) {
    return ["Pool Hours", "Spa Treatments", "Check Availability"];
  }
  if (lowerMsg.includes("check-in") || lowerMsg.includes("check in") || lowerMsg.includes("arrival")) {
    return ["What time is check-out?", "Early Check-in Policy", "Check Availability"];
  }
  if (lowerMsg.includes("cancel") || lowerMsg.includes("refund")) {
    return ["Check Availability", "Modify Booking", "Contact Concierge"];
  }
  if (lowerMsg.includes("room") || lowerMsg.includes("suite") || lowerMsg.includes("bed")) {
    return ["Check Availability", "Is Breakfast Included?", "View All Suites"];
  }
  return [
    "Is breakfast included?",
    "Which room is best for three guests?",
    "Check Availability",
    "What time is check-in?",
  ];
}
