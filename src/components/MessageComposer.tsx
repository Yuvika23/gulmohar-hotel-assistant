"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, X } from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Ask about rooms, dining, amenities, policies, or availability...",
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="w-full bg-[#FCFBF9] border-t border-[#E5DFD5] p-3 sm:p-3.5 shadow-2xs">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5DFD5] focus-within:border-[#C2410C] rounded-xl transition-all duration-150 p-2 sm:p-2.5 shadow-xs"
      >
        <div className="flex items-start gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="w-full resize-none bg-transparent outline-none text-xs sm:text-sm text-[#1C1917] placeholder:text-[#A8A092] leading-relaxed py-1 px-1.5 max-h-28"
          />

          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            {text.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-[#A8A092] hover:text-[#1C1917] transition-colors rounded-md cursor-pointer"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              disabled={!text.trim() || disabled}
              className="p-2 bg-[#1C1917] hover:bg-[#C2410C] disabled:opacity-30 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center active:scale-95 shadow-xs"
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footnote */}
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#EDE8E0] text-[10px] text-[#78716C]">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>The Gulmohar Guest Assistant</span>
          </div>
          <span className="hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-[#F5F2EB] border border-[#E5DFD5] rounded text-[9px] font-mono">Enter</kbd> to send
          </span>
        </div>
      </form>
    </div>
  );
};
