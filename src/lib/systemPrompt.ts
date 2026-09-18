import { HOTEL_DATA } from "@/data/hotelKnowledge";

/**
 * Serializes the hotel knowledge base into a compact, structured text block
 * that is embedded into the Gemini system prompt.
 *
 * This is the single source of truth — the LLM reads ONLY from here.
 * It cannot invent anything not present in hotelKnowledge.ts.
 */
export function buildKnowledgeBaseContext(): string {
  const { name, location, address, tagline, overview, checkIn, checkOut, breakfast, cancellation, rooms, dining, amenities, policies, faq } = HOTEL_DATA;

  const roomsList = rooms.map((r) => `
  [ROOM: ${r.name}]
  Category: ${r.category} | Capacity: Up to ${r.capacity} adults | Bed: ${r.bedType}
  Size: ${r.sizeSqm} m² | View: ${r.view}
  Price: ₹${r.pricePerNight.toLocaleString("en-IN")} per night
  Description: ${r.description}
  Amenities: ${r.amenities.join(", ")}
  Highlights: ${r.highlights.join(", ")}`).join("\n");

  const diningList = dining.map((d) => `
  [DINING: ${d.name}]
  Type: ${d.type} | Hours: ${d.hours}
  Breakfast included: ${d.breakfastIncluded ? "Included with Premium King Room and Executive Suite" : "A la carte or optional buffet charge"}
  Description: ${d.description}
  ${d.dressCode ? `Dress code: ${d.dressCode}` : ""}
  Reservations: ${d.reservations}`).join("\n");

  const amenitiesList = amenities.map((a) => `
  [AMENITY: ${a.name}]
  Category: ${a.category}
  ${a.hours ? `Hours: ${a.hours}` : ""}
  Description: ${a.description}`).join("\n");

  const policiesList = policies.map((p) => `
  [POLICY: ${p.title}]
  Summary: ${p.summary}
  Details: ${p.details.join(" | ")}`).join("\n");

  const faqList = faq.map((f) => `
  Q: ${f.question}
  A: ${f.answer}`).join("\n");

  return `
==================================================
HOTEL: ${name}
Location: ${location}
Address: ${address}
Tagline: ${tagline}
Overview: ${overview}

CHECK-IN / CHECK-OUT:
- Check-in: ${checkIn.standardTime}
- Early check-in: ${checkIn.earlyCheckInPolicy}
- Luggage: ${checkIn.luggagePolicy}
- Check-out: ${checkOut.standardTime}
- Late check-out: ${checkOut.lateCheckOutPolicy}

BREAKFAST:
- Hours: ${breakfast.hours}
- Location: ${breakfast.location}
- Details: ${breakfast.buffetAndALaCarte}
- Dietary options: ${breakfast.dietaryOptions.join(", ")}

CANCELLATION POLICY:
- Standard: ${cancellation.standardPolicy}
- Cutoff: ${cancellation.flexibleCutoffHours} hours
- Penalty after cutoff: ${cancellation.penaltyAfterCutoff}
- Non-refundable terms: ${cancellation.nonRefundableTerms}

==================================================
ROOMS:
${roomsList}

==================================================
DINING VENUES:
${diningList}

==================================================
AMENITIES & FACILITIES:
${amenitiesList}

==================================================
POLICIES:
${policiesList}

==================================================
FREQUENTLY ASKED QUESTIONS:
${faqList}
==================================================
`.trim();
}

/**
 * The complete system prompt sent to Gemini for every chat request.
 * The hotel knowledge base is embedded directly so the model has full context.
 */
export function buildSystemPrompt(): string {
  const knowledgeBase = buildKnowledgeBaseContext();

  return `You are the digital guest assistant for The Gulmohar, a modern boutique hotel in Bengaluru, India.

YOUR ROLE & RESPONSIBILITIES:
- Help hotel guests with accurate information about rooms, dining, amenities, policies, check-in/out, and services.
- Help guests select the most suitable room for their party size (e.g., Deluxe King or Premium King for up to 2 adults; Family Room or Executive Suite for 3 adults).
- Answer questions clearly, naturally, and warmly — exactly like a professional, friendly hotel team member.

VOICE AND TONE:
- Speak naturally, like a helpful hotel staff member.
- Do NOT sound like an AI chatbot.
- Avoid flowery, archaic, or artificial phrasing such as "According to our archives...", "At our esteemed establishment...", "Your refined stay...", or foreign words.
- Give direct, helpful answers:
  * For example, if asked "Is breakfast included?":
    "Breakfast is included with our Premium King Room and Executive Suite. For Deluxe King Room and Family Room bookings, breakfast can be added or enjoyed at our all-day dining buffet, which features South Indian, North Indian, and continental options."
  * If asked about check-in:
    "Check-in is at 2:00 PM, and check-out is at 11:00 AM. Early check-in from 10:00 AM is available subject to room readiness on the day."
- Always format prices in Indian Rupees using the symbol ₹ (e.g., ₹6,500/night).

CRITICAL RULES:
1. ONLY answer using the hotel information provided below in the HOTEL KNOWLEDGE BASE.
2. NEVER invent room types, features, amenities, policies, prices, or availability that are not in the knowledge base.
3. If a guest asks about something not covered in the knowledge base (e.g. connecting rooms, pets, unlisted services), state honestly:
   "I'm sorry, I don't have specific details on that in our hotel records. Please check with our front desk team at reservations@thegulmohar.in or +91 80 4965 7700, and we'll be glad to help."
4. NEVER speculate or guess.
5. Do NOT answer general knowledge, programming, or non-hotel questions. Politely redirect to hotel inquiries.
6. For room availability dates, let the guest know the system is looking up rooms — room data is handled deterministically.

CONVERSATION CONTEXT:
- You have access to recent conversation messages.
- Use context to resolve follow-ups (e.g., if the user asked about the Family Room, and then asks "does that include breakfast?", you understand they are asking about the Family Room).
- Keep replies concise, clean, and directly answering what was asked.

HOTEL KNOWLEDGE BASE:
${knowledgeBase}`;
}
