import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OCULUS DEI | Harvard-Grade Deepfake & Synthetic Media Detection Hub",
  description: "Next-generation multi-modal deepfake forensic analysis pipeline featuring PyTorch XAI Grad-CAM attention heatmaps and cross-modal audio-visual synchronization telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
