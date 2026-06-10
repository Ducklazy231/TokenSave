# TokenSave - Backend (FastAPI + MarkItDown)

FastAPI service that converts uploaded documents into AI-ready text using
[Microsoft MarkItDown](https://github.com/microsoft/markitdown), estimates LLM
token usage, and returns a token-optimized version.

## Endpoints

| Method | Path      | Description                                  |
| ------ | --------- | -------------------------------------------- |
| GET    | `/health` | Health check.                                |
| POST   | `/upload` | Upload a document (multipart, field `file`). |
| GET    | `/docs`   | Interactive Swagger UI (auto-generated).     |

### `POST /upload` response shape

```json
{
  "filename": "report.pdf",
  "text": "...",
  "markdown": "...",
  "word_count": 0,
  "character_count": 0,
  "estimated_tokens": 0,
  "estimated_tokens_gpt": 0,
  "estimated_tokens_claude": 0,
  "estimated_tokens_gemini": 0,
  "optimized_text": "...",
  "optimized_tokens": 0,
  "saved_tokens": 0,
  "saving_percentage": 0
}
```

Supported file types: PDF, DOCX, PPTX, XLSX, TXT, HTML.

## Local development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000 and docs at
http://localhost:8000/docs.

## Environment variables

| Variable          | Default | Description                                       |
| ----------------- | ------- | ------------------------------------------------- |
| `ALLOWED_ORIGINS` | `*`     | Comma-separated allowed CORS origins (frontend).  |
| `PORT`            | `8000`  | Provided automatically by Railway in production.  |
