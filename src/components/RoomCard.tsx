"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Users, Bed, Eye, Check, ArrowRight } from "lucide-react";
import { Room } from "@/data/hotelKnowledge";
import { AvailableRoom } from "@/lib/availabilityService";

interface RoomCardProps {
  room: Room | AvailableRoom;
  onSelectRoom?: (room: Room | AvailableRoom) => void;
  compact?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelectRoom, compact = false }) => {
  const [imageError, setImageError] = useState(false);
  const isAvailableRoom = "totalPrice" in room;
  const availableCount = isAvailableRoom ? (room as AvailableRoom).availableCount : room.totalRooms;
  const nights = isAvailableRoom ? (room as AvailableRoom).nights : 1;
  const totalPrice = isAvailableRoom ? (room as AvailableRoom).totalPrice : room.pricePerNight;
  const isLimited = isAvailableRoom && (room as AvailableRoom).status === "limited";

  const roomImageSrc = imageError
    ? "/images/hotel/deluxe-room.jpg"
    : room.imageUrl || "/images/hotel/deluxe-room.jpg";

  return (
    <div
      className={`bg-white border border-[#E3DDD3] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#C2410C]/60 hover:shadow-md flex flex-col justify-between ${
        compact ? "p-3 sm:p-4 text-xs" : "p-0"
      }`}
    >
      <div>
        {/* Room Photograph Header */}
        {!compact ? (
          <div className="relative w-full aspect-[16/10] bg-[#EAE4D9] overflow-hidden">
            <Image
              src={roomImageSrc}
              alt={`${room.name} at The Gulmohar Bengaluru`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-103"
              onError={() => setImageError(true)}
            />
            {/* Top badges on photo */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] uppercase font-bold text-white tracking-wider">
                {room.category} Collection
              </span>

              {isLimited ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-600/90 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                  Only {availableCount} left
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-emerald-700/90 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                  Available
                </span>
              )}
            </div>

            {/* Bottom photo gradient */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
        ) : (
          /* Compact header banner for chat cards */
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#EDE8E0]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
              <span className="text-[#C2410C]">{room.category}</span>
              <span>•</span>
              <span>{room.sizeSqm} m²</span>
            </div>

            {isLimited ? (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                Only {availableCount} left
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                Available
              </span>
            )}
          </div>
        )}

        {/* Room Body Details */}
        <div className={compact ? "" : "p-4 sm:p-5"}>
          {!compact && (
            <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
              <span className="font-semibold uppercase tracking-wider text-[#C2410C]">
                {room.category} Room
              </span>
              <span>{room.sizeSqm} m² · Soundproof</span>
            </div>
          )}

          <h3 className="text-base font-bold text-[#1C1917] tracking-tight mb-0.5">
            {room.name.toUpperCase()}
          </h3>
          <p className="text-xs text-[#78716C] mb-3 line-clamp-1">
            {room.tagline}
          </p>

          {/* Key Specs Pill */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#44403C] mb-3 py-2 px-2.5 bg-[#F5F2EB] rounded-xl border border-[#E3DDD3]">
            <div className="flex items-center gap-1.5" title="Bed Type">
              <Bed className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="font-medium">{room.bedType}</span>
            </div>
            <span className="text-[#D4CBC0]">•</span>
            <div className="flex items-center gap-1.5" title="Guest Capacity">
              <Users className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="font-medium">Up to {room.capacity} adults</span>
            </div>
            <span className="text-[#D4CBC0] hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5" title="Window View">
              <Eye className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="truncate max-w-[130px] font-medium">{room.view}</span>
            </div>
          </div>

          {/* Description */}
          {!compact && (
            <p className="text-xs text-[#57534E] leading-relaxed mb-3.5 line-clamp-2">
              {room.description}
            </p>
          )}

          {/* Amenities Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {room.amenities.slice(0, compact ? 2 : 3).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 bg-[#EFECE4] text-[#44403C] rounded-md font-medium"
              >
                <Check className="w-3 h-3 text-[#15803D]" />
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Reservation CTA */}
      <div className={`border-t border-[#EDE8E0] flex items-center justify-between gap-3 mt-auto ${compact ? "pt-3" : "p-4 sm:p-5 pt-3 bg-[#FCFBF9]"}`}>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-[#1C1917]">
              ₹{room.pricePerNight.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-[#78716C]">/ night</span>
          </div>

          {isAvailableRoom && nights > 1 && (
            <p className="text-[11px] text-[#C2410C] font-semibold">
              Total: ₹{totalPrice.toLocaleString("en-IN")} ({nights} nights)
            </p>
          )}
        </div>

        <button
          onClick={() => onSelectRoom && onSelectRoom(room)}
          className="px-3.5 py-2 text-xs font-semibold bg-[#1C1917] hover:bg-[#C2410C] text-white transition-colors rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
        >
          <span>View room</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
