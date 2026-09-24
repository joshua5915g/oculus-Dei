"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Heart, Activity, ShieldAlert, CheckCircle2, Zap, Info, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { RPPGAnalysis } from "@/lib/types";

interface RPPGVisualizerProps {
  rppg: RPPGAnalysis;
}

export default function RPPGVisualizer({ rppg }: RPPGVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const isPulseAbsent = rppg.status === "BIOLOGICAL_PULSE_ABSENT" || rppg.status === "CHAOTIC_SIGNAL";

  const chartData = rppg.bvp_waveform.map((point) => ({
    time: `${point.time_sec.toFixed(2)}s`,
    timestamp: point.time_sec,
    "BVP Amplitude": Math.round(point.bvp_amplitude * 100),
    "Noise Residual": Math.round(point.synthetic_noise * 100),
    peak: point.systolic_peak,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPeak = payload[0]?.payload?.peak;
      return (
        <div className="p-3 rounded-sm bg-[#04060a]/95 border border-[#d4af37]/40 text-xs font-mono shadow-2xl backdrop-blur-md">
          <div className="text-[#f7e7c4] font-bold mb-1.5 border-b border-white/10 pb-1 flex items-center justify-between gap-4">
            <span className="tracking-wider">TIME: {label}</span>
            {isPeak && (
              <span className="px-1.5 py-0.5 rounded-sm bg-[#320814] text-[#ff80a0] text-[9px] font-bold border border-[#ff0055]/60 uppercase">
                SYSTOLIC PEAK
              </span>
            )}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4 text-[#00ff88]">
              <span>BVP Waveform:</span>
              <span className="font-bold">{payload[0].value}%</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[#ff0055]">
              <span>Noise Residual:</span>
              <span className="font-bold">{payload[1].value}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-sm border border-[#d4af37]/20 bg-[#090d16]/90 p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/60" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-sm border ${
              isPulseAbsent
                ? "bg-[#320814] border-[#ff0055]/50 text-[#ff0055]"
                : "bg-[#062419] border-[#00ff88]/50 text-[#00ff88]"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                !isPulseAbsent ? "animate-pulse" : ""
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-sm font-semibold tracking-wider text-[#f7e7c4] uppercase">
                rPPG Biological Cardiac Pulse & BVP Telemetry
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                HEMOGLOBIN ABSORPTION (rPPG)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Remote photoplethysmography analyzing micro-vascular blood volume pulse across facial epidermal tissue
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#f7e7c4] flex items-center gap-1.5 transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isPlaying ? "FREEZE" : "PLAY"}
          </button>
          <div
            className={`px-3 py-1 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 ${
              isPulseAbsent
                ? "bg-[#ff0055]/15 border-[#ff0055]/60 text-[#ff80a0]"
                : "bg-[#00ff88]/15 border-[#00ff88]/60 text-[#80ffcc]"
            }`}
          >
            {isPulseAbsent ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff0055]" />
                BIOLOGICAL PULSE ABSENT
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
                PHYSIOLOGICAL PULSE VERIFIED
              </>
            )}
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {/* Heart Rate BPM */}
        <div className="p-3 rounded-sm bg-[#04060a]/80 border border-white/5 relative overflow-hidden">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>HEART RATE</span>
            <Heart className="w-3 h-3 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#f7e7c4] mt-1">
            {rppg.heart_rate_bpm > 0 ? `${rppg.heart_rate_bpm}` : "--"}
            <span className="text-xs font-normal text-slate-400 ml-1">BPM</span>
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">
            {rppg.heart_rate_bpm > 0 ? "Normal Resting Rhythm" : "Zero Spectral Periodicity"}
          </div>
        </div>

        {/* Pulse Consistency Index (PCI) */}
        <div className="p-3 rounded-sm bg-[#04060a]/80 border border-white/5 relative overflow-hidden">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>PULSE CONSISTENCY (PCI)</span>
            <Activity className="w-3 h-3 text-[#00f0ff]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#f7e7c4] mt-1">
            {(rppg.pulse_consistency_index * 100).toFixed(0)}%
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${
                rppg.pulse_consistency_index > 0.6 ? "bg-[#00ff88]" : "bg-[#ff0055]"
              }`}
              style={{ width: `${rppg.pulse_consistency_index * 100}%` }}
            />
          </div>
        </div>

        {/* Biological Liveliness Score */}
        <div className="p-3 rounded-sm bg-[#04060a]/80 border border-white/5 relative overflow-hidden">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>BIOLOGICAL LIVELINESS</span>
            <Zap className="w-3 h-3 text-[#ffb800]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#f7e7c4] mt-1">
            {(rppg.biological_liveliness_score * 100).toFixed(0)}%
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${
                rppg.biological_liveliness_score > 0.6 ? "bg-[#00ff88]" : "bg-[#ff0055]"
              }`}
              style={{ width: `${rppg.biological_liveliness_score * 100}%` }}
            />
          </div>
        </div>

        {/* SNR Ratio */}
        <div className="p-3 rounded-sm bg-[#04060a]/80 border border-white/5 relative overflow-hidden">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>BVP SIGNAL-TO-NOISE</span>
            <span className="text-[9px] text-slate-400">SNR</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[#f7e7c4] mt-1">
            {rppg.snr_db > 0 ? `+${rppg.snr_db}` : `${rppg.snr_db}`}
            <span className="text-xs font-normal text-slate-400 ml-1">dB</span>
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">
            {rppg.snr_db > 10 ? "Clean Vascular Waveform" : "High Synthetic Noise"}
          </div>
        </div>
      </div>

      {/* Oscilloscope Waveform Canvas / Chart */}
      <div className="p-4 rounded-sm bg-[#04060a] border border-white/10 relative">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">BVP CARDIAC OSCILLOSCOPE TRACE:</span>
            <span className="flex items-center gap-1.5 text-[#00ff88]">
              <span className="w-2.5 h-1 bg-[#00ff88] rounded-full inline-block" />
              Blood Volume Pulse
            </span>
            <span className="flex items-center gap-1.5 text-[#ff0055]">
              <span className="w-2.5 h-1 bg-[#ff0055] rounded-full inline-block" />
              Noise Floor
            </span>
          </div>
          <span className="text-slate-500">WINDOW: 4.0s @ 30 FPS</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" />
              <XAxis
                dataKey="time"
                stroke="#666"
                tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#666"
                tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={50} stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
              <Line
                type="monotone"
                dataKey="BVP Amplitude"
                stroke={isPulseAbsent ? "#ff0055" : "#00ff88"}
                strokeWidth={2}
                dot={false}
                isAnimationActive={isPlaying}
              />
              <Line
                type="monotone"
                dataKey="Noise Residual"
                stroke="rgba(255, 0, 85, 0.4)"
                strokeWidth={1}
                dot={false}
                strokeDasharray="2 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spatial Facial Perfusion Matrix */}
      <div className="mt-4">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>SPATIAL EPIDERMAL PERFUSION ROIs</span>
          <span className="text-[10px] text-slate-500">4-REGION VASCULAR COHERENCE</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {rppg.spatial_perfusion.map((region, idx) => {
            const isNominal = region.status === "NOMINAL";
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-sm border font-mono text-xs ${
                  isNominal
                    ? "bg-[#062419]/50 border-[#00ff88]/30"
                    : "bg-[#320814]/50 border-[#ff0055]/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#f7e7c4] font-semibold text-[11px] truncate">
                    {region.name}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded ${
                      isNominal ? "text-[#00ff88]" : "text-[#ff0055]"
                    }`}
                  >
                    {region.status}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1 text-[11px]">
                  <span className="text-slate-400">Coherence:</span>
                  <span className={isNominal ? "text-[#00ff88] font-bold" : "text-[#ff0055] font-bold"}>
                    {(region.perfusion_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-[10px] text-slate-400">
                  <span>SNR:</span>
                  <span>{region.snr_db > 0 ? `+${region.snr_db}dB` : `${region.snr_db}dB`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="mt-4 p-3 rounded-sm bg-[#04060a]/90 border border-[#d4af37]/20 flex items-start gap-2.5 text-xs font-mono">
        <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-[#d4af37]">FORENSIC BIOMETRIC SYNTHESIS: </strong>
          {rppg.summary}
        </p>
      </div>
    </div>
  );
}
