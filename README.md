# Oculus Dei — Deepfake & Synthetic Media Forensic Hub

A Defense-grade Deepfake and Synthetic Media Detection platform built with **Next.js 15**, **React 19**, **Tailwind CSS**, **Recharts**, and a **FastAPI** backend with simulated **PyTorch** inference and **OpenCV** Explainable AI (XAI) Grad-CAM visualizer.

---

## ⚡ Key Capabilities

1. **Multi-Modal Evidence Ingestion:**
   - Drag-and-drop support for `.mp4`, `.jpg`, `.jpeg`, `.png`, and `.webp` with size validation (up to 100MB) and instant preview.
   - Built-in one-click synthetic deepfake and authentic reference samples for instantaneous testing.

2. **Explainable AI (XAI) Grad-CAM & 2D FFT Spectrogram Visualizer:**
   - **Interactive Split Comparison Slider**: Smooth curtain wipe slider allowing forensic analysts to compare raw unaltered evidence against neural Grad-CAM overlays in real time.
   - **2D FFT Frequency Power Spectrogram**: Fast Fourier Transform power density spectrum analyzer detecting periodic high-frequency checkerboard anomalies characteristic of GANs and diffusion upsampling.
   - Real-time interactive opacity slider (0% to 100% blend), standalone heatmaps, and raw frame inspection modes.
   - Interactive bounding box annotations and severity markers for facial warping, corneal specularity mismatch, and GAN frequency artifacts.

3. **Cross-Modal Audio-Visual Synchronization Analysis:**
   - Dual-area time-series chart (powered by Recharts) correlating acoustic speech energy with facial labial viseme displacement.
   - Highlights desynchronization windows, temporal phase lag (e.g., -142.5ms), and phoneme-viseme discrepancy indices.

4. **Forensic Telemetry & Auditing:**
   - 4-quadrant granular breakdown: Facial Boundary Warping, 2D FFT Frequency Checkerboard, Corneal Specular Disparity, and Compression Discontinuities.
   - **Court-Ready PDF Dossier Export**: Generate official, court-admissible forensic intelligence dossiers formatted with cryptographic SHA-256 seals, ISO/IEC 27037 digital evidence standards, optical/acoustic telemetry matrices, embedded keyframe thumbnails, and examiner sign-off certification.
   - Exportable machine-readable JSON forensic audit record with SHA-256 audit stamps.

---

## 🏛️ Architecture Overview

```
oculus-Dei/
├── api/                               # FastAPI ML Backend
│   ├── app/
│   │   ├── core/config.py             # Settings, CORS, payload limits
│   │   ├── models/schemas.py          # Pydantic v2 schemas
│   │   ├── services/
│   │   │   ├── detector.py            # MockDeepfakeDetector (PyTorch & OpenCV pipeline)
│   │   │   └── xai_visualizer.py      # Grad-CAM heatmap generation & colormapping
│   │   ├── routes/detection.py        # POST /detect, GET /health
│   │   └── main.py                    # FastAPI application instance & CORS
│   ├── requirements.txt
│   └── run.py                         # Uvicorn launcher script
│
└── web/                               # Next.js 15 App Router Frontend
    ├── app/
    │   ├── globals.css                # Dark cybersecurity theme, HUD grid, glow tokens
    │   ├── layout.tsx                 # Root layout & typography
    │   └── page.tsx                   # Main Forensic Lab Workstation
    ├── components/
    │   ├── Header.tsx                 # HUD telemetry bar & live model status
    │   ├── Dropzone.tsx               # Drag-and-drop zone with animated radar sweep
    │   ├── AnalysisProgress.tsx       # 4-stage forensic inference progress indicator
    │   ├── ForensicScoreGauge.tsx     # Radial verdict gauge and confidence breakdown
    │   ├── XAIViewer.tsx              # Grad-CAM heatmap blend/opacity slider
    │   ├── AudioVisualSyncChart.tsx   # Recharts area chart for speech vs lip sync
    │   ├── ForensicMetricsGrid.tsx    # Anomaly breakdown cards
    │   └── ExportReportModal.tsx      # Cryptographic JSON audit exporter
    └── lib/
        ├── api.ts                     # Typed API client
        └── types.ts                   # TypeScript interfaces matching backend
```

---

## 🚀 Running Locally

### 1. Start Backend (`/api`)
```bash
cd api
python -m pip install -r requirements.txt
python run.py
```
* Backend runs at: `http://localhost:8000`
* Interactive OpenAPI Docs: `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/api/v1/health`

### 2. Start Frontend (`/web`)
```bash
cd web
npm install
npm run dev -- --port 3000
```
* Web UI runs at: `http://localhost:3000` (or `http://localhost:3001` if 3000 is occupied)

---

## 📋 API Contract

### `POST /api/v1/detect`
* **Content-Type:** `multipart/form-data`
* **Form Field:** `file` (`.mp4`, `.jpg`, `.png`)
* **Response Schema:**
```json
{
  "job_id": "uuid-string",
  "filename": "suspect_interview.mp4",
  "media_type": "video",
  "file_size_bytes": 14285810,
  "dimensions": { "width": 1920, "height": 1080 },
  "duration_seconds": 6.4,
  "verdict": "SYNTHETIC",
  "prediction_label": "Deepfake Detected (High Confidence)",
  "fake_probability": 0.942,
  "real_probability": 0.058,
  "risk_level": "CRITICAL",
  "processing_time_ms": 2180.4,
  "timestamp": "2026-09-15T14:23:45.120Z",
  "xai": {
    "original_frame_base64": "data:image/jpeg;base64,...",
    "heatmap_base64": "data:image/png;base64,...",
    "composite_overlay_base64": "data:image/png;base64,...",
    "detected_artifacts": [...]
  },
  "forensic_breakdown": {
    "facial_inconsistency_score": 0.91,
    "frequency_spectrum_anomaly": 0.88,
    "gaze_reflection_asymmetry": 0.74,
    "compression_fingerprint_mismatch": 0.65
  },
  "audio_visual_sync": {
    "status": "DESYNCHRONIZED",
    "sync_confidence": 0.89,
    "temporal_offset_ms": -145.0,
    "phoneme_viseme_discrepancy": 0.82,
    "summary": "Audio track leads facial lip motion by 145ms...",
    "timeline": [...]
  }
}
```
