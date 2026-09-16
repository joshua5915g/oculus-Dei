"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Dropzone from "@/components/Dropzone";
import AnalysisProgress from "@/components/AnalysisProgress";
import ForensicScoreGauge from "@/components/ForensicScoreGauge";
import XAIViewer from "@/components/XAIViewer";
import AudioVisualSyncChart from "@/components/AudioVisualSyncChart";
import ForensicMetricsGrid from "@/components/ForensicMetricsGrid";
import ExportReportModal from "@/components/ExportReportModal";
import { analyzeMedia } from "@/lib/api";
import { DetectionResponse } from "@/lib/types";
import {
  ShieldAlert,
  RotateCcw,
  FileSpreadsheet,
  Cpu,
  Fingerprint,
  Radio,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Helper to construct synthetic demo canvas media
  const createSampleFile = (type: "deepfake_video" | "authentic_image"): File => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Cybernetic test canvas
      ctx.fillStyle = "#0a0f1d";
      ctx.fillRect(0, 0, 1280, 720);

      // Grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.1)";
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

      // Simulated Face Outline
      ctx.strokeStyle = type === "deepfake_video" ? "#ff0055" : "#00ff88";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(640, 360, 190, 0, Math.PI * 2);
      ctx.stroke();

      // Eye markers
      ctx.fillStyle = type === "deepfake_video" ? "#ff0055" : "#00f0ff";
      ctx.beginPath();
      ctx.arc(560, 310, 24, 0, Math.PI * 2);
      ctx.arc(720, 310, 24, 0, Math.PI * 2);
      ctx.fill();

      // Mouth marker
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(640, 430, 60, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      // Forensic Labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px monospace";
      ctx.fillText(
        type === "deepfake_video"
          ? "[SYNTHETIC SAMPLE] SUSPECT_TALKING_HEAD.MP4"
          : "[AUTHENTIC SAMPLE] BIOMETRIC_VERIFIED_IDENTITY.JPG",
        220,
        120
      );

      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px monospace";
      ctx.fillText("HARVARD FORENSIC BENCHMARK TEST SPECIMEN", 400, 155);
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

  const handleLoadSample = (sampleType: "deepfake_video" | "authentic_image") => {
    setError(null);
    const sample = createSampleFile(sampleType);
    setSelectedFile(sample);
    setAnalysisResult(null);
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
      setError(err?.message || "Failed to complete forensic inference");
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
    <div className="min-h-screen flex flex-col bg-[#06080e] cyber-grid selection:bg-cyan-500 selection:text-black">
      {/* HUD Header */}
      <Header onLoadSample={handleLoadSample} isAnalyzing={isAnalyzing} />

      {/* Main Forensic Workstation Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome / System Status Intro */}
        {!analysisResult && !isAnalyzing && (
          <div className="rounded-xl cyber-panel p-6 border border-cyan-500/20 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>NEURAL INTEGRITY VERIFICATION PROTOCOL</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                  Multi-Modal Synthetic Media & Deepfake Detection
                </h2>
                <p className="text-sm text-slate-400 font-mono max-w-2xl leading-relaxed">
                  Military-grade forensic pipeline inspecting spatial warping boundaries, 2D FFT spectral checkerboard anomalies, and cross-modal audio-visual phoneme synchronization.
                </p>
              </div>

              <div className="flex flex-wrap lg:flex-col gap-3 font-mono text-xs w-full lg:w-auto">
                <div className="flex items-center gap-2 text-slate-400">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>PyTorch XAI Grad-CAM</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>SyncNet Audio-Visual Telemetry</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span>Zero-Trust Evidence Sandbox</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Notice */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs font-mono flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <span className="font-bold">FORENSIC PIPELINE ERROR: </span>
                <span>{error}</span>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-3 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 cursor-pointer text-[11px]"
            >
              DISMISS
            </button>
          </div>
        )}

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
          <div className="space-y-6 animate-fadeIn">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl cyber-panel border border-cyan-500/30">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span className="text-cyan-400 font-bold">ANALYSIS TARGET:</span>
                <span className="text-white font-semibold">{analysisResult.filename}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 uppercase">{analysisResult.media_type}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs cursor-pointer transition-all"
                  id="btn-export-dossier"
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  EXPORT AUDIT DOSSIER
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs cursor-pointer transition-all"
                  id="btn-new-analysis"
                >
                  <RotateCcw className="w-4 h-4" />
                  NEW EVIDENCE FILE
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
          </div>
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#04060a] py-6 mt-12 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">OCULUS DEI</span>
            <span>• Defense-Grade Synthetic Media & Deepfake Forensic Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>ISO/IEC 27037 FORENSIC STANDARD</span>
            <span>PYTORCH GRAD-CAM v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
