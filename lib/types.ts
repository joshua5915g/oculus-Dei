export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ArtifactAnnotation {
  type: string;
  description: string;
  severity: SeverityLevel;
  bbox: [number, number, number, number] | null;
}

export interface XAIOutput {
  original_frame_base64: string;
  heatmap_base64: string;
  composite_overlay_base64: string;
  fft_spectrogram_base64?: string;
  detected_artifacts: ArtifactAnnotation[];
}

export interface ForensicBreakdown {
  facial_inconsistency_score: number;
  frequency_spectrum_anomaly: number;
  gaze_reflection_asymmetry: number;
  compression_fingerprint_mismatch: number;
}

export interface AudioVisualSyncTimelinePoint {
  timestamp_sec: number;
  audio_energy: number;
  lip_motion_energy: number;
  anomaly: boolean;
}

export interface AudioVisualSyncAnalysis {
  status: "IN_SYNC" | "DESYNCHRONIZED" | "NO_AUDIO_TRACK";
  sync_confidence: number;
  temporal_offset_ms: number;
  phoneme_viseme_discrepancy: number;
  summary: string;
  timeline: AudioVisualSyncTimelinePoint[];
}

export interface MediaDimensions {
  width: number;
  height: number;
}

export type Dimensions = MediaDimensions;

// -------------------------------------------------------------
// 1. Biological rPPG Cardiac & Blood Volume Pulse (BVP) Forensics
// -------------------------------------------------------------
export interface BVPWaveformPoint {
  time_sec: number;
  bvp_amplitude: number; // Normalized pulse amplitude
  synthetic_noise: number;
  systolic_peak: boolean;
}

export interface SpatialPerfusionRegion {
  name: "Forehead" | "Left Cheek (Malar)" | "Right Cheek (Malar)" | "Nasal/Perioral";
  perfusion_score: number; // 0.0 - 1.0 (biological micro-circulation coherence)
  snr_db: number;
  status: "NOMINAL" | "CHAOTIC_VOID" | "DESYNCHRONIZED";
}

export interface RPPGAnalysis {
  status: "BIOMETRIC_PULSE_DETECTED" | "BIOLOGICAL_PULSE_ABSENT" | "CHAOTIC_SIGNAL";
  heart_rate_bpm: number;
  pulse_consistency_index: number; // 0.0 - 1.0
  biological_liveliness_score: number; // 0.0 - 1.0
  snr_db: number;
  summary: string;
  bvp_waveform: BVPWaveformPoint[];
  spatial_perfusion: SpatialPerfusionRegion[];
}

// -------------------------------------------------------------
// 2. Error Level Analysis (ELA) & Provenance / C2PA Forensics
// -------------------------------------------------------------
export interface C2PAManifest {
  has_c2pa: boolean;
  signer?: string;
  claim_generator?: string;
  signature_valid: boolean;
  ai_generation_flag: boolean;
  generation_tool?: string;
  tamper_evident_status: "VERIFIED_AUTHENTIC" | "AI_GENERATED_DISCLOSED" | "MODIFIED_UNTRUSTED" | "NO_MANIFEST";
  provenance_tags: string[];
}

export interface ELAForensicOutput {
  ela_image_base64: string; // Enhanced JPEG compression error delta
  compression_discrepancy_score: number; // 0.0 - 1.0
  grid_blockiness_index: number;
  prnu_sensor_snr: number;
  icc_profile_tampered: boolean;
  quantization_table_anomalous: boolean;
  c2pa_manifest: C2PAManifest;
  summary: string;
}

// -------------------------------------------------------------
// 3. Multi-Frame Temporal Video Consistency & Keyframe Scrubber
// -------------------------------------------------------------
export interface TemporalFrameAnomaly {
  frame_index: number;
  timestamp_sec: number;
  anomaly_score: number; // 0.0 - 1.0
  face_boundary_jitter: number;
  optical_flow_discontinuity: number;
  flagged_artifact?: string;
  is_spike: boolean;
  thumbnail_base64?: string;
}

export interface TemporalAnalysisReport {
  total_frames_analyzed: number;
  fps: number;
  jitter_variance: number;
  peak_anomaly_frame: number;
  temporal_stability_index: number; // 0.0 - 1.0
  frames: TemporalFrameAnomaly[];
}

// -------------------------------------------------------------
// 4. Dual Evidence Comparative Forensic Results
// -------------------------------------------------------------
export interface ComparativeForensicResult {
  reference_name: string;
  suspect_name: string;
  structural_similarity_ssim: number; // -1.0 to 1.0
  cosine_feature_similarity: number; // 0.0 to 1.0
  landmark_displacement_px: number;
  delta_heatmap_base64: string;
  verdict: "IDENTITY_MISMATCH" | "SYNTHETIC_REPLACEMENT" | "AUTHENTIC_MATCH";
  risk_score: number;
  summary: string;
}

// -------------------------------------------------------------
// Comprehensive Detection Response
// -------------------------------------------------------------
export interface DetectionResponse {
  job_id: string;
  filename: string;
  media_type: "image" | "video";
  file_size_bytes: number;
  dimensions: MediaDimensions;
  duration_seconds: number | null;
  verdict: "SYNTHETIC" | "AUTHENTIC" | "SUSPICIOUS";
  prediction_label: string;
  fake_probability: number;
  real_probability: number;
  risk_level: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "MINIMAL";
  processing_time_ms: number;
  timestamp: string;
  xai: XAIOutput;
  forensic_breakdown: ForensicBreakdown;
  audio_visual_sync: AudioVisualSyncAnalysis;
  rppg?: RPPGAnalysis;
  ela?: ELAForensicOutput;
  temporal?: TemporalAnalysisReport;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
  version: string;
}
