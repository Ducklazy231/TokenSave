from fastapi import APIRouter
from app.api.endpoints import upload, ai

api_router = APIRouter()

# Register endpoints
api_router.include_router(upload.router, tags=["document-conversion"])
api_router.include_router(ai.router, tags=["ai-integrations"])
