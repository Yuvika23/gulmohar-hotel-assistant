"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, BedDouble, Utensils, Sparkles, ShieldCheck, Clock, User, LogOut } from "lucide-react";
import { GulmoharLogo } from "./GulmoharLogo";

interface HeaderProps {
  onOpenAvailability: () => void;
  onOpenModal: (modal: "rooms" | "dining" | "amenities" | "policies") => void;
}

interface GuestUser {
  name: string;
  phone?: string;
  email?: string;
  tier?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAvailability, onOpenModal }) => {
  const [istTime, setIstTime] = useState<string>("");
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now);
        setIstTime(timeString);
      } catch {
        setIstTime("16:00");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);

    // Check logged in user
    try {
      const stored = localStorage.getItem("gulmohar_guest_user");
      if (stored) {
        setGuestUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gulmohar_guest_user");
    setGuestUser(null);
    setShowUserMenu(false);
  };

  return (
    <header className="w-full border-b border-[#B59E89] bg-[#C4AD98]/95 backdrop-blur-xs sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Brand Identity & Wordmark */}
        <Link href="/" className="flex items-center space-x-3 group">
          {/* Hotel Botanical Emblem Logo */}
          <GulmoharLogo size={38} showLiveDot={true} className="group-hover:scale-105 transition-transform" />

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-semibold tracking-[0.14em] text-base sm:text-lg text-[#1C1917] group-hover:text-[#C2410C] transition-colors">
                THE GULMOHAR
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] tracking-wider uppercase text-[#57534E]">
              <span>Boutique Hotel &amp; Guest Assistant</span>
              <span className="text-[#C2410C]">•</span>
              <span className="font-medium text-[#1C1917]">Bengaluru · India</span>
            </div>
          </div>
        </Link>

        {/* Center: Live Duty Status Area */}
        <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#B89F89] border border-[#A88E78] text-[11px] text-[#1C1917]">
          <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
          <span className="font-semibold text-[#1C1917]">Guest Assistance</span>
          <span className="text-[#8C7561]">|</span>
          <span className="text-[#44403C] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#57534E]" />
            Bengaluru · IST {istTime || "16:00"}
          </span>
        </div>

        {/* Right: Quick Navigation & Availability Button */}
        <div className="flex items-center space-x-1 sm:space-x-2.5">
          <nav className="hidden lg:flex items-center space-x-0.5 text-xs font-medium text-[#57534E]">
            <button
              onClick={() => onOpenModal("rooms")}
              className="px-2.5 py-1.5 rounded-md hover:text-[#1C1917] hover:bg-[#EFECE4] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BedDouble className="w-3.5 h-3.5 text-[#78716C]" />
              Rooms
            </button>
            <button
              onClick={() => onOpenModal("dining")}
              className="px-2.5 py-1.5 rounded-md hover:text-[#1C1917] hover:bg-[#EFECE4] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-[#78716C]" />
              Dining
            </button>
            <button
              onClick={() => onOpenModal("amenities")}
              className="px-2.5 py-1.5 rounded-md hover:text-[#1C1917] hover:bg-[#EFECE4] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#78716C]" />
              Amenities
            </button>
            <button
              onClick={() => onOpenModal("policies")}
              className="px-2.5 py-1.5 rounded-md hover:text-[#1C1917] hover:bg-[#EFECE4] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#78716C]" />
              Policies
            </button>
          </nav>

          {/* Guest Account / Login Button */}
          {guestUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="px-2.5 py-1.5 text-xs font-medium bg-[#EFECE4] hover:bg-[#E5DFD5] border border-[#E5DFD5] text-[#1C1917] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-[#C2410C] text-white flex items-center justify-center text-[9px] font-bold">
                  {guestUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px]">{guestUser.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E5DFD5] rounded-lg shadow-lg p-2 text-xs space-y-1 z-40 animate-fade-in">
                  <div className="p-2 border-b border-[#EDE8E0]">
                    <span className="block font-semibold text-[#1C1917] truncate">{guestUser.name}</span>
                    <span className="block text-[10px] text-[#C2410C] font-medium">{guestUser.tier || "Resident Club"}</span>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-[#F5F2EB] text-[#44403C] block"
                  >
                    Guest Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 text-red-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#44403C] hover:text-[#1C1917] hover:bg-[#EFECE4] border border-[#E5DFD5] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Quick Stay Check Trigger */}
          <button
            onClick={onOpenAvailability}
            className="px-3 sm:px-3.5 py-1.5 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#C2410C] transition-colors flex items-center gap-1.5 rounded-lg cursor-pointer shadow-xs active:scale-98"
            aria-label="Check Room Availability"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Check Stay</span>
          </button>
        </div>
      </div>
    </header>
  );
};
