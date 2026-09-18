"use client";

import React from "react";
import { AlertCircle, RotateCcw, Mail } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "We are experiencing a brief delay reaching our hotel assistant.",
  onRetry,
}) => {
  return (
    <div className="flex justify-start w-full animate-fade-in my-2.5">
      <div className="bg-white border border-red-200 rounded-lg p-4 shadow-2xs max-w-[90%] sm:max-w-[75%] space-y-2.5">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">
            Assistant Notice
          </span>
        </div>

        <p className="text-xs text-[#525252] leading-relaxed">
          {message}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#F0F0EC]">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-[#191919] hover:bg-[#C2410C] text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}

          <a
            href="mailto:reservations@thegulmohar.in"
            className="px-3 py-1.5 bg-[#F4F4F2] hover:bg-[#EAEAE6] border border-[#E8E8E4] text-[#404040] text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3 h-3 text-[#737373]" />
            <span>Email Front Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
};
