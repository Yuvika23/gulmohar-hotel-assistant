"use client";

import React from "react";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { ChatMessageData } from "@/lib/conciergeEngine";
import { RoomCard } from "./RoomCard";
import { Room } from "@/data/hotelKnowledge";
import { AvailableRoom } from "@/lib/availabilityService";
import { GulmoharLogo } from "./GulmoharLogo";

interface ChatMessageProps {
  message: ChatMessageData;
  onSelectAction?: (actionText: string) => void;
  onSelectRoom?: (room: Room | AvailableRoom) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectAction,
  onSelectRoom,
}) => {
  const isGuest = message.sender === "guest";

  if (isGuest) {
    return (
      <div className="flex justify-end w-full animate-fade-in my-2.5">
        <div className="max-w-[85%] sm:max-w-[75%] bg-[#1C1917] text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#A8A092] mb-1 font-semibold flex justify-between items-center">
            <span>You</span>
            <span>{message.timestamp}</span>
          </div>
          <p className="whitespace-pre-line">{message.text}</p>
        </div>
      </div>
    );
  }

  // Hotel Assistant Message
  return (
    <div className="flex justify-start w-full animate-fade-in my-3">
      <div className="max-w-[95%] sm:max-w-[85%] w-full bg-white border border-[#E5DFD5] rounded-xl p-4 sm:p-5 shadow-xs">
        {/* Assistant Header */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#EDE8E0]">
          <div className="flex items-center space-x-2.5">
            <GulmoharLogo size={26} />
            <div className="flex items-baseline space-x-2 text-xs">
              <span className="font-semibold text-[#1C1917]">
                Guest Assistant
              </span>
              <span className="text-[#C2410C] text-[10px]">•</span>
              <span className="text-[11px] text-[#78716C]">
                The Gulmohar
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#A8A092]">{message.timestamp}</span>
        </div>

        {/* Message Text */}
        <div className="text-xs sm:text-sm text-[#292524] leading-relaxed space-y-2">
          <p className="whitespace-pre-line">{message.text}</p>
        </div>

        {/* Highlighted Single Room Recommendation */}
        {message.highlightedRoom && (
          <div className="mt-3.5 pt-3 border-t border-[#EDE8E0]">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#C2410C] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Recommended Room</span>
            </div>
            <RoomCard
              room={message.highlightedRoom}
              onSelectRoom={onSelectRoom}
              compact={true}
            />
          </div>
        )}

        {/* Embedded Live Availability Results */}
        {message.availabilityData && message.availabilityData.rooms.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-[#EDE8E0] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#15803D] font-semibold bg-[#F0FDF4] p-2 rounded-lg border border-[#BBF7D0]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
                {message.availabilityData.nights} {message.availabilityData.nights === 1 ? "Night" : "Nights"} ({message.availabilityData.checkIn} to {message.availabilityData.checkOut})
              </span>
              <span>
                {message.availabilityData.guests} {message.availabilityData.guests === 1 ? "Guest" : "Guests"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {message.availabilityData.rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelectRoom={onSelectRoom}
                  compact={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Follow-up Actions */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-[#EDE8E0] flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#78716C] font-semibold mr-1">
              Suggestions:
            </span>
            {message.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onSelectAction && onSelectAction(action)}
                className="px-2.5 py-1 text-xs bg-[#F5F2EB] hover:bg-[#FFF7ED] border border-[#E5DFD5] hover:border-[#FED7AA] text-[#44403C] hover:text-[#C2410C] rounded-lg transition-colors flex items-center gap-1 cursor-pointer active:scale-98 font-medium shadow-2xs"
              >
                <span>{action}</span>
                <ArrowRight className="w-2.5 h-2.5 text-[#C2410C]" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
