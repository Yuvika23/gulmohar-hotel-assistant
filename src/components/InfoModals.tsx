"use client";

import React from "react";
import { X, Check, Clock, Utensils, Sparkles, Shield, Calendar, Bed, Eye, Users } from "lucide-react";
import { HOTEL_DATA } from "@/data/hotelKnowledge";
import { GulmoharLogo } from "./GulmoharLogo";

interface InfoModalsProps {
  activeModal: "rooms" | "dining" | "amenities" | "policies" | null;
  onClose: () => void;
  onSelectRoomInquiry: (roomName: string) => void;
  onOpenStayPlanner: () => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({
  activeModal,
  onClose,
  onSelectRoomInquiry,
  onOpenStayPlanner,
}) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[#FCFBF9] border border-[#E5DFD5] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5DFD5] flex items-center justify-between bg-white shadow-2xs">
          <div className="flex items-center space-x-3">
            <GulmoharLogo size={34} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#C2410C] font-semibold block">
                The Gulmohar · Bengaluru
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1C1917] tracking-tight">
                {activeModal === "rooms" && "Rooms & Suites"}
                {activeModal === "dining" && "Dining & Breakfast"}
                {activeModal === "amenities" && "Hotel Amenities & Services"}
                {activeModal === "policies" && "Hotel Policies & Guidelines"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#44403C]">
          {/* ROOMS MODAL */}
          {activeModal === "rooms" && (
            <div className="space-y-4">
              <p className="text-[#57534E] leading-relaxed">
                All rooms at The Gulmohar are designed for comfort and productivity in central Bengaluru, featuring soundproof double-glazed windows, high-speed Wi-Fi, and modern bathrooms.
              </p>

              <div className="space-y-3.5">
                {HOTEL_DATA.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 bg-white border border-[#E5DFD5] rounded-xl space-y-2.5 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#EDE8E0] pb-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#C2410C] font-semibold">
                          {room.category}
                        </span>
                        <h3 className="text-base font-semibold text-[#1C1917]">
                          {room.name}
                        </h3>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-[#1C1917]">
                          ₹{room.pricePerNight.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-[#78716C]">/ night</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C] py-1 border-y border-[#EDE8E0]">
                      <span className="flex items-center gap-1 font-medium">
                        <Bed className="w-3.5 h-3.5 text-[#78716C]" /> {room.bedType}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#78716C]" /> Up to {room.capacity} adults
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Eye className="w-3.5 h-3.5 text-[#78716C]" /> {room.view}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {room.amenities.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 bg-[#F5F2EB] border border-[#E5DFD5] text-[#44403C] rounded-md font-medium"
                          >
                            {a}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectRoomInquiry(`Tell me more about the ${room.name} and current rates.`);
                        }}
                        className="text-xs text-[#C2410C] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Ask Assistant →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DINING MODAL */}
          {activeModal === "dining" && (
            <div className="space-y-4">
              {/* Breakfast Highlight Banner */}
              <div className="p-4 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#C2410C]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Breakfast Buffet &amp; Regional Flavours
                  </span>
                </div>
                <p className="text-xs text-[#44403C] leading-relaxed">
                  {HOTEL_DATA.breakfast.buffetAndALaCarte}
                </p>
                <div className="pt-2 border-t border-[#FED7AA] flex flex-wrap items-center gap-3 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#C2410C]" /> {HOTEL_DATA.breakfast.hours}
                  </span>
                  <span>•</span>
                  <span>{HOTEL_DATA.breakfast.location}</span>
                </div>
              </div>

              {/* Venues */}
              <div className="space-y-3.5">
                {HOTEL_DATA.dining.map((venue, idx) => (
                  <div key={idx} className="p-4 bg-white border border-[#E5DFD5] rounded-xl space-y-2 shadow-xs">
                    <div className="flex justify-between items-baseline border-b border-[#EDE8E0] pb-2">
                      <h3 className="text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-[#C2410C]" />
                        {venue.name}
                      </h3>
                      <span className="text-[11px] text-[#78716C] font-medium">
                        {venue.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {venue.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-[#78716C] pt-1.5">
                      <span><strong>Hours:</strong> {venue.hours}</span>
                      {venue.dressCode && <span><strong>Attire:</strong> {venue.dressCode}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AMENITIES MODAL */}
          {activeModal === "amenities" && (
            <div className="space-y-3.5">
              <p className="text-[#57534E] leading-relaxed">
                Enjoy contemporary amenities including an open-air swimming pool, fully equipped fitness centre, and round-the-clock services.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HOTEL_DATA.amenities.map((amenity, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-[#E5DFD5] rounded-xl space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2 text-[#C2410C]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <h3 className="text-xs font-semibold text-[#1C1917]">
                        {amenity.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {amenity.description}
                    </p>
                    {amenity.hours && (
                      <span className="block text-[11px] text-[#78716C]">
                        {amenity.hours}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POLICIES MODAL */}
          {activeModal === "policies" && (
            <div className="space-y-3.5">
              {HOTEL_DATA.policies.map((policy, idx) => (
                <div key={idx} className="p-4 bg-white border border-[#E5DFD5] rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-[#EDE8E0] pb-2 text-[#C2410C]">
                    <Shield className="w-4 h-4" />
                    <h3 className="text-sm font-semibold text-[#1C1917]">
                      {policy.title}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-[#1C1917]">{policy.summary}</p>
                  <ul className="space-y-1.5 text-xs text-[#57534E]">
                    {policy.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 border-t border-[#E5DFD5] bg-white flex items-center justify-between">
          <span className="text-xs text-[#78716C]">
            Have a specific request? Ask our digital assistant anytime.
          </span>

          <button
            onClick={() => {
              onClose();
              onOpenStayPlanner();
            }}
            className="px-4 py-2 bg-[#1C1917] hover:bg-[#C2410C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Check Stay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
