"use client";

import React from "react";

interface GulmoharLogoProps {
  size?: number;
  className?: string;
  showLiveDot?: boolean;
  variant?: "terracotta" | "dark" | "gold" | "white";
}

export const GulmoharLogo: React.FC<GulmoharLogoProps> = ({
  size = 36,
  className = "",
  showLiveDot = false,
  variant = "terracotta",
}) => {
  // Color themes
  const colorMap = {
    terracotta: {
      bg: "#FFF7ED",
      border: "#FED7AA",
      petalPrimary: "#C2410C",
      petalSecondary: "#EA580C",
      center: "#9A3412",
      ring: "#FDBA74",
      accent: "#D97706",
    },
    dark: {
      bg: "#1C1917",
      border: "#44403C",
      petalPrimary: "#FED7AA",
      petalSecondary: "#FDBA74",
      center: "#F97316",
      ring: "#78716C",
      accent: "#FBBF24",
    },
    gold: {
      bg: "#FEF3C7",
      border: "#FDE68A",
      petalPrimary: "#B45309",
      petalSecondary: "#D97706",
      center: "#92400E",
      ring: "#FCD34D",
      accent: "#F59E0B",
    },
    white: {
      bg: "rgba(255, 255, 255, 0.95)",
      border: "rgba(255, 255, 255, 0.4)",
      petalPrimary: "#C2410C",
      petalSecondary: "#EA580C",
      center: "#9A3412",
      ring: "#FED7AA",
      accent: "#D97706",
    },
  };

  const theme = colorMap[variant] || colorMap.terracotta;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl shadow-2xs transition-transform duration-200 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        <defs>
          {/* Petal Gradients */}
          <linearGradient id="gulmoharPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.petalSecondary} />
            <stop offset="100%" stopColor={theme.petalPrimary} />
          </linearGradient>

          <linearGradient id="gulmoharTopPetalGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={theme.accent} />
            <stop offset="100%" stopColor={theme.petalPrimary} />
          </linearGradient>

          <radialGradient id="gulmoharCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="60%" stopColor={theme.accent} />
            <stop offset="100%" stopColor={theme.center} />
          </radialGradient>
        </defs>

        {/* Delicate Outer Geometric Frame */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={theme.ring}
          strokeWidth="1.2"
          strokeDasharray="2 3"
          opacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke={theme.border}
          strokeWidth="0.8"
        />

        {/* 5-Petal Stylized Royal Poinciana / Gulmohar Blossom */}
        {/* Top Feature Petal (The Standard with Crown Flare) */}
        <path
          d="M50 18 C56 26, 62 33, 55 45 C52 48, 48 48, 45 45 C38 33, 44 26, 50 18 Z"
          fill="url(#gulmoharTopPetalGrad)"
        />
        <path
          d="M50 20 L50 36"
          stroke="#FFFBEB"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Top-Right Petal */}
        <path
          d="M78 36 C77 46, 68 50, 56 48 C52 46, 50 43, 52 39 C58 29, 68 28, 78 36 Z"
          fill="url(#gulmoharPetalGrad)"
        />

        {/* Bottom-Right Petal */}
        <path
          d="M70 74 C60 77, 54 70, 52 58 C51 54, 53 51, 57 51 C69 51, 74 62, 70 74 Z"
          fill="url(#gulmoharPetalGrad)"
        />

        {/* Bottom-Left Petal */}
        <path
          d="M30 74 C34 62, 39 51, 51 51 C55 51, 57 54, 56 58 C54 70, 48 77, 30 74 Z"
          fill="url(#gulmoharPetalGrad)"
        />

        {/* Top-Left Petal */}
        <path
          d="M22 36 C32 28, 42 29, 48 39 C50 43, 48 46, 44 48 C32 50, 23 46, 22 36 Z"
          fill="url(#gulmoharPetalGrad)"
        />

        {/* Radiating Delicate Stamens / Pistils */}
        <line x1="50" y1="50" x2="50" y2="34" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="50" cy="33" r="1.8" fill={theme.accent} />

        <line x1="50" y1="50" x2="63" y2="42" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="64" cy="41" r="1.8" fill={theme.accent} />

        <line x1="50" y1="50" x2="59" y2="61" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="60" cy="62" r="1.8" fill={theme.accent} />

        <line x1="50" y1="50" x2="41" y2="61" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="40" cy="62" r="1.8" fill={theme.accent} />

        <line x1="50" y1="50" x2="37" y2="42" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="36" cy="41" r="1.8" fill={theme.accent} />

        {/* Center Floral Core */}
        <circle cx="50" cy="50" r="7" fill="url(#gulmoharCenterGlow)" />
        <circle cx="50" cy="50" r="3.2" fill={theme.petalPrimary} />
      </svg>

      {/* Live Assistant Indicator Dot */}
      {showLiveDot && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#15803D] rounded-full border-2 border-white ring-1 ring-[#15803D]/20 animate-pulse"
          title="Guest Assistant Live"
        />
      )}
    </div>
  );
};
