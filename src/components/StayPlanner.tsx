"use client";

import React, { useState } from "react";
import { Users, ArrowRight, Sparkles, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { fetchAvailability } from "@/lib/api";
import { AvailableRoom, AvailabilityResponse } from "@/lib/availabilityService";
import { RoomCard } from "./RoomCard";
import { Room } from "@/data/hotelKnowledge";

interface StayPlannerProps {
  onSelectRoom: (room: Room | AvailableRoom) => void;
  onInquireStayInChat?: (checkIn: string, checkOut: string, guests: number) => void;
}

export const StayPlanner: React.FC<StayPlannerProps> = ({
  onSelectRoom,
  onInquireStayInChat,
}) => {
  // Default to sensible future dates
  const today = new Date();
  const defaultIn = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
    .toISOString()
    .split("T")[0];
  const defaultOut = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)
    .toISOString()
    .split("T")[0];

  const [checkIn, setCheckIn] = useState<string>(defaultIn);
  const [checkOut, setCheckOut] = useState<string>(defaultOut);
  const [guests, setGuests] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AvailabilityResponse | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    // Validation
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      setError("Check-out date must be at least one day after your check-in date.");
      return;
    }

    if (guests < 1) {
      setError("Please select at least 1 guest.");
      return;
    }

    setLoading(true);

    try {
      const data = await fetchAvailability(checkIn, checkOut, guests);
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to check room availability right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementGuests = () => {
    if (guests < 6) setGuests(guests + 1);
  };

  const handleDecrementGuests = () => {
    if (guests > 1) setGuests(guests - 1);
  };

  return (
    <div className="bg-[#FCFBF9] border border-[#E5DFD5] rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="border-b border-[#EDE8E0] pb-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[#C2410C] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
            Real-time Room Rates
          </span>
          <span className="text-xs text-[#78716C]">Bengaluru, India</span>
        </div>
        <h2 className="text-xl font-semibold text-[#1C1917] mt-1 tracking-tight">
          CHECK YOUR STAY
        </h2>
        <p className="text-xs text-[#78716C] mt-0.5">
          Select check-in, check-out, and guests to view available rooms and rates in ₹ (INR).
        </p>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSearch} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Check-In Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#525252]">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-white border border-[#E5DFD5] focus:border-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1C1917] outline-none transition-colors shadow-2xs"
              required
            />
          </div>

          {/* Check-Out Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#525252]">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="w-full bg-white border border-[#E5DFD5] focus:border-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1C1917] outline-none transition-colors shadow-2xs"
              required
            />
          </div>
        </div>

        {/* Guest Selector Counter */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-[#525252]">
            Guests
          </label>
          <div className="flex items-center justify-between bg-white border border-[#E5DFD5] rounded-lg px-3.5 py-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-[#44403C]">
              <Users className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="font-medium">
                {guests} {guests === 1 ? "Adult" : "Adults"}
              </span>
              <span className="text-[11px] text-[#78716C]">
                ({guests <= 2 ? "Deluxe & Premium" : "Family Room & Suite"})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecrementGuests}
                disabled={guests <= 1}
                className="w-6 h-6 rounded-md border border-[#D4CBC0] bg-[#F5F2EB] hover:bg-[#EFECE4] disabled:opacity-35 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors"
                aria-label="Decrease guests"
              >
                −
              </button>
              <span className="w-4 text-center font-medium">{guests}</span>
              <button
                type="button"
                onClick={handleIncrementGuests}
                disabled={guests >= 6}
                className="w-6 h-6 rounded-md border border-[#D4CBC0] bg-[#F5F2EB] hover:bg-[#EFECE4] disabled:opacity-35 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors"
                aria-label="Increase guests"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-99 disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Checking Availability...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>SEARCH AVAILABLE ROOMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      </form>

      {/* Results Section */}
      {results && results.success && (
        <div className="pt-4 border-t border-[#EDE8E0] space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#15803D] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {results.rooms.length} Rooms Available ({results.nights} {results.nights === 1 ? "Night" : "Nights"})
              </span>
            </div>

            {onInquireStayInChat && (
              <button
                type="button"
                onClick={() => onInquireStayInChat(checkIn, checkOut, guests)}
                className="text-xs text-[#C2410C] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Sparkles className="w-3 h-3" />
                Ask Assistant in Chat
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {results.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSelectRoom={onSelectRoom}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
