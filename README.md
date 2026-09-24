# Oculus Dei — Deepfake & Synthetic Media Forensic Hub

A Defense-grade Deepfake and Synthetic Media Detection platform built with **Next.js 15**, **React 19**, **Tailwind CSS**, **Recharts**, and a **FastAPI** backend with multi-spectral neural inference, **OpenCV** Explainable AI (XAI) Grad-CAM visualizer, **rPPG** biological pulse detection, **Error Level Analysis (ELA)**, **C2PA Provenance Verification**, **Multi-Frame Temporal Scrubber**, **Dual-Evidence Comparative Lab**, and **Real-Time Live Stream Interceptor**.

---

## ⚡ Defense-Grade Forensic Capabilities

1. **Remote Photoplethysmography (rPPG) Biological Pulse & BVP Telemetry:**
   - Detects micro-capillary hemoglobin absorption fluctuations in facial skin tissue.
   - Extracts real-time Blood Volume Pulse (BVP) waveforms, Pulse Consistency Index (PCI), Signal-to-Noise Ratio (SNR), and 4-quadrant spatial facial perfusion coherence (Forehead, Left Malar, Right Malar, Perioral).

2. **Error Level Analysis (ELA) & Cryptographic C2PA Provenance:**
   - Multiplier-boosted JPEG quantization error analysis (10x-60x) exposing localized compression seam discrepancies.
   - Silicon sensor PRNU photon noise verification and C2PA / JUMBF / Google SynthID cryptographic manifest inspector.

3. **Multi-Frame Video Temporal Consistency Scrubber:**
   - Multi-track timeline indexing facial boundary jitter, warp flickering, and inter-frame optical flow discontinuities.
   - Interactive filmstrip keyframe carousel with instant "Jump to Peak Spike" anomaly navigation.

4. **Dual-Evidence Comparative Forensic Lab:**
   - Side-by-side comparison of confirmed authentic biometric standards against suspect media.
   - Synchronized curtain wipe slider, differential subtraction heatmaps ($|\Delta \text{Frame}|$), and Structural Similarity (SSIM) distance metrics.

5. **Real-Time Live Stream & Webcam Interceptor (Live Shield):**
   - Zero-latency 30 FPS video canvas tracking with simulated virtual camera injection and autoencoder boundary seam detection.
   - Acoustic spectral voice clone / TTS interceptor alerting on synthetic phase continuity and robotic artifacts (Bark/ElevenLabs).

6. **OSINT Feeds & Batch Evidence Triage Queue:**
   - Multi-file dropzone & direct social media URL ingestion (Twitter/X, YouTube, TikTok, CDN/S3).
   - Automated risk prioritization queue with one-click forensic specimen inspection and CSV audit export.

7. **Explainable AI (XAI) Grad-CAM & 2D FFT Spectrogram Visualizer:**
   - Interactive Split Comparison Slider comparing raw unaltered evidence against neural Grad-CAM overlays.
   - 2D FFT power density spectrum analyzer detecting periodic high-frequency checkerboard anomalies.

8. **Cross-Modal Audio-Visual Synchronization Analysis:**
   - Dual-area time-series chart correlating acoustic speech energy with facial labial viseme displacement.
   - Identifies phase lag, desynchronization windows, and phoneme-viseme discrepancy indices.

9. **Court-Ready PDF Dossier Export & Audit Stamps:**
   - Generate official forensic dossiers formatted with cryptographic SHA-256 seals, ISO/IEC 27037 standards, optical/acoustic telemetry matrices, and examiner sign-off certification.

---

## 🏛️ Architecture Overview

```
oculus-Dei/
├── api/                               # FastAPI ML Backend
│   ├── app/
│   │   ├── core/config.py             # Settings, CORS, payload limits
│   │   ├── models/schemas.py          # Pydantic v2 schemas (rPPG, ELA, Temporal, C2PA)
│   │   ├── services/
│   │   │   ├── detector.py            # MultiSpectralForensicDetector pipeline
│   │   │   ├── rppg_analyzer.py       # Biological rPPG cardiac pulse & BVP extractor
│   │   │   ├── ela_inspector.py       # Error Level Analysis & C2PA manifest scanner
│   │   │   ├── temporal_analyzer.py   # Multi-frame video temporal consistency engine
│   │   │   └── xai_visualizer.py      # Grad-CAM heatmap generation & 2D FFT spectrogram
│   │   ├── routes/detection.py        # POST /detect, GET /health
│   │   └── main.py                    # FastAPI application instance & CORS
│   ├── requirements.txt
│   └── run.py                         # Uvicorn launcher script
│
└── components/                        # Next.js 15 App Router Frontend
    ├── Header.tsx                     # HUD telemetry bar & mode launchers
    ├── Dropzone.tsx                   # Drag-and-drop zone with animated radar sweep
    ├── BatchIngestQueue.tsx           # Multi-file triage & direct OSINT URL ingestion
    ├── ComparativeLabModal.tsx        # Dual-evidence comparative forensic lab
    ├── LiveDeepfakeShield.tsx         # Real-time webcam & voice clone interceptor
    ├── RPPGVisualizer.tsx             # Biological rPPG pulse & BVP oscilloscope
    ├── ELAInspector.tsx               # Error Level Analysis & C2PA manifest inspector
    ├── TemporalScrubber.tsx           # Multi-frame video temporal scrubber
    ├── XAIViewer.tsx                  # Grad-CAM heatmap blend/opacity & FFT viewer
    ├── AudioVisualSyncChart.tsx       # Recharts area chart for speech vs lip sync
    ├── ForensicMetricsGrid.tsx        # Anomaly breakdown cards
    ├── ForensicScoreGauge.tsx         # Radial verdict gauge and confidence breakdown
    └── ExportReportModal.tsx          # Cryptographic JSON & PDF dossier exporter
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

### 2. Start Frontend
```bash
npm install
npm run dev -- --port 3000
```
* Web UI runs at: `http://localhost:3000`
