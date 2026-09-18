import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/systemPrompt";

/**
 * Initializes the Gemini client.
 * The API key is read ONLY from the server-side environment variable GEMINI_API_KEY.
 * It is never exposed to the client.
 *
 * Model: gemini-2.0-flash — Google's fast, capable model well-suited for
 * conversational grounded-knowledge tasks.
 */

const MODEL_NAME = "gemini-2.5-flash";

let _client: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (_client) return _client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please add it to .env.local"
    );
  }

  _client = new GoogleGenAI({ apiKey });
  return _client;
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

/**
 * Sends a message to Gemini with the full hotel knowledge base embedded in the
 * system prompt and the conversation history for contextual understanding.
 *
 * @param userMessage - The current guest message
 * @param history     - Prior conversation turns (max 10 kept to limit token usage)
 * @returns           - The model's text reply
 */
export async function callGemini(
  userMessage: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const client = getGeminiClient();

  // Build the system prompt (KB embedded inside)
  const systemInstruction = buildSystemPrompt();

  // Convert our internal history format to Gemini's expected format.
  // Keep the last 10 turns to avoid excessive token usage.
  const recentHistory = history.slice(-10);
  const geminiHistory: GeminiMessage[] = recentHistory.map((h) => ({
    role: h.role === "assistant" ? "model" : "user",
    parts: [{ text: h.content }],
  }));

  // Create a chat session with system instruction and history
  const chat = client.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction,
      // Keep responses grounded and concise
      temperature: 0.4,
      maxOutputTokens: 600,
    },
    history: geminiHistory,
  });

  // Send the current user message and get the response
  const response = await chat.sendMessage({
    message: userMessage,
  });

  const text = response.text;
  if (!text || text.trim() === "") {
    throw new Error("Empty response received from Gemini");
  }

  return text.trim();
}

export { MODEL_NAME };
