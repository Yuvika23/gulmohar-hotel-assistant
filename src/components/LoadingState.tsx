"use client";

import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Checking hotel information...",
}) => {
  return (
    <div className="flex justify-start w-full animate-fade-in my-2.5">
      <div className="bg-white border border-[#E8E8E4] rounded-lg p-3.5 shadow-2xs max-w-[85%] sm:max-w-[70%]">
        <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-[#F0F0EC]">
          <div className="w-5 h-5 rounded-md bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center text-[#C2410C] text-[10px] font-semibold">
            G
          </div>
          <span className="text-[11px] font-semibold text-[#191919]">
            Guest Assistant
          </span>
          <span className="text-[#D4D4D0] text-[10px]">•</span>
          <span className="text-[11px] text-[#C2410C] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-ping" />
            Finding answers
          </span>
        </div>

        <div className="flex items-center space-x-2.5 py-0.5">
          <div className="w-3.5 h-3.5 border-2 border-[#E8E8E4] border-t-[#C2410C] rounded-full animate-spin shrink-0" />
          <p className="text-xs text-[#525252]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
