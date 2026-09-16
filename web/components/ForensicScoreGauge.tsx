"use client";

import React from "react";
import { ShieldAlert, CheckCircle, AlertOctagon, Clock, HardDrive, FileText, Hash, Award } from "lucide-react";
import { motion } from "framer-motion";
import { DetectionResponse } from "@/lib/types";

interface ForensicScoreGaugeProps {
  data: DetectionResponse;
}

export default function ForensicScoreGauge({ data }: ForensicScoreGaugeProps) {
  const isSynthetic = data.verdict === "SYNTHETIC";
  const fakePercent = Math.round(data.fake_probability * 1000) / 10;
  const realPercent = Math.round(data.real_probability * 1000) / 10;

  // Arc calculation for radial gauge
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.fake_probability * circumference);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-sm p-6 relative obsidian-card ${
        isSynthetic
          ? "border-[#ff0055]/40 shadow-[0_20px_50px_rgba(255,0,85,0.12)]"
          : "border-[#00ff88]/40 shadow-[0_20px_50px_rgba(0,255,136,0.12)]"
      }`}
    >
      <div className="corner-pin-tl" />
      <div className="corner-pin-tr" />
      <div className="corner-pin-bl" />
      <div className="corner-pin-br" />
      {isSynthetic ? <div className="top-glow-danger" /> : <div className="top-glow-success" />}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Radial Score Gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-7 text-center sm:text-left">
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Outer faint HUD ring */}
              <circle
                cx="80"
                cy="80"
                r={radius + 8}
                className="stroke-white/5"
                strokeWidth="1"
                fill="transparent"
                strokeDasharray="4 4"
              />
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#090e17]"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Progress Stroke */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={isSynthetic ? "#ff0055" : "#00ff88"}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  filter: isSynthetic
                    ? "drop-shadow(0 0 12px rgba(255, 0, 85, 0.8))"
                    : "drop-shadow(0 0 12px rgba(0, 255, 136, 0.8))",
                }}
              />
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className={`text-3xl font-black font-cinzel leading-none ${
                  isSynthetic ? "text-[#ff4d79]" : "text-[#00ff88]"
                }`}
              >
                {fakePercent}%
              </span>
              <span className="text-[9px] text-[#a89f91] uppercase tracking-[0.25em] font-mono mt-1">
                {isSynthetic ? "SYNTHESIS" : "AUTHENTIC"}
              </span>
            </div>
          </div>

          {/* Verdict Classification */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2.5">
              <span
                className={`px-3 py-1 rounded-sm text-[11px] font-mono font-bold tracking-[0.2em] uppercase border flex items-center gap-2 shadow-lg ${
                  isSynthetic
                    ? "bg-[#2b0813] border-[#ff0055]/80 text-[#ff80a0] shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                    : "bg-[#052617] border-[#00ff88]/80 text-[#7affb8] shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                }`}
              >
                {isSynthetic ? (
                  <AlertOctagon className="w-3.5 h-3.5 text-[#ff0055]" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-[#00ff88]" />
                )}
                {data.verdict} • {data.risk_level} THREAT
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-cinzel tracking-wide">
              {data.prediction_label}
            </h2>

            <p className="text-xs sm:text-sm text-[#a89f91] font-montserrat mt-2 max-w-lg leading-relaxed">
              {isSynthetic
                ? `Multimodal deepfake neural classifiers identified artificial generative synthesis patterns with ${(
                    data.fake_probability * 100
                  ).toFixed(1)}% statistical confidence.`
                : `Media integrity verification confirmed natural biological micro-movements, coherent photon reflection vectors, and natural frame rates.`}
            </p>
          </div>
        </div>

        {/* Forensic Metadata Telemetry Pills */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono w-full lg:w-auto">
          <div className="p-3 rounded-sm bg-[#04060a] border border-white/10 flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
            <div>
              <div className="text-[9px] text-[#80776d] tracking-wider uppercase">LATENCY</div>
              <div className="text-[#f7e7c4] font-bold">{data.processing_time_ms} ms</div>
            </div>
          </div>

          <div className="p-3 rounded-sm bg-[#04060a] border border-white/10 flex items-center gap-3">
            <HardDrive className="w-4 h-4 text-[#d4af37] shrink-0" />
            <div>
              <div className="text-[9px] text-[#80776d] tracking-wider uppercase">BUFFER SIZE</div>
              <div className="text-[#f7e7c4] font-bold">
                {(data.file_size_bytes / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          </div>

          <div className="p-3 rounded-sm bg-[#04060a] border border-white/10 flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#00f0ff] shrink-0" />
            <div>
              <div className="text-[9px] text-[#80776d] tracking-wider uppercase">DIMENSIONS</div>
              <div className="text-white font-bold">
                {data.dimensions.width}x{data.dimensions.height}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-sm bg-[#04060a] border border-white/10 flex items-center gap-3">
            <Hash className="w-4 h-4 text-[#00f0ff] shrink-0" />
            <div>
              <div className="text-[9px] text-[#80776d] tracking-wider uppercase">AUDIT HASH</div>
              <div className="text-[#a89f91] font-mono text-[10px] truncate w-24">
                {data.job_id.substring(0, 10)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
