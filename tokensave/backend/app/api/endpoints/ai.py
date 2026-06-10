import time
from fastapi import APIRouter, HTTPException, Depends, status
from app.models.schemas import (
    AISummaryRequest, AISummaryResponse,
    AIBrdRequest, AIBrdResponse,
    AIUserStoryRequest, AIUserStoryResponse
)
from app.services.ai_service import get_ai_service, BaseAIService
from app.services.token_service import token_service

router = APIRouter()

@router.post("/ai/summarize", response_model=AISummaryResponse)
async def summarize(
    payload: AISummaryRequest,
    ai_service: BaseAIService = Depends(get_ai_service)
) -> AISummaryResponse:
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source text cannot be empty."
        )
        
    start_time = time.perf_counter()
    summary = await ai_service.summarize_text(
        text=payload.text,
        style=payload.style,
        length=payload.length
    )
    end_time = time.perf_counter()
    
    # Estimate tokens in summary
    summary_tokens = token_service.estimate_tokens(summary, "gpt")
    
    return AISummaryResponse(
        summary=summary,
        estimated_tokens=summary_tokens,
        processing_time_sec=round(end_time - start_time, 4)
    )


@router.post("/ai/analyze-brd", response_model=AIBrdResponse)
async def analyze_brd(
    payload: AIBrdRequest,
    ai_service: BaseAIService = Depends(get_ai_service)
) -> AIBrdResponse:
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source text cannot be empty."
        )
        
    start_time = time.perf_counter()
    results = await ai_service.analyze_brd(text=payload.text)
    end_time = time.perf_counter()
    
    return AIBrdResponse(
        requirements=results["requirements"],
        summary=results["summary"],
        processing_time_sec=round(end_time - start_time, 4)
    )


@router.post("/ai/generate-stories", response_model=AIUserStoryResponse)
async def generate_stories(
    payload: AIUserStoryRequest,
    ai_service: BaseAIService = Depends(get_ai_service)
) -> AIUserStoryResponse:
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source text cannot be empty."
        )
        
    start_time = time.perf_counter()
    stories = await ai_service.generate_user_stories(text=payload.text)
    end_time = time.perf_counter()
    
    return AIUserStoryResponse(
        user_stories=stories,
        processing_time_sec=round(end_time - start_time, 4)
    )
