import { describe, it, expect, vi, beforeEach } from "vitest";
import { processConciergeMessage, extractGuestCount, extractStayDates } from "../src/lib/conciergeEngine";
import { checkAvailability, validateBookingParams } from "../src/lib/availabilityService";

// ─── Mock Gemini so tests run without a real API key ─────────────────────────
// All deterministic (availability) paths do NOT call Gemini.
// LLM paths are tested with a controlled mock response.
vi.mock("../src/lib/geminiClient", () => ({
  callGemini: vi.fn(async (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes("breakfast")) {
      return "Yes, breakfast is included with our Premium King Room and Executive Suite. For Deluxe King Room and Family Room, our breakfast buffet is available with South Indian, North Indian, and continental options.";
    }
    if (lower.includes("gym") || lower.includes("fitness")) {
      return "The Gulmohar features a fully equipped 24/7 fitness centre with cardio machines, free weights, and stretching mats.";
    }
    if (lower.includes("check-in") || lower.includes("check in")) {
      return "Check-in begins at 2:00 PM and check-out is at 11:00 AM. Early check-in from 10:00 AM is available subject to room readiness.";
    }
    if (lower.includes("amenities") || lower.includes("facilities")) {
      return "The Gulmohar offers an open-air swimming pool, 24/7 fitness centre, high-speed Wi-Fi, all-day dining restaurant, complimentary valet parking, and business lounge.";
    }
    if (lower.includes("cancellation") || lower.includes("cancel")) {
      return "You may cancel or reschedule without charge up to 48 hours prior to your 2:00 PM check-in date. Cancellations within 48 hours incur the first night's room charge.";
    }
    if (lower.includes("connecting room")) {
      return "I'm sorry, I don't have specific details on connecting rooms in our hotel records. Please check with our front desk team at reservations@thegulmohar.in or +91 80 4965 7700.";
    }
    if (lower.includes("which room") || lower.includes("suitable for") || lower.includes("three adults")) {
      return "For three adults, our Family Room (₹9,200/night) with a king bed plus a single bed, or our Executive Suite (₹12,500/night) are suitable options.";
    }
    if (lower.includes("does that") || lower.includes("does it include")) {
      return "Yes, breakfast is included with the Executive Suite and Premium King Room.";
    }
    return "Thank you for your inquiry. I'd be happy to help with any questions about The Gulmohar.";
  }),
  MODEL_NAME: "gemini-2.5-flash",
}));

describe("The Gulmohar — LLM-Powered Concierge Engine Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Extraction helpers (deterministic) ──────────────────────────────────

  describe("extractGuestCount()", () => {
    it("extracts numeric guest count", () => {
      expect(extractGuestCount("for 3 guests")).toBe(3);
      expect(extractGuestCount("room for 2 people")).toBe(2);
      expect(extractGuestCount("party of 4")).toBe(4);
    });

    it("extracts word-form guest count", () => {
      expect(extractGuestCount("three guests")).toBe(3);
      expect(extractGuestCount("two people")).toBe(2);
      expect(extractGuestCount("couple")).toBe(2);
    });

    it("returns null when no guest count found", () => {
      expect(extractGuestCount("Do you have a pool?")).toBeNull();
    });
  });

  describe("extractStayDates()", () => {
    it("extracts ISO date ranges", () => {
      const result = extractStayDates("available from 2026-10-10 to 2026-10-13");
      expect(result.checkIn).toBe("2026-10-10");
      expect(result.checkOut).toBe("2026-10-13");
    });

    it("extracts month-day ranges", () => {
      const result = extractStayDates("from Dec 20 to Dec 23");
      expect(result.checkIn).toContain("-12-20");
      expect(result.checkOut).toContain("-12-23");
    });

    it("returns nulls when no dates found", () => {
      const result = extractStayDates("Is breakfast included?");
      expect(result.checkIn).toBeNull();
      expect(result.checkOut).toBeNull();
    });
  });

  // ── Availability path (deterministic — no LLM) ──────────────────────────

  describe("Scenario 1: Full availability request with ISO dates", () => {
    it("runs deterministically without calling Gemini", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const response = await processConciergeMessage({
        message: "Do you have rooms available from 2026-10-10 to 2026-10-13 for 3 guests?",
      });

      expect(response.intent).toBe("availability_results");
      expect(response.availabilityData).toBeDefined();
      expect(response.availabilityData?.checkIn).toBe("2026-10-10");
      expect(response.availabilityData?.checkOut).toBe("2026-10-13");
      expect(response.availabilityData?.guests).toBe(3);
      expect(response.availabilityData?.nights).toBe(3);
      expect(response.availabilityData?.rooms.length).toBeGreaterThan(0);
      response.availabilityData?.rooms.forEach((r) => {
        expect(r.capacity).toBeGreaterThanOrEqual(3);
      });
      // Gemini should NOT have been called
      expect(callGemini).not.toHaveBeenCalled();
    });
  });

  describe("Scenario 2: Month-name natural language availability", () => {
    it("parses 'Dec 20 to Dec 23 for 2 people' correctly", async () => {
      const response = await processConciergeMessage({
        message: "Do you have rooms from Dec 20 to Dec 23 for 2 people?",
      });

      expect(response.intent).toBe("availability_results");
      expect(response.availabilityData?.guests).toBe(2);
      expect(response.availabilityData?.checkIn).toContain("-12-20");
      expect(response.availabilityData?.checkOut).toContain("-12-23");
      expect(response.availabilityData?.nights).toBe(3);
    });
  });

  describe("Scenario 3: Missing dates — asks for clarification", () => {
    it("returns availability_missing_dates intent and does not call Gemini", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const response = await processConciergeMessage({
        message: "Do you have any available rooms?",
      });

      expect(response.intent).toBe("availability_missing_dates");
      expect(response.availabilityData).toBeUndefined();
      expect(response.reply).toContain("check-in");
      expect(callGemini).not.toHaveBeenCalled();
    });
  });

  describe("Scenario 4: Invalid dates validation", () => {
    it("rejects checkout before checkin", () => {
      const validation = validateBookingParams("2026-10-15", "2026-10-10", 2);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain("Check-out date must be at least one day after");
    });

    it("rejects excessive party size", () => {
      const availability = checkAvailability("2026-10-10", "2026-10-14", 12);
      expect(availability.success).toBe(false);
      expect(availability.error).toContain("reservations@thegulmohar.in");
    });
  });

  describe("Scenario 5: Multi-night pricing calculation", () => {
    it("calculates totalPrice = pricePerNight × nights correctly", () => {
      const result = checkAvailability("2026-11-01", "2026-11-05", 2); // 4 nights
      expect(result.success).toBe(true);
      expect(result.nights).toBe(4);
      const deluxeRoom = result.rooms.find((r) => r.id === "deluxe-king-room");
      expect(deluxeRoom).toBeDefined();
      if (deluxeRoom) {
        expect(deluxeRoom.totalPrice).toBe(deluxeRoom.pricePerNight * 4);
      }
    });
  });

  // ── LLM path (Gemini — mocked) ───────────────────────────────────────────

  describe("Scenario 6: Normal hotel question — routes to Gemini", () => {
    it("'Is breakfast included?' calls Gemini and returns KB-grounded answer", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const response = await processConciergeMessage({ message: "Is breakfast included?" });

      expect(callGemini).toHaveBeenCalledOnce();
      expect(response.intent).toBe("llm_response");
      expect(response.reply).toContain("breakfast");
      expect(response.reply.toLowerCase()).toContain("premium king");
    });

    it("'What amenities do you have?' calls Gemini", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const response = await processConciergeMessage({ message: "What amenities do you have?" });

      expect(callGemini).toHaveBeenCalledOnce();
      expect(response.intent).toBe("llm_response");
      expect(response.reply.toLowerCase()).toMatch(/pool|fitness|wi-fi|dining/);
    });

    it("'What time is check-in?' calls Gemini", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const response = await processConciergeMessage({ message: "What time is check-in?" });

      expect(callGemini).toHaveBeenCalledOnce();
      expect(response.reply).toContain("2:00 PM");
    });
  });

  describe("Scenario 7: Cancellation policy via LLM", () => {
    it("'What is the cancellation policy?' routes through Gemini", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const response = await processConciergeMessage({ message: "What is the cancellation policy?" });

      expect(callGemini).toHaveBeenCalledOnce();
      expect(response.reply).toContain("48 hours");
    });
  });

  describe("Scenario 8: Follow-up context via conversation history", () => {
    it("passes history to Gemini for contextual follow-up understanding", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const history: { role: "user" | "assistant"; content: string }[] = [
        { role: "user", content: "Which room is suitable for three adults?" },
        { role: "assistant", content: "Our Family Room accommodates up to 3 adults..." },
      ];

      const response = await processConciergeMessage({
        message: "Does that room include breakfast?",
        history,
      });

      expect(callGemini).toHaveBeenCalledOnce();
      const callArgs = vi.mocked(callGemini).mock.calls[0];
      expect(callArgs[1]).toHaveLength(2);
      expect(callArgs[1][0].role).toBe("user");
      expect(response.reply.toLowerCase()).toContain("breakfast");
    });
  });

  describe("Scenario 9: Availability follow-up ('what about two adults instead?')", () => {
    it("detects follow-up availability intent from recent history context", async () => {
      const { callGemini } = await import("../src/lib/geminiClient");
      const history: { role: "user" | "assistant"; content: string }[] = [
        { role: "user", content: "Do you have rooms from Oct 10 to Oct 14 for 3 guests?" },
        { role: "assistant", content: "We have rooms available for your 4-night stay." },
      ];

      const response = await processConciergeMessage({
        message: "What about two adults instead?",
        history,
      });

      expect(callGemini).not.toHaveBeenCalled();
      expect(response.intent).toBe("availability_results");
      expect(response.availabilityData?.guests).toBe(2);
      expect(response.availabilityData?.checkIn).toContain("10-10");
    });
  });

  describe("Scenario 10: Connecting rooms — graceful unknown boundary", () => {
    it("routes to Gemini and returns boundary response (not hallucinated data)", async () => {
      const response = await processConciergeMessage({
        message: "Do you have connecting rooms?",
      });

      expect(response.intent).toBe("llm_response");
      expect(response.reply.toLowerCase()).toMatch(/don't have|not have|check with|front desk|reservations/);
    });
  });
});
