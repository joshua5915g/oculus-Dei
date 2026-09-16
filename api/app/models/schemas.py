from pydantic import BaseModel, Field
from typing import List, Optional

class ArtifactAnnotation(BaseModel):
    type: str = Field(..., description="Classification category of the detected forensic artifact")
    description: str = Field(..., description="Explanation of spatial/frequency anomaly")
    severity: str = Field(..., description="Severity level: LOW, MEDIUM, HIGH, CRITICAL")
    bbox: Optional[List[int]] = Field(None, description="Bounding box [x1, y1, x2, y2] relative to frame")

class XAIOutput(BaseModel):
    original_frame_base64: str = Field(..., description="Data URI base64 of the analyzed original frame/image")
    heatmap_base64: str = Field(..., description="Data URI base64 of the standalone Grad-CAM pseudo-color heatmap")
    composite_overlay_base64: str = Field(..., description="Data URI base64 of the blended Grad-CAM overlay")
    detected_artifacts: List[ArtifactAnnotation] = Field(default_factory=list, description="List of localized forensic anomalies")

class ForensicBreakdown(BaseModel):
    facial_inconsistency_score: float = Field(..., ge=0.0, le=1.0)
    frequency_spectrum_anomaly: float = Field(..., ge=0.0, le=1.0)
    gaze_reflection_asymmetry: float = Field(..., ge=0.0, le=1.0)
    compression_fingerprint_mismatch: float = Field(..., ge=0.0, le=1.0)

class AudioVisualSyncTimelinePoint(BaseModel):
    timestamp_sec: float
    audio_energy: float = Field(..., ge=0.0, le=1.0)
    lip_motion_energy: float = Field(..., ge=0.0, le=1.0)
    anomaly: bool

class AudioVisualSyncAnalysis(BaseModel):
    status: str = Field(..., description="IN_SYNC | DESYNCHRONIZED | NO_AUDIO_TRACK")
    sync_confidence: float = Field(..., ge=0.0, le=1.0)
    temporal_offset_ms: float = Field(..., description="Temporal lag/lead between speech and lip movements")
    phoneme_viseme_discrepancy: float = Field(..., ge=0.0, le=1.0)
    summary: str
    timeline: List[AudioVisualSyncTimelinePoint] = Field(default_factory=list)

class Dimensions(BaseModel):
    width: int
    height: int

class DetectionResponse(BaseModel):
    job_id: str
    filename: str
    media_type: str = Field(..., description="'image' or 'video'")
    file_size_bytes: int
    dimensions: Dimensions
    duration_seconds: Optional[float] = None
    verdict: str = Field(..., description="'SYNTHETIC' or 'AUTHENTIC'")
    prediction_label: str
    fake_probability: float = Field(..., ge=0.0, le=1.0)
    real_probability: float = Field(..., ge=0.0, le=1.0)
    risk_level: str = Field(..., description="'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'MINIMAL'")
    processing_time_ms: float
    timestamp: str
    xai: XAIOutput
    forensic_breakdown: ForensicBreakdown
    audio_visual_sync: AudioVisualSyncAnalysis

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str
    version: str
