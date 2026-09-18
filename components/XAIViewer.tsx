"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Layers,
  Sliders,
  AlertTriangle,
  Crosshair,
  Sparkles,
  Scan,
  Eye,
  Columns,
  Radio,
  Activity,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { XAIOutput, MediaDimensions } from "@/lib/types";

interface XAIViewerProps {
  xai: XAIOutput;
  dimensions: MediaDimensions;
  filename: string;
}

type ViewMode =
  | "split_slider"
  | "fft_spectrogram"
  | "interactive_blend"
  | "side_by_side"
  | "heatmap_only"
  | "original_only";

export default function XAIViewer({ xai, dimensions, filename }: XAIViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("split_slider");
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(70); // 0 - 100%
  const [showArtifactBoxes, setShowArtifactBoxes] = useState<boolean>(true);
  const [selectedArtifactIndex, setSelectedArtifactIndex] = useState<number | null>(null);

  // Split Slider state
  const [splitPosition, setSplitPosition] = useState<number>(50); // 0 - 100%
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewModes: { id: ViewMode; label: string; icon?: React.ReactNode }[] = [
    { id: "split_slider", label: "SPLIT SLIDER" },
    { id: "fft_spectrogram", label: "2D FFT SPECTRUM" },
    { id: "interactive_blend", label: "DYNAMIC BLEND" },
    { id: "side_by_side", label: "SIDE-BY-SIDE" },
    { id: "heatmap_only", label: "PURE HEATMAP" },
    { id: "original_only", label: "RAW FRAME" },
  ];

  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDraggingSlider(true);
  const handleMouseUp = () => setIsDraggingSlider(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

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
              EXPLAINABLE AI (XAI) GRAD-CAM & 2D SPECTRAL VISUALIZER
            </h3>
          </div>
          <p className="text-xs text-[#a89f91] font-montserrat mt-1">
            Convolutional gradient backpropagation & 2D Fast Fourier Transform frequency analysis ({dimensions.width}x{dimensions.height}px)
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
        {viewMode === "split_slider" && (
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <Columns className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[#a89f91] text-[11px] tracking-wider">SPLIT WIPE POSITION:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={splitPosition}
              onChange={(e) => setSplitPosition(Number(e.target.value))}
              className="w-36 slider-luxury cursor-pointer"
            />
            <span className="text-[#f7e7c4] font-bold w-12 text-right">{Math.round(splitPosition)}%</span>
          </div>
        )}

        {viewMode === "interactive_blend" && (
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
            />
            <span className="text-[#f7e7c4] font-bold w-12 text-right">{heatmapOpacity}%</span>
          </div>
        )}

        {viewMode === "fft_spectrogram" && (
          <div className="flex items-center gap-2.5 text-xs text-[#00f0ff]">
            <Activity className="w-4 h-4 text-[#00f0ff]" />
            <span className="tracking-wider">2D FOURIER POWER DENSITY SPECTRUM (LOG-MAGNITUDE // NYQUIST FREQUENCY)</span>
          </div>
        )}

        {(viewMode === "side_by_side" || viewMode === "heatmap_only" || viewMode === "original_only") && (
          <div className="flex items-center gap-2 text-[#a89f91] text-xs font-mono">
            <Scan className="w-4 h-4 text-[#d4af37]" />
            <span>FOCAL INSPECTION MODE ACTIVE</span>
          </div>
        )}

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
      <div
        className="relative rounded-sm overflow-hidden bg-[#020305] border border-white/10 flex items-center justify-center min-h-[420px] p-4 shadow-inner select-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 1. INTERACTIVE SPLIT COMPARISON SLIDER */}
        {viewMode === "split_slider" && (
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={(e) => handleSliderMove(e.clientX)}
            className="relative max-w-full max-h-[550px] inline-block shadow-2xl rounded-sm cursor-col-resize select-none overflow-hidden"
          >
            {/* Base Image (Raw Specimen) */}
            <img
              src={xai.original_frame_base64}
              alt="Raw Forensic Specimen"
              className="max-h-[520px] w-auto object-contain rounded-sm pointer-events-none block"
            />

            {/* Overlay Layer (Grad-CAM Composite) Clipped to Split Position */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                clipPath: `polygon(${splitPosition}% 0%, 100% 0%, 100% 100%, ${splitPosition}% 100%)`,
              }}
            >
              <img
                src={xai.composite_overlay_base64}
                alt="Grad-CAM Overlay"
                className="max-h-[520px] w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Split Divider Vertical Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#f7e7c4] via-[#d4af37] to-[#c99e5d] shadow-[0_0_12px_rgba(212,175,55,0.8)] pointer-events-none z-20"
              style={{ left: `${splitPosition}%` }}
            >
              {/* Divider Handle Grip */}
              <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#04060a] border-2 border-[#d4af37] flex items-center justify-center text-[#f7e7c4] shadow-[0_0_20px_rgba(212,175,55,0.6)] cursor-col-resize pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
              >
                <span className="text-[12px] font-mono font-black tracking-tighter">⇄</span>
              </div>
            </div>

            {/* HUD Labels */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-black/80 border border-white/20 text-[10px] font-mono tracking-widest text-[#a89f91] uppercase pointer-events-none backdrop-blur-sm z-10">
              ◄ RAW SPECIMEN
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-sm bg-black/80 border border-[#d4af37]/40 text-[10px] font-mono tracking-widest text-[#f7e7c4] uppercase pointer-events-none backdrop-blur-sm z-10">
              GRAD-CAM OVERLAY ►
            </div>

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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtifactIndex(isSelected ? null : idx);
                    }}
                    className={`absolute border transition-all duration-200 cursor-pointer pointer-events-auto z-10 ${
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

        {/* 2. 2D FFT FREQUENCY SPECTROGRAM */}
        {viewMode === "fft_spectrogram" && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full p-2">
            <div className="relative max-h-[480px] inline-block shadow-2xl rounded-sm border border-[#d4af37]/30 bg-[#04020a] p-2">
              <img
                src={xai.fft_spectrogram_base64 || xai.composite_overlay_base64}
                alt="2D FFT Frequency Spectrogram"
                className="max-h-[420px] w-auto object-contain rounded-sm"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-sm bg-black/90 border border-white/20 text-[10px] font-mono text-[#f7e7c4] tracking-widest uppercase">
                2D FFT LOG POWER SPECTRUM
              </div>
            </div>

            <div className="flex flex-col gap-4 max-w-sm font-mono text-xs text-[#e8dfd8]">
              <div className="p-4 rounded-sm bg-[#06080e] border border-white/10">
                <span className="text-[10px] text-[#a89f91] tracking-widest uppercase block mb-1">
                  FREQUENCY DOMAIN ANALYSIS
                </span>
                <p className="text-xs text-[#e8dfd8] leading-relaxed font-montserrat">
                  Natural optical images follow a smooth <strong>1/f² power decay slope</strong>. Generative AI models (GANs/Diffusion) inject periodic high-frequency checkerboard anomalies during transposed convolution upsampling.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-[#06080e] border border-[#d4af37]/30 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#a89f91] text-[11px]">LATTICE HARMONICS:</span>
                  <span className="text-[#ff0055] font-bold">RADIAL PEAKS DETECTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#a89f91] text-[11px]">SPECTRUM COLOUR:</span>
                  <span className="text-[#f7e7c4]">INFERNO POWER DENSITY</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#a89f91] text-[11px]">FOURIER TRANSFORM:</span>
                  <span className="text-[#00f0ff]">2D DFT (SHIFTED DC)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. DYNAMIC BLEND WITH OPACITY SLIDER */}
        {viewMode === "interactive_blend" && (
          <div className="relative max-w-full max-h-[550px] inline-block shadow-2xl rounded-sm">
            <img
              src={xai.original_frame_base64}
              alt="Original Forensic Sample"
              className="max-h-[520px] w-auto object-contain rounded-sm"
            />
            <img
              src={xai.heatmap_base64}
              alt="Grad-CAM Activation Heatmap"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-sm transition-opacity duration-150 mix-blend-screen"
              style={{ opacity: heatmapOpacity / 100 }}
            />

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

        {/* 4. SIDE-BY-SIDE SPLIT */}
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

        {/* 5. PURE HEATMAP ONLY */}
        {viewMode === "heatmap_only" && (
          <div className="flex flex-col items-center">
            <img
              src={xai.heatmap_base64}
              alt="Standalone Heatmap"
              className="max-h-[500px] w-auto object-contain rounded-sm"
            />
          </div>
        )}

        {/* 6. RAW ORIGINAL ONLY */}
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

      {/* Spectrum Bar Indicator */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-sm bg-[#040609] border border-white/10 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-[#a89f91] tracking-wider">
          <Scan className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>
            {viewMode === "fft_spectrogram"
              ? "FOURIER SPECTRAL ENERGY LEVEL:"
              : "NEURAL ACTIVATION SPECTRUM:"}
          </span>
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
