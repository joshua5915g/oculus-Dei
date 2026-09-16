"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, Cpu, Activity, Database, CheckCircle2, AlertTriangle } from "lucide-react";
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
    // Initial health check
    checkBackendHealth().then(setHealth);
    const interval = setInterval(() => {
      checkBackendHealth().then(setHealth);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-cyan-500/20 bg-[#070b12]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Logo and Core Identity */}
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <ShieldAlert className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-wider text-white flex items-center gap-1.5 font-mono">
                  OCULUS <span className="text-cyan-400">DEI</span>
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold">
                  Forensic v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Harvard-Grade Synthetic Media & Deepfake Detection Lab
              </p>
            </div>
          </div>

          {/* HUD Live Status Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Engine Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">ML BACKEND:</span>
              {health?.model_loaded ? (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> ONLINE ({health.device.toUpperCase()})
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertTriangle className="w-3 h-3 animate-spin" /> CONNECTING
                </span>
              )}
            </div>

            {/* Time Telemetry */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime || "INITIALIZING..."}</span>
            </div>

            {/* Sample Demos */}
            <div className="flex items-center gap-2">
              <button
                disabled={isAnalyzing}
                onClick={() => onLoadSample("deepfake_video")}
                className="px-2.5 py-1.5 text-xs font-mono rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 transition-all cursor-pointer disabled:opacity-50"
                title="Load sample synthetic clip"
              >
                + Sample Deepfake
              </button>
              <button
                disabled={isAnalyzing}
                onClick={() => onLoadSample("authentic_image")}
                className="px-2.5 py-1.5 text-xs font-mono rounded bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 transition-all cursor-pointer disabled:opacity-50"
                title="Load sample verified media"
              >
                + Sample Authentic
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
