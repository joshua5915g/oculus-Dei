import os
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.core.config import settings
from app.models.schemas import DetectionResponse, HealthResponse
from app.services.detector import detector

router = APIRouter(prefix="", tags=["Detection & Forensic Analysis"])

@router.get("/health", response_model=HealthResponse)
async def get_health():
    return HealthResponse(
        status="operational",
        model_loaded=True,
        device=detector.device,
        version=settings.VERSION
    )

@router.post("/detect", response_model=DetectionResponse)
async def detect_media(file: UploadFile = File(...)):
    # Validate filename and extension
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename must be provided"
        )
    
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Read bytes and validate file size
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read upload stream: {str(e)}"
        )
    
    if len(contents) > settings.MAX_FILE_SIZE_BYTES:
        max_mb = settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum permissible payload size of {max_mb} MB"
        )
    
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded media file is empty (0 bytes)"
        )

    content_type = file.content_type or ("video/mp4" if ext == ".mp4" else "image/jpeg")

    try:
        response = await detector.analyze_media(
            file_bytes=contents,
            filename=file.filename,
            content_type=content_type
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Forensic detection pipeline failed during inference: {str(e)}"
        )
