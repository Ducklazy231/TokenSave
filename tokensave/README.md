# TokenSave

> Convert documents into AI-ready text while saving tokens.

TokenSave is a production-ready SaaS web app that lets users upload documents
(PDF, DOCX, PPTX, XLSX, TXT, HTML), extracts clean AI-ready plain text and
markdown using [Microsoft MarkItDown](https://github.com/microsoft/markitdown),
estimates token usage for GPT / Claude / Gemini, and produces a token-optimized
version so you spend less on LLM context.

## ✨ Features

- **Document upload** — drag & drop or browse (PDF, DOCX, PPTX, XLSX, TXT, HTML)
- **AI-ready extraction** — clean plain text + markdown via MarkItDown
- **Token analysis** — characters, words, and estimated GPT / Claude / Gemini tokens
- **Smart compression** — original vs optimized text with savings percentage
- **Export** — copy to clipboard, download TXT, download Markdown
- **Modern SaaS UI** — dark mode, mobile responsive, landing page (Linear/Vercel/Notion vibe)

## 🗂 Folder structure

```
tokensave/
├─ backend/                 # FastAPI + MarkItDown
│  ├─ main.py               # API: POST /upload, GET /health
│  ├─ requirements.txt
│  ├─ Procfile              # Railway / generic process file
│  ├─ railway.json          # Railway deploy config
│  ├─ runtime.txt
│  ├─ .env.example
│  └─ README.md
└─ frontend/                # React + TS + Vite + Tailwind + shadcn/ui
   ├─ src/
   │  ├─ components/
   │  │  ├─ ui/            # shadcn/ui primitives (button, card, badge, tabs, progress)
   │  │  ├─ Navbar.tsx
   │  │  ├─ Footer.tsx
   │  │  ├─ FileUpload.tsx
   │  │  ├─ StatCard.tsx
   │  │  └─ theme-provider.tsx
   │  ├─ lib/
   │  │  ├─ api.ts          # fetch wrapper for the backend
   │  │  └─ utils.ts
   │  ├─ pages/
   │  │  ├─ Landing.tsx
   │  │  ├─ Converter.tsx
   │  │  └─ About.tsx
   │  ├─ App.tsx
   │  ├─ main.tsx
   │  └─ index.css
   ├─ index.html
   ├─ package.json
   ├─ vite.config.ts
   ├─ tailwind.config.js
   ├─ vercel.json
   └─ .env.example
```

## 🚀 Quick start (local)

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Backend runs at http://localhost:8000 (docs at `/docs`).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env             # ensure VITE_API_URL=http://localhost:8000
npm run dev
```

Frontend runs at http://localhost:5173.

## ☁️ Deployment

### Backend → Railway

1. Push this repo to GitHub.
2. In [Railway](https://railway.app), create a **New Project → Deploy from GitHub repo** and pick this repo.
3. Set the **Root Directory** to `backend`.
4. Railway auto-detects Python and installs `requirements.txt`. The included `railway.json` / `Procfile` provides the start command:
   `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add an environment variable `ALLOWED_ORIGINS` set to your Vercel frontend URL (e.g. `https://tokensave.vercel.app`).
6. Deploy and copy the public backend URL (e.g. `https://tokensave-backend.up.railway.app`).

> Alternatively use **Render** or **Fly.io** — the `Procfile` works on both.

### Frontend → Vercel

1. In [Vercel](https://vercel.com), **Add New → Project** and import the same GitHub repo.
2. Set the **Root Directory** to `frontend`.
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist` (auto-detected).
4. Add an environment variable `VITE_API_URL` set to your Railway backend URL.
5. Deploy. The included `vercel.json` handles SPA routing rewrites.

### Connecting the two

- Frontend reads `VITE_API_URL` to call the backend.
- Backend reads `ALLOWED_ORIGINS` to allow CORS from the frontend.
- Set both after the first deploy, then redeploy if needed.

## 🧠 Token estimates

Token counts are fast heuristics (character + word density per model family) for
planning and comparison. For exact billing, use each provider's official
tokenizer (e.g. `tiktoken` for OpenAI).

## 📜 License

MIT — build freely. MarkItDown is © Microsoft, MIT licensed.
