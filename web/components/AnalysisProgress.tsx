"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, ShieldAlert, Cpu, Terminal, Radio } from "lucide-react";

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
  const [progressPercent, setProgressPercent] = useState(12);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "INITIALIZING TENSOR PIPELINE...",
    "EXTRACTING SPATIAL MESH KEYPOINTS...",
  ]);

  const steps: Step[] = [
    {
      id: 0,
      label: "Spatial Geometry & Facial Landmarks",
      description: "Isolating 68 perioral and ocular mesh points for warping anomalies",
    },
    {
      id: 1,
      label: "2D FFT Frequency Domain Analysis",
      description: "Uncovering periodic high-frequency checkerboard generator artifacts",
    },
    {
      id: 2,
      label: "PyTorch Inference & Grad-CAM Backprop",
      description: "Computing activation gradients across convolutional layers",
    },
    {
      id: 3,
      label: mediaType === "video" ? "Cross-Modal Audio-Visual Sync Telemetry" : "Specular Corneal Reflection Gaze Analysis",
      description: mediaType === "video" 
        ? "Correlating acoustic phonemes with labial viseme motion curves"
        : "Checking corneal light vector coherence across ocular spheres",
    },
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 550);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 95) {
          return prev + Math.floor(Math.random() * 6 + 3);
        }
        return prev;
      });
    }, 180);

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
    }, 380);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [mediaType]);

  return (
    <div className="w-full rounded-xl cyber-panel p-6 border border-cyan-500/30 relative overflow-hidden">
      {/* Background Pulse Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Live Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-400/50 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white font-mono flex items-center gap-2">
              DEEP LEARNING FORENSIC SCAN IN PROGRESS
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Harvard-grade neural pipeline processing raw media tensors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-lg border border-cyan-500/30">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-sm font-bold font-mono text-cyan-300">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 mb-6 overflow-hidden border border-slate-800 p-[1px]">
        <div
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_#00f0ff]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-lg border transition-all font-mono text-xs ${
                isDone
                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                  : isCurrent
                  ? "bg-cyan-950/30 border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                  : "bg-slate-900/40 border-slate-800/60 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] shrink-0">
                    {step.id + 1}
                  </div>
                )}
                <span className="font-semibold text-slate-200 text-xs">
                  {step.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Telemetry Console / Terminal Log */}
      <div className="rounded-lg bg-black/80 border border-slate-800 p-3.5 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-500 pb-2 mb-2 border-b border-slate-800/80 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>REAL-TIME INFERENCE LOG</span>
        </div>
        <div className="space-y-1 text-slate-400 text-[11px]">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-cyan-500/70 select-none">&gt;</span>
              <span className={idx === terminalLogs.length - 1 ? "text-cyan-300" : "text-slate-400"}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
