"use client";

import React, { useState } from "react";
import { Download, Copy, Check, X, FileJson, ShieldCheck } from "lucide-react";
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
    a.download = `forensic_report_${data.job_id.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="rounded-xl cyber-panel border border-cyan-500/40 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#070b12]">
          <div className="flex items-center gap-2 font-mono">
            <FileJson className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wider">
              EXPORT FORENSIC AUDIT DOSSIER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300">
          <div className="mb-3 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SHA-256 AUDIT STAMP: {data.job_id}</span>
            </div>
            <span className="text-[10px] text-slate-400">{data.timestamp}</span>
          </div>

          <pre className="p-3 bg-black/90 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-80 select-all">
            {jsonString}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#070b12] flex items-center justify-end gap-3 font-mono text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "COPIED TO CLIPBOARD" : "COPY RAW JSON"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD JSON AUDIT
          </button>
        </div>
      </div>
    </div>
  );
}
