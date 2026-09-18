import { processConciergeMessage } from "../src/lib/conciergeEngine.js";

// Test runner for the 10 evaluation scenarios
async function runEvaluations() {
  console.log("Starting 10 evaluation scenarios...\n");

  const scenarios = [
    {
      id: 1,
      name: "Normal hotel question (breakfast)",
      input: "What time is breakfast?",
      history: [],
    },
    {
      id: 2,
      name: "Another normal hotel question (Wi-Fi)",
      input: "Does the hotel have Wi-Fi?",
      history: [],
    },
    {
      id: 3,
      name: "Missing information (date inquiry)",
      input: "Can I book a room?",
      history: [],
    },
    {
      id: 4,
      name: "Ambiguous availability question",
      input: "Do you have a room for me?",
      history: [],
    },
    {
      id: 5,
      name: "Structured availability request",
      input: "I need a room for 3 adults from September 20 to September 23.",
      history: [],
    },
    {
      id: 6,
      name: "Availability follow-up (guest change)",
      input: "What about 2 adults?",
      history: [
        { role: "user", content: "I need a room for 3 adults from September 20 to September 23." },
        { role: "assistant", content: "I've checked our room ledger for 3 nights from September 20 to September 23 for 3 guests. We have room options available." },
      ],
    },
    {
      id: 7,
      name: "Unsupported/incorrect assumption (sauna)",
      input: "Does the hotel have a sauna?",
      history: [],
    },
    {
      id: 8,
      name: "Conversational follow-up",
      input: "What kind of breakfast do you serve?",
      history: [
        { role: "user", content: "Is breakfast included?" },
        { role: "assistant", content: "Breakfast is included with our Premium King Room and Executive Suite." },
      ],
    },
    {
      id: 9,
      name: "Backend/model failure handling",
      input: "What is your pet policy?",
      history: [],
    },
    {
      id: 10,
      name: "Full end-to-end guest journey",
      input: "Do you have a room from 2026-10-10 to 2026-10-13 for 2 guests?",
      history: [],
    },
  ];

  for (const s of scenarios) {
    console.log(`--- Scenario ${s.id}: ${s.name} ---`);
    console.log(`Input: "${s.input}"`);
    try {
      const res = await processConciergeMessage({ message: s.input, history: s.history });
      console.log(`Intent: ${res.intent}`);
      console.log(`Reply: ${res.reply.substring(0, 140)}...`);
      if (res.availabilityData) {
        console.log(`Availability: ${res.availabilityData.rooms.length} rooms returned (${res.availabilityData.nights} nights)`);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
    console.log("\n");
  }
}

runEvaluations();
