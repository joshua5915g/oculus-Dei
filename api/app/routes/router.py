from fastapi import APIRouter
from app.routes.detection import router as detection_router

api_router = APIRouter()
api_router.include_router(detection_router, prefix="")
