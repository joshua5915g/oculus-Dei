"use client";

import React from "react";
import { ForensicBreakdown } from "@/lib/types";
import { ScanFace, Radio, Eye, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface ForensicMetricsGridProps {
  breakdown: ForensicBreakdown;
}

export default function ForensicMetricsGrid({ breakdown }: ForensicMetricsGridProps) {
  const metrics = [
    {
      title: "Facial Boundary Warping",
      value: Math.round(breakdown.facial_inconsistency_score * 100),
      icon: ScanFace,
      desc: "Perioral and mandibular spatial gradient warping indicating face-swap blending seam",
      risk: breakdown.facial_inconsistency_score > 0.7 ? "CRITICAL" : "LOW",
    },
    {
      title: "2D FFT Frequency Artifacts",
      value: Math.round(breakdown.frequency_spectrum_anomaly * 100),
      icon: Radio,
      desc: "Periodic grid spectral spikes produced by neural upsampling deconvolution operations",
      risk: breakdown.frequency_spectrum_anomaly > 0.7 ? "HIGH" : "LOW",
    },
    {
      title: "Corneal Specular Disparity",
      value: Math.round(breakdown.gaze_reflection_asymmetry * 100),
      icon: Eye,
      desc: "Mismatched ocular environmental light reflection angles between left and right pupils",
      risk: breakdown.gaze_reflection_asymmetry > 0.7 ? "HIGH" : "NOMINAL",
    },
    {
      title: "Compression Discontinuity",
      value: Math.round(breakdown.compression_fingerprint_mismatch * 100),
      icon: Layers,
      desc: "Quantization matrix discrepancies between foreground face patch and background frame",
      risk: breakdown.compression_fingerprint_mismatch > 0.6 ? "MODERATE" : "NOMINAL",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        const isHigh = item.value >= 70;
        return (
          <motion.div
            key={idx}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="obsidian-card rounded-sm p-5 border border-white/10 flex flex-col justify-between relative group"
          >
            <div className="corner-pin-tl" />
            <div className="corner-pin-br" />
            <div className="top-glow-gold opacity-40 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-sm bg-[#18140e] border border-[#d4af37]/35 flex items-center justify-center text-[#f7e7c4] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[9px] px-2.5 py-0.5 rounded-sm font-mono font-bold uppercase tracking-widest ${
                    isHigh
                      ? "bg-[#320a16] border border-[#ff0055]/80 text-[#ff80a0] shadow-[0_0_10px_rgba(255,0,85,0.3)]"
                      : "bg-[#061910] border border-[#00ff88]/50 text-[#7affb8]"
                  }`}
                >
                  {item.risk}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-cinzel tracking-wide mb-1.5">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#a89f91] font-montserrat leading-relaxed mb-4">
                {item.desc}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-[#80776d] text-[9px] tracking-wider uppercase">ANOMALY INDEX</span>
                <span className={`font-bold ${isHigh ? "text-[#ff4d79]" : "text-[#f7e7c4]"}`}>
                  {item.value}%
                </span>
              </div>
              <div className="w-full bg-[#04060a] rounded-sm h-1.5 overflow-hidden border border-white/10 p-[0.5px]">
                <div
                  className={`h-full rounded-sm ${
                    isHigh
                      ? "bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_0_8px_#ff0055]"
                      : "bg-gradient-to-r from-[#d4af37] to-[#00f0ff] shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                  }`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
