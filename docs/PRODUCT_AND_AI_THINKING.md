# Product & AI Thinking: The Gulmohar Digital Guest Assistant

## 1. Customer Problem
When prospective or in-house guests research boutique hotels, they encounter two recurring pain points:
1. **Scattered, Ambiguous Information:** Hotel websites often hide critical logistical answers (e.g., breakfast timings, pool hours, cancellation cutoffs, early check-in fees, airport transfer details) across multiple PDFs, FAQs, or nested subpages.
2. **Disconnected Booking & Inquiry Experiences:** Traditional hotel chatbots are often either rigid keyword decision trees that fail when phrased naturally, or generic LLM chatbots that hallucinate non-existent rooms, invent pricing, or offer non-binding reservations.

**The Solution:** The Gulmohar Digital Guest Assistant bridges this gap by acting as a modern Indian boutique hotel's digital concierge. It combines real LLM conversational intelligence (Gemini 2.5 Flash) with deterministic business logic for date validation, room capacity matching, and rate calculations.

---

## 2. Guest Journey
The guest's interaction follows a structured, natural hospitality flow:
1. **Arrival & Orientation:** The guest arrives at the landing page and is greeted by an architectural visual identity reflecting Bengaluru boutique hospitality (teak wood, warm sandstone, courtyard greenery).
2. **Exploration & Inquiry:**
   - **Open Inquiries:** Guests can ask free-form questions via the concierge window (*"What time is breakfast?", "Do you offer airport pickup from Kempegowda Airport?", "What is the cancellation cutoff?"*).
   - **Stay Verification:** Guests can either use the interactive **Stay Planner** date selector or inquire conversationally (*"Do you have a room for 3 adults from Oct 10 to Oct 14?"*).
3. **Grounded Concierge Responses:** The assistant answers general inquiries grounded strictly in [`src/data/hotelKnowledge.ts`](../src/data/hotelKnowledge.ts).
4. **Structured Availability Ledger:** When checking dates, the assistant presents available rooms, price per night in ₹, total multi-night stay tariff, and occupancy constraints.
5. **Reservation Request / Follow-up:** Guests can click **View room** to launch an inquiry modal with pre-populated parameters or ask follow-up questions in the chat (*"What about 2 adults instead?"*).

---

## 3. Frontend Design Decisions
- **Warm Sandstone & Terracotta Palette (`#C4AD98`):** Replaced stark white/SaaS canvas aesthetics with an architectural color palette inspired by contemporary Indian boutique interiors (Jaipur sandstone, Bengaluru courtyard greenery, terracotta accents).
- **Editorial Split-Hero:** Combines guest greeting copy with an authentic boutique hotel lobby panel, establishing hospitality context immediately.
- **Asymmetric Service Cards:** Prioritizes **Check Availability** as the dominant action while providing immediate access to *Explore Rooms*, *Dining & Breakfast*, *Amenities*, and *Policies*.
- **Clear Separation of Concerns:**
  - Left column: Stay Planner date tool and Hotel Overview.
  - Right column: Real-time Guest Assistant conversation window.
  - Below fold: Photographic room cards, The Gulmohar Restaurant showcase, and curated amenities grid.
- **Custom Botanical Brand Identity:** Scalable SVG hallmark ([`GulmoharLogo.tsx`](../src/components/GulmoharLogo.tsx)) inspired by the 5-petal Royal Poinciana (*Gulmohar*) blossom.

---

## 4. AI vs. Deterministic Logic

### Architectural Division of Responsibility
To ensure absolute reliability, the application separates conversational understanding from business-critical transactions:

| Capability | Responsible System | Rationale |
| :--- | :--- | :--- |
| **Hotel Knowledge Questions** | **Gemini LLM (`gemini-2.5-flash`)** | Natural language flexibility, nuance understanding, friendly staff persona |
| **Conversational Context & History** | **Gemini LLM (`gemini-2.5-flash`)** | Resolves pronouns and follow-up references (*"does that room include breakfast?"*) |
| **Room Inventory & Availability** | **Deterministic Engine (`checkAvailability`)** | LLMs cannot reliably verify inventory; must be mathematically sound |
| **Date & Calendar Validation** | **Deterministic Engine (`validateBookingParams`)** | Rejects inverted dates, past dates, non-date strings without hallucination |
| **Capacity & Occupancy Enforcement** | **Deterministic Engine (`hotelKnowledge.ts`)** | Enforces hard room limits (e.g. Deluxe King max 2 adults; Family Room max 3) |
| **Pricing & Multi-Night Tariffs** | **Deterministic Engine** | Formulaic calculation (`pricePerNight × nights`); LLM must never calculate money |

### Implementation Note: Routing Architecture (Option B)
> [!IMPORTANT]
> **Availability Implementation is Option B (Deterministic Application-Level Routing).**
> The system does **NOT** use Gemini tool/function calling. Instead, [`src/lib/conciergeEngine.ts`](../src/lib/conciergeEngine.ts) executes an application-level intent classifier (`isAvailabilityIntent`) and date/guest extractors (`extractStayDates`, `extractGuestCount`).
> - When an availability query is detected, the engine completely **bypasses Gemini** and calls `checkAvailability()` directly, returning structured room inventory with `availability_results` or `availability_missing_dates`.
> - For non-availability hotel questions, the engine routes directly to `callGemini()` with the embedded hotel knowledge base.

---

## 5. AI Failure Modes & Mitigation

| Failure Mode | Risk | Mitigation in Architecture |
| :--- | :--- | :--- |
| **Hallucination** | Inventing rooms, pets policies, or European origins | System prompt strictly forbids inventing details outside `HOTEL_DATA`; fallback boundary instructions provided. |
| **Inventory Fabrication** | Claiming a sold-out room is available | All availability is routed away from Gemini into deterministic code. |
| **Date Inversion** | Accepting check-out before check-in | `validateBookingParams` rejects `diffDays <= 0` before any room lookup. |
| **API Rate Limits (HTTP 429)** | Free-tier quota exhaustion | Caught server-side in `conciergeEngine.ts`; returns friendly fallback without exposing raw errors or crashing. |
| **Context Bleed** | Answering general programming or math questions | System prompt enforces boutique hotel concierge domain only. |

---

## 6. Hallucination Prevention
1. **Single Source of Truth:** All hotel facts reside in [`src/data/hotelKnowledge.ts`](../src/data/hotelKnowledge.ts).
2. **Prompt Injection of Full KB:** The full structured text of rooms, dining, amenities, policies, and FAQs is serialized via `buildKnowledgeBaseContext()` into the Gemini system instruction.
3. **Explicit Boundary Rules:** Gemini is instructed:
   > *"If a guest asks about something not covered in the knowledge base (e.g. connecting rooms, pets, unlisted services), state honestly: 'I'm sorry, I don't have specific details on that in our hotel records. Please check with our front desk team at reservations@thegulmohar.in or +91 80 4965 7700.'"*
4. **Low Sampling Temperature:** Model temperature is locked at `0.4` to reduce creative variance and maximize fidelity to knowledge base tokens.

---

## 7. Failure Handling
- **Server-Side Encapsulation:** Gemini calls occur exclusively inside Next.js Node.js server routes (`/api/chat`). `GEMINI_API_KEY` is never exposed in client bundles.
- **Graceful Fallback Text:** If Gemini fails or times out, the assistant returns:
  > *"I'm temporarily unable to respond to that right now. Please try again in a moment. I can still help you check room availability."*
- **Availability Remains Operational:** Because availability is deterministic and independent of Gemini, guests can continue to search dates, view tariffs, and submit reservation inquiries even if the LLM provider experiences an outage.

---

## 8. Measuring Usefulness
In a production deployment, concierge performance would be measured across four operational axes:
1. **Inquiry Resolution Rate:** Percentage of guest chats that answer the inquiry without requiring human front-desk escalation.
2. **Look-to-Book Conversion:** Number of date checks and room modal views initiated from conversational recommendations.
3. **Fallback Frequency:** Ratio of `llm_error` fallback responses to total conversational turns (monitoring model availability and quota limits).
4. **Guest Interaction Latency:** Time to First Token (TTFT) and full response roundtrip latency (target < 1.5 seconds).

---

## 9. Production Improvements
1. **True PMS (Property Management System) Integration:** Replace the deterministic mock ledger with a live 2-way API (e.g. Opera, Cloudbeds, or hospitality PMS) with real-time room lockouts.
2. **Authenticated Guest Folios:** Upgrade the demo Resident Club portal with real SMS OTP verification via Twilio/Gupshup and OAuth2 session tokens.
3. **Hybrid Tool Calling:** Transition the application-level regex date extraction to native Gemini Tool/Function Calling with strict JSON Schema schema validation.
4. **Multi-Language Localization:** Support Hindi, Kannada, Tamil, and international languages through automated language detection and localized knowledge bases.
5. **Streaming Responses:** Implement server-sent events (SSE) for streaming Gemini token responses to enhance perceived conversational responsiveness.
