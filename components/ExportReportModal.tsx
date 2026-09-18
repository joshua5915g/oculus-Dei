"use client";

import React, { useState } from "react";
import { Download, Copy, Check, X, FileJson, ShieldCheck, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DetectionResponse } from "@/lib/types";
import { generateForensicDossierPDF } from "@/lib/pdfGenerator";

interface ExportReportModalProps {
  data: DetectionResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportReportModal({ data, isOpen, onClose }: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oculus_dei_audit_${data.job_id.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateForensicDossierPDF(data);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="obsidian-card rounded-sm border border-[#d4af37]/40 w-full max-w-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[88vh] relative"
        >
          <div className="corner-pin-tl" />
          <div className="corner-pin-tr" />
          <div className="corner-pin-bl" />
          <div className="corner-pin-br" />
          <div className="top-glow-gold" />

          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#04060a]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#1a140d] border border-[#d4af37]/40 flex items-center justify-center text-[#f7e7c4]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-cinzel tracking-wider">
                  CRYPTOGRAPHIC FORENSIC AUDIT DOSSIER
                </h3>
                <span className="text-[10px] font-mono tracking-widest text-[#a89f91] uppercase">
                  IMMUTABLE SHA-256 SEAL // ISO/IEC 27037 COURT EVIDENCE RECORD
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-[#1a140d] text-[#a89f91] hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-[#e8dfd8] space-y-4">
            {/* Hash Banner */}
            <div className="p-3.5 rounded-sm bg-[#040609] border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#f7e7c4]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-[11px] tracking-wider truncate max-w-xs sm:max-w-md">
                  STAMP: {data.job_id}
                </span>
              </div>
              <span className="text-[10px] text-[#80776d] shrink-0">{data.timestamp}</span>
            </div>

            {/* Feature Callout */}
            <div className="p-3 rounded-sm bg-[#060a14] border border-cyan-500/20 flex items-center justify-between">
              <div className="text-[11px] text-[#00f0ff] font-montserrat">
                <strong>Official PDF Evidence Dossier:</strong> Compiles verified optical telemetry matrices, Grad-CAM keyframes, 2D FFT spectrograms, and biometric synchronization into a court-ready document.
              </div>
            </div>

            <pre className="p-4 bg-[#020305] rounded-sm border border-white/10 text-[11px] font-mono text-[#a0ffcc] overflow-x-auto leading-relaxed max-h-64 select-all shadow-inner">
              {jsonString}
            </pre>
          </div>

          {/* Modal Footer */}
          <div className="p-5 border-t border-white/10 bg-[#04060a] flex flex-wrap items-center justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#0e121a] hover:bg-[#181d28] border border-white/10 text-[#f7e7c4] cursor-pointer transition-all tracking-wider"
            >
              {copied ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "COPIED" : "COPY JSON"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#121722] hover:bg-[#1d2536] border border-white/20 text-[#f7e7c4] cursor-pointer transition-all tracking-wider"
            >
              <FileJson className="w-4 h-4 text-[#d4af37]" />
              <span>DOWNLOAD JSON</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#d4af37] via-[#f7e7c4] to-[#c99e5d] hover:brightness-110 text-black font-bold tracking-wider cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : pdfSuccess ? (
                <Check className="w-4 h-4 text-black" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingPdf ? "COMPILING PDF..." : pdfSuccess ? "PDF GENERATED!" : "OFFICIAL PDF DOSSIER"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
