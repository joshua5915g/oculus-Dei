"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Layers,
  Activity,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Radio,
  Sliders,
  Scan,
  Zap,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  badge: string;
  badgeColor: string;
  content: string;
  actionHint?: string;
  requiresResults?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "header-telemetry",
    targetId: "tour-header",
    title: "Live Neural Engine & Telemetry HUD",
    badge: "SYSTEM STATUS",
    badgeColor: "#00ff88",
    content:
      "Monitor the real-time health of the PyTorch neural backend, hardware acceleration device, UTC timestamps, and MIL-STD 461F compliance telemetry.",
    actionHint: "Notice the status indicator showing active neural weights.",
  },
  {
    id: "sample-buttons",
    targetId: "tour-sample-buttons",
    title: "1-Click Forensic Benchmark Specimens",
    badge: "INSTANT TEST",
    badgeColor: "#ff0055",
    content:
      "Don't have suspect media on hand? Instantaneously inject synthetic deepfakes or authentic benchmark specimens to test the neural detection engine.",
    actionHint: "Click '+ Test Deepfake' at any time to run an immediate forensic simulation.",
  },
  {
    id: "dropzone",
    targetId: "tour-dropzone",
    title: "Multi-Modal Evidence Ingestion",
    badge: "INGESTION",
    badgeColor: "#d4af37",
    content:
      "Drag and drop any suspect .mp4 video or .jpg/.png/.webp forensic keyframe up to 100MB. The engine performs zero-trust SHA-256 cryptographic hashing upon ingestion.",
    actionHint: "Upload custom suspect footage or drag media directly into the radar sweep.",
  },
  {
    id: "verdict-gauge",
    targetId: "tour-verdict-gauge",
    title: "Forensic Verdict & Probability Gauge",
    badge: "VERDICT GAUGE",
    badgeColor: "#ff0055",
    content:
      "High-precision radial probability scoring calculating neural manipulation likelihood, confidence indices, SHA-256 evidence integrity seals, and ISO/IEC 27037 audit logs.",
    requiresResults: true,
  },
  {
    id: "xai-viewer",
    targetId: "tour-xai-viewer",
    title: "Explainable AI (XAI) Grad-CAM & 2D FFT Spectrum",
    badge: "NEURAL VISUALIZER",
    badgeColor: "#00f0ff",
    content:
      "Inspect spatial gradient neural attention heatmaps using an interactive curtain wipe split slider, or switch to 2D FFT Frequency Power Spectrograms to detect periodic GAN checkerboard anomalies.",
    actionHint: "Drag the center curtain handle left or right to blend raw evidence with neural heatmaps.",
    requiresResults: true,
  },
  {
    id: "forensic-metrics",
    targetId: "tour-forensic-metrics",
    title: "4-Quadrant Forensic Telemetry Grid",
    badge: "ANOMALY ANALYSIS",
    badgeColor: "#d4af37",
    content:
      "Granular breakdown across Facial Boundary Warping, 2D FFT Frequency Checkerboard, Corneal Specular Disparity, and Compression Discontinuities with severity ratings.",
    requiresResults: true,
  },
  {
    id: "av-sync",
    targetId: "tour-av-sync",
    title: "Cross-Modal Audio-Visual Lip-Sync Analysis",
    badge: "TEMPORAL SYNC",
    badgeColor: "#80ffc0",
    content:
      "Wav2Lip biometric cross-correlation plotting acoustic speech amplitude against labial viseme displacement to isolate temporal phase lag (e.g., -142.5ms desync).",
    requiresResults: true,
  },
  {
    id: "export-dossier",
    targetId: "tour-export-dossier",
    title: "Court-Admissible PDF Intelligence Dossier",
    badge: "LEGAL EXPORT",
    badgeColor: "#f7e7c4",
    content:
      "Generate official, court-ready forensic dossiers formatted with cryptographic SHA-256 seals, examiner sign-off credentials, and ISO/IEC 27037 compliance certificates.",
    actionHint: "Click 'Export Audit Dossier' to preview and download the PDF report.",
    requiresResults: true,
  },
];

interface SystemTourGuideProps {
  isTourActive: boolean;
  onCloseTour: () => void;
  onOpenTour: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
  onLoadDemo: (sampleType: "deepfake_video" | "authentic_image") => void;
  hasResults: boolean;
}

export default function SystemTourGuide({
  isTourActive,
  onCloseTour,
  onOpenTour,
  isModalOpen,
  onCloseModal,
  onOpenModal,
  onLoadDemo,
  hasResults,
}: SystemTourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  const [activeBriefingTab, setActiveBriefingTab] = useState<number>(0);

  // Check first-time visitor
  useEffect(() => {
    try {
      const tourSeen = localStorage.getItem("oculus_dei_tour_completed");
      if (!tourSeen) {
        const timer = setTimeout(() => {
          setShowWelcomeBanner(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
    try {
      localStorage.setItem("oculus_dei_tour_completed", "true");
    } catch {
      // Ignore
    }
  };

  const handleStartTourFromBanner = () => {
    setShowWelcomeBanner(false);
    try {
      localStorage.setItem("oculus_dei_tour_completed", "true");
    } catch {
      // Ignore
    }
    onOpenTour();
    setCurrentStepIndex(0);
  };

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Auto-scroll and calculate target element bounding rect
  const updateTargetRect = useCallback(() => {
    if (!isTourActive || !currentStep) return;

    // If step requires results but no results exist, auto-load demo deepfake specimen
    if (currentStep.requiresResults && !hasResults) {
      onLoadDemo("deepfake_video");
      return;
    }

    const targetElement = document.getElementById(currentStep.targetId);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setTargetRect(rect);
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      setTargetRect(null);
    }
  }, [isTourActive, currentStep, hasResults, onLoadDemo]);

  useEffect(() => {
    if (isTourActive) {
      // Delay slightly to allow DOM changes / re-renders
      const timer = setTimeout(updateTargetRect, 250);
      window.addEventListener("resize", updateTargetRect);
      window.addEventListener("scroll", updateTargetRect);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateTargetRect);
        window.removeEventListener("scroll", updateTargetRect);
      };
    }
  }, [isTourActive, currentStepIndex, updateTargetRect, hasResults]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTourActive) {
        if (e.key === "Escape") {
          onCloseTour();
        } else if (e.key === "ArrowRight" || e.key === "Enter") {
          handleNextStep();
        } else if (e.key === "ArrowLeft") {
          handlePrevStep();
        }
      } else if (isModalOpen && e.key === "Escape") {
        onCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTourActive, isModalOpen, currentStepIndex]);

  const handleNextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = TOUR_STEPS[nextIndex];
      if (nextStep.requiresResults && !hasResults) {
        onLoadDemo("deepfake_video");
      }
      setCurrentStepIndex(nextIndex);
    } else {
      onCloseTour();
      try {
        localStorage.setItem("oculus_dei_tour_completed", "true");
      } catch {
        // Ignore
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Calculate tooltip placement
  const getTooltipStyle = () => {
    if (!targetRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const margin = 16;
    const tooltipWidth = 420;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    let top = targetRect.bottom + margin;
    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

    // Keep horizontally in bounds
    if (left < 16) left = 16;
    if (left + tooltipWidth > windowWidth - 16) left = windowWidth - tooltipWidth - 16;

    // Flip to top if overflow bottom
    if (top + 300 > windowHeight && targetRect.top > 320) {
      top = targetRect.top - 310;
    }

    return {
      top: `${Math.max(16, top)}px`,
      left: `${left}px`,
    };
  };

  const briefingCards = [
    {
      icon: <Cpu className="w-6 h-6 text-[#d4af37]" />,
      title: "PyTorch Grad-CAM & 2D FFT Spectrograms",
      badge: "XAI VISION",
      desc: "Our neural visualizer leverages Gradient-weighted Class Activation Mapping to pinpoint pixel-level facial boundary warping and 2D Fast Fourier Transform power density spectra to uncover periodic GAN/Diffusion upsampling frequency artifacts.",
      features: [
        "Curtain wipe split comparison slider (0% to 100%)",
        "2D FFT frequency checkerboard power spectrum",
        "Bounding box spatial anomaly coordinates",
        "Corneal specular disparity detection",
      ],
    },
    {
      icon: <Radio className="w-6 h-6 text-[#00f0ff]" />,
      title: "Cross-Modal Audio-Visual Lip-Sync Analysis",
      badge: "ACOUSTIC FORENSICS",
      desc: "Dual-stream biometric correlation comparing acoustic speech energy with labial viseme displacement. Identifies subtle temporal phase lags (-142.5ms) typical in AI-dubbed or face-swapped deepfakes.",
      features: [
        "Recharts dual-area speech vs viseme waveform",
        "Phoneme-viseme discrepancy index tracking",
        "Identifies desynchronized frame windows",
        "Biometric audio-visual temporal lag detection",
      ],
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#00ff88]" />,
      title: "Zero-Trust Cryptographic Evidence Integrity",
      badge: "DATA INTEGRITY",
      desc: "Every piece of ingested evidence receives an immutable SHA-256 cryptographic audit seal with timestamp verification adhering strictly to ISO/IEC 27037 digital forensic standards.",
      features: [
        "Client & backend SHA-256 hash validation",
        "Deterministic tamper-evident processing",
        "Classification verification: Synthetic vs Authentic",
        "Real-time MIL-STD 461F compliance monitoring",
      ],
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-[#f7e7c4]" />,
      title: "Court-Ready Forensic Dossier & Audit Export",
      badge: "OFFICIAL DOSSIER",
      desc: "Export comprehensive, court-admissible forensic intelligence dossiers formatted with cryptographic seals, examiner credentials, optical/acoustic telemetry matrices, and embedded keyframe proof.",
      features: [
        "ISO/IEC 27037 certified PDF report layout",
        "Embedded Grad-CAM and FFT spectral evidence stamps",
        "Cryptographic SHA-256 audit stamps & QR verification",
        "Machine-readable JSON forensic audit trail",
      ],
    },
  ];

  return (
    <>
      {/* 1. Subtle First-Time User Welcome Banner */}
      <AnimatePresence>
        {showWelcomeBanner && !isTourActive && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] p-5 rounded-sm obsidian-card border border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-xs font-mono"
          >
            <div className="corner-pin-tl" />
            <div className="corner-pin-tr" />
            <div className="corner-pin-bl" />
            <div className="corner-pin-br" />
            <div className="top-glow-gold" />

            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f7e7c4]">
                  <Compass className="w-4 h-4 animate-spin text-[#d4af37]" style={{ animationDuration: "12s" }} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] block">SYSTEM ONBOARDING</span>
                  <h4 className="text-sm font-bold text-white font-cinzel tracking-wider">NEW ANALYST BRIEFING</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismissBanner}
                className="text-[#a89f91] hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close onboarding prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#a89f91] text-[11px] leading-relaxed mb-4 font-sans">
              Welcome to Oculus Dei. Would you like an interactive guided tour of our neural XAI Grad-CAM visualizer, 2D FFT spectrograms, and lip-sync forensic tools?
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartTourFromBanner}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#c99e5d] text-black font-bold text-[11px] tracking-wider uppercase hover:brightness-110 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Tour</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDismissBanner();
                  onLoadDemo("deepfake_video");
                }}
                className="py-2 px-3 rounded-sm bg-[#120a07] border border-[#ff0055]/40 text-[#ff80a0] font-semibold text-[11px] tracking-wider uppercase hover:bg-[#22070f] cursor-pointer transition-all"
              >
                ⚡ Load Demo
              </button>
              <button
                type="button"
                onClick={handleDismissBanner}
                className="py-2 px-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-[#a89f91] text-[11px] uppercase transition-colors cursor-pointer"
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Spotlight Guided Walkthrough */}
      <AnimatePresence>
        {isTourActive && (
          <div className="fixed inset-0 z-50 pointer-events-auto">
            {/* Backdrop cutout mask */}
            <div
              className="absolute inset-0 bg-black/75 backdrop-blur-[2px] transition-all duration-300 cursor-pointer"
              onClick={onCloseTour}
            />

            {/* Target Highlight Box */}
            {targetRect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  top: targetRect.top - 8,
                  left: targetRect.left - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute pointer-events-none rounded-sm border-2 border-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.45),inset_0_0_20px_rgba(212,175,55,0.15)] z-10"
              >
                {/* Tactical Reticle Corner Crosshairs */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#00ff88]" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#00ff88]" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#00ff88]" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#00ff88]" />
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-2 h-[2px] bg-[#d4af37]" />
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-2 h-[2px] bg-[#d4af37]" />
              </motion.div>
            )}

            {/* Floating HUD Tooltip Card */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={getTooltipStyle()}
              className="fixed z-20 w-[420px] max-w-[calc(100vw-2rem)] p-6 rounded-sm obsidian-card border border-[#d4af37]/60 shadow-[0_30px_70px_rgba(0,0,0,0.95)] font-mono text-xs"
            >
              <div className="corner-pin-tl" />
              <div className="corner-pin-tr" />
              <div className="corner-pin-bl" />
              <div className="corner-pin-br" />
              <div className="top-glow-gold" />

              {/* Step Counter & Category Badge */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase border"
                    style={{
                      color: currentStep.badgeColor,
                      borderColor: `${currentStep.badgeColor}50`,
                      backgroundColor: `${currentStep.badgeColor}15`,
                    }}
                  >
                    {currentStep.badge}
                  </span>
                  <span className="text-[#a89f91] text-[11px]">
                    Step {currentStepIndex + 1} of {TOUR_STEPS.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onCloseTour}
                  className="text-[#a89f91] hover:text-white transition-colors cursor-pointer p-1"
                  aria-label="Exit tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white font-cinzel tracking-wider uppercase mb-2">
                {currentStep.title}
              </h3>

              {/* Body Text */}
              <p className="text-[#e8dfd8] text-xs font-sans leading-relaxed mb-3">
                {currentStep.content}
              </p>

              {/* Action Hint Callout */}
              {currentStep.actionHint && (
                <div className="flex items-start gap-2 p-2.5 rounded-sm bg-[#0a0d14] border border-[#d4af37]/30 text-[#f7e7c4] text-[11px] mb-4">
                  <Zap className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span className="font-sans italic">{currentStep.actionHint}</span>
                </div>
              )}

              {/* Progress Bar Dots */}
              <div className="flex items-center gap-1.5 mb-5">
                {TOUR_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      if (step.requiresResults && !hasResults) {
                        onLoadDemo("deepfake_video");
                      }
                      setCurrentStepIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex
                        ? "w-7 bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
                        : idx < currentStepIndex
                        ? "w-2.5 bg-[#00ff88]"
                        : "w-2.5 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Jump to step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="text-[#a89f91] hover:text-[#f7e7c4] text-[11px] tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Full Guide</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentStepIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-3 py-1.5 rounded-sm bg-[#06080e] hover:bg-[#0c101a] border border-white/20 hover:border-white/40 text-[#e8dfd8] text-[11px] tracking-wider uppercase cursor-pointer transition-all flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-1.5 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#c99e5d] hover:brightness-110 text-black font-bold text-[11px] tracking-wider uppercase cursor-pointer transition-all shadow-[0_0_12px_rgba(212,175,55,0.3)] flex items-center gap-1.5"
                  >
                    <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Step"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Comprehensive Mission Briefing Matrix Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={onCloseModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl p-6 sm:p-8 rounded-sm obsidian-card border border-[#d4af37]/40 shadow-[0_30px_90px_rgba(0,0,0,0.95)] z-10 font-mono text-xs my-8"
            >
              <div className="corner-pin-tl" />
              <div className="corner-pin-tr" />
              <div className="corner-pin-bl" />
              <div className="corner-pin-br" />
              <div className="top-glow-gold" />

              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#f7e7c4] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <Compass className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-[0.25em] text-[#d4af37] uppercase">
                        MISSION BRIEFING // CAPABILITIES MATRIX
                      </span>
                      <span className="px-1.5 py-0.5 rounded-sm bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-[9px]">
                        MIL-STD 461F
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel tracking-wider uppercase">
                      OCULUS DEI FORENSIC PLATFORM GUIDE
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onCloseModal}
                  className="p-2 text-[#a89f91] hover:text-white hover:bg-white/5 rounded-sm transition-colors cursor-pointer"
                  aria-label="Close guide modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Workflow Overview */}
              <div className="py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-sm bg-[#06080e] border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7c4] font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Ingest Evidence</h4>
                    <p className="text-[#a89f91] text-[11px] font-sans mt-0.5">
                      Upload .mp4 video or keyframe images up to 100MB, or use 1-click test specimens.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-sm bg-[#06080e] border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Neural & FFT Analysis</h4>
                    <p className="text-[#a89f91] text-[11px] font-sans mt-0.5">
                      Grad-CAM split slider, 2D FFT spectrograms, and Wav2Lip temporal lip-sync charts.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-sm bg-[#06080e] border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88] font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Export Court Dossier</h4>
                    <p className="text-[#a89f91] text-[11px] font-sans mt-0.5">
                      Export ISO/IEC 27037 compliant court-ready PDF dossiers with SHA-256 seal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Tabs */}
              <div className="flex border-b border-white/10 gap-2 mb-4 overflow-x-auto pb-1">
                {briefingCards.map((card, idx) => (
                  <button
                    key={card.title}
                    type="button"
                    onClick={() => setActiveBriefingTab(idx)}
                    className={`px-3.5 py-2 text-xs font-mono tracking-wider uppercase rounded-t-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border-b-2 ${
                      activeBriefingTab === idx
                        ? "text-[#f7e7c4] border-[#d4af37] bg-[#d4af37]/10"
                        : "text-[#a89f91] border-transparent hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{card.badge}</span>
                  </button>
                ))}
              </div>

              {/* Active Tab Detailed View */}
              {briefingCards[activeBriefingTab] && (
                <div className="p-5 rounded-sm bg-[#05070c] border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-sm bg-[#0a0f18] border border-white/15">
                      {briefingCards[activeBriefingTab].icon}
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest text-[#d4af37] uppercase block">
                        MODULE 0{activeBriefingTab + 1}
                      </span>
                      <h3 className="text-base font-bold text-white font-cinzel tracking-wider uppercase">
                        {briefingCards[activeBriefingTab].title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[#e8dfd8] text-xs font-sans leading-relaxed">
                    {briefingCards[activeBriefingTab].desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {briefingCards[activeBriefingTab].features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2 text-[11px] text-[#a89f91] p-2 rounded-sm bg-[#030509] border border-white/5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
                        <span className="font-sans">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action Launchers */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-[11px] text-[#a89f91]">
                  <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
                  <span>ISO/IEC 27037 Digital Evidence Benchmark Standard</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onCloseModal();
                      onLoadDemo("deepfake_video");
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-[#22070f] hover:bg-[#340b17] border border-[#ff0055]/50 text-[#ff80a0] font-mono text-xs tracking-wider uppercase cursor-pointer transition-all shadow-[0_0_12px_rgba(255,0,85,0.2)]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>⚡ Load Demo Case</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onCloseModal();
                      onOpenTour();
                      setCurrentStepIndex(0);
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#c99e5d] hover:brightness-110 text-black font-mono text-xs font-bold tracking-wider uppercase cursor-pointer transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Step-by-Step Tour</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
