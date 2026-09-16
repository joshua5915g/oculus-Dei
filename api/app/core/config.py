from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Oculus Dei - Forensic Synthetic Media Detection Hub"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:8000"
    ]
    
    # Media Validation
    MAX_FILE_SIZE_BYTES: int = 100 * 1024 * 1024  # 100 MB
    ALLOWED_EXTENSIONS: set = {".mp4", ".jpg", ".jpeg", ".png", ".webp"}
    ALLOWED_MIME_TYPES: set = {
        "video/mp4",
        "image/jpeg",
        "image/png",
        "image/webp"
    }

settings = Settings()
