// Live verification test script for The Gulmohar
const BASE_URL = "http://localhost:3003";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendChat(message, history = []) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  return res.json();
}

async function runLiveTests() {
  console.log("=== RUNNING LIVE GULMOHAR TEST SUITE ===");

  const conversationHistory = [];

  // Q1
  console.log("\n--- TEST 1: 'Is breakfast included?' ---");
  await sleep(1000);
  const res1 = await sendChat("Is breakfast included?", conversationHistory);
  console.log("Intent:", res1.intent);
  console.log("Reply:", res1.reply);
  conversationHistory.push({ role: "user", content: "Is breakfast included?" });
  conversationHistory.push({ role: "assistant", content: res1.reply });

  // Q2
  console.log("\n--- TEST 2: 'What amenities do you have?' ---");
  await sleep(1000);
  const res2 = await sendChat("What amenities do you have?", conversationHistory);
  console.log("Intent:", res2.intent);
  console.log("Reply:", res2.reply);

  // Q3
  console.log("\n--- TEST 3: 'Which room is suitable for three adults?' ---");
  await sleep(1000);
  const res3 = await sendChat("Which room is suitable for three adults?", conversationHistory);
  console.log("Intent:", res3.intent);
  console.log("Reply:", res3.reply);
  conversationHistory.push({ role: "user", content: "Which room is suitable for three adults?" });
  conversationHistory.push({ role: "assistant", content: res3.reply });

  // Q4
  console.log("\n--- TEST 4: 'Does that room include breakfast?' (Contextual follow-up) ---");
  await sleep(1000);
  const res4 = await sendChat("Does that room include breakfast?", conversationHistory);
  console.log("Intent:", res4.intent);
  console.log("Reply:", res4.reply);

  // Q5
  console.log("\n--- TEST 5: 'Do you have parking?' ---");
  await sleep(1000);
  const res5 = await sendChat("Do you have parking?", conversationHistory);
  console.log("Intent:", res5.intent);
  console.log("Reply:", res5.reply);

  // Q6
  console.log("\n--- TEST 6: 'Do you offer airport transfers?' ---");
  await sleep(1000);
  const res6 = await sendChat("Do you offer airport transfers?", conversationHistory);
  console.log("Intent:", res6.intent);
  console.log("Reply:", res6.reply);

  // Q7
  console.log("\n--- TEST 7: 'What time is check-in?' ---");
  await sleep(1000);
  const res7 = await sendChat("What time is check-in?", conversationHistory);
  console.log("Intent:", res7.intent);
  console.log("Reply:", res7.reply);

  // Q8
  console.log("\n--- TEST 8: 'Do you have a room for 3 adults from September 20 to September 23?' ---");
  await sleep(1000);
  const res8 = await sendChat("Do you have a room for 3 adults from September 20 to September 23?");
  console.log("Intent:", res8.intent);
  console.log("Summary:", res8.availabilityData?.summary);
  console.log("Rooms returned:", res8.availabilityData?.rooms.map(r => `${r.name} (₹${r.pricePerNight}/night, capacity ${r.capacity})`));
  const availHistory = [
    { role: "user", content: "Do you have a room for 3 adults from September 20 to September 23?" },
    { role: "assistant", content: res8.reply },
  ];

  // Q9
  console.log("\n--- TEST 9: 'What about two adults instead?' ---");
  await sleep(1000);
  const res9 = await sendChat("What about two adults instead?", availHistory);
  console.log("Intent:", res9.intent);
  console.log("Summary:", res9.availabilityData?.summary);
  console.log("Rooms returned:", res9.availabilityData?.rooms.map(r => `${r.name} (₹${r.pricePerNight}/night, capacity ${r.capacity})`));

  // Q10
  console.log("\n--- TEST 10: 'Do you have connecting rooms?' ---");
  await sleep(1000);
  const res10 = await sendChat("Do you have connecting rooms?");
  console.log("Intent:", res10.intent);
  console.log("Reply:", res10.reply);

  console.log("\n=== ALL TESTS COMPLETED ===");
}

runLiveTests().catch(err => console.error(err));
