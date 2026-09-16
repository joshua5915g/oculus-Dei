"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, Layers, Sliders, AlertTriangle, Crosshair, ZoomIn } from "lucide-react";
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

  return (
    <div className="rounded-xl cyber-panel p-5 border border-cyan-500/30">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white font-mono tracking-wide">
              EXPLAINABLE AI (XAI) GRAD-CAM VISUALIZER
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Neural activation heatmap pinpointing synthesis & boundary artifacts ({dimensions.width}x{dimensions.height}px)
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-black/60 border border-slate-800">
          <button
            onClick={() => setViewMode("interactive_blend")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              viewMode === "interactive_blend"
                ? "bg-cyan-500 text-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Blend Overlay
          </button>
          <button
            onClick={() => setViewMode("side_by_side")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              viewMode === "side_by_side"
                ? "bg-cyan-500 text-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode("heatmap_only")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              viewMode === "heatmap_only"
                ? "bg-cyan-500 text-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Heatmap Pure
          </button>
          <button
            onClick={() => setViewMode("original_only")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              viewMode === "original_only"
                ? "bg-cyan-500 text-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-black/40 border border-slate-800/80 mb-4 text-xs font-mono">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">HEATMAP OPACITY:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={heatmapOpacity}
            onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
            className="w-32 accent-cyan-400 cursor-pointer"
            disabled={viewMode !== "interactive_blend"}
          />
          <span className="text-cyan-300 font-bold w-10">{heatmapOpacity}%</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={showArtifactBoxes}
              onChange={(e) => setShowArtifactBoxes(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>SHOW ARTIFACT ANNOTATIONS</span>
          </label>
        </div>
      </div>

      {/* Main Visual Display Area */}
      <div className="relative rounded-lg overflow-hidden bg-black/80 border border-slate-800 flex items-center justify-center min-h-[380px] p-3">
        {viewMode === "interactive_blend" && (
          <div className="relative max-w-full max-h-[550px] inline-block shadow-2xl rounded">
            {/* Base Image */}
            <img
              src={xai.original_frame_base64}
              alt="Original Forensic Sample"
              className="max-h-[520px] w-auto object-contain rounded"
            />

            {/* Overlay Heatmap with interactive opacity */}
            <img
              src={xai.heatmap_base64}
              alt="Grad-CAM Activation Heatmap"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded transition-opacity duration-150 mix-blend-screen"
              style={{ opacity: heatmapOpacity / 100 }}
            />

            {/* Bounding Box Annotations */}
            {showArtifactBoxes &&
              xai.detected_artifacts.map((art, idx) => {
                if (!art.bbox) return null;
                const [x1, y1, x2, y2] = art.bbox;
                // Normalize bounding box coordinates relative to natural dimensions
                const left = (x1 / dimensions.width) * 100;
                const top = (y1 / dimensions.height) * 100;
                const width = ((x2 - x1) / dimensions.width) * 100;
                const height = ((y2 - y1) / dimensions.height) * 100;

                const isSelected = selectedArtifactIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedArtifactIndex(isSelected ? null : idx)}
                    className={`absolute border-2 transition-all cursor-pointer ${
                      art.severity === "CRITICAL"
                        ? "border-red-500 bg-red-500/15"
                        : art.severity === "HIGH"
                        ? "border-amber-400 bg-amber-400/15"
                        : "border-cyan-400 bg-cyan-400/10"
                    } ${isSelected ? "ring-2 ring-white shadow-[0_0_20px_#ff0055]" : ""}`}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-black/90 text-white border border-slate-700 whitespace-nowrap flex items-center gap-1 shadow">
                      <Crosshair className="w-2.5 h-2.5 text-red-400" />
                      {art.type.replace(/_/g, " ")}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {viewMode === "side_by_side" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2">
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-slate-400 mb-2">RAW INPUT EVIDENCE</span>
              <img
                src={xai.original_frame_base64}
                alt="Raw Evidence"
                className="max-h-[380px] w-auto object-contain rounded border border-slate-800"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-cyan-400 mb-2">GRAD-CAM ACTIVATION TENSOR</span>
              <img
                src={xai.composite_overlay_base64}
                alt="Composite XAI Overlay"
                className="max-h-[380px] w-auto object-contain rounded border border-cyan-500/40"
              />
            </div>
          </div>
        )}

        {viewMode === "heatmap_only" && (
          <div className="flex flex-col items-center">
            <img
              src={xai.heatmap_base64}
              alt="Standalone Heatmap"
              className="max-h-[500px] w-auto object-contain rounded"
            />
          </div>
        )}

        {viewMode === "original_only" && (
          <div className="flex flex-col items-center">
            <img
              src={xai.original_frame_base64}
              alt="Original Unaltered"
              className="max-h-[500px] w-auto object-contain rounded"
            />
          </div>
        )}
      </div>

      {/* Heatmap Colormap Spectrum Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-black/40 border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <span>GRAD-CAM ACTIVATION SPECTRUM:</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-80">
          <span className="text-blue-400 text-[10px]">NOMINAL (0.0)</span>
          <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-green-400 via-yellow-400 to-red-600 shadow-inner" />
          <span className="text-red-400 text-[10px] font-bold">SYNTHETIC (1.0)</span>
        </div>
      </div>

      {/* Detected Forensic Artifact Annotations List */}
      <div className="mt-4">
        <h4 className="text-xs font-mono text-slate-400 uppercase mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Neural Anomaly Evidence Markers ({xai.detected_artifacts.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {xai.detected_artifacts.map((art, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedArtifactIndex(selectedArtifactIndex === idx ? null : idx)}
              className={`p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
                selectedArtifactIndex === idx
                  ? "bg-red-950/40 border-red-500 text-white shadow-[0_0_15px_rgba(255,0,85,0.2)]"
                  : "bg-slate-900/50 border-slate-800 hover:border-cyan-500/40 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-cyan-300">{art.type.replace(/_/g, " ")}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    art.severity === "CRITICAL"
                      ? "bg-red-950 border border-red-500 text-red-400"
                      : art.severity === "HIGH"
                      ? "bg-amber-950 border border-amber-500 text-amber-400"
                      : "bg-blue-950 border border-blue-500 text-blue-400"
                  }`}
                >
                  {art.severity}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{art.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
