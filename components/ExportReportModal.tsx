"use client";

import React, { useState } from "react";
import { Download, Copy, Check, X, FileJson, ShieldCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DetectionResponse } from "@/lib/types";

interface ExportReportModalProps {
  data: DetectionResponse;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportReportModal({ data, isOpen, onClose }: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="obsidian-card rounded-sm border border-[#d4af37]/40 w-full max-w-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] relative"
        >
          <div className="corner-pin-tl" />
          <div className="corner-pin-tr" />
          <div className="corner-pin-bl" />
          <div className="corner-pin-br" />
          <div className="top-glow-gold" />

          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#04060a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#1a140d] border border-[#d4af37]/40 flex items-center justify-center text-[#f7e7c4]">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-cinzel tracking-wider">
                  CRYPTOGRAPHIC FORENSIC AUDIT DOSSIER
                </h3>
                <span className="text-[10px] font-mono tracking-widest text-[#a89f91] uppercase">
                  IMMUTABLE SHA-256 VERIFIED RECORD
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
          <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-[#e8dfd8]">
            <div className="mb-4 p-3.5 rounded-sm bg-[#040609] border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#f7e7c4]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-[11px] tracking-wider truncate max-w-xs sm:max-w-md">
                  STAMP: {data.job_id}
                </span>
              </div>
              <span className="text-[10px] text-[#80776d] shrink-0">{data.timestamp}</span>
            </div>

            <pre className="p-4 bg-[#020305] rounded-sm border border-white/10 text-[11px] font-mono text-[#a0ffcc] overflow-x-auto leading-relaxed max-h-80 select-all shadow-inner">
              {jsonString}
            </pre>
          </div>

          {/* Modal Footer */}
          <div className="p-5 border-t border-white/10 bg-[#04060a] flex items-center justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#0e121a] hover:bg-[#181d28] border border-white/10 text-[#f7e7c4] cursor-pointer transition-all tracking-wider"
            >
              {copied ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "COPIED TO CLIPBOARD" : "COPY RAW JSON"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#d4af37] via-[#f7e7c4] to-[#c99e5d] hover:brightness-110 text-black font-bold tracking-wider cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD JSON AUDIT</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
