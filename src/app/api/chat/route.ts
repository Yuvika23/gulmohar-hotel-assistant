import { NextRequest, NextResponse } from "next/server";
import { processConciergeMessage, ChatRequest } from "@/lib/conciergeEngine";

// This route is server-side only. GEMINI_API_KEY is never sent to the client.
export const runtime = "nodejs";
export const maxDuration = 30; // seconds

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;

    // Input validation
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required and cannot be empty.",
          reply: "I apologize, I didn't catch your question. How may I assist your stay at The Gulmohar?",
        },
        { status: 400 }
      );
    }

    if (body.message.trim().length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is too long.",
          reply: "Your message is a little too long. Could you summarize your question?",
        },
        { status: 400 }
      );
    }

    // Process through the concierge engine (LLM or deterministic availability)
    const response = await processConciergeMessage(body);

    return NextResponse.json({
      success: true,
      reply: response.reply,
      suggestedActions: response.suggestedActions,
      intent: response.intent,
      availabilityData: response.availabilityData ?? null,
      highlightedRoom: response.highlightedRoom ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // Log server-side for debugging — never expose to client
    console.error("[/api/chat] Unhandled error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Concierge Service Error",
        reply: "We are experiencing a brief delay. Please try your question again in a moment.",
      },
      { status: 500 }
    );
  }
}
