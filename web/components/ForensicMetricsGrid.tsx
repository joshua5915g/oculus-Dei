"use client";

import React from "react";
import { ForensicBreakdown } from "@/lib/types";
import { ScanFace, Radio, Eye, Layers } from "lucide-react";

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
          <div
            key={idx}
            className="rounded-xl cyber-panel p-4 border border-slate-800 flex flex-col justify-between font-mono"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    isHigh
                      ? "bg-red-950 border border-red-500/60 text-red-300"
                      : "bg-slate-900 border border-slate-700 text-slate-400"
                  }`}
                >
                  {item.risk}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-200 mb-1">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{item.desc}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 text-[10px]">ANOMALY INDEX</span>
                <span className={`font-bold ${isHigh ? "text-red-400" : "text-cyan-300"}`}>
                  {item.value}%
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full ${
                    isHigh
                      ? "bg-gradient-to-r from-amber-500 to-red-500"
                      : "bg-gradient-to-r from-cyan-500 to-emerald-400"
                  }`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
