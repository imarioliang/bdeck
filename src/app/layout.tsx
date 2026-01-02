import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";
import { CommandPalette } from "@/components/dashboard/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bdeck // COMMAND CENTER",
  description: "Retro-Terminal Dashboard for Power Users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a]`}>
        <ThemeWrapper>
          <CommandPalette>
            {children}
          </CommandPalette>
        </ThemeWrapper>
      </body>
    </html>
  );
}
