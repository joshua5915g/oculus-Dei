"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, Film, Image as ImageIcon, FileCheck, X, Play, AlertCircle } from "lucide-react";

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

  const allowedTypes = [
    "video/mp4",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const handleFileProcess = (file: File) => {
    setErrorMsg(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isValidExt = ["mp4", "jpg", "jpeg", "png", "webp"].includes(ext || "");

    if (!isValidExt) {
      setErrorMsg("Unsupported format. Please upload .mp4, .jpg, or .png media.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg("File exceeds 100MB limit.");
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
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
        id="forensic-media-input"
        disabled={isAnalyzing}
      />

      {errorMsg && (
        <div className="mb-3 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-xl border-2 border-dashed transition-all p-8 sm:p-12 text-center flex flex-col items-center justify-center radar-sweep cyber-grid ${
            isDragOver
              ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(0,240,255,0.2)]"
              : "border-slate-800 hover:border-cyan-500/50 bg-[#0a0f1d]/60 hover:bg-[#0c1426]/70"
          }`}
        >
          {/* Cyber Corner Decals */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

          <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h3 className="text-lg font-semibold text-white tracking-wide mb-1 font-mono">
            DROP FORENSIC EVIDENCE HERE
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-4 font-mono">
            Drag and drop suspect video (.mp4) or image (.jpg, .png) or browse local filesystem
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 text-cyan-300">
              MP4 VIDEO
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 text-cyan-300">
              JPG / PNG / WEBP
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 text-slate-400">
              MAX 100MB
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl cyber-panel p-5 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-400">
                {isVideo ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white font-mono truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 uppercase">
                    {isVideo ? "Video Stream" : "Static Image"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || "binary media"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                disabled={isAnalyzing}
                onClick={clearCurrent}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/50 hover:text-red-400 hover:border-red-500/40 border border-slate-700 text-slate-400 transition-all cursor-pointer disabled:opacity-50"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                disabled={isAnalyzing}
                onClick={onStartAnalysis}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                EXECUTE FORENSIC PIPELINE
              </button>
            </div>
          </div>

          {/* Quick Preview Thumbnail */}
          {previewUrl && (
            <div className="mt-4 flex justify-center bg-black/50 rounded-lg p-2 border border-slate-800/60 max-h-64 overflow-hidden relative group">
              {isVideo ? (
                <video
                  src={previewUrl}
                  controls
                  className="max-h-60 rounded object-contain"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Evidence Preview"
                  className="max-h-60 rounded object-contain"
                />
              )}
              <div className="absolute bottom-3 left-4 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 border border-cyan-500/40 text-cyan-300">
                RAW UNALTERED INPUT
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
