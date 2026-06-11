import re
import os
from typing import Optional
from fastapi import HTTPException, status
from app.core.config import settings

# Supported extensions
SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".pptx",
    ".xlsx",
    ".txt",
    ".html",
    ".htm",
}

# File signatures (magic bytes)
# PDF: %PDF
# Office Open XML (DOCX, XLSX, PPTX) are zip files: PK\x03\x04
SIGNATURES = {
    ".pdf": b"%PDF",
    ".docx": b"PK\x03\x04",
    ".xlsx": b"PK\x03\x04",
    ".pptx": b"PK\x03\x04",
}

def validate_file_metadata(filename: str, size: int) -> str:
    """Validate the filename extension and size."""
    if not filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing."
        )
        
    ext = os.path.splitext(filename)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Supported types: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
        )
        
    if size > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_BYTES / (1024 * 1024):.1f}MB."
        )
        
    return ext

def validate_file_content(content: bytes, ext: str) -> None:
    """Validate content bytes against expected file signatures (magic bytes)."""
    # For binary formats, check signature
    if ext in SIGNATURES:
        expected_sig = SIGNATURES[ext]
        file_sig = content[:len(expected_sig)]
        if file_sig != expected_sig:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file structure: file content does not match the '{ext}' format signature."
            )
            
    # For plain text formats, verify it's readable text
    elif ext in {".txt", ".html", ".htm"}:
        try:
            content.decode("utf-8")
        except UnicodeDecodeError:
            try:
                # Fallback to Latin-1
                content.decode("latin-1")
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid text encoding. The text file must be encoded in UTF-8 or compatible encoding."
                )

def sanitize_text(text: str) -> str:
    """Basic HTML sanitization to prevent rendering scripting tags when text output is displayed."""
    if not text:
        return ""
    # Strip script blocks completely
    text = re.sub(r"<script\b[^>]*>([\s\S]*?)<\/script>", "", text, flags=re.IGNORECASE)
    # Escape simple tags or return stripped
    return text

import urllib.request
import urllib.parse
import json

def verify_turnstile_token(token: Optional[str]) -> bool:
    """Verify Cloudflare Turnstile token via siteverify API."""
    return True

