"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { WelcomeHero } from "@/components/WelcomeHero";
import { StayPlanner } from "@/components/StayPlanner";
import { ChatWindow } from "@/components/ChatWindow";
import { InfoModals } from "@/components/InfoModals";
import { ReservationModal } from "@/components/ReservationModal";
import { RoomCard } from "@/components/RoomCard";
import { ChatMessageData } from "@/lib/conciergeEngine";
import { sendChatMessage } from "@/lib/api";
import { Room, HOTEL_DATA } from "@/data/hotelKnowledge";
import { AvailableRoom } from "@/lib/availabilityService";
import { MapPin, Phone, Mail, Clock, Shield, Sparkles, Waves, Dumbbell, Wifi, Car, Utensils, Coffee } from "lucide-react";
import { GulmoharLogo } from "@/components/GulmoharLogo";

export default function Home() {
  // Initial Concierge Greeting
  const initialGreeting: ChatMessageData = {
    id: "welcome-msg",
    sender: "concierge",
    text: `Welcome to The Gulmohar. I am your digital guest assistant.

Whether you would like to know about our rooms, all-day dining and breakfast, amenities, hotel policies, or check live room availability, I am happy to help.

How can we make your stay in Bengaluru comfortable today?`,
    timestamp: "Just now",
    suggestedActions: [
      "Is breakfast included?",
      "Do you have a room for 3 adults?",
      "What amenities do you have?",
      "What time is check-in?",
    ],
  };

  const [messages, setMessages] = useState<ChatMessageData[]>([initialGreeting]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessageSent, setLastMessageSent] = useState<string>("");

  // Modals & Selected Room
  const [activeModal, setActiveModal] = useState<"rooms" | "dining" | "amenities" | "policies" | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | AvailableRoom | null>(null);

  // Active tab on mobile (planner vs conversation)
  const [mobileTab, setMobileTab] = useState<"chat" | "stay">("chat");

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setError(null);
    setLastMessageSent(text);

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: "guest",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Build conversation history for context
      const history = updatedMessages.map((m) => ({
        role: m.sender === "guest" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

      const response = await sendChatMessage(text, history);

      const conciergeReply: ChatMessageData = {
        id: `concierge-${Date.now()}`,
        sender: "concierge",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: response.suggestedActions,
        availabilityData: response.availabilityData,
        highlightedRoom: response.highlightedRoom,
      };

      setMessages((prev) => [...prev, conciergeReply]);
    } catch (err: unknown) {
      console.error("Chat error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "We are experiencing a temporary delay reaching our assistant."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastMessageSent) {
      handleSendMessage(lastMessageSent);
    }
  };

  const handleInquireStayInChat = (checkIn: string, checkOut: string, guests: number) => {
    const prompt = `Do you have rooms available from ${checkIn} to ${checkOut} for ${guests} guests?`;
    setMobileTab("chat");
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#C4AD98] text-[#1C1917]">
      {/* 1. Header */}
      <Header
        onOpenAvailability={() => {
          setMobileTab("stay");
          const plannerElem = document.getElementById("stay-planner-section");
          if (plannerElem) plannerElem.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* 2. Welcome Experience & Split Editorial Hero */}
      <WelcomeHero
        onSelectService={(service) => {
          if (service === "availability") {
            setMobileTab("stay");
            const plannerElem = document.getElementById("stay-planner-section");
            if (plannerElem) plannerElem.scrollIntoView({ behavior: "smooth" });
          }
        }}
        onSelectQuestion={(q) => handleSendMessage(q)}
        onOpenAvailability={() => {
          setMobileTab("stay");
          const plannerElem = document.getElementById("stay-planner-section");
          if (plannerElem) plannerElem.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden px-4 pt-3 pb-1 max-w-7xl mx-auto w-full">
        <div className="flex rounded-xl border border-[#E3DDD3] bg-[#EAE4D9] p-1">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mobileTab === "chat" ? "bg-white text-[#1C1917] shadow-xs" : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            Guest Assistant
          </button>
          <button
            onClick={() => setMobileTab("stay")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mobileTab === "stay" ? "bg-white text-[#1C1917] shadow-xs" : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            Check Stay &amp; Rooms
          </button>
        </div>
      </div>

      {/* 3. Main Workspace: Two-column on desktop */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Stay Planner & Hotel Identity */}
          <div
            id="stay-planner-section"
            className={`lg:col-span-5 space-y-6 ${mobileTab === "chat" ? "hidden lg:block" : "block"}`}
          >
            {/* Interactive Stay Planner Card */}
            <StayPlanner
              onSelectRoom={(room) => setSelectedRoom(room)}
              onInquireStayInChat={handleInquireStayInChat}
            />

            {/* Hotel Overview Card */}
            <div className="bg-[#FAF7F0] border border-[#E3DDD3] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EDE8E0] pb-3">
                <span className="text-[11px] uppercase tracking-wider text-[#C2410C] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                  Hotel Overview
                </span>
                <span className="text-xs text-[#15803D] flex items-center gap-1 font-semibold">
                  <Shield className="w-3.5 h-3.5" /> Best Direct Rates
                </span>
              </div>

              <div className="flex items-start gap-3">
                <GulmoharLogo size={34} />
                <div>
                  <h3 className="text-lg font-semibold text-[#1C1917] tracking-tight">
                    {HOTEL_DATA.name}
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    {HOTEL_DATA.tagline}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed mt-2.5">
                {HOTEL_DATA.overview}
              </p>

              {/* Practical Stay Details */}
              <div className="space-y-2.5 pt-3 border-t border-[#EDE8E0] text-xs text-[#44403C]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C2410C] shrink-0 mt-0.5" />
                  <span>{HOTEL_DATA.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                  <span>
                    Check-in: <strong>{HOTEL_DATA.checkIn.standardTime}</strong> | Check-out:{" "}
                    <strong>{HOTEL_DATA.checkOut.standardTime}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                  <span>{HOTEL_DATA.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                  <span>{HOTEL_DATA.contact.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Guest Assistant Conversation */}
          <div className={`lg:col-span-7 h-[680px] sm:h-[750px] ${mobileTab === "stay" ? "hidden lg:block" : "block"}`}>
            <ChatWindow
              messages={messages}
              loading={loading}
              error={error}
              onSendMessage={handleSendMessage}
              onRetry={handleRetry}
              onSelectRoom={(room) => setSelectedRoom(room)}
            />
          </div>
        </div>

        {/* 4. Hotel Rooms Showcase (Visual Grid with Photography) */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E3DDD3] pb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C2410C]">
                ACCOMMODATION
              </span>
              <h2 className="text-2xl font-bold text-[#1C1917] tracking-tight mt-0.5">
                Rooms &amp; Suites
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Thoughtfully appointed spaces featuring city views, high-speed Wi-Fi, and plush bedding.
              </p>
            </div>

            <button
              onClick={() => setActiveModal("rooms")}
              className="text-xs font-semibold text-[#C2410C] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View full room comparison</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {HOTEL_DATA.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSelectRoom={(r) => setSelectedRoom(r)}
                compact={false}
              />
            ))}
          </div>
        </section>

        {/* 5. Dining & Restaurant Showcase (Photography Split Card) */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-[#E3DDD3] pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C2410C]">
              GASTRONOMY
            </span>
            <h2 className="text-2xl font-bold text-[#1C1917] tracking-tight mt-0.5">
              The Gulmohar Restaurant
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              All-day dining celebrating regional South Indian delicacies, North Indian classics, and continental comfort cuisine.
            </p>
          </div>

          <div className="bg-[#FAF7F0] border border-[#E3DDD3] rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Restaurant Photograph */}
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[300px] w-full bg-[#EAE4D9]">
              <Image
                src="/images/hotel/dining-restaurant.jpg"
                alt="The Gulmohar Restaurant and Breakfast Buffet in Bengaluru"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold">
                Daily 6:30 AM – 11:00 PM
              </div>
            </div>

            {/* Restaurant Copy & Highlights */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-xs font-semibold text-[#C2410C]">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>South Indian · North Indian · Continental</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1C1917] tracking-tight">
                    Morning Breakfast Buffet &amp; Live Counters
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                    Enjoy crisp dosas prepared to order, steamed idlis, medu vadas, authentic South Indian filter coffee, stuffed parathas, seasonal fruits, eggs to order, and continental bakeries. Included with Premium King and Executive Suite bookings.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#44403C]">
                  <div className="p-3 bg-white border border-[#E3DDD3] rounded-xl flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>Traditional Filter Coffee</span>
                  </div>
                  <div className="p-3 bg-white border border-[#E3DDD3] rounded-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>Live Dosa &amp; Egg Counter</span>
                  </div>
                  <div className="p-3 bg-white border border-[#E3DDD3] rounded-xl flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>Extensive Pure Veg Options</span>
                  </div>
                  <div className="p-3 bg-white border border-[#E3DDD3] rounded-xl flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>24/7 In-Room Dining Menu</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDE8E0] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#78716C]">
                  Open to hotel residents and visiting guests.
                </span>
                <button
                  onClick={() => handleSendMessage("Tell me about dining and breakfast at The Gulmohar.")}
                  className="px-4 py-2 bg-[#1C1917] hover:bg-[#C2410C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  Ask Assistant About Dining
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Amenities & Services Grid */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-[#E3DDD3] pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C2410C]">
              HOTEL SERVICES
            </span>
            <h2 className="text-2xl font-bold text-[#1C1917] tracking-tight mt-0.5">
              Curated Guest Amenities
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Everything you need for a comfortable business trip or leisure retreat in central Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 bg-[#FAF7F0] border border-[#E3DDD3] rounded-xl space-y-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E3DDD3] flex items-center justify-center text-[#C2410C]">
                <Waves className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#1C1917]">Swimming Pool</h4>
              <p className="text-[11px] text-[#78716C]">Open-air terrace lap pool, daily 6 AM – 9 PM</p>
            </div>

            <div className="p-4 bg-[#FAF7F0] border border-[#E3DDD3] rounded-xl space-y-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E3DDD3] flex items-center justify-center text-[#C2410C]">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#1C1917]">Fitness Centre</h4>
              <p className="text-[11px] text-[#78716C]">Cardio &amp; strength equipment, open 24/7</p>
            </div>

            <div className="p-4 bg-[#FAF7F0] border border-[#E3DDD3] rounded-xl space-y-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E3DDD3] flex items-center justify-center text-[#C2410C]">
                <Wifi className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#1C1917]">Fiber Wi-Fi</h4>
              <p className="text-[11px] text-[#78716C]">Complimentary high-speed (300 Mbps) across hotel</p>
            </div>

            <div className="p-4 bg-[#FAF7F0] border border-[#E3DDD3] rounded-xl space-y-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E3DDD3] flex items-center justify-center text-[#C2410C]">
                <Car className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#1C1917]">Valet &amp; Parking</h4>
              <p className="text-[11px] text-[#78716C]">Complimentary covered parking with EV charging</p>
            </div>

            <div className="p-4 bg-[#FAF7F0] border border-[#E3DDD3] rounded-xl space-y-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E3DDD3] flex items-center justify-center text-[#C2410C]">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#1C1917]">Airport Transfers</h4>
              <p className="text-[11px] text-[#78716C]">Kempegowda Airport (BLR) chauffeured sedans</p>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Subtle Hotel Footer */}
      <footer className="w-full border-t border-[#E3DDD3] bg-[#FAF7F0] py-8 text-xs text-[#78716C] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5">
                <GulmoharLogo size={28} />
                <span className="font-bold text-[#1C1917] tracking-wider uppercase text-sm">
                  THE GULMOHAR
                </span>
              </div>
              <p className="text-xs text-[#57534E]">
                Boutique Hotel &amp; Guest Assistant
              </p>
              <p className="text-xs text-[#78716C] max-w-sm">
                14 Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001, India
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] block">
                  Guest Services
                </span>
                <ul className="space-y-1">
                  <li><button onClick={() => setActiveModal("rooms")} className="hover:text-[#C2410C] cursor-pointer">Rooms &amp; Suites</button></li>
                  <li><button onClick={() => setActiveModal("dining")} className="hover:text-[#C2410C] cursor-pointer">Dining &amp; Breakfast</button></li>
                  <li><button onClick={() => setActiveModal("amenities")} className="hover:text-[#C2410C] cursor-pointer">Hotel Amenities</button></li>
                  <li><button onClick={() => setActiveModal("policies")} className="hover:text-[#C2410C] cursor-pointer">Policies &amp; FAQs</button></li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] block">
                  Contact
                </span>
                <ul className="space-y-1">
                  <li>+91 80 4965 7700</li>
                  <li>reservations@thegulmohar.in</li>
                  <li>Front Desk: 24 Hours</li>
                  <li>Check-in: 2:00 PM | Check-out: 11:00 AM</li>
                </ul>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <span className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] block">
                  Location
                </span>
                <p className="text-[11px] leading-relaxed">
                  Lavelle Road, central Bengaluru. 36 km from Kempegowda International Airport (BLR).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3DDD3] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>&copy; 2026 The Gulmohar Boutique Hotel. All rights reserved. Digital Guest Assistant.</p>
            <div className="flex items-center gap-4 text-[#78716C]">
              <span>Complimentary Wi-Fi</span>
              <span>•</span>
              <span>24/7 Valet Parking</span>
              <span>•</span>
              <span>Government Photo ID Required</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InfoModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSelectRoomInquiry={(q) => handleSendMessage(q)}
        onOpenStayPlanner={() => {
          setMobileTab("stay");
          const elem = document.getElementById("stay-planner-section");
          if (elem) elem.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <ReservationModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onConfirmInquiry={(inquiry) => handleSendMessage(inquiry)}
      />
    </div>
  );
}
