import time
from typing import Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Header, status
from app.models.schemas import UploadResponse
from app.core.config import settings
from app.core.security import (
    validate_file_metadata,
    validate_file_content,
    sanitize_text,
    verify_turnstile_token,
)
from app.services.document_service import document_service
from app.services.token_service import token_service

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    x_turnstile_token: Optional[str] = Header(None)
) -> UploadResponse:
    # 0. Bot Protection Validation
    if not verify_turnstile_token(x_turnstile_token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security verification failed. Please complete the CAPTCHA."
        )

    filename = file.filename or "document"
    
    # 1. Stream file in chunks to validate size mid-transfer (Denial of Service Guard)
    chunks = []
    total_bytes = 0
    max_bytes = settings.MAX_FILE_SIZE_BYTES
    
    try:
        while True:
            # Read in 64KB blocks
            chunk = await file.read(1024 * 64)
            if not chunk:
                break
            total_bytes += len(chunk)
            if total_bytes > max_bytes:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds maximum allowed size of {max_bytes / (1024 * 1024):.1f}MB."
                )
            chunks.append(chunk)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reading upload stream: {str(e)}"
        )
        
    file_bytes = b"".join(chunks)
    
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )
        
    # 2. Check extension validation
    ext = validate_file_metadata(filename, total_bytes)
    
    # 3. Check magic byte signature to block extension spoofing
    validate_file_content(file_bytes, ext)
    
    # Start performance timer
    start_time = time.perf_counter()
    
    # 4. Extract markdown using MarkItDown
    markdown_content = document_service.convert_to_markdown(file_bytes, ext)
    
    # 5. Extract plain text
    plain_text = document_service.markdown_to_plain_text(markdown_content)
    plain_text = sanitize_text(plain_text)
    
    # Check if we retrieved any text content
    if not plain_text.strip():
        # Let's set status as empty warning
        extraction_status = "warning"
        plain_text = "(No readable text extracted. Document may be empty or contain only image data.)"
        markdown_content = "(No readable text extracted)"
    else:
        extraction_status = "success"
        
    # 6. Gather token & text statistics
    char_count = token_service.count_characters(plain_text)
    word_count = token_service.count_words(plain_text)
    line_count = token_service.count_lines(plain_text)
    
    gpt_tokens = token_service.estimate_tokens(plain_text, "gpt")
    claude_tokens = token_service.estimate_tokens(plain_text, "claude")
    gemini_tokens = token_service.estimate_tokens(plain_text, "gemini")
    
    # 7. Compress and optimize text
    optimized = document_service.optimize_text(plain_text)
    optimized_tokens = token_service.estimate_tokens(optimized, "gpt")
    
    saved_tokens = max(0, gpt_tokens - optimized_tokens)
    saving_percentage = (
        round((saved_tokens / gpt_tokens) * 100, 1) if gpt_tokens else 0.0
    )
    
    # Stop timer
    end_time = time.perf_counter()
    processing_time = round(end_time - start_time, 4)
    
    return UploadResponse(
        filename=filename,
        text=plain_text,
        markdown=markdown_content,
        word_count=word_count,
        character_count=char_count,
        line_count=line_count,
        estimated_tokens=gpt_tokens,
        estimated_tokens_gpt=gpt_tokens,
        estimated_tokens_claude=claude_tokens,
        estimated_tokens_gemini=gemini_tokens,
        optimized_text=optimized,
        optimized_tokens=optimized_tokens,
        saved_tokens=saved_tokens,
        saving_percentage=saving_percentage,
        file_size_bytes=total_bytes,
        processing_time_sec=processing_time,
        extraction_status=extraction_status
    )
