# The Gulmohar — AI Hotel Guest Assistant

A complete, production-grade digital guest assistant built for **The Gulmohar**, a contemporary Indian boutique hotel in Bengaluru, Karnataka, India. 

Designed for technical assignment evaluation, this project demonstrates real **Google Gemini 2.5 Flash** LLM integration for conversational hotel knowledge grounded in a structured knowledge base, combined with **deterministic business logic** for date validation, room capacity matching, and rate calculations.

---

## Project Overview

The Gulmohar Digital Guest Assistant acts as an intelligent digital concierge for guests planning a stay or residing at the hotel. Guests can converse naturally to ask about dining, breakfast menus, check-in policies, amenities, and room recommendations, as well as check live room availability across multiple dates.

- **Hotel:** The Gulmohar (Boutique Hotel & Digital Concierge)
- **Location:** 14 Lavelle Road, Bengaluru, Karnataka, India
- **Repository:** `gulmohar-hotel-assistant`
- **Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Google Gen AI SDK (`@google/genai` v2.23.0), Vitest 5

---

## Features

- **Grounded AI Concierge:** Real-time conversational assistant powered by Google Gemini 2.5 Flash, strictly grounded in the hotel knowledge base to prevent hallucinations.
- **Deterministic Stay Availability:** Direct room ledger search that validates check-in/out dates, enforces maximum guest capacities, and calculates multi-night room tariffs in Indian Rupees (₹).
- **Conversational Context:** Resolves multi-turn follow-ups (e.g., *"Which room fits 3 adults?"* followed by *"Does that include breakfast?"* or *"What about 2 adults instead?"*).
- **Architectural Boutique Visual Identity:** Custom warm sandstone palette (`#C4AD98`) reflecting Indian boutique hospitality, high-resolution hotel photography, and bespoke vector botanical branding (`GulmoharLogo.tsx`).
- **Interactive Dual Workspaces:** Side-by-side Stay Planner date selector and conversational chat assistant on desktop, with seamless tab switching on mobile.
- **Visual Hotel Showcases:** Dedicated sections for Accommodation (Room Photography & Specs), Gastronomy (The Gulmohar Restaurant buffet highlights & live counters), and Curated Amenities (terrace pool, 24/7 gym, valet parking).
- **Guest Portal Preview:** A Resident Club interface demonstrating mobile OTP and email authentication flows in demo mode.

---

## Architecture

The system enforces a strict architectural boundary between **probabilistic conversational intelligence** (Gemini) and **deterministic financial/booking transactions** (local availability service):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Next.js 16)                          │
│                                                                             │
│  Header (Brand Emblem + Bengaluru IST Clock + Modals Nav + Resident Portal) │
│  WelcomeHero (Editorial Split Hero + Popular Inquiries)                    │
│                                                                             │
│  ┌─────────────────────────┐          ┌──────────────────────────────────┐  │
│  │       Stay Planner       │          │      Guest Assistant Chat        │  │
│  │   (Date inputs, guests) │          │  (Real-time conversation feed)   │  │
│  │   (Direct rate queries) │          │  (Embedded rich room cards)      │  │
│  └────────────┬────────────┘          └────────────────┬─────────────────┘  │
│               │                                        │                    │
│  Showcases: Rooms & Suites · Gastronomy · Curated Amenities · Footer        │
└───────────────┼────────────────────────────────────────┼────────────────────┘
                │ POST /api/availability                 │ POST /api/chat
┌───────────────▼────────────────────────────────────────▼────────────────────┐
│                    NEXT.JS SERVER LAYER (Node.js Runtime)                   │
│                                                                             │
│  POST /api/availability               POST /api/chat                        │
│         │                                    │                              │
│         │                             conciergeEngine.ts                     │
│         │                                    │                              │
│         │                   ┌────────────────┴───────────────┐              │
│         │                   │ Availability Intent Detected?  │              │
│         │                   └───────┬─────────────────┬──────┘              │
│         │                      YES  │                 │ NO                  │
│         │                           │                 ▼                     │
│         ▼                           ▼          geminiClient.ts              │
│  availabilityService.ts ◄───────────┘                 │                     │
│  (checkAvailability)                                  │ Google Gen AI SDK   │
│  • Date & night validation                            ▼ (gemini-2.5-flash)  │
│  • Capacity filtering                          Google Gemini API            │
│  • Deterministic ₹ tariffs                     (Server-side only)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## AI + Deterministic Logic

### Architectural Division of Responsibility

| Capability | Engine | Behavior |
| :--- | :--- | :--- |
| **Hotel Knowledge Questions** | **Gemini 2.5 Flash** | Natural conversational explanations regarding amenities, dining, timings, and policies grounded in `hotelKnowledge.ts`. |
| **Conversational Context** | **Gemini 2.5 Flash** | Maintains recent history to resolve pronouns, room references, and contextual questions. |
| **Availability Routing** | **Deterministic Regex Engine** | Detects booking intent (`isAvailabilityIntent`) and extracts dates (`extractStayDates`) and guest counts (`extractGuestCount`). |
| **Room Inventory & Rates** | **Deterministic Application Code** | Calls `checkAvailability()` directly. Enforces hard room limits (e.g. Deluxe King max 2 adults). Calculates exact mathematical tariffs. |

> [!IMPORTANT]
> **Implementation Note on Availability:**
> This project implements **Option B: Deterministic Application-Level Routing**.
> Availability is **not** handled by Gemini function/tool calling. Instead, `conciergeEngine.ts` identifies availability intents before reaching the LLM and calls `checkAvailability()` directly. Gemini is never permitted to calculate dates, invent rates, or guess inventory.

---

## Hotel Knowledge Base (`src/data/hotelKnowledge.ts`)

A structured TypeScript repository acting as the single source of truth for hotel operations:

- **Identity & Address:** The Gulmohar, 14 Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001, India.
- **Accommodations (Tariffs in ₹ INR):**
  - **Deluxe King Room (₹6,500/night):** 32 m², King bed, max 2 adults, city view, soundproof, fiber Wi-Fi.
  - **Premium King Room (₹7,800/night):** 38 m², King bed, max 2 adults, private balcony, breakfast buffet included.
  - **Family Room (₹9,200/night):** 48 m², King bed + single bed, max 3 adults, extra living space, garden view.
  - **Executive Suite (₹12,500/night):** 58 m², King bed, max 3 adults, lounge access, soaking tub, breakfast included.
- **Gastronomy:**
  - *The Gulmohar Restaurant:* All-day dining (6:30 AM – 11:00 PM) serving South Indian, North Indian, and continental dishes.
  - *Breakfast Buffet:* 7:00 AM – 10:30 AM with live dosa & egg counter, idlis, vadas, parathas, and traditional filter coffee.
  - *24/7 In-Room Dining:* Round-the-clock comfort dining menu.
- **Amenities:** Open-air terrace swimming pool (6:00 AM – 9:00 PM), 24/7 fitness centre, 300 Mbps fiber Wi-Fi, covered parking with EV charging, Kempegowda Airport (BLR) chauffeured sedans.
- **Policies:** Check-in at 2:00 PM, Check-out at 11:00 AM, early check-in from 10:00 AM (subject to room readiness), 48-hour free cancellation cutoff, mandatory Government photo ID.

---

## Availability

The availability engine in [`src/lib/availabilityService.ts`](file:///e:/PROJECTSSS/simplotel/src/lib/availabilityService.ts) runs deterministically:
1. **Date Validation:** Verifies ISO date format, checks that checkout is at least 1 day after checkin, and calculates total nights.
2. **Occupancy Filtering:** Rejects parties > 8 guests (prompts contact with reservations desk); filters rooms that cannot accommodate the guest count (e.g. parties of 3 adults receive only Family Room and Executive Suite options).
3. **Deterministic Pricing:** Computes `totalPrice = pricePerNight * nights`.
4. **Consistency:** Generates inventory state based on a deterministic hash of the stay parameters.

---

## API Documentation

### 1. `POST /api/chat`
Handles all guest conversational inquiries, routing to either the deterministic availability service or the Gemini LLM.

- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "message": "What time is check-in?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Welcome to The Gulmohar. How may I assist your stay?" }
  ]
}
```
- **Response Body (LLM Response):**
```json
{
  "success": true,
  "reply": "Check-in is at 2:00 PM, and check-out is at 11:00 AM. Early check-in from 10:00 AM is available subject to room readiness.",
  "suggestedActions": ["What time is check-out?", "Early Check-in Policy", "Check Availability"],
  "intent": "llm_response",
  "availabilityData": null,
  "highlightedRoom": null,
  "timestamp": "2026-09-18T17:45:52.324Z"
}
```
- **Response Body (Availability Query):**
```json
{
  "success": true,
  "reply": "I've checked our room ledger for 3 nights (2026-09-20 to 2026-09-23) for 3 guests. We have 2 room options available that match your party size. You can review room details and rates below.",
  "suggestedActions": ["Check Cancellation Policy", "Is Breakfast Included?", "View Amenities"],
  "intent": "availability_results",
  "availabilityData": {
    "checkIn": "2026-09-20",
    "checkOut": "2026-09-23",
    "guests": 3,
    "nights": 3,
    "rooms": [ /* Array of matching AvailableRoom objects */ ]
  },
  "timestamp": "2026-09-18T17:48:00.000Z"
}
```
- **curl Example:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What time is check-in?",
    "history": []
  }'
```

---

### 2. `POST /api/availability`
Direct endpoint for date-based room availability queries used by the Stay Planner.

- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "checkIn": "2026-10-10",
  "checkOut": "2026-10-14",
  "guests": 2
}
```
- **Response Body:**
```json
{
  "success": true,
  "checkIn": "2026-10-10",
  "checkOut": "2026-10-14",
  "guests": 2,
  "nights": 4,
  "rooms": [
    {
      "id": "deluxe-king-room",
      "name": "Deluxe King Room",
      "category": "Deluxe",
      "capacity": 2,
      "pricePerNight": 6500,
      "totalPrice": 26000,
      "nights": 4,
      "availableCount": 5,
      "status": "available"
    }
  ],
  "summary": "We have found 4 room options for 2 guests for your 4-night stay from 2026-10-10 to 2026-10-14."
}
```
- **curl Example:**
```bash
curl -X POST http://localhost:3000/api/availability \
  -H "Content-Type: application/json" \
  -d '{
    "checkIn": "2026-10-10",
    "checkOut": "2026-10-14",
    "guests": 2
  }'
```

---

### Environment Variables & Security (`GEMINI_API_KEY`)

- The Google Gemini API key is configured using the environment variable `GEMINI_API_KEY`.
- **Local Development:** Placed in `.env.local` (which is included in `.gitignore` and never committed).
- **Client Security:** Never prefix with `NEXT_PUBLIC_`. The key is accessed exclusively by server-side routes (`src/app/api/chat/route.ts`).
- **Production Deployment (Vercel):** Configured securely under Project Settings → Environment Variables.

---

## Setup

### Prerequisites
- Node.js 18.18+ or 20+
- npm 9+
- A Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### Installation
```bash
# 1. Clone repository
git clone https://github.com/Yuvika23/gulmohar-hotel-assistant.git
cd gulmohar-hotel-assistant

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local:
# GEMINI_API_KEY=your_gemini_api_key_here

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Scope | Description |
| :--- | :---: | :--- | :--- |
| `GEMINI_API_KEY` | **Yes** | Server-side only | API key for Gemini 2.5 Flash from Google AI Studio. |
| `NEXT_PUBLIC_API_URL` | No | Client-side | Base URL override for API requests (defaults to relative `/api/*`). |

---

## Testing

The project includes an automated test suite verifying both deterministic business logic and LLM orchestration:

```bash
# Run Vitest test suite
npm test

# Build production bundle (TypeScript check & Static Optimization)
npm run build
```

**Test Coverage Highlights:**
- `extractGuestCount`: Numeric, word-form, and conversational guest extractions.
- `extractStayDates`: ISO and natural language date parsing.
- `checkAvailability`: Valid date spans, inverted dates rejection, occupancy filtering, and multi-night multiplication.
- `processConciergeMessage`: LLM routing, contextual conversation follow-ups, availability interception, and boundary responses for unlisted amenities.

---

## Evaluation

Ten structured evaluation scenarios were executed against the live application and test suite. Full details and actual observed responses are documented in [`docs/EVALUATION.md`](docs/EVALUATION.md):
1. Normal hotel question (Breakfast hours & location) — **PASS**
2. Wi-Fi inquiry (High-speed fiber connectivity) — **PASS**
3. Missing information detection (*"Can I book a room?"*) — **PASS**
4. Ambiguous availability request (*"Do you have a room for me?"*) — **PASS**
5. Structured availability check (3 adults, Sep 20 to Sep 23) — **PASS**
6. Contextual availability follow-up (*"What about 2 adults?"*) — **PASS**
7. Unsupported assumption boundary (*"Does the hotel have a sauna?"*) — **PASS**
8. Multi-turn conversational follow-up (Breakfast details) — **PASS**
9. Backend/model failure graceful fallback — **PASS**
10. Full end-to-end multi-night stay booking flow — **PASS**

---

## AI Tools Used During Development

In accordance with assignment guidelines, the following AI tools were utilized during the development lifecycle:
- **Antigravity (Google DeepMind):** Primary agentic pair-programming tool used for codebase inspection, implementation of Next.js components, UI refactoring, Vitest suite creation, local test execution, and browser visual validation.
- **Claude (Anthropic):** Used for technical critique, architecture validation, prompt engineering reviews, and checking boundary handling for hotel knowledge grounding.
- **ChatGPT (OpenAI):** Utilized for initial planning, conceptual technical guidance, and reviewing deterministic availability data models.

---

## Known Limitations

1. **Gemini Free Tier Quotas:** The Google AI Studio free tier enforces a rate limit of 5 requests per minute (RPM). Rapid consecutive messages can trigger HTTP 429 errors (handled gracefully by our fallback mechanism).
2. **Simulated PMS Inventory:** Room availability is generated deterministically from an internal date-hash seed rather than querying a live hotel Property Management System (PMS).
3. **Demo Resident Club:** The guest portal at `/login` provides a front-end demonstration of guest session state and OTP forms; real SMS gateway delivery (e.g. Twilio) is not connected.

---

## Production Improvements

1. **Two-Way PMS Synchronization:** Integrate with hospitality management APIs (Opera, Cloudbeds, or Simplotel) to lock real rooms and process live booking confirmation numbers.
2. **Token Streaming:** Upgrade `/api/chat` to stream responses using Server-Sent Events (SSE) for lower perceived latency.
3. **Native Gemini Tool Calling:** Migrate application-level regex extraction to Gemini's native Function Calling API with strict JSON schema definitions.
4. **Live SMS/WhatsApp Gateway:** Connect Resident Club authentication to Twilio or Gupshup for production OTP verification and booking updates.
5. **Multi-Lingual Support:** Expand knowledge base localization to support Kannada, Hindi, and international languages.

---

*The Gulmohar · 14 Lavelle Road, Bengaluru, Karnataka 560001, India*
