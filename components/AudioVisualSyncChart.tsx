"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { AlertTriangle, CheckCircle, Activity, Info, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { AudioVisualSyncAnalysis } from "@/lib/types";

interface AudioVisualSyncChartProps {
  analysis: AudioVisualSyncAnalysis;
}

export default function AudioVisualSyncChart({ analysis }: AudioVisualSyncChartProps) {
  const isDesync = analysis.status === "DESYNCHRONIZED";

  const chartData = analysis.timeline.map((point) => ({
    time: `${point.timestamp_sec.toFixed(1)}s`,
    timestamp: point.timestamp_sec,
    "Acoustic Speech Energy": Math.round(point.audio_energy * 100),
    "Lip Motion Amplitude": Math.round(point.lip_motion_energy * 100),
    anomaly: point.anomaly,
  }));

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isAnomaly = payload[0]?.payload?.anomaly;
      return (
        <div className="p-3.5 rounded-sm bg-[#04060a]/95 border border-[#d4af37]/40 text-xs font-mono shadow-2xl backdrop-blur-md">
          <div className="text-[#f7e7c4] font-bold mb-1.5 border-b border-white/10 pb-1 flex items-center justify-between gap-4">
            <span className="tracking-wider">TIMESTAMP: {label}</span>
            {isAnomaly && (
              <span className="px-1.5 py-0.5 rounded-sm bg-[#320814] text-[#ff80a0] text-[9px] font-bold border border-[#ff0055]/60 uppercase">
                PHASE LAG
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-5 text-[#f7e7c4]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                Speech Energy:
              </span>
              <span className="font-bold">{payload[0].value}%</span>
            </div>
            <div className="flex items-center justify-between gap-5 text-[#80f0ff]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                Lip Motion:
              </span>
              <span className="font-bold">{payload[1].value}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="obsidian-card rounded-sm p-6 relative">
      <div className="corner-pin-tl" />
      <div className="corner-pin-tr" />
      <div className="corner-pin-bl" />
      <div className="corner-pin-br" />
      <div className="top-glow-gold" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Waves className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-lg font-bold text-white font-cinzel tracking-wider">
              CROSS-MODAL AUDIO-VISUAL SYNC TELEMETRY
            </h3>
          </div>
          <p className="text-xs text-[#a89f91] font-montserrat mt-1">
            SyncNet/Wav2Lip forensic verification tracking acoustic formant energy against labial viseme displacement
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold tracking-[0.2em] uppercase border flex items-center gap-2 shadow-lg ${
              isDesync
                ? "bg-[#2c0813] border-[#ff0055]/80 text-[#ff80a0] shadow-[0_0_15px_rgba(255,0,85,0.25)]"
                : "bg-[#052617] border-[#00ff88]/80 text-[#7affb8] shadow-[0_0_15px_rgba(0,255,136,0.25)]"
            }`}
          >
            {isDesync ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#ff0055]" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-[#00ff88]" />
            )}
            {analysis.status}
          </span>
        </div>
      </div>

      {/* Cross-Modal Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6 text-xs font-mono relative z-10">
        <div className="p-4 rounded-sm bg-[#04060a] border border-white/10">
          <div className="text-[10px] text-[#80776d] tracking-wider uppercase mb-1">
            TEMPORAL PHASE LAG
          </div>
          <div className={`text-xl font-bold font-cinzel ${isDesync ? "text-[#ff4d79]" : "text-[#00ff88]"}`}>
            {analysis.temporal_offset_ms > 0 ? `+${analysis.temporal_offset_ms}` : analysis.temporal_offset_ms} ms
          </div>
          <p className="text-[10px] text-[#a89f91] mt-1 font-montserrat">
            {isDesync ? "Severe acoustic lead over lip closure" : "Within physiological latency tolerance"}
          </p>
        </div>

        <div className="p-4 rounded-sm bg-[#04060a] border border-white/10">
          <div className="text-[10px] text-[#80776d] tracking-wider uppercase mb-1">
            PHONEME-VISEME DISCREPANCY
          </div>
          <div className={`text-xl font-bold font-cinzel ${isDesync ? "text-[#ffb800]" : "text-[#80f0ff]"}`}>
            {(analysis.phoneme_viseme_discrepancy * 100).toFixed(1)}%
          </div>
          <p className="text-[10px] text-[#a89f91] mt-1 font-montserrat">
            Mouth geometry vs. vocalized formant mismatch
          </p>
        </div>

        <div className="p-4 rounded-sm bg-[#04060a] border border-white/10">
          <div className="text-[10px] text-[#80776d] tracking-wider uppercase mb-1">
            CROSS-CORRELATION CONFIDENCE
          </div>
          <div className="text-xl font-bold text-[#f7e7c4] font-cinzel">
            {(analysis.sync_confidence * 100).toFixed(1)}%
          </div>
          <p className="text-[10px] text-[#a89f91] mt-1 font-montserrat">
            Confidence of multi-modal sync engine
          </p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-68 w-full bg-[#020305] rounded-sm p-3 border border-white/10 relative z-10 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldAudioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cyanLipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#131923" />
            <XAxis
              dataKey="time"
              stroke="#524d47"
              fontSize={11}
              tickLine={false}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis
              stroke="#524d47"
              fontSize={11}
              domain={[0, 100]}
              tickLine={false}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", paddingTop: "10px" }}
            />
            <Area
              type="monotone"
              dataKey="Acoustic Speech Energy"
              stroke="#d4af37"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#goldAudioGradient)"
            />
            <Area
              type="monotone"
              dataKey="Lip Motion Amplitude"
              stroke="#00f0ff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#cyanLipGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Forensic Audio-Visual Synopsis */}
      <div className="mt-5 p-4 rounded-sm bg-[#040609] border border-white/10 text-xs font-mono flex items-start gap-3">
        <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#f7e7c4] tracking-wider">FORENSIC OBSERVATION: </span>
          <span className="text-[#a89f91] font-montserrat leading-relaxed">{analysis.summary}</span>
        </div>
      </div>
    </div>
  );
}
