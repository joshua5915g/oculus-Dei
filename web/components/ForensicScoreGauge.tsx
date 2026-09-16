"use client";

import React from "react";
import { ShieldAlert, CheckCircle, AlertOctagon, Clock, HardDrive, FileText, Hash } from "lucide-react";
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
    <div
      className={`rounded-xl p-5 border transition-all ${
        isSynthetic ? "cyber-panel-danger" : "cyber-panel-success"
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Radial Score Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress Stroke */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={isSynthetic ? "#ff0055" : "#00ff88"}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: "stroke-dashoffset 1s ease-in-out",
                  filter: isSynthetic
                    ? "drop-shadow(0 0 8px rgba(255, 0, 85, 0.7))"
                    : "drop-shadow(0 0 8px rgba(0, 255, 136, 0.7))",
                }}
              />
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
              <span
                className={`text-2xl font-black ${
                  isSynthetic ? "text-red-400 glow-text-danger" : "text-emerald-400 glow-text-success"
                }`}
              >
                {fakePercent}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {isSynthetic ? "Synthetic" : "Authentic"}
              </span>
            </div>
          </div>

          {/* Verdict Classification */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`px-3 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 shadow ${
                  isSynthetic
                    ? "bg-red-950/80 border-red-500/80 text-red-300"
                    : "bg-emerald-950/80 border-emerald-500/80 text-emerald-300"
                }`}
              >
                {isSynthetic ? (
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {data.verdict} • {data.risk_level} RISK
              </span>
            </div>

            <h2 className="text-xl font-bold text-white font-mono tracking-tight">
              {data.prediction_label}
            </h2>

            <p className="text-xs text-slate-400 font-mono mt-1 max-w-md">
              {isSynthetic
                ? `Multimodal deepfake neural classifiers identified artificial synthesis artifacts with ${(
                    data.fake_probability * 100
                  ).toFixed(1)}% statistical certainty.`
                : `Media integrity verification confirmed natural biological micro-movements and coherent photon reflection.`}
            </p>
          </div>
        </div>

        {/* Forensic Metadata Pills */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono w-full md:w-auto">
          <div className="p-2.5 rounded bg-black/50 border border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500">INFERENCE LATENCY</div>
              <div className="text-slate-200 font-bold">{data.processing_time_ms} ms</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-black/50 border border-slate-800 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500">PAYLOAD SIZE</div>
              <div className="text-slate-200 font-bold">
                {(data.file_size_bytes / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-black/50 border border-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500">STREAM RES</div>
              <div className="text-slate-200 font-bold">
                {data.dimensions.width}x{data.dimensions.height}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-black/50 border border-slate-800 flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500">JOB AUDIT HASH</div>
              <div className="text-slate-200 font-mono text-[10px] truncate w-24">
                {data.job_id.substring(0, 10)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
