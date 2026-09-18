import { AvailabilityResponse } from "./availabilityService";
import { ChatResponse } from "./conciergeEngine";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function sendChatMessage(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  conversationId?: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history, conversationId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.reply || errorData.error || "The concierge desk is momentarily unreachable. Please try again."
    );
  }

  return response.json();
}

export async function fetchAvailability(
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<AvailabilityResponse> {
  const response = await fetch(`${API_BASE}/api/availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ checkIn, checkOut, guests }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Unable to check suite availability for these dates.");
  }

  return data;
}
