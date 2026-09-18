import { NextRequest, NextResponse } from "next/server";
import { checkAvailability } from "@/lib/availabilityService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkIn, checkOut, guests } = body || {};

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        {
          success: false,
          error: "Check-in and check-out dates are required.",
          rooms: [],
          nights: 0,
        },
        { status: 400 }
      );
    }

    const guestCount = parseInt(guests, 10) || 2;
    const availability = checkAvailability(checkIn, checkOut, guestCount);

    if (!availability.success) {
      return NextResponse.json(
        {
          success: false,
          error: availability.error || "Could not verify room availability for the requested dates.",
          rooms: [],
          nights: 0,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(availability, { status: 200 });
  } catch (error) {
    console.error("Error in /api/availability:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while querying room ledger.",
        rooms: [],
        nights: 0,
      },
      { status: 500 }
    );
  }
}
