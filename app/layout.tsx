import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCULUS DEI — Defense-Grade Synthetic Media Forensic Intelligence",
  description:
    "Harvard-grade multi-modal deepfake forensic workstation featuring PyTorch XAI Grad-CAM spatial activation maps and cross-modal phoneme-viseme desynchronization telemetry.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Montserrat:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#020305] text-[#e8dfd8] flex flex-col font-sans selection:bg-[#d4af37] selection:text-black antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
