# The Gulmohar — Boutique Hotel & Guest Assistant

A complete, polished full-stack AI-powered hotel guest assistant for **The Gulmohar**, a contemporary boutique hotel in Bengaluru, Karnataka, India. Built as a technical assignment demonstrating architectural depth, hospitality-first UX, clean TypeScript engineering, and strict knowledge grounding.

---

## Problem Being Solved

Hotel guests frequently need quick, reliable answers to questions about room types, check-in times, breakfast options, amenities, cancellation terms, and stay availability. This application replaces generic AI chatbot interfaces with an authentic **Indian boutique hotel digital guest assistant** — clean, contemporary, grounded, and deeply hospitality-focused.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 16)                   │
│                                                                 │
│  Header (Wordmark + Live Bengaluru IST Clock + Modal Nav)       │
│  WelcomeHero (Service shortcuts + Common questions)             │
│                                                                 │
│  ┌──────────────────────┐   ┌──────────────────────────────┐   │
│  │   Stay Planner        │   │   Guest Assistant Chat       │   │
│  │  (Check-in/out dates) │   │   (Chat feed + Composer)     │   │
│  │  (Guest counter)      │   │   (Room cards in stream)     │   │
│  │  (Room results in ₹)  │   │   (Suggested actions)        │   │
│  └──────────────────────┘   └──────────────────────────────┘   │
│                                                                 │
│  InfoModals (Rooms · Dining · Amenities · Policies)             │
│  ReservationModal (Room selection + Inquiry form)               │
└─────────────────────┬───────────────────────────────────────────┘
                      │  HTTP POST
┌─────────────────────▼───────────────────────────────────────────┐
│                  NEXT.JS API ROUTES (Backend)                    │
│                                                                 │
│  POST /api/chat         — Concierge conversational engine        │
│  POST /api/availability — Deterministic availability ledger      │
└─────────────────────┬───────────────────────────────────────────┘
                      │  Imports
┌─────────────────────▼───────────────────────────────────────────┐
│                  HOTEL KNOWLEDGE REPOSITORY                      │
│                                                                 │
│  hotelKnowledge.ts  — Deluxe, Premium, Family, Suite, dining    │
│  conciergeEngine.ts — Intent parser + Gemini router             │
│  geminiClient.ts    — Google Gen AI SDK + Grounded Prompt       │
│  availabilityService.ts — Deterministic inventory logic          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom boutique hotel design tokens
- **Icons**: Lucide React
- **Typography**: DM Sans (modern, clean sans-serif hierarchy)

### Backend & AI
- **Runtime**: Next.js API Routes (`src/app/api/`)
- **LLM SDK**: `@google/genai` (v2.23.0) with Gemini Flash
- **Knowledge Base**: Strictly grounded on structured hotel knowledge
- **Chat endpoint**: `POST /api/chat`
- **Availability endpoint**: `POST /api/availability`

### Testing
- **Runner**: Vitest 5 + jsdom environment
- **Assertions**: Vitest built-in

---

## Hotel Knowledge Base (`src/data/hotelKnowledge.ts`)

A structured TypeScript data store containing:

- **Hotel Profile**: The Gulmohar, 14 Lavelle Road, Bengaluru, Karnataka, India
- **Rooms**:
  * **Deluxe King Room**: ₹6,500/night (Up to 2 adults, King bed, City view, Wi-Fi)
  * **Premium King Room**: ₹7,800/night (Up to 2 adults, King bed, Balcony, Breakfast included)
  * **Family Room**: ₹9,200/night (Up to 3 adults, King bed + single bed, Extra space)
  * **Executive Suite**: ₹12,500/night (Up to 3 adults, King bed, Lounge access, Breakfast included)
- **Dining**:
  * The Gulmohar Restaurant (All-day dining, regional Karnataka, South Indian, North Indian, and continental)
  * Breakfast Buffet (Daily 7:00 AM – 10:30 AM, live dosas, idlis, parathas, filter coffee)
  * 24/7 In-Room Dining
- **Amenities**: Open-air swimming pool, 24/7 fitness centre, high-speed Wi-Fi, on-site parking with valet & EV charging, 24/7 front desk, airport transfers (BLR), laundry service, business lounge
- **Policies**: Check-in (2:00 PM), Check-out (11:00 AM), 48-hour flexible cancellation, Government ID requirements (Aadhaar, Passport, Driving License, Voter ID), extra bed policy (₹1,500/night)

---

## Availability Logic (`src/lib/availabilityService.ts`)

Fully deterministic availability system:

1. **Validates** check-in/out dates: ISO format, minimum 1 night, checkout must be after checkin
2. **Validates** guest count: 1–8 guests; over 8 prompts to contact reservations directly
3. **Filters rooms** by guest capacity
4. **Calculates**: total nights, per-night price, full-stay cost in INR (₹)
5. **Generates availability indicators** deterministically from date hash seed

---

## Running the Application

```bash
# Development server
npm run dev

# Run automated test suite
npm test
```

---

*The Gulmohar · 14 Lavelle Road, Bengaluru, Karnataka, India*
