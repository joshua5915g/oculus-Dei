"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Terminal, Radio, Sparkles, Cpu } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisProgressProps {
  mediaType: "image" | "video";
}

interface Step {
  id: number;
  label: string;
  description: string;
}

export default function AnalysisProgress({ mediaType }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(14);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "INITIALIZING OCULUS DEI TENSOR ENGINE...",
    "DECODING BASELINE FRAME MATRIX...",
  ]);

  const steps: Step[] = [
    {
      id: 0,
      label: "Spatial Geometry & Facial Landmarks",
      description: "Isolating 68 perioral and ocular mesh keypoints for warp vectors",
    },
    {
      id: 1,
      label: "2D FFT Frequency Domain Analysis",
      description: "Detecting periodic high-frequency checkerboard generator artifacts",
    },
    {
      id: 2,
      label: "PyTorch Inference & Grad-CAM Backprop",
      description: "Computing activation gradients across convolutional layers",
    },
    {
      id: 3,
      label: mediaType === "video" ? "Audio-Visual Cross-Modal Desync Telemetry" : "Specular Corneal Gaze Disparity Analysis",
      description: mediaType === "video" 
        ? "Correlating acoustic phonemes with labial viseme motion curves"
        : "Checking corneal reflection vector coherence across ocular spheres",
    },
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 550);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => (prev < 96 ? prev + Math.floor(Math.random() * 5 + 3) : prev));
    }, 160);

    const logMessages = [
      "[INFO] Ingesting uncompressed YUV/RGB buffers...",
      "[SPECTRAL] Calculating 2D Discrete Fourier Transform spectrum...",
      "[XAI] Calculating Grad-CAM weights over layer4.conv2...",
      "[AUDIO] Extracting MFCC spectrogram acoustic envelopes...",
      "[SYNC] Aligning labial landmarks against voice formant frequencies...",
      "[DEFENSE] Generating cryptographic authenticity signature...",
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < logMessages.length) {
        setTerminalLogs((prev) => [...prev.slice(-4), logMessages[logIdx]]);
        logIdx++;
      }
    }, 360);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [mediaType, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full obsidian-card rounded-sm p-6 sm:p-8 relative overflow-hidden"
    >
      <div className="corner-pin-tl" />
      <div className="corner-pin-tr" />
      <div className="corner-pin-bl" />
      <div className="corner-pin-br" />
      <div className="top-glow-gold" />

      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Live Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-sm bg-[#18140e] border border-[#d4af37]/40 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Radio className="w-5 h-5 text-[#f7e7c4] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase">
                ACTIVE PIPELINE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            </div>
            <h3 className="text-lg font-bold text-white font-cinzel tracking-wider">
              DEEP LEARNING FORENSIC INFERENCE
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#05070c] px-4 py-2 rounded-sm border border-[#d4af37]/30 shadow-inner">
          <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
          <span className="text-base font-bold font-mono text-[#f7e7c4]">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar with Luxury Gold Glow */}
      <div className="w-full bg-[#040609] rounded-sm h-2.5 mb-7 overflow-hidden border border-[#d4af37]/25 p-[1px] relative">
        <motion.div
          className="h-full rounded-sm bg-gradient-to-r from-[#8c6d4f] via-[#d4af37] to-[#f7e7c4] shadow-[0_0_15px_rgba(212,175,55,0.7)]"
          style={{ width: `${progressPercent}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        />
      </div>

      {/* Pipeline Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6 relative z-10">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-sm border transition-all duration-300 font-mono text-xs ${
                isDone
                  ? "bg-[#06140e]/70 border-[#00ff88]/40 text-[#80ffc0] shadow-[0_0_15px_rgba(0,255,136,0.08)]"
                  : isCurrent
                  ? "bg-[#18130a]/80 border-[#d4af37]/70 text-[#f7e7c4] shadow-[0_0_20px_rgba(212,175,55,0.18)]"
                  : "bg-[#06080d]/50 border-white/5 text-[#635f59]"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-sm border border-white/10 flex items-center justify-center text-[9px] shrink-0 text-[#a89f91]">
                    {step.id + 1}
                  </div>
                )}
                <span className={`font-semibold text-xs tracking-wider ${isCurrent ? "text-white" : isDone ? "text-[#a0ffcc]" : "text-[#807a72]"}`}>
                  {step.label}
                </span>
              </div>
              <p className="text-[11px] text-[#a89f91] pl-6 leading-relaxed font-montserrat">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Real-Time Terminal Log */}
      <div className="rounded-sm bg-[#020306] border border-white/10 p-4 font-mono text-xs relative">
        <div className="flex items-center gap-2 text-[#a89f91] pb-2 mb-2 border-b border-white/5 text-[11px] tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>REAL-TIME INFERENCE LOG</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#d4af37]/70 select-none">&gt;</span>
              <span className={idx === terminalLogs.length - 1 ? "text-[#f7e7c4] font-medium" : "text-[#7f776d]"}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
