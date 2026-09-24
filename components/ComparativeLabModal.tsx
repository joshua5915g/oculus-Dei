"use client";

import React, { useState } from "react";
import {
  Scale,
  X,
  UploadCloud,
  FileCheck,
  AlertOctagon,
  CheckCircle2,
  ArrowRightLeft,
  Sliders,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Zap,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ComparativeForensicResult } from "@/lib/types";

interface ComparativeLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComparativeLabModal({ isOpen, onClose }: ComparativeLabModalProps) {
  const [refFile, setRefFile] = useState<File | null>(null);
  const [suspectFile, setSuspectFile] = useState<File | null>(null);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [suspectPreview, setSuspectPreview] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [result, setResult] = useState<ComparativeForensicResult | null>(null);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<"side_by_side" | "curtain" | "delta_diff">("curtain");

  if (!isOpen) return null;

  const handleLoadDemoPair = (type: "deepfake_swap" | "authentic_match") => {
    // Generate reference specimen
    const refSvg = `
      <svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#080c14"/>
        <ellipse cx="320" cy="240" rx="130" ry="170" fill="#162032" stroke="#00ff88" stroke-width="2"/>
        <circle cx="270" cy="210" r="16" fill="#00ff88"/>
        <circle cx="370" cy="210" r="16" fill="#00ff88"/>
        <path d="M 280 310 Q 320 330 360 310" stroke="#00ff88" stroke-width="3" fill="none"/>
        <text x="30" y="50" fill="#00ff88" font-family="monospace" font-size="14" font-weight="bold">REF: AUTHENTIC_PERSONNEL_01.JPG</text>
        <text x="30" y="80" fill="#a89f91" font-family="monospace" font-size="11">ENCLAVE SECURE REGISTERED BIOMETRIC</text>
      </svg>
    `;

    // Generate suspect specimen
    const isSwap = type === "deepfake_swap";
    const suspectSvg = `
      <svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#080c14"/>
        <ellipse cx="320" cy="240" rx="130" ry="170" fill="#162032" stroke="${isSwap ? "#ff0055" : "#00ff88"}" stroke-width="2"/>
        <circle cx="${isSwap ? 264 : 270}" cy="${isSwap ? 204 : 210}" r="16" fill="${isSwap ? "#ff0055" : "#00ff88"}"/>
        <circle cx="${isSwap ? 376 : 370}" cy="${isSwap ? 204 : 210}" r="16" fill="${isSwap ? "#ff0055" : "#00ff88"}"/>
        <path d="M 280 ${isSwap ? 325 : 310} Q 320 ${isSwap ? 355 : 330} 360 ${isSwap ? 325 : 310}" stroke="${isSwap ? "#ff0055" : "#00ff88"}" stroke-width="3" fill="none"/>
        <text x="30" y="50" fill="${isSwap ? "#ff0055" : "#00ff88"}" font-family="monospace" font-size="14" font-weight="bold">${isSwap ? "SUSPECT: MANIPULATED_FEED.MP4" : "SUSPECT: LIVE_VERIFIED_CAPTURE.JPG"}</text>
        <text x="30" y="80" fill="#a89f91" font-family="monospace" font-size="11">${isSwap ? "INTERPOLATED FACIAL REPLACEMENT" : "CONFIRMED SAME-SUBJECT IDENTITY"}</text>
      </svg>
    `;

    // Generate delta heatmap SVG
    const deltaSvg = `
      <svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#030108"/>
        <!-- Difference glow -->
        ${
          isSwap
            ? `<ellipse cx="320" cy="240" rx="140" ry="180" fill="#ff0055" opacity="0.35"/>
               <circle cx="270" cy="210" r="35" fill="#ffb800" opacity="0.8"/>
               <circle cx="370" cy="210" r="35" fill="#ffb800" opacity="0.8"/>
               <ellipse cx="320" cy="320" rx="60" ry="30" fill="#ff0055" opacity="0.9"/>
               <text x="30" y="450" fill="#ff0055" font-family="monospace" font-size="14" font-weight="bold">DELTA PEAK: 42.6px FACIAL LANDMARK DISPLACEMENT</text>`
            : `<text x="30" y="450" fill="#00ff88" font-family="monospace" font-size="14">ZERO DELTA DISPARITY // BIOMETRIC GEOMETRY IDENTICAL</text>`
        }
      </svg>
    `;

    const refB64 = `data:image/svg+xml;base64,${btoa(refSvg)}`;
    const suspectB64 = `data:image/svg+xml;base64,${btoa(suspectSvg)}`;
    const deltaB64 = `data:image/svg+xml;base64,${btoa(deltaSvg)}`;

    setRefPreview(refB64);
    setSuspectPreview(suspectB64);

    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      setResult({
        reference_name: "AUTHENTIC_PERSONNEL_01.JPG",
        suspect_name: isSwap ? "SUSPECT_MANIPULATED_FEED.MP4" : "LIVE_VERIFIED_CAPTURE.JPG",
        structural_similarity_ssim: isSwap ? 0.38 : 0.96,
        cosine_feature_similarity: isSwap ? 0.42 : 0.98,
        landmark_displacement_px: isSwap ? 42.6 : 1.4,
        delta_heatmap_base64: deltaB64,
        verdict: isSwap ? "SYNTHETIC_REPLACEMENT" : "AUTHENTIC_MATCH",
        risk_score: isSwap ? 0.93 : 0.04,
        summary: isSwap
          ? "Critical biometric structural discrepancy detected. Suspect asset exhibits significant perioral and ocular displacement (42.6px) relative to reference biometric profile. Synthesized face-swap confirmed."
          : "Biometric feature vectors and facial landmark geometry match reference profile within 98% cosine similarity tolerances. Confirmed authentic identical subject.",
      });
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="obsidian-card rounded-sm border border-[#d4af37]/40 w-full max-w-5xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh] relative"
        >
          {/* Decorative pins */}
          <div className="corner-pin-tl" />
          <div className="corner-pin-tr" />
          <div className="corner-pin-bl" />
          <div className="corner-pin-br" />
          <div className="top-glow-gold" />

          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#04060a]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#1a140d] border border-[#d4af37]/40 flex items-center justify-center text-[#f7e7c4]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-cinzel tracking-wider flex items-center gap-2">
                  DUAL-EVIDENCE COMPARATIVE FORENSIC LAB
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                    DIFFERENTIAL SSIM & EMBEDDING
                  </span>
                </h3>
                <span className="text-[10px] font-mono tracking-widest text-[#a89f91] uppercase">
                  SIDE-BY-SIDE DIFFERENTIAL SUBTRACTION & BIOMETRIC DISTANCE MATRIX
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLoadDemoPair("deepfake_swap")}
                className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-[#ff0055]/20 text-[#ff80a0] border border-[#ff0055]/30 text-xs font-mono transition-colors"
              >
                LOAD DEMO: FACE-SWAP VS REAL
              </button>
              <button
                onClick={() => handleLoadDemoPair("authentic_match")}
                className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-[#00ff88]/20 text-[#80ffcc] border border-[#00ff88]/30 text-xs font-mono transition-colors"
              >
                LOAD DEMO: REAL MATCH
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-sm hover:bg-[#1a140d] text-[#a89f91] hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-[#e8dfd8] space-y-4">
            {/* If no specimens loaded yet */}
            {!refPreview && !suspectPreview && (
              <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-sm bg-[#04060a]/60 space-y-3">
                <Scale className="w-10 h-10 text-[#d4af37] mx-auto" />
                <h4 className="text-sm font-bold text-[#f7e7c4]">Select or Load Evidence Pairs</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Compare a confirmed authentic biometric reference portrait against a suspected manipulated video or image to calculate pixel-level delta heatmaps and structural deviation.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleLoadDemoPair("deepfake_swap")}
                    className="px-4 py-2 bg-[#d4af37] hover:bg-[#e0c058] text-black font-bold rounded-sm text-xs font-mono"
                  >
                    TEST DEEPFAKE COMPARISON
                  </button>
                </div>
              </div>
            )}

            {/* If specimens loaded */}
            {refPreview && suspectPreview && (
              <div className="space-y-4">
                {/* View Switcher Bar */}
                <div className="flex items-center justify-between p-2 rounded-sm bg-[#04060a] border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">VIEW MODE:</span>
                    <button
                      onClick={() => setViewMode("curtain")}
                      className={`px-3 py-1 rounded-sm ${
                        viewMode === "curtain" ? "bg-[#d4af37] text-black font-bold" : "bg-white/5 text-slate-400"
                      }`}
                    >
                      CURTAIN WIPE
                    </button>
                    <button
                      onClick={() => setViewMode("delta_diff")}
                      className={`px-3 py-1 rounded-sm ${
                        viewMode === "delta_diff" ? "bg-[#d4af37] text-black font-bold" : "bg-white/5 text-slate-400"
                      }`}
                    >
                      DELTA SUBTRACTION (|Δ|)
                    </button>
                    <button
                      onClick={() => setViewMode("side_by_side")}
                      className={`px-3 py-1 rounded-sm ${
                        viewMode === "side_by_side" ? "bg-[#d4af37] text-black font-bold" : "bg-white/5 text-slate-400"
                      }`}
                    >
                      SIDE-BY-SIDE
                    </button>
                  </div>

                  {result && (
                    <div
                      className={`px-3 py-1 rounded-sm border font-bold ${
                        result.verdict === "SYNTHETIC_REPLACEMENT"
                          ? "bg-[#ff0055]/20 text-[#ff80a0] border-[#ff0055]/50"
                          : "bg-[#00ff88]/20 text-[#80ffcc] border-[#00ff88]/50"
                      }`}
                    >
                      {result.verdict}
                    </div>
                  )}
                </div>

                {/* Visualizer Frame */}
                <div className="relative aspect-video rounded-sm overflow-hidden bg-[#04060a] border border-white/10 flex items-center justify-center">
                  {viewMode === "delta_diff" && result && (
                    <img
                      src={result.delta_heatmap_base64}
                      alt="Delta Difference Heatmap"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {viewMode === "curtain" && (
                    <div className="relative w-full h-full select-none overflow-hidden">
                      <img
                        src={refPreview}
                        alt="Reference"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPos}%` }}
                      >
                        <img
                          src={suspectPreview}
                          alt="Suspect"
                          className="absolute inset-0 w-full h-full object-contain max-w-none"
                          style={{ width: "100%", height: "100%" }}
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-black/80 border border-[#ff0055]/50 text-[10px] text-[#ff80a0] font-bold">
                          SUSPECT EVIDENCE
                        </div>
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-[#d4af37] cursor-ew-resize flex items-center justify-center shadow-[0_0_12px_#d4af37]"
                        style={{ left: `${sliderPos}%` }}
                      >
                        <div className="w-6 h-6 rounded-full bg-[#090d16] border-2 border-[#d4af37] flex items-center justify-center text-[9px] text-[#d4af37] shadow-lg">
                          ↔
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPos}
                        onChange={(e) => setSliderPos(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                      />
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-black/80 border border-[#00ff88]/50 text-[10px] text-[#80ffcc] font-bold">
                        AUTHENTIC REFERENCE
                      </div>
                    </div>
                  )}

                  {viewMode === "side_by_side" && (
                    <div className="grid grid-cols-2 w-full h-full gap-2 p-2">
                      <div className="relative border border-white/10 rounded overflow-hidden">
                        <img src={refPreview} alt="Reference" className="w-full h-full object-contain" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] text-[#00ff88]">
                          REFERENCE STANDARD
                        </span>
                      </div>
                      <div className="relative border border-white/10 rounded overflow-hidden">
                        <img src={suspectPreview} alt="Suspect" className="w-full h-full object-contain" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] text-[#ff0055]">
                          SUSPECT EVIDENCE
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comparative Metrics Grid */}
                {result && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-sm bg-[#04060a] border border-white/10">
                      <span className="text-slate-400 text-[10px] block">STRUCTURAL SIMILARITY (SSIM)</span>
                      <span className="text-2xl font-bold text-[#f7e7c4] mt-0.5 block">
                        {(result.structural_similarity_ssim * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {result.structural_similarity_ssim > 0.8 ? "High Geometric Match" : "Severe Distortion"}
                      </span>
                    </div>

                    <div className="p-3 rounded-sm bg-[#04060a] border border-white/10">
                      <span className="text-slate-400 text-[10px] block">FEATURE COSINE SIMILARITY</span>
                      <span className="text-2xl font-bold text-[#f7e7c4] mt-0.5 block">
                        {(result.cosine_feature_similarity * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {result.cosine_feature_similarity > 0.85 ? "Same Biometric Identity" : "Identity Divergence"}
                      </span>
                    </div>

                    <div className="p-3 rounded-sm bg-[#04060a] border border-white/10">
                      <span className="text-slate-400 text-[10px] block">FACIAL LANDMARK DISPLACEMENT</span>
                      <span
                        className={`text-2xl font-bold mt-0.5 block ${
                          result.landmark_displacement_px > 10 ? "text-[#ff0055]" : "text-[#00ff88]"
                        }`}
                      >
                        {result.landmark_displacement_px}px
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {result.landmark_displacement_px > 10 ? "Warping / Misalignment" : "Sub-pixel Alignment"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Forensic Summary */}
                {result && (
                  <div className="p-3 rounded-sm bg-[#04060a] border border-[#d4af37]/30 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <p className="text-slate-300 leading-relaxed text-xs">
                      <strong className="text-[#d4af37]">COMPARATIVE LAB VERDICT: </strong>
                      {result.summary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
