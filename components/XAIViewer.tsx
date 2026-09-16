"use client";

import React, { useState } from "react";
import { Layers, Sliders, AlertTriangle, Crosshair, Sparkles, Scan, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { XAIOutput, MediaDimensions } from "@/lib/types";

interface XAIViewerProps {
  xai: XAIOutput;
  dimensions: MediaDimensions;
  filename: string;
}

type ViewMode = "interactive_blend" | "side_by_side" | "heatmap_only" | "original_only";

export default function XAIViewer({ xai, dimensions, filename }: XAIViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("interactive_blend");
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(65); // 0 - 100%
  const [showArtifactBoxes, setShowArtifactBoxes] = useState<boolean>(true);
  const [selectedArtifactIndex, setSelectedArtifactIndex] = useState<number | null>(null);

  const viewModes: { id: ViewMode; label: string }[] = [
    { id: "interactive_blend", label: "DYNAMIC BLEND" },
    { id: "side_by_side", label: "SPLIT COMPARISON" },
    { id: "heatmap_only", label: "PURE HEATMAP" },
    { id: "original_only", label: "RAW FRAME" },
  ];

  return (
    <div className="obsidian-card rounded-sm p-6 relative">
      <div className="corner-pin-tl" />
      <div className="corner-pin-tr" />
      <div className="corner-pin-bl" />
      <div className="corner-pin-br" />
      <div className="top-glow-gold" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-lg font-bold text-white font-cinzel tracking-wider">
              EXPLAINABLE AI (XAI) GRAD-CAM VISUALIZER
            </h3>
          </div>
          <p className="text-xs text-[#a89f91] font-montserrat mt-1">
            Backpropagated convolutional layer activation maps highlighting pixel perturbation anomalies ({dimensions.width}x{dimensions.height}px)
          </p>
        </div>

        {/* Luxury View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-sm bg-[#04060a] border border-[#d4af37]/25 shadow-inner">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setViewMode(mode.id)}
              className={`px-3 py-1.5 rounded-sm text-[10px] font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                viewMode === mode.id
                  ? "bg-gradient-to-r from-[#d4af37] via-[#f7e7c4] to-[#c99e5d] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-[#a89f91] hover:text-white"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-sm bg-[#040609] border border-white/10 mb-5 text-xs font-mono relative z-10">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <Sliders className="w-4 h-4 text-[#d4af37]" />
          <span className="text-[#a89f91] text-[11px] tracking-wider">HEATMAP OPACITY:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={heatmapOpacity}
            onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
            className="w-36 slider-luxury cursor-pointer"
            disabled={viewMode !== "interactive_blend"}
          />
          <span className="text-[#f7e7c4] font-bold w-12 text-right">{heatmapOpacity}%</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#a89f91] hover:text-[#e8dfd8] text-[11px] tracking-wider transition-colors">
            <input
              type="checkbox"
              checked={showArtifactBoxes}
              onChange={(e) => setShowArtifactBoxes(e.target.checked)}
              className="accent-[#d4af37] rounded-sm w-3.5 h-3.5 cursor-pointer"
            />
            <span>SHOW ARTIFACT ANNOTATIONS</span>
          </label>
        </div>
      </div>

      {/* Main Visual Display Area */}
      <div className="relative rounded-sm overflow-hidden bg-[#020305] border border-white/10 flex items-center justify-center min-h-[380px] p-4 shadow-inner">
        {viewMode === "interactive_blend" && (
          <div className="relative max-w-full max-h-[550px] inline-block shadow-2xl rounded-sm">
            {/* Base Image */}
            <img
              src={xai.original_frame_base64}
              alt="Original Forensic Sample"
              className="max-h-[520px] w-auto object-contain rounded-sm"
            />

            {/* Overlay Heatmap with interactive opacity */}
            <img
              src={xai.heatmap_base64}
              alt="Grad-CAM Activation Heatmap"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-sm transition-opacity duration-150 mix-blend-screen"
              style={{ opacity: heatmapOpacity / 100 }}
            />

            {/* Bounding Box Annotations */}
            {showArtifactBoxes &&
              xai.detected_artifacts.map((art, idx) => {
                if (!art.bbox) return null;
                const [x1, y1, x2, y2] = art.bbox;
                const left = (x1 / dimensions.width) * 100;
                const top = (y1 / dimensions.height) * 100;
                const width = ((x2 - x1) / dimensions.width) * 100;
                const height = ((y2 - y1) / dimensions.height) * 100;

                const isSelected = selectedArtifactIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedArtifactIndex(isSelected ? null : idx)}
                    className={`absolute border transition-all duration-200 cursor-pointer ${
                      art.severity === "CRITICAL"
                        ? "border-[#ff0055] bg-[#ff0055]/15 shadow-[0_0_15px_rgba(255,0,85,0.4)]"
                        : art.severity === "HIGH"
                        ? "border-[#ffb800] bg-[#ffb800]/15 shadow-[0_0_15px_rgba(255,184,0,0.4)]"
                        : "border-[#00f0ff] bg-[#00f0ff]/15 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    } ${isSelected ? "ring-2 ring-white scale-[1.02]" : ""}`}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold tracking-wider uppercase bg-black/90 text-white border border-white/20 whitespace-nowrap flex items-center gap-1.5 shadow">
                      <Crosshair className="w-2.5 h-2.5 text-[#ff0055]" />
                      <span>{art.type.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {viewMode === "side_by_side" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full p-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono tracking-widest text-[#a89f91] mb-2 uppercase">
                RAW UNALTERED SPECIMEN
              </span>
              <img
                src={xai.original_frame_base64}
                alt="Raw Evidence"
                className="max-h-[380px] w-auto object-contain rounded-sm border border-white/10"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono tracking-widest text-[#f7e7c4] mb-2 uppercase">
                GRAD-CAM COMPOSITE BLEND
              </span>
              <img
                src={xai.composite_overlay_base64}
                alt="Composite XAI Overlay"
                className="max-h-[380px] w-auto object-contain rounded-sm border border-[#d4af37]/40 shadow-[0_0_25px_rgba(212,175,55,0.15)]"
              />
            </div>
          </div>
        )}

        {viewMode === "heatmap_only" && (
          <div className="flex flex-col items-center">
            <img
              src={xai.heatmap_base64}
              alt="Standalone Heatmap"
              className="max-h-[500px] w-auto object-contain rounded-sm"
            />
          </div>
        )}

        {viewMode === "original_only" && (
          <div className="flex flex-col items-center">
            <img
              src={xai.original_frame_base64}
              alt="Original Unaltered"
              className="max-h-[500px] w-auto object-contain rounded-sm"
            />
          </div>
        )}
      </div>

      {/* Heatmap Colormap Spectrum Bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-sm bg-[#040609] border border-white/10 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-[#a89f91] tracking-wider">
          <Scan className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>NEURAL ACTIVATION SPECTRUM:</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-96">
          <span className="text-[#00f0ff] text-[9px] tracking-wider">NOMINAL (0.0)</span>
          <div className="flex-1 h-2.5 rounded-sm bg-gradient-to-r from-blue-600 via-cyan-400 via-emerald-400 via-amber-400 to-red-600 shadow-inner" />
          <span className="text-[#ff0055] text-[9px] tracking-wider font-bold">SYNTHESIS (1.0)</span>
        </div>
      </div>

      {/* Detected Forensic Artifact Annotations Grid */}
      <div className="mt-5">
        <h4 className="text-xs font-mono text-[#a89f91] tracking-wider uppercase mb-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Neural Anomaly Evidence Markers ({xai.detected_artifacts.length})</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {xai.detected_artifacts.map((art, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedArtifactIndex(selectedArtifactIndex === idx ? null : idx)}
              className={`p-4 rounded-sm border transition-all duration-300 cursor-pointer font-mono text-xs ${
                selectedArtifactIndex === idx
                  ? "bg-[#250812] border-[#ff0055] text-white shadow-[0_0_20px_rgba(255,0,85,0.25)]"
                  : "bg-[#06080e]/90 border-white/10 hover:border-[#d4af37]/50 text-[#a89f91]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-white tracking-wider font-cinzel">
                  {art.type.replace(/_/g, " ")}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest ${
                    art.severity === "CRITICAL"
                      ? "bg-[#380b18] border border-[#ff0055] text-[#ff80a0]"
                      : art.severity === "HIGH"
                      ? "bg-[#2d1b06] border border-[#ffb800] text-[#ffd166]"
                      : "bg-[#061924] border border-[#00f0ff] text-[#80f0ff]"
                  }`}
                >
                  {art.severity}
                </span>
              </div>
              <p className="text-[11px] text-[#a89f91] font-montserrat leading-relaxed">
                {art.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
