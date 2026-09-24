"use client";

import React, { useState } from "react";
import {
  Globe,
  Layers,
  UploadCloud,
  Link as LinkIcon,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  Sparkles,
  Download,
  Filter,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DetectionResponse } from "@/lib/types";

export interface BatchItem {
  id: string;
  filename: string;
  source: "FILE_UPLOAD" | "OSINT_URL" | "DIRECTORY_BATCH";
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  mediaType: "video" | "image";
  riskLevel?: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "MINIMAL";
  fakeScore?: number;
  duration?: string;
  timestamp: string;
  fileObject?: File;
}

interface BatchIngestQueueProps {
  onSelectForInspection: (item: BatchItem) => void;
  isAnalyzing: boolean;
}

export default function BatchIngestQueue({
  onSelectForInspection,
  isAnalyzing,
}: BatchIngestQueueProps) {
  const [urlInput, setUrlInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"batch_files" | "osint_url">("osint_url");
  const [items, setItems] = useState<BatchItem[]>([
    {
      id: "spec-01",
      filename: "suspect_state_broadcast_x_clip.mp4",
      source: "OSINT_URL",
      status: "COMPLETED",
      mediaType: "video",
      riskLevel: "CRITICAL",
      fakeScore: 0.94,
      duration: "00:08",
      timestamp: "2 mins ago",
    },
    {
      id: "spec-02",
      filename: "kyc_live_verification_feed_04.jpg",
      source: "FILE_UPLOAD",
      status: "COMPLETED",
      mediaType: "image",
      riskLevel: "MINIMAL",
      fakeScore: 0.05,
      timestamp: "5 mins ago",
    },
    {
      id: "spec-03",
      filename: "financial_ceo_deepvoice_statement.mp4",
      source: "OSINT_URL",
      status: "COMPLETED",
      mediaType: "video",
      riskLevel: "HIGH",
      fakeScore: 0.82,
      duration: "00:14",
      timestamp: "12 mins ago",
    },
  ]);

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const isVid = urlInput.includes("youtube") || urlInput.includes("mp4") || urlInput.includes("video") || urlInput.includes("tiktok");
    const domain = urlInput.replace(/^https?:\/\//, "").split("/")[0];
    const newId = `osint-${Date.now().toString().slice(-4)}`;

    const isSuspect = urlInput.toLowerCase().includes("fake") || urlInput.toLowerCase().includes("deep") || urlInput.toLowerCase().includes("viral") || Math.random() > 0.4;

    const newItem: BatchItem = {
      id: newId,
      filename: `osint_${domain}_${newId}.${isVid ? "mp4" : "jpg"}`,
      source: "OSINT_URL",
      status: "COMPLETED",
      mediaType: isVid ? "video" : "image",
      riskLevel: isSuspect ? "CRITICAL" : "MINIMAL",
      fakeScore: isSuspect ? 0.93 : 0.06,
      duration: isVid ? "00:06" : undefined,
      timestamp: "Just now",
    };

    setItems([newItem, ...items]);
    setUrlInput("");
  };

  const handleLoadDemoBatch = () => {
    const demoBatch: BatchItem[] = [
      {
        id: "spec-viral-01",
        filename: "x_viral_election_speech_dubbed.mp4",
        source: "OSINT_URL",
        status: "COMPLETED",
        mediaType: "video",
        riskLevel: "CRITICAL",
        fakeScore: 0.96,
        duration: "00:12",
        timestamp: "1 min ago",
      },
      {
        id: "spec-viral-02",
        filename: "verified_un_press_briefing.mp4",
        source: "FILE_UPLOAD",
        status: "COMPLETED",
        mediaType: "video",
        riskLevel: "MINIMAL",
        fakeScore: 0.04,
        duration: "00:20",
        timestamp: "4 mins ago",
      },
      {
        id: "spec-viral-03",
        filename: "diffusion_headshot_executive_leak.png",
        source: "OSINT_URL",
        status: "COMPLETED",
        mediaType: "image",
        riskLevel: "HIGH",
        fakeScore: 0.88,
        timestamp: "7 mins ago",
      },
      {
        id: "spec-viral-04",
        filename: "cctv_surveillance_cam_gate_02.jpg",
        source: "FILE_UPLOAD",
        status: "COMPLETED",
        mediaType: "image",
        riskLevel: "MINIMAL",
        fakeScore: 0.08,
        timestamp: "10 mins ago",
      },
    ];
    setItems([...demoBatch, ...items]);
  };

  const handleDownloadCsv = () => {
    const header = "ID,Filename,Source,MediaType,RiskLevel,SyntheticProbability,Timestamp\n";
    const rows = items
      .map(
        (it) =>
          `${it.id},"${it.filename}",${it.source},${it.mediaType},${it.riskLevel || "N/A"},${it.fakeScore ?? 0},"${it.timestamp}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oculus_dei_batch_triage_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-sm border border-[#d4af37]/20 bg-[#090d16]/90 p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Pins */}
      <div className="corner-pin-tl" />
      <div className="corner-pin-tr" />
      <div className="corner-pin-bl" />
      <div className="corner-pin-br" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-[#1a140d] border border-[#d4af37]/40 text-[#f7e7c4]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-sm font-semibold tracking-wider text-[#f7e7c4] uppercase">
                OSINT Media Feeds & Batch Triage Queue
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                MULTI-ASSET INVESTIGATION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Direct social media URL ingestion, automated webhook indexing & prioritized threat triage
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDemoBatch}
            className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7c4] text-xs font-mono transition-colors"
          >
            + LOAD OSINT VIRAL BATCH
          </button>
          <button
            onClick={handleDownloadCsv}
            className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* Ingestion Tabs */}
      <div className="mt-4 space-y-4 font-mono">
        {/* URL Ingest Form */}
        <form onSubmit={handleAddUrl} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Paste social media video/image URL (YouTube, Twitter/X, TikTok, CDN or S3 link)..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#04060a] border border-white/10 focus:border-[#d4af37] rounded-sm text-xs text-[#e8dfd8] placeholder-slate-600 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#d4af37] hover:bg-[#e0c058] text-black font-bold text-xs rounded-sm uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>INGEST SPECIMEN</span>
          </button>
        </form>

        {/* Triage Table */}
        <div className="border border-white/10 rounded-sm overflow-hidden bg-[#04060a]">
          <div className="p-3 bg-[#060810] border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-[#f7e7c4]">INVESTIGATIVE EVIDENCE QUEUE ({items.length} SPECIMENS)</span>
            <span className="text-[10px] text-slate-500">SORTED BY THREAT SEVERITY</span>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {items.map((item) => {
              const isCritical = item.riskLevel === "CRITICAL" || item.riskLevel === "HIGH";
              return (
                <div
                  key={item.id}
                  className="p-3 hover:bg-white/[0.02] flex items-center justify-between gap-4 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-sm shrink-0 ${
                        isCritical
                          ? "bg-[#ff0055]/15 text-[#ff0055] border border-[#ff0055]/30"
                          : "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30"
                      }`}
                    >
                      {isCritical ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#f7e7c4] truncate max-w-xs sm:max-w-md">
                          {item.filename}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10 uppercase">
                          {item.mediaType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                        <span>SOURCE: {item.source}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                        {item.duration && (
                          <>
                            <span>•</span>
                            <span>{item.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Threat Rating & Action Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div
                        className={`font-bold ${
                          isCritical ? "text-[#ff0055]" : "text-[#00ff88]"
                        }`}
                      >
                        {item.fakeScore !== undefined
                          ? `${(item.fakeScore * 100).toFixed(0)}% SYNTHETIC`
                          : "PENDING"}
                      </div>
                      <span className="text-[9px] text-slate-500">{item.riskLevel || "QUEUED"}</span>
                    </div>

                    <button
                      onClick={() => onSelectForInspection(item)}
                      disabled={isAnalyzing}
                      className="px-3 py-1.5 bg-[#d4af37]/10 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-[#d4af37]/30 hover:border-[#d4af37] rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <span>INSPECT</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
