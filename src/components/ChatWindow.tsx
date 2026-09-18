"use client";

import React, { useRef, useEffect } from "react";
import { ChatMessageData } from "@/lib/conciergeEngine";
import { ChatMessage } from "./ChatMessage";
import { MessageComposer } from "./MessageComposer";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { Room } from "@/data/hotelKnowledge";
import { AvailableRoom } from "@/lib/availabilityService";
import { Sparkles } from "lucide-react";
import { GulmoharLogo } from "./GulmoharLogo";

interface ChatWindowProps {
  messages: ChatMessageData[];
  loading: boolean;
  error: string | null;
  onSendMessage: (text: string) => void;
  onRetry: () => void;
  onSelectRoom: (room: Room | AvailableRoom) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  loading,
  error,
  onSendMessage,
  onRetry,
  onSelectRoom,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, error]);

  return (
    <div className="flex flex-col h-full bg-[#F5F2EB] border border-[#E5DFD5] rounded-xl shadow-xs overflow-hidden">
      {/* Assistant Header Banner */}
      <div className="px-5 py-3.5 border-b border-[#E5DFD5] bg-[#FCFBF9] flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <GulmoharLogo size={32} showLiveDot={true} />
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#1C1917]">
              Guest Assistant
            </h2>
            <p className="text-[11px] text-[#78716C]">
              The Gulmohar · Bengaluru, India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#C2410C] bg-[#FFF7ED] px-2.5 py-1 rounded-full border border-[#FED7AA]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px]">Online 24/7</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-1.5">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onSelectAction={onSendMessage}
            onSelectRoom={onSelectRoom}
          />
        ))}

        {loading && <LoadingState message="Checking hotel details..." />}

        {error && <ErrorState message={error} onRetry={onRetry} />}

        <div ref={bottomRef} />
      </div>

      {/* Message Composer Area */}
      <MessageComposer onSendMessage={onSendMessage} disabled={loading} />
    </div>
  );
};
