"use client";

import React from "react";
import Image from "next/image";
import { BedDouble, Calendar, Utensils, Sparkles, ShieldCheck, ArrowUpRight, MapPin } from "lucide-react";

interface WelcomeHeroProps {
  onSelectService: (service: string) => void;
  onSelectQuestion: (question: string) => void;
  onOpenAvailability: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  onSelectService,
  onSelectQuestion,
  onOpenAvailability,
}) => {
  const serviceCards = [
    {
      id: "availability",
      label: "Check Availability",
      subtext: "Live room inventory & tariffs",
      icon: Calendar,
      action: onOpenAvailability,
      highlight: true,
    },
    {
      id: "rooms",
      label: "Explore Rooms",
      subtext: "Deluxe, Premium, Family & Suites",
      icon: BedDouble,
      action: () => onSelectQuestion("Do you have a room for 3 adults?"),
    },
    {
      id: "dining",
      label: "Dining & Breakfast",
      subtext: "Buffet, South/North Indian & Room Service",
      icon: Utensils,
      action: () => onSelectQuestion("Is breakfast included?"),
    },
    {
      id: "amenities",
      label: "Hotel Amenities",
      subtext: "Terrace Pool, 24/7 Gym & High-Speed Wi-Fi",
      icon: Sparkles,
      action: () => onSelectQuestion("What amenities do you have?"),
    },
    {
      id: "policies",
      label: "Hotel Policies",
      subtext: "Check-in 2:00 PM, ID rules & Cancellation",
      icon: ShieldCheck,
      action: () => onSelectQuestion("What time is check-in?"),
    },
  ];

  const quickQuestions = [
    "Is breakfast included?",
    "What time is check-in?",
    "Can I get early check-in?",
    "Do you have a room for 3 adults?",
    "Is parking available?",
    "Do you offer airport transfers?",
    "Is there a swimming pool?",
    "What is the cancellation policy?",
    "Can I add an extra bed?",
  ];

  return (
    <section className="border-b border-[#B59E89] bg-gradient-to-b from-[#D2BAA4] to-[#C4AD98] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top: Editorial Hero Split (Welcome Copy + Large Hotel Visual Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Hospitality Greeting & Introduction */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#C2410C] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FED7AA] shadow-2xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>14 Lavelle Road · Bengaluru, Karnataka</span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#57493D] block">
                WELCOME TO THE GULMOHAR
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight leading-tight">
                Welcome to The Gulmohar.
              </h1>
              <p className="text-lg sm:text-xl font-medium text-[#2E2822]">
                How can we make your stay easier?
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#3D352D] leading-relaxed max-w-xl font-normal">
              Ask about rooms, dining, amenities, hotel policies, or live stay availability. Our digital guest assistant provides instant, grounded answers for your upcoming trip to Bengaluru.
            </p>

            {/* Quick Questions Chips */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-[#2E2822] block">
                Popular inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.slice(0, 6).map((question) => (
                  <button
                    key={question}
                    onClick={() => onSelectQuestion(question)}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#FFF7ED] border border-[#B59E89] hover:border-[#C2410C] text-[#1C1917] hover:text-[#C2410C] text-xs font-medium transition-colors cursor-pointer shadow-2xs active:scale-98"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Architectural Hotel Photograph Panel */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E3DDD3] group">
              <div className="aspect-[4/3] sm:aspect-[16/10] relative w-full bg-[#EAE4D9]">
                <Image
                  src="/images/hotel/hero-lobby.jpg"
                  alt="The Gulmohar Boutique Hotel Reception and Courtyard Lounge in Bengaluru"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-102"
                  priority
                />
                {/* Subtle warm architectural gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white flex items-end justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-[10px] uppercase tracking-wider font-semibold mb-1">
                    Boutique Hospitality
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white drop-shadow-xs">
                    Contemporary sanctuary in central Bengaluru
                  </p>
                  <p className="text-xs text-white/80 font-light">
                    Natural teak wood · Courtyard greenery · 24/7 guest assistance
                  </p>
                </div>

                <button
                  onClick={onOpenAvailability}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Asymmetric Service Cards Grid (Prominent Availability + Smaller Service Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            const isFeatured = service.highlight;

            return (
              <button
                key={service.id}
                onClick={service.action}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group cursor-pointer text-left ${
                  isFeatured
                    ? "bg-[#FFF7ED] border-[#FED7AA] hover:border-[#C2410C] shadow-sm sm:col-span-2 lg:col-span-1 ring-1 ring-[#C2410C]/20"
                    : "bg-white hover:bg-[#FCFBF9] border-[#E3DDD3] hover:border-[#C7BEB0] shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isFeatured
                        ? "bg-[#C2410C] text-white shadow-xs"
                        : "bg-[#DFD7C8] text-[#44403C] group-hover:text-[#C2410C] transition-colors"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight
                    className={`w-4 h-4 transition-colors ${
                      isFeatured
                        ? "text-[#C2410C]"
                        : "text-[#A8A092] group-hover:text-[#C2410C]"
                    }`}
                  />
                </div>

                <div>
                  <span className={`block text-xs font-bold ${isFeatured ? "text-[#C2410C]" : "text-[#1C1917]"}`}>
                    {service.label}
                  </span>
                  <span className="block text-[11px] text-[#78716C] mt-0.5 leading-snug">
                    {service.subtext}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
