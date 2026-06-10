"""
TokenSave - Entry point forwarder
Imports and exposes the FastAPI app from the refactored modular app directory.
"""
from app.main import app

if __name__ == "__main__":
    import uvicorn
    # Local debugging entrypoint
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
