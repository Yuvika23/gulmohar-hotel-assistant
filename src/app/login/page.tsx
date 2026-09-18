"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Shield, Phone, Mail, Lock, User, Sparkles, MapPin } from "lucide-react";
import { GulmoharLogo } from "@/components/GulmoharLogo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");

  // Form states
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    try {
      const existing = localStorage.getItem("gulmohar_guest_user");
      if (existing) {
        const parsed = JSON.parse(existing);
        setSuccess(`Currently signed in as ${parsed.name || parsed.phone || parsed.email}`);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || phone.trim().length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setSuccess("Verification OTP sent to +91 " + phone + " (Demo code: 1234)");
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp !== "1234" && otp.trim().length !== 4) {
      setError("Invalid OTP. For demo purposes, please use 1234.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = {
        name: mode === "register" ? fullName || "Resident Guest" : "Resident Guest",
        phone: "+91 " + phone,
        memberSince: "2026",
        tier: "Resident Club",
      };
      localStorage.setItem("gulmohar_guest_user", JSON.stringify(user));
      setLoading(false);
      setSuccess("Welcome to The Gulmohar Resident Club!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 600);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = {
        name: mode === "register" ? fullName || "Resident Guest" : email.split("@")[0],
        email,
        memberSince: "2026",
        tier: "Resident Club",
      };
      localStorage.setItem("gulmohar_guest_user", JSON.stringify(user));
      setLoading(false);
      setSuccess("Authentication successful. Redirecting to assistant...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 600);
  };

  const handleLogout = () => {
    localStorage.removeItem("gulmohar_guest_user");
    setSuccess(null);
    setOtpSent(false);
    setPhone("");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen bg-[#C4AD98] flex flex-col justify-between text-[#1C1917]">
      {/* Top Navbar */}
      <header className="w-full border-b border-[#B59E89] bg-[#C4AD98] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#44403C] hover:text-[#C2410C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Guest Assistant</span>
          </Link>

          <div className="flex items-center space-x-2.5">
            <GulmoharLogo size={36} />
            <div>
              <span className="font-semibold text-sm tracking-wider uppercase text-[#1C1917]">
                THE GULMOHAR
              </span>
              <span className="block text-[10px] text-[#57534E] uppercase tracking-wider">
                Bengaluru · India
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          {/* Left Column: Architectural Photograph & Resident Perks */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-md border border-[#E3DDD3] flex flex-col justify-between min-h-[460px] bg-[#191614] group">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/hotel/hero-lobby.jpg"
                alt="The Gulmohar Hotel Lobby"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-102"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            </div>

            {/* Top Badge */}
            <div className="relative p-6 sm:p-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-[#C2410C] text-xs font-semibold shadow-xs">
                <GulmoharLogo size={20} />
                <span>Gulmohar Resident Club — Coming Soon</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-3">
                A seamless boutique stay in central Bengaluru.
              </h2>
              <p className="text-xs text-white/80 mt-1 leading-relaxed max-w-md">
                Preview member privileges, priority early check-in, and exclusive resident dining benefits.
              </p>
            </div>

            {/* Bottom Perks Card Overlay */}
            <div className="relative p-6 sm:p-8 z-10 space-y-3 bg-black/40 backdrop-blur-sm border-t border-white/10 text-xs text-white/90">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span><strong>Early Check-in Priority:</strong> Advance room readiness requests from 10:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span><strong>10% Resident Dining Privilege:</strong> Valid across all-day dining</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span><strong>Direct Booking Guarantee:</strong> Transparent rates in ₹ with zero booking fees</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FED7AA]" /> 14 Lavelle Road, Bengaluru
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> Demo Mode Preview
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Guest Sign In Form Card */}
          <div className="lg:col-span-6 bg-white border border-[#E3DDD3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-center">
            {/* Reviewer / Demo Notice */}
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Resident Club — Coming Soon (Demo Mode):</strong> This guest portal demonstrates local session state and UI flows. Full backend authentication is planned for a future release. Use demo OTP <strong>1234</strong> to preview.
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C2410C] font-semibold block">
                {mode === "login" ? "Guest Sign In (Preview)" : "Registration (Preview)"}
              </span>
              <h1 className="text-2xl font-bold text-[#1C1917] tracking-tight">
                {mode === "login" ? "Welcome to The Gulmohar." : "Join the Resident Club"}
              </h1>
              <p className="text-xs text-[#78716C] mt-1">
                {mode === "login"
                  ? "Access your stay details, dining privileges, and live assistant in demo mode."
                  : "Preview the Gulmohar Resident Club member experience."}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-[#DFD7C8] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setOtpSent(false);
                }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-[#1C1917] shadow-xs"
                    : "text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                Guest Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                  setOtpSent(false);
                }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-white text-[#1C1917] shadow-xs"
                    : "text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Auth Method Switcher (Phone OTP vs Email) */}
            <div className="flex items-center justify-center gap-4 text-xs text-[#78716C] border-b border-[#EDE8E0] pb-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("phone");
                  setError(null);
                  setOtpSent(false);
                }}
                className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer font-semibold ${
                  authMethod === "phone"
                    ? "border-[#C2410C] text-[#C2410C]"
                    : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile Number (Fast OTP)</span>
              </button>
              <span className="text-[#D1C7BA]">|</span>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("email");
                  setError(null);
                }}
                className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer font-semibold ${
                  authMethod === "email"
                    ? "border-[#C2410C] text-[#C2410C]"
                    : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email &amp; Password</span>
              </button>
            </div>

            {/* Success & Error notices */}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
                <span>{success}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] underline font-semibold hover:text-emerald-950 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {error}
              </div>
            )}

            {/* Form */}
            {authMethod === "phone" ? (
              !otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  {mode === "register" && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#A8A092] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g., Vikram Mehra"
                          className="w-full bg-[#FAF7F0] border border-[#E3DDD3] focus:border-[#C2410C] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1917] outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                      Mobile Number
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2 bg-[#DFD7C8] border border-[#E3DDD3] rounded-xl text-xs font-semibold text-[#44403C]">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="98765 43210"
                        className="flex-1 bg-[#FAF7F0] border border-[#E3DDD3] focus:border-[#C2410C] rounded-xl px-3 py-2 text-xs text-[#1C1917] outline-none tracking-wider"
                      />
                    </div>
                    <p className="text-[10px] text-[#78716C]">
                      We will send a 4-digit verification code to this Indian mobile number.
                    </p>
                  </div>

                  {mode === "register" && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                        City of Residence
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Bengaluru, Mumbai, Delhi"
                        className="w-full bg-[#FAF7F0] border border-[#E3DDD3] focus:border-[#C2410C] rounded-xl px-3 py-2 text-xs text-[#1C1917] outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs active:scale-99 disabled:opacity-70"
                  >
                    {loading ? "Sending OTP..." : "Send Verification OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div className="p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-xl text-xs text-[#9A3412] space-y-1">
                    <p className="font-semibold">Verification Code Sent</p>
                    <p className="text-[11px]">
                      Enter the 4-digit OTP sent to +91 {phone}. (Use demo code: <strong>1234</strong>)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                      4-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="1234"
                      className="w-full bg-[#FAF7F0] border border-[#E3DDD3] focus:border-[#C2410C] rounded-xl px-3 py-2.5 text-center text-xl tracking-[0.5em] font-bold text-[#1C1917] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#78716C] hover:underline cursor-pointer"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[#C2410C] hover:underline font-semibold cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs active:scale-99 disabled:opacity-70"
                  >
                    {loading ? "Verifying..." : "Verify & Enter Guest Portal"}
                  </button>
                </form>
              )
            ) : (
              /* Email + Password Form */
              <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#A8A092] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., Vikram Mehra"
                        className="w-full bg-[#FAF7F0] border border-[#E3DDD3] focus:border-[#C2410C] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1917] outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A8A092] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., guest@example.com"
                      className="w-full bg-[#FAF7F0] border border-[#E3DDD3] focus:border-[#C2410C] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1917] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                      Password
                    </label>
                    {mode === "login" && (
                      <span className="text-[11px] text-[#78716C] hover:underline cursor-pointer">
                        Forgot?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A8A092] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF7F0] border border-[#E3DDD3] focus:border-[#C2410C] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1917] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs active:scale-99 disabled:opacity-70"
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "Sign In"
                    : "Create Guest Account"}
                </button>
              </form>
            )}

            <p className="text-[11px] text-[#78716C] text-center pt-1">
              By signing in, you agree to The Gulmohar&apos;s reservation terms and guest privacy policy.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E3DDD3] bg-[#FAF7F0] py-4 text-center text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>THE GULMOHAR · 14 Lavelle Road, Bengaluru, Karnataka, India</span>
          <span>Guest Assistance Desk: +91 80 4965 7700</span>
        </div>
      </footer>
    </div>
  );
}
