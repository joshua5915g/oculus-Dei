"use client";

import React, { useState } from "react";
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  ZoomIn,
  Sparkles,
  Info,
  FileCheck,
  FileWarning,
  Eye,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";
import { ELAForensicOutput, Dimensions } from "@/lib/types";

interface ELAInspectorProps {
  ela: ELAForensicOutput;
  originalFrame: string;
  dimensions?: Dimensions;
}

export default function ELAInspector({
  ela,
  originalFrame,
  dimensions = { width: 1280, height: 720 },
}: ELAInspectorProps) {
  const [multiplier, setMultiplier] = useState<number>(25);
  const [viewMode, setViewMode] = useState<"ela_only" | "original" | "split">("ela_only");
  const [sliderPos, setSliderPos] = useState<number>(50);

  const isAnomalous = ela.compression_discrepancy_score > 0.5;
  const c2pa = ela.c2pa_manifest;

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
              isAnomalous
                ? "bg-[#320814] border-[#ff0055]/50 text-[#ff0055]"
                : "bg-[#062419] border-[#00ff88]/50 text-[#00ff88]"
            }`}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-sm font-semibold tracking-wider text-[#f7e7c4] uppercase">
                Error Level Analysis (ELA) & C2PA Provenance
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                JPEG QUANTIZATION RESIDUAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Differential compression rate matrix highlighting spliced boundary seams, neural inpainting & C2PA credentials
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-sm bg-[#04060a] border border-white/10 text-xs font-mono">
          <button
            onClick={() => setViewMode("ela_only")}
            className={`px-3 py-1 rounded-sm transition-colors ${
              viewMode === "ela_only"
                ? "bg-[#d4af37] text-black font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ELA MAP
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1 rounded-sm transition-colors ${
              viewMode === "split"
                ? "bg-[#d4af37] text-black font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SPLIT CURTAIN
          </button>
          <button
            onClick={() => setViewMode("original")}
            className={`px-3 py-1 rounded-sm transition-colors ${
              viewMode === "original"
                ? "bg-[#d4af37] text-black font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RAW FRAME
          </button>
        </div>
      </div>

      {/* Main Grid: Visualizer + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4">
        {/* Canvas / ELA Display (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="relative aspect-video rounded-sm overflow-hidden bg-[#04060a] border border-white/10 flex items-center justify-center">
            {/* ELA Image */}
            {viewMode === "ela_only" && (
              <img
                src={ela.ela_image_base64}
                alt="Error Level Analysis"
                className="w-full h-full object-contain filter"
                style={{ filter: `brightness(${multiplier / 25})` }}
              />
            )}

            {/* Raw Original Image */}
            {viewMode === "original" && (
              <img
                src={originalFrame}
                alt="Raw Specimen Frame"
                className="w-full h-full object-contain"
              />
            )}

            {/* Split Comparison Slider */}
            {viewMode === "split" && (
              <div className="relative w-full h-full select-none overflow-hidden">
                <img
                  src={originalFrame}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={ela.ela_image_base64}
                    alt="ELA Diff"
                    className="absolute inset-0 w-full h-full object-contain max-w-none"
                    style={{
                      width: "100%",
                      height: "100%",
                      filter: `brightness(${multiplier / 25})`,
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-black/80 border border-[#d4af37]/40 text-[10px] font-mono text-[#d4af37] font-bold">
                    ELA RESIDUAL (25X)
                  </div>
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#d4af37] cursor-ew-resize flex items-center justify-center shadow-[0_0_12px_#d4af37]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-[#090d16] border-2 border-[#d4af37] flex items-center justify-center text-[9px] font-mono text-[#d4af37] shadow-lg">
                    ↔
                  </div>
                </div>
                {/* Invisible slider drag range */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-black/80 border border-white/20 text-[10px] font-mono text-white/80">
                  RAW SPECIMEN
                </div>
              </div>
            )}

            {/* Multiplier Tag */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-sm bg-black/80 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md">
              COMPRESSION RESIDUAL // MULTIPLIER: <span className="text-[#d4af37] font-bold">{multiplier}X</span>
            </div>
          </div>

          {/* Multiplier Slider Controls */}
          <div className="flex items-center justify-between p-2.5 rounded-sm bg-[#04060a] border border-white/5 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
              ERROR SCALE MULTIPLIER:
            </span>
            <div className="flex items-center gap-2">
              {[10, 25, 40, 60].map((val) => (
                <button
                  key={val}
                  onClick={() => setMultiplier(val)}
                  className={`px-2.5 py-0.5 rounded-sm text-[11px] transition-colors ${
                    multiplier === val
                      ? "bg-[#d4af37] text-black font-bold"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {val}X
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry & C2PA Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* ELA Discrepancy Score */}
          <div className="p-3.5 rounded-sm bg-[#04060a] border border-white/10">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>COMPRESSION DISCREPANCY</span>
              <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
            </div>
            <div className="text-2xl font-mono font-bold text-[#f7e7c4] mt-1">
              {(ela.compression_discrepancy_score * 100).toFixed(0)}%
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  isAnomalous ? "bg-[#ff0055]" : "bg-[#00ff88]"
                }`}
                style={{ width: `${ela.compression_discrepancy_score * 100}%` }}
              />
            </div>
            <div className="text-[10px] font-mono mt-2 text-slate-400">
              {isAnomalous
                ? "Discontinuous JPEG error rate across facial seam"
                : "Continuous natural compression envelope"}
            </div>
          </div>

          {/* Grid Blockiness & PRNU Noise */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-sm bg-[#04060a] border border-white/5 font-mono text-xs">
              <span className="text-[10px] text-slate-400 block">8x8 BLOCKINESS</span>
              <span className="text-lg font-bold text-[#f7e7c4] mt-0.5 block">
                {(ela.grid_blockiness_index * 100).toFixed(0)}%
              </span>
              <span className="text-[9px] text-slate-500">
                {ela.grid_blockiness_index > 0.5 ? "Disrupted" : "Uniform"}
              </span>
            </div>
            <div className="p-3 rounded-sm bg-[#04060a] border border-white/5 font-mono text-xs">
              <span className="text-[10px] text-slate-400 block">SENSOR PRNU SNR</span>
              <span className="text-lg font-bold text-[#f7e7c4] mt-0.5 block">
                {ela.prnu_sensor_snr}dB
              </span>
              <span className="text-[9px] text-slate-500">
                {ela.prnu_sensor_snr > 15 ? "Authentic Sensor" : "Synthetic Latent"}
              </span>
            </div>
          </div>

          {/* C2PA Provenance & Cryptographic Signature Box */}
          <div className="p-3.5 rounded-sm bg-[#04060a] border border-white/10 flex-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-2 mb-2.5">
              <span className="flex items-center gap-1.5 text-[#f7e7c4]">
                <FileCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                C2PA PROVENANCE MANIFEST
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  c2pa.tamper_evident_status === "VERIFIED_AUTHENTIC"
                    ? "bg-[#00ff88]/20 text-[#00ff88]"
                    : c2pa.tamper_evident_status === "AI_GENERATED_DISCLOSED"
                    ? "bg-[#ffb800]/20 text-[#ffb800]"
                    : "bg-[#ff0055]/20 text-[#ff80a0]"
                }`}
              >
                {c2pa.tamper_evident_status}
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Signer Authority:</span>
                <span className="text-right truncate max-w-[140px]">{c2pa.signer || "None (Unsigned)"}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Claim Generator:</span>
                <span className="text-right truncate max-w-[140px]">{c2pa.claim_generator || "Standard Camera"}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Generator Tag:</span>
                <span className="text-[#d4af37] text-right truncate max-w-[140px]">{c2pa.generation_tool || "CMOS Physical"}</span>
              </div>
            </div>

            {/* Provenance Tags */}
            <div className="mt-3 flex flex-wrap gap-1">
              {c2pa.provenance_tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded-[2px] bg-white/5 text-[9px] font-mono text-slate-400 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-3 rounded-sm bg-[#04060a]/90 border border-[#d4af37]/20 flex items-start gap-2.5 text-xs font-mono">
        <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-[#d4af37]">COMPRESSION & PROVENANCE EVALUATION: </strong>
          {ela.summary}
        </p>
      </div>
    </div>
  );
}
