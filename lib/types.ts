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
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
  version: string;
}
