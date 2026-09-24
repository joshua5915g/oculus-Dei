"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Dropzone from "@/components/Dropzone";
import AnalysisProgress from "@/components/AnalysisProgress";
import ForensicScoreGauge from "@/components/ForensicScoreGauge";
import XAIViewer from "@/components/XAIViewer";
import AudioVisualSyncChart from "@/components/AudioVisualSyncChart";
import ForensicMetricsGrid from "@/components/ForensicMetricsGrid";
import RPPGVisualizer from "@/components/RPPGVisualizer";
import ExportReportModal from "@/components/ExportReportModal";
import SystemTourGuide from "@/components/SystemTourGuide";
import { analyzeMedia } from "@/lib/api";
import { DetectionResponse } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  FileSpreadsheet,
  Cpu,
  Radio,
  AlertCircle,
  Sparkles,
  Fingerprint,
  ShieldCheck,
  Zap,
  Compass,
  Play,
  HelpCircle,
} from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Mouse flashlight tracking
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -200, y: -200 });
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);

  useEffect(() => {
    setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Construct synthetic demo canvas media
  const createSampleFile = (type: "deepfake_video" | "authentic_image"): File => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#04060b";
      ctx.fillRect(0, 0, 1280, 720);

      // Tactical grid lines
      ctx.strokeStyle = "rgba(212, 175, 55, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 1280; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 720);
        ctx.stroke();
      }
      for (let y = 0; y < 720; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1280, y);
        ctx.stroke();
      }

      // Simulated Face Mesh Contour
      ctx.strokeStyle = type === "deepfake_video" ? "#ff0055" : "#00ff88";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(640, 360, 190, 0, Math.PI * 2);
      ctx.stroke();

      // Eye keypoints
      ctx.fillStyle = type === "deepfake_video" ? "#ff0055" : "#d4af37";
      ctx.beginPath();
      ctx.arc(560, 310, 24, 0, Math.PI * 2);
      ctx.arc(720, 310, 24, 0, Math.PI * 2);
      ctx.fill();

      // Mouth keypoints
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(640, 430, 60, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      // Specimen Stamp
      ctx.fillStyle = "#f7e7c4";
      ctx.font = "bold 24px 'JetBrains Mono', monospace";
      ctx.fillText(
        type === "deepfake_video"
          ? "[SYNTHETIC SPECIMEN] SUSPECT_MANIPULATED_STREAM.MP4"
          : "[AUTHENTIC SPECIMEN] BIOMETRIC_VERIFIED_ORIGIN.JPG",
        180,
        120
      );

      ctx.fillStyle = "#a89f91";
      ctx.font = "16px 'JetBrains Mono', monospace";
      ctx.fillText("FORENSIC BENCHMARK TEST SPECIMEN // OCULUS DEI", 360, 155);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const filename =
      type === "deepfake_video" ? "suspect_interview_manipulated.mp4" : "verified_personnel_sample.jpg";
    const mimeType = type === "deepfake_video" ? "video/mp4" : "image/jpeg";

    return new File([ab], filename, { type: mimeType });
  };

  const handleLoadSample = async (
    sampleType: "deepfake_video" | "authentic_image",
    autoRun: boolean = false
  ) => {
    setError(null);
    const sample = createSampleFile(sampleType);
    setSelectedFile(sample);
    setAnalysisResult(null);

    if (autoRun) {
      setIsAnalyzing(true);
      try {
        const response = await analyzeMedia(sample);
        setAnalysisResult(response);
      } catch (err: any) {
        console.error("Forensic analysis error:", err);
        setError(err?.message || "Failed to complete forensic inference pipeline");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await analyzeMedia(selectedFile);
      setAnalysisResult(response);
    } catch (err: any) {
      console.error("Forensic analysis error:", err);
      setError(err?.message || "Failed to complete forensic inference pipeline");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const isVideo = selectedFile?.type.includes("video") || selectedFile?.name.endsWith(".mp4");

  return (
    <div className="relative min-h-screen flex flex-col bg-[#020305] text-[#e8dfd8] selection:bg-[#d4af37] selection:text-black tactical-grid">
      
      {/* 1. Dynamic Interactive Mouse Flashlight Glow */}
      {isFinePointer && cursorPos.x >= 0 && (
        <div
          className="fixed pointer-events-none z-30 w-[460px] h-[460px] rounded-full blur-[140px] opacity-25 bg-[radial-gradient(circle,#d4af37_0%,#8c6d4f_40%,transparent_80%)] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        />
      )}

      {/* 2. Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-[#d4af37]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-[#8c6d4f]/5 rounded-full blur-[170px] pointer-events-none" />

      {/* 3. Top HUD Navigation */}
      <Header
        onLoadSample={(type) => handleLoadSample(type, false)}
        isAnalyzing={isAnalyzing}
        onOpenTour={() => setIsTourActive(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* 4. Main Forensic Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9 relative z-10">
        
        {/* Welcome Hero / Mission Control Banner */}
        {!analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="obsidian-card rounded-sm p-8 sm:p-10 relative overflow-hidden group"
          >
            <div className="corner-pin-tl" />
            <div className="corner-pin-tr" />
            <div className="corner-pin-bl" />
            <div className="corner-pin-br" />
            <div className="top-glow-gold" />

            {/* Eyebrow Header */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-[#d4af37] font-montserrat">
                01 / FORENSIC SURVEILLANCE MATRIX
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-[#d4af37]/80 to-transparent" />
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase font-cinzel text-white leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7e7c4] to-[#c99e5d]">
                    DEFENSE-GRADE MULTI-MODAL
                  </span>
                  <span className="block text-white">
                    SYNTHETIC MEDIA INTELLIGENCE
                  </span>
                </h2>
                <p className="text-sm sm:text-base font-light text-[#a89f91] font-montserrat leading-relaxed">
                  Advanced forensic workstation isolating spatial gradient facial boundaries, 2D FFT spectral checkerboard anomalies, and cross-modal phoneme-viseme desynchronization in real time.
                </p>

                {/* Quick Interactive Tour & Demo Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTourActive(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#c99e5d] text-black font-mono text-xs font-bold tracking-wider uppercase hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all"
                  >
                    <Compass className="w-4 h-4" />
                    <span>🎯 Start Guided Tour</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoadSample("deepfake_video", true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-sm bg-[#18090f] hover:bg-[#280e18] border border-[#ff0055]/50 text-[#ff80a0] font-mono text-xs tracking-wider uppercase cursor-pointer transition-all shadow-[0_0_12px_rgba(255,0,85,0.2)]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>⚡ Instant Demo Case</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGuideModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-[#e8dfd8] font-mono text-xs tracking-wider uppercase cursor-pointer transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Platform Overview</span>
                  </button>
                </div>
              </div>

              {/* Forensic Capability Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 font-mono text-xs w-full lg:w-auto shrink-0">
                <div className="flex items-center gap-3 p-3 rounded-sm bg-[#040609] border border-white/10">
                  <Cpu className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-[#f7e7c4] tracking-wider">PyTorch XAI Grad-CAM</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-sm bg-[#040609] border border-white/10">
                  <Radio className="w-4 h-4 text-[#00f0ff]" />
                  <span className="text-[#e8dfd8] tracking-wider">Wav2Lip Viseme Desync</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-sm bg-[#040609] border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-[#a0ffcc] tracking-wider">Zero-Trust Evidence Hash</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Global Error Notice */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-sm bg-[#1e070d] border border-[#ff0055]/60 text-[#ff8ba7] text-xs font-mono flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(255,0,85,0.25)]"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff0055] shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-white">PIPELINE MALFUNCTION: </span>
                  <span>{error}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="px-3 py-1.5 rounded-sm bg-[#380917] hover:bg-[#520d22] text-[#ff80a0] cursor-pointer text-[10px] tracking-wider uppercase border border-[#ff0055]/40 transition-colors"
              >
                DISMISS
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 1: File Ingestion Dropzone */}
        {!analysisResult && (
          <div className="space-y-4">
            <Dropzone
              onFileSelected={(file) => {
                setSelectedFile(file);
                setError(null);
              }}
              selectedFile={selectedFile}
              onClearFile={() => setSelectedFile(null)}
              onStartAnalysis={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* Stage 2: Deep Learning Inference Progress State */}
        {isAnalyzing && (
          <AnalysisProgress mediaType={isVideo ? "video" : "image"} />
        )}

        {/* Stage 3: Forensic Results Dashboard */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            {/* Tactical Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-sm obsidian-card relative">
              <div className="corner-pin-tl" />
              <div className="corner-pin-br" />
              <div className="top-glow-gold" />

              <div className="flex items-center gap-3 font-mono text-xs text-[#a89f91]">
                <span className="text-[#d4af37] font-bold tracking-wider uppercase">TARGET SPECIMEN:</span>
                <span className="text-white font-semibold">{analysisResult.filename}</span>
                <span className="text-white/20">•</span>
                <span className="text-[#f7e7c4] uppercase tracking-wider">{analysisResult.media_type}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  id="tour-export-dossier"
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm bg-[#06080e] hover:bg-[#0c101a] border border-[#d4af37]/30 text-[#f7e7c4] font-mono text-xs tracking-wider uppercase cursor-pointer transition-all hover:border-[#d4af37]/70 shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
                  <span>EXPORT AUDIT DOSSIER</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#c99e5d] hover:brightness-110 text-black font-mono text-xs font-bold tracking-wider uppercase cursor-pointer transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  id="btn-new-analysis"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>NEW SPECIMEN</span>
                </button>
              </div>
            </div>

            {/* Verdict Gauge & Forensic Classification */}
            <ForensicScoreGauge data={analysisResult} />

            {/* Explainable AI Visualizer (Grad-CAM Blend Slider) */}
            <XAIViewer
              xai={analysisResult.xai}
              dimensions={analysisResult.dimensions}
              filename={analysisResult.filename}
            />

            {/* Granular Forensic Metrics Cards */}
            <ForensicMetricsGrid breakdown={analysisResult.forensic_breakdown} />

            {/* Cross-Modal Audio-Visual Sync Analysis Dashboard */}
            <AudioVisualSyncChart analysis={analysisResult.audio_visual_sync} />

            {/* Remote Photoplethysmography (rPPG) Biological Cardiac Pulse Telemetry */}
            {analysisResult.rppg && (
              <RPPGVisualizer rppg={analysisResult.rppg} />
            )}
          </motion.div>
        )}
      </main>

      {/* Forensic Report Export Modal */}
      {analysisResult && (
        <ExportReportModal
          data={analysisResult}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {/* System Tour Guide & Capabilities Matrix Modal */}
      <SystemTourGuide
        isTourActive={isTourActive}
        onCloseTour={() => setIsTourActive(false)}
        onOpenTour={() => setIsTourActive(true)}
        isModalOpen={isGuideModalOpen}
        onCloseModal={() => setIsGuideModalOpen(false)}
        onOpenModal={() => {
          setIsTourActive(false);
          setIsGuideModalOpen(true);
        }}
        onLoadDemo={(type) => handleLoadSample(type, true)}
        hasResults={!!analysisResult}
      />

      {/* Cinematic Luxury Footer */}
      <footer className="border-t border-[#d4af37]/20 bg-[#020306] py-8 mt-16 font-mono text-xs text-[#a89f91] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[#f7e7c4] font-bold font-cinzel tracking-widest">OCULUS DEI</span>
            <span className="text-[#d4af37]/60">•</span>
            <span className="text-[#7e766c] text-[11px] tracking-wider">Defense-Grade Synthetic Media Forensic Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-[#5e574d] text-[11px] tracking-wider">
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="text-[#a89f91] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              SYSTEM BRIEFING GUIDE
            </button>
            <span>•</span>
            <span>ISO/IEC 27037 FORENSIC STANDARD</span>
            <span>•</span>
            <span className="text-[#d4af37]/80">PYTORCH GRAD-CAM v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
