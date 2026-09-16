"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Cpu, Clock, Sparkles, Terminal, Activity } from "lucide-react";
import { checkBackendHealth } from "@/lib/api";
import { HealthResponse } from "@/lib/types";

interface HeaderProps {
  onLoadSample: (sampleType: "deepfake_video" | "authentic_image") => void;
  isAnalyzing: boolean;
}

export default function Header({ onLoadSample, isAnalyzing }: HeaderProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    checkBackendHealth().then(setHealth);
    const interval = setInterval(() => {
      checkBackendHealth().then(setHealth);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().replace("T", " ").substring(0, 19) + " UTC"
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d4af37]/20 bg-[#030508]/85 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
      {/* Top micro gold highlight line */}
      <div className="top-glow-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-4">
          
          {/* Brand Identity & Eyebrow Badge */}
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="relative w-10 h-10 rounded-sm bg-gradient-to-br from-[#d4af37] via-[#f7e7c4] to-[#8c6d4f] p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_28px_rgba(212,175,55,0.6)] transition-all duration-300">
              <div className="w-full h-full bg-[#07090e] rounded-[1px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#f7e7c4] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-white font-cinzel">
                  OCULUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7c4] via-[#d4af37] to-[#c99e5d]">DEI</span>
                </h1>
                <span className="hidden sm:inline-flex text-[9px] font-mono tracking-[0.2em] px-2 py-0.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f7e7c4] uppercase font-medium">
                  FORENSIC LAB
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#a89f91] uppercase">
                <span>Defense-Grade Synthetic Media Intelligence</span>
                <span className="text-[#d4af37]/60">•</span>
                <span className="text-emerald-400/90 font-mono">MIL-STD 461F</span>
              </div>
            </div>
          </div>

          {/* HUD Live Status Badges & Quick Specimens */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* Classification Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#120a07] border border-[#d4af37]/30 text-[10px] font-mono tracking-wider text-[#f7e7c4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
              <span>CLASSIFIED // SCI-RESTRICTED</span>
            </div>

            {/* ML Backend Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#090d14]/90 border border-[#d4af37]/25 shadow-inner">
              <Cpu className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono text-[#a89f91] tracking-wider">NEURAL ENGINE:</span>
              {health?.model_loaded ? (
                <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[#00ff88]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
                  ONLINE ({health.device.toUpperCase()})
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[#ffb800]">
                  <Activity className="w-3 h-3 animate-spin text-[#ffb800]" />
                  STANDBY
                </span>
              )}
            </div>

            {/* Time Telemetry */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#090d14]/90 border border-white/10 text-[#a89f91] text-[11px] font-mono tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{currentTime || "INITIALIZING..."}</span>
            </div>

            {/* Sample Specimens */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => onLoadSample("deepfake_video")}
                className="relative px-3 py-1.5 text-[11px] font-mono tracking-wider rounded-sm bg-[#22070f]/80 hover:bg-[#340b17] border border-[#ff0055]/40 hover:border-[#ff0055]/80 text-[#ff80a0] transition-all duration-200 cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,0,85,0.15)] group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] group-hover:scale-125 transition-transform shadow-[0_0_6px_#ff0055]" />
                <span>+ Test Deepfake</span>
              </button>
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => onLoadSample("authentic_image")}
                className="relative px-3 py-1.5 text-[11px] font-mono tracking-wider rounded-sm bg-[#051f14]/80 hover:bg-[#0a2f1f] border border-[#00ff88]/40 hover:border-[#00ff88]/80 text-[#80ffc0] transition-all duration-200 cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,136,0.15)] group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] group-hover:scale-125 transition-transform shadow-[0_0_6px_#00ff88]" />
                <span>+ Test Authentic</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
