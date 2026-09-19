"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, Film, Image as ImageIcon, X, Play, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
}

export default function Dropzone({
  onFileSelected,
  selectedFile,
  onClearFile,
  onStartAnalysis,
  isAnalyzing,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setErrorMsg(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isValidExt = ["mp4", "jpg", "jpeg", "png", "webp"].includes(ext || "");

    if (!isValidExt) {
      setErrorMsg("Unsupported format. Please supply .mp4 video or .jpg, .png, .webp forensic frames.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg("Specimen payload exceeds maximum forensic buffer (100MB).");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    onFileSelected(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const clearCurrent = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMsg(null);
    onClearFile();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isVideo = selectedFile?.type.includes("video") || selectedFile?.name.endsWith(".mp4");

  return (
    <div id="tour-dropzone" className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
        id="forensic-media-input"
        disabled={isAnalyzing}
      />

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3.5 rounded-sm bg-[#1c070c] border border-[#ff0055]/50 text-[#ff8ba7] text-xs font-mono flex items-center gap-2.5 shadow-[0_0_20px_rgba(255,0,85,0.2)]"
          >
            <AlertCircle className="w-4 h-4 text-[#ff0055] shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-sm border p-8 sm:p-14 text-center flex flex-col items-center justify-center radar-sweep-bar tactical-grid transition-all duration-500 ${
            isDragOver
              ? "border-[#d4af37] bg-[#14120e]/85 shadow-[0_0_40px_rgba(212,175,55,0.25)]"
              : "border-[#d4af37]/25 hover:border-[#d4af37]/60 bg-[#06080d]/80 hover:bg-[#0a0e15]/90 shadow-[0_16px_40px_rgba(0,0,0,0.85)]"
          }`}
        >
          {/* Tactical Corner Pins */}
          <div className="corner-pin-tl" />
          <div className="corner-pin-tr" />
          <div className="corner-pin-bl" />
          <div className="corner-pin-br" />

          {/* Top subtle highlight */}
          <div className="top-glow-gold opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Central Holographic Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm bg-gradient-to-br from-[#1b1712] via-[#0b0f17] to-[#04060a] border border-[#d4af37]/40 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-all duration-300">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-[#f7e7c4] group-hover:text-[#d4af37] transition-colors" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#d4af37] animate-ping opacity-75" />
          </div>

          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#d4af37] mb-2">
            INGEST EVIDENCE SPECIMEN
          </span>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wider mb-2 font-cinzel">
            DROP FORENSIC FILE HERE
          </h3>

          <p className="text-xs sm:text-sm text-[#a89f91] max-w-lg mb-6 font-montserrat leading-relaxed">
            Upload candidate video stream (<span className="text-[#f7e7c4]">.mp4</span>) or high-res biometric frames (<span className="text-[#f7e7c4]">.jpg, .png, .webp</span>) for automated PyTorch & XAI inspection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[10px] font-mono tracking-wider">
            <span className="px-3 py-1 rounded-sm bg-[#120f0a] border border-[#d4af37]/30 text-[#f7e7c4]">
              MP4 TELEMETRY
            </span>
            <span className="px-3 py-1 rounded-sm bg-[#06121a] border border-[#00f0ff]/30 text-[#00f0ff]">
              RAW IMAGE MATRIX
            </span>
            <span className="px-3 py-1 rounded-sm bg-[#0a0d14] border border-white/10 text-[#a89f91]">
              MAX BUFFER 100MB
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="obsidian-card rounded-sm p-6 relative"
        >
          {/* Tactical Corner Pins */}
          <div className="corner-pin-tl" />
          <div className="corner-pin-tr" />
          <div className="corner-pin-bl" />
          <div className="corner-pin-br" />
          <div className="top-glow-gold" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#241c14] to-[#0c0f16] border border-[#d4af37]/40 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0">
                {isVideo ? (
                  <Film className="w-6 h-6 text-[#f7e7c4]" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#00f0ff]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-base font-bold text-white font-cinzel truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </h4>
                  <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-sm bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f7e7c4] uppercase">
                    {isVideo ? "TEMPORAL STREAM" : "STATIC EVIDENCE"}
                  </span>
                </div>
                <p className="text-xs text-[#a89f91] font-mono mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || "octet-stream"} • READY FOR INFERENCE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={clearCurrent}
                className="p-2.5 rounded-sm bg-[#12070a] hover:bg-[#260c14] border border-[#ff0055]/30 hover:border-[#ff0055]/70 text-[#ff8ba7] transition-all cursor-pointer disabled:opacity-40"
                title="Discard specimen"
              >
                <X className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={onStartAnalysis}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-gradient-to-r from-[#d4af37] via-[#f7e7c4] to-[#c99e5d] hover:brightness-110 text-black font-bold font-mono text-xs tracking-widest uppercase shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>EXECUTE FORENSIC PIPELINE</span>
              </button>
            </div>
          </div>

          {/* Quick Preview Area */}
          {previewUrl && (
            <div className="mt-5 flex justify-center bg-[#020306] rounded-sm p-3 border border-white/5 max-h-72 overflow-hidden relative group">
              {isVideo ? (
                <video
                  src={previewUrl}
                  controls
                  className="max-h-64 rounded-sm object-contain"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Evidence Preview"
                  className="max-h-64 rounded-sm object-contain"
                />
              )}
              <div className="absolute bottom-4 left-5 flex items-center gap-2 text-[10px] font-mono px-2.5 py-1 rounded-sm bg-black/85 border border-[#d4af37]/40 text-[#f7e7c4] tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                <span>INGESTION HASH VERIFIED</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
