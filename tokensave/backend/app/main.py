from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import upload, ai

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Convert documents into AI-ready text while saving tokens, with extensible AI endpoints.",
    version=settings.VERSION,
)

# Dynamically wire CORS Origins
origins = settings.get_allowed_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main health endpoint
@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }

# Root guide route
@app.get("/")
def root() -> dict:
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "upload": "POST /upload (multipart/form-data)",
            "ai_summarize": "POST /ai/summarize",
            "ai_brd_analysis": "POST /ai/analyze-brd",
            "ai_user_stories": "POST /ai/generate-stories"
        }
    }

# Include endpoints at root level for clean path mapping
app.include_router(upload.router)
app.include_router(ai.router)
