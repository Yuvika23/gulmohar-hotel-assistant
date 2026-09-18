import { HOTEL_DATA, Room } from "@/data/hotelKnowledge";

export interface AvailableRoom extends Room {
  availableCount: number;
  totalPrice: number;
  nights: number;
  status: "available" | "limited" | "sold_out";
}

export interface AvailabilityResponse {
  success: boolean;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  rooms: AvailableRoom[];
  summary: string;
  error?: string;
}

/**
 * Validates check-in/out dates and guest count.
 */
export function validateBookingParams(
  checkInStr: string,
  checkOutStr: string,
  guests: number
): { valid: boolean; error?: string; nights: number; checkInDate?: Date; checkOutDate?: Date } {
  if (!checkInStr || !checkOutStr) {
    return { valid: false, error: "Please provide both check-in and check-out dates.", nights: 0 };
  }

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { valid: false, error: "Invalid date format. Please use YYYY-MM-DD.", nights: 0 };
  }

  // Normalize to midnight UTC for fair day calculation
  const start = Date.UTC(checkIn.getUTCFullYear(), checkIn.getUTCMonth(), checkIn.getUTCDate());
  const end = Date.UTC(checkOut.getUTCFullYear(), checkOut.getUTCMonth(), checkOut.getUTCDate());
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      valid: false,
      error: "Check-out date must be at least one day after your check-in date.",
      nights: 0,
    };
  }

  if (guests <= 0 || !Number.isInteger(guests)) {
    return { valid: false, error: "Number of guests must be at least 1.", nights: 0 };
  }

  if (guests > 8) {
    return {
      valid: false,
      error:
        "For group bookings over 8 guests, please contact our reservations desk directly at reservations@thegulmohar.in for special arrangements.",
      nights: 0,
    };
  }

  return { valid: true, nights: diffDays, checkInDate: checkIn, checkOutDate: checkOut };
}

/**
 * Deterministic availability checker.
 * Evaluates room capacity, night count, and inventory state.
 */
export function checkAvailability(
  checkIn: string,
  checkOut: string,
  guests: number
): AvailabilityResponse {
  const validation = validateBookingParams(checkIn, checkOut, guests);

  if (!validation.valid) {
    return {
      success: false,
      checkIn,
      checkOut,
      guests,
      nights: 0,
      rooms: [],
      summary: validation.error || "Invalid booking parameters.",
      error: validation.error,
    };
  }

  const { nights } = validation;

  // Filter rooms that can accommodate the guest count
  const matchingRooms = HOTEL_DATA.rooms.filter((room) => room.capacity >= guests);

  if (matchingRooms.length === 0) {
    return {
      success: true,
      checkIn,
      checkOut,
      guests,
      nights,
      rooms: [],
      summary: `Our individual rooms and suites accommodate up to 3 guests. For a party of ${guests}, we would be happy to reserve multiple adjoining rooms for you.`,
    };
  }

  // Generate deterministic inventory counts based on date string hash
  const seed = (checkIn + checkOut + guests).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const availableRooms: AvailableRoom[] = matchingRooms.map((room, index) => {
    // Deterministic pseudo-availability
    const roomSeed = (seed + index * 7) % 10;
    const availableCount = Math.max(1, room.totalRooms - (roomSeed % 3));
    let status: "available" | "limited" | "sold_out" = "available";

    if (availableCount <= 2) {
      status = "limited";
    }

    const totalPrice = room.pricePerNight * nights;

    return {
      ...room,
      availableCount,
      totalPrice,
      nights,
      status,
    };
  });

  const summary = `We have found ${availableRooms.length} room option${
    availableRooms.length > 1 ? "s" : ""
  } for ${guests} guest${guests > 1 ? "s" : ""} for your ${nights}-night stay from ${checkIn} to ${checkOut}.`;

  return {
    success: true,
    checkIn,
    checkOut,
    guests,
    nights,
    rooms: availableRooms,
    summary,
  };
}
