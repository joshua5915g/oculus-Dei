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
import { Mic, Video, AlertTriangle, CheckCircle, Activity, Info } from "lucide-react";
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
        <div className="p-3 rounded-lg bg-black/95 border border-cyan-500/40 text-xs font-mono shadow-2xl backdrop-blur-md">
          <div className="text-cyan-400 font-bold mb-1 border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
            <span>TIMESTAMP: {label}</span>
            {isAnomaly && (
              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold border border-red-500/50">
                PHASE ANOMALY
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-cyan-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Speech Energy:
              </span>
              <span className="font-bold">{payload[0].value}%</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-pink-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
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
    <div className="rounded-xl cyber-panel p-5 border border-cyan-500/30">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white font-mono tracking-wide">
              CROSS-MODAL AUDIO-VISUAL SYNC ANALYSIS
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Temporal alignment of acoustic phonemes vs facial visemes (SyncNet / Wav2Lip forensic verification)
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-2 ${
              isDesync
                ? "bg-red-950/80 border-red-500/80 text-red-300 shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                : "bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
            }`}
          >
            {isDesync ? (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            {analysis.status}
          </span>
        </div>
      </div>

      {/* Cross-Modal Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-xs font-mono">
        <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">TEMPORAL PHASE LAG</div>
          <div className={`text-base font-bold ${isDesync ? "text-red-400" : "text-emerald-400"}`}>
            {analysis.temporal_offset_ms > 0 ? `+${analysis.temporal_offset_ms}` : analysis.temporal_offset_ms} ms
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {isDesync ? "Severe acoustic lead over lip closure" : "Within physiological latency tolerance"}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">PHONEME-VISEME DISCREPANCY</div>
          <div className={`text-base font-bold ${isDesync ? "text-amber-400" : "text-cyan-300"}`}>
            {(analysis.phoneme_viseme_discrepancy * 100).toFixed(1)}%
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Mouth shape vs. vocalized formant mismatch
          </p>
        </div>

        <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">CROSS-CORRELATION CONFIDENCE</div>
          <div className="text-base font-bold text-cyan-400">
            {(analysis.sync_confidence * 100).toFixed(1)}%
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Confidence of multi-modal sync engine
          </p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full bg-black/40 rounded-lg p-2 border border-slate-800/80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="audioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="lipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              fontFamily="monospace"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={[0, 100]}
              tickLine={false}
              fontFamily="monospace"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "8px" }}
            />
            <Area
              type="monotone"
              dataKey="Acoustic Speech Energy"
              stroke="#00f0ff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#audioGradient)"
            />
            <Area
              type="monotone"
              dataKey="Lip Motion Amplitude"
              stroke="#ec4899"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#lipGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Forensic Audio-Visual Synopsis */}
      <div className="mt-4 p-3 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">FORENSIC OBSERVATION: </span>
          <span className="text-slate-300 leading-relaxed">{analysis.summary}</span>
        </div>
      </div>
    </div>
  );
}
