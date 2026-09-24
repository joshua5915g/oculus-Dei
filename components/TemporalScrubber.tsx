"use client";

import React, { useState, useEffect } from "react";
import {
  Film,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Eye,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TemporalAnalysisReport, TemporalFrameAnomaly } from "@/lib/types";

interface TemporalScrubberProps {
  temporal: TemporalAnalysisReport;
  filename: string;
}

export default function TemporalScrubber({ temporal, filename }: TemporalScrubberProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const frames = temporal.frames;
  const currentFrame = frames[selectedIdx] || frames[0];
  const isInstability = temporal.temporal_stability_index < 0.5;

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedIdx((prev) => (prev + 1) % frames.length);
      }, 400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, frames.length]);

  const handleJumpToPeak = () => {
    const peakIndex = frames.findIndex((f) => f.frame_index === temporal.peak_anomaly_frame);
    if (peakIndex !== -1) {
      setSelectedIdx(peakIndex);
    } else {
      // Find highest anomaly frame
      let maxScore = -1;
      let maxI = 0;
      frames.forEach((f, idx) => {
        if (f.anomaly_score > maxScore) {
          maxScore = f.anomaly_score;
          maxI = idx;
        }
      });
      setSelectedIdx(maxI);
    }
    setIsPlaying(false);
  };

  return (
    <div className="rounded-sm border border-[#d4af37]/20 bg-[#090d16]/90 p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/60" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-sm border ${
              isInstability
                ? "bg-[#320814] border-[#ff0055]/50 text-[#ff0055]"
                : "bg-[#062419] border-[#00ff88]/50 text-[#00ff88]"
            }`}
          >
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-sm font-semibold tracking-wider text-[#f7e7c4] uppercase">
                Multi-Frame Temporal Consistency Scrubber
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                INTER-FRAME OPTICAL FLOW
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Multi-track timeline indexing facial boundary jitter, warp flickering & localized synthesis spikes
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleJumpToPeak}
            className="px-3 py-1 rounded-sm bg-[#ff0055]/15 hover:bg-[#ff0055]/25 border border-[#ff0055]/50 text-[#ff80a0] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-[#ff0055]" />
            JUMP TO PEAK SPIKE
          </button>
          <div
            className={`px-3 py-1 rounded-sm border text-xs font-mono font-bold flex items-center gap-2 ${
              isInstability
                ? "bg-[#ff0055]/15 border-[#ff0055]/60 text-[#ff80a0]"
                : "bg-[#00ff88]/15 border-[#00ff88]/60 text-[#80ffcc]"
            }`}
          >
            {isInstability ? "TEMPORAL FLICKER DETECTED" : "TEMPORAL STABILITY NOMINAL"}
          </div>
        </div>
      </div>

      {/* Primary Telemetry Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 font-mono">
        <div className="p-3 rounded-sm bg-[#04060a] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">STABILITY INDEX</span>
          <span className="text-2xl font-bold text-[#f7e7c4] mt-0.5 block">
            {(temporal.temporal_stability_index * 100).toFixed(0)}%
          </span>
          <span className="text-[10px] text-slate-500">
            {temporal.temporal_stability_index > 0.6 ? "Coherent Transitions" : "Erratic Frame Jitter"}
          </span>
        </div>

        <div className="p-3 rounded-sm bg-[#04060a] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">JITTER VARIANCE</span>
          <span className="text-2xl font-bold text-[#f7e7c4] mt-0.5 block">
            {temporal.jitter_variance}px
          </span>
          <span className="text-[10px] text-slate-500">
            {temporal.jitter_variance < 2.0 ? "Sub-pixel Drift" : "Excessive Warping"}
          </span>
        </div>

        <div className="p-3 rounded-sm bg-[#04060a] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">ACTIVE KEYFRAME</span>
          <span className="text-2xl font-bold text-[#00f0ff] mt-0.5 block">
            #{currentFrame?.frame_index ?? 0}
          </span>
          <span className="text-[10px] text-slate-500">
            T+{currentFrame?.timestamp_sec.toFixed(2)}s / {(temporal.total_frames_analyzed / 30).toFixed(1)}s
          </span>
        </div>

        <div className="p-3 rounded-sm bg-[#04060a] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">FRAME ANOMALY SCORE</span>
          <span
            className={`text-2xl font-bold mt-0.5 block ${
              (currentFrame?.anomaly_score || 0) > 0.6 ? "text-[#ff0055]" : "text-[#00ff88]"
            }`}
          >
            {((currentFrame?.anomaly_score || 0) * 100).toFixed(0)}%
          </span>
          <span className="text-[10px] text-slate-500">
            {currentFrame?.is_spike ? "CRITICAL ANOMALY SPIKE" : "Within tolerances"}
          </span>
        </div>
      </div>

      {/* Main Interactive Track & Frame Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4">
        {/* Filmstrip & Timeline Scrubber (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Anomaly Bar Heatmap Track */}
          <div className="p-3.5 rounded-sm bg-[#04060a] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
                INTER-FRAME ANOMALY HEATMAP TRACK
              </span>
              <span>TOTAL FRAMES: {temporal.total_frames_analyzed}</span>
            </div>

            {/* Frame bars */}
            <div className="h-10 w-full flex items-end gap-1 p-1 bg-black/50 rounded-sm border border-white/5">
              {frames.map((f, idx) => {
                const isSelected = idx === selectedIdx;
                const score = f.anomaly_score;
                let bg = "bg-[#00ff88]";
                if (score > 0.75) bg = "bg-[#ff0055]";
                else if (score > 0.4) bg = "bg-[#ffb800]";

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`flex-1 rounded-[1px] transition-all relative group cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#00f0ff] ring-offset-1 ring-offset-black z-10"
                        : "opacity-80 hover:opacity-100"
                    } ${bg}`}
                    style={{ height: `${Math.max(20, score * 100)}%` }}
                  >
                    {f.is_spike && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scrubber slider */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedIdx((prev) => Math.max(0, prev - 1));
                    setIsPlaying(false);
                  }}
                  className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-sm bg-[#d4af37] hover:bg-[#e0c058] text-black font-bold"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setSelectedIdx((prev) => Math.min(frames.length - 1, prev + 1));
                    setIsPlaying(false);
                  }}
                  className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="range"
                min="0"
                max={frames.length - 1}
                value={selectedIdx}
                onChange={(e) => {
                  setSelectedIdx(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="flex-1 accent-[#d4af37] cursor-pointer"
              />

              <span className="text-xs font-mono text-[#d4af37] font-bold">
                {selectedIdx + 1} / {frames.length}
              </span>
            </div>
          </div>

          {/* Filmstrip Thumbnail Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {frames.map((f, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`shrink-0 w-24 rounded-sm overflow-hidden border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#00f0ff] scale-105 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    {f.thumbnail_base64 ? (
                      <img
                        src={f.thumbnail_base64}
                        alt={`Frame ${f.frame_index}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film className="w-4 h-4 text-slate-600" />
                    )}
                    {f.is_spike && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff0055]" />
                    )}
                  </div>
                  <div className="p-1 bg-[#04060a] text-[9px] font-mono text-center flex justify-between px-1 text-slate-400">
                    <span>#{f.frame_index}</span>
                    <span className={f.anomaly_score > 0.6 ? "text-[#ff0055] font-bold" : "text-[#00ff88]"}>
                      {(f.anomaly_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Frame Detail Telemetry Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3 font-mono">
          <div className="p-4 rounded-sm bg-[#04060a] border border-white/10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-xs text-[#f7e7c4] font-bold">FRAME #{currentFrame.frame_index} DIAGNOSTICS</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    currentFrame.is_spike
                      ? "bg-[#ff0055]/20 text-[#ff80a0] border border-[#ff0055]/40"
                      : "bg-[#00ff88]/20 text-[#80ffcc]"
                  }`}
                >
                  {currentFrame.is_spike ? "WARP ANOMALY SPIKE" : "NOMINAL"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Timestamp:</span>
                  <span>+{currentFrame.timestamp_sec.toFixed(2)}s</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Boundary Jitter:</span>
                  <span className={currentFrame.face_boundary_jitter > 5 ? "text-[#ff0055] font-bold" : "text-[#00ff88]"}>
                    {currentFrame.face_boundary_jitter}px
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Optical Discontinuity:</span>
                  <span className={currentFrame.optical_flow_discontinuity > 0.5 ? "text-[#ff0055] font-bold" : "text-[#00ff88]"}>
                    {(currentFrame.optical_flow_discontinuity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {currentFrame.flagged_artifact && (
                <div className="mt-3 p-2.5 rounded-sm bg-[#320814]/80 border border-[#ff0055]/40 text-xs text-[#ff80a0]">
                  <span className="font-bold block text-[10px] text-[#ff0055] uppercase">FLAGGED ARTIFACT:</span>
                  {currentFrame.flagged_artifact}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500">
              SPECIMEN: {filename} // FPS: {temporal.fps}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-3 rounded-sm bg-[#04060a]/90 border border-[#d4af37]/20 flex items-start gap-2.5 text-xs font-mono">
        <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-[#d4af37]">TEMPORAL COHERENCE AUDIT: </strong>
          {isInstability
            ? `Inter-frame jitter variance of ${temporal.jitter_variance}px and peak anomaly detected at frame #${temporal.peak_anomaly_frame}. High-frequency flickering indicates autoencoder face-swapping or Wav2Lip interpolation seams.`
            : `Continuous temporal flow with low jitter variance (${temporal.jitter_variance}px). Natural inter-frame head motion and expression continuity verified.`}
        </p>
      </div>
    </div>
  );
}
