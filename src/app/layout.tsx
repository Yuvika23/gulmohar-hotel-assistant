import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Gulmohar — Boutique Hotel & Guest Assistant | Bengaluru, India",
  description:
    "Official digital guest assistant for The Gulmohar, a modern boutique hotel in Bengaluru, India. Inquire about rooms, all-day dining, swimming pool, fitness centre, policies, and check live stay availability.",
  keywords: [
    "The Gulmohar",
    "Boutique Hotel Bengaluru",
    "Bengaluru Boutique Hotel",
    "Digital Guest Assistant",
    "Lavelle Road Hotel",
  ],
  authors: [{ name: "The Gulmohar Bengaluru" }],
  icons: {
    icon: "/images/gulmohar-logo.svg",
    shortcut: "/images/gulmohar-logo.svg",
    apple: "/images/gulmohar-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#C4AD98] text-[#191919] selection:bg-[#FEE2E2] selection:text-[#991B1B]">
        {children}
      </body>
    </html>
  );
}
