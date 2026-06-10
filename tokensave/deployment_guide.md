# Deployment Guide for TokenSave

This guide describes how to deploy TokenSave in production, hosting the **FastAPI Backend** on Railway and the **React Frontend** on Vercel.

---

## 1. Backend Deployment (Railway)

Railway automatically detects FastAPI applications using standard Python environments and builds them using Nixpacks or Heroku Buildpacks.

### Step-by-Step Instructions:

1. **Create a Railway Account**: Sign up at [railway.app](https://railway.app/).
2. **Create a New Project**: Click **New Project** → **Deploy from GitHub repo** → select your repository containing TokenSave.
3. **Set Root Directory**:
   - In the service configuration under **Settings**, set the **Root Directory** to `backend`.
4. **Configure Variables**:
   Under the **Variables** tab for the backend service, add:
   - `PORT`: (Automatically set by Railway).
   - `ALLOWED_ORIGINS`: Set to your deployed frontend Vercel URL (e.g., `https://tokensave.vercel.app`) or `*` to allow multiple.
   - `AI_PROVIDER`: Set to `mock` (or `openai`/`anthropic` when future AI integrations are enabled).
5. **Verify Procfile**:
   The `Procfile` is located inside the `backend` folder and contains:
   ```procfile
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   Railway will automatically read this command and launch the Uvicorn web server.
6. **Deploy**:
   Click **Deploy**. Once completed, Railway will generate a production backend domain (e.g., `https://tokensave-backend.up.railway.app`).

---

## 2. Frontend Deployment (Vercel)

Vercel provides native hosting for Vite/React applications.

### Step-by-Step Instructions:

1. **Create a Vercel Account**: Sign up at [vercel.com](https://vercel.com/).
2. **Import Project**:
   - Click **Add New** → **Project** → Select the GitHub repository.
3. **Configure Project Settings**:
   - **Framework Preset**: Select **Vite**.
   - **Root Directory**: Select `frontend`.
4. **Configure Environment Variables**:
   Under the **Environment Variables** accordion, add:
   - Key: `VITE_API_URL`
   - Value: The URL of your deployed Railway backend (e.g., `https://tokensave-backend.up.railway.app`).
5. **Vercel Routing (vercel.json)**:
   The `vercel.json` is located in the `frontend` folder to handle routing fallbacks for single-page applications (`react-router-dom`):
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
6. **Deploy**:
   Click **Deploy**. Vercel will build the frontend assets and provide a production domain.

---

## 3. Local Development

To run the full stack locally for verification:

### Backend
1. Navigate to the `backend` folder.
2. Activate virtual environment:
   - Windows: `.\.venv\Scripts\activate`
   - Unix/macOS: `source .venv/bin/activate`
3. Run with reload:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend
1. Navigate to the `frontend` folder.
2. Install packages: `npm install`
3. Create a `.env.local` containing `VITE_API_URL=http://localhost:8000`.
4. Launch development server:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173`.
