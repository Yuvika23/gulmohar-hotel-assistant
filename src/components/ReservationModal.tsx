"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";
import { Room } from "@/data/hotelKnowledge";
import { AvailableRoom } from "@/lib/availabilityService";
import { GulmoharLogo } from "./GulmoharLogo";

interface ReservationModalProps {
  room: Room | AvailableRoom | null;
  onClose: () => void;
  onConfirmInquiry: (message: string) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  room,
  onClose,
  onConfirmInquiry,
}) => {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!room) return null;

  const isAvailableRoom = "totalPrice" in room;
  const nights = isAvailableRoom ? (room as AvailableRoom).nights : 2;
  const totalPrice = isAvailableRoom ? (room as AvailableRoom).totalPrice : room.pricePerNight * 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const inquiryText = `I would like to reserve the ${room.name} for ${room.capacity} guests. Guest: ${guestName || "Guest"} (${guestEmail || "Email provided"}). ${specialRequests ? `Special requests: ${specialRequests}` : ""}`;

    setTimeout(() => {
      onConfirmInquiry(inquiryText);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[#FCFBF9] border border-[#E5DFD5] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5DFD5] bg-white flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <GulmoharLogo size={32} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#C2410C] font-semibold block">
                Reservation Request
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-[#1C1917] tracking-tight">
                {room.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg cursor-pointer hover:bg-[#F5F2EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-white">
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C1917]">Inquiry Sent to Front Desk</h3>
            <p className="text-xs text-[#57534E] max-w-sm mx-auto leading-relaxed">
              We have noted your details for the {room.name}. Connecting you with our guest assistant now.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            {/* Stay Overview Pill */}
            <div className="p-3.5 bg-white border border-[#E5DFD5] rounded-xl space-y-2 shadow-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#57534E]">{room.bedType}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-[#1C1917]">
                    ₹{room.pricePerNight.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[#78716C]">/ night</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EDE8E0] flex items-center justify-between text-[11px] text-[#57534E]">
                <span>Wi-Fi &amp; Pool access included</span>
                <span className="font-semibold text-[#1C1917]">
                  Estimated {nights} nights: ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Guest Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#525252] mb-1">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vikram Mehra"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD5] focus:border-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1C1917] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#525252] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g., vikram@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD5] focus:border-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1C1917] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#525252] mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Early check-in preference, airport transfer from BLR, dietary preferences..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD5] focus:border-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1C1917] outline-none resize-none shadow-2xs"
                />
              </div>
            </div>

            {/* Policy Reminder */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-[#78350F] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <span>
                Free cancellation up to 48 hours prior to check-in. Valid Government-issued photo ID required at arrival.
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EDE8E0]">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-[#EFECE4] hover:bg-[#E5DFD5] text-[#44403C] rounded-lg cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1C1917] hover:bg-[#C2410C] text-white rounded-lg cursor-pointer font-semibold text-xs transition-colors shadow-xs"
              >
                Confirm Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
