# TokenSave - Frontend (React + Vite + Tailwind + shadcn/ui)

Modern SaaS UI for TokenSave. Talks to the FastAPI backend.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev            # http://localhost:5173
```

## Build

```bash
npm run build          # outputs to dist/
npm run preview        # preview the production build
```

## Environment

| Variable       | Description                         |
| -------------- | ----------------------------------- |
| `VITE_API_URL` | Base URL of the TokenSave backend.  |

## Pages

- `/` — Landing page
- `/converter` — Token Converter (upload + analysis)
- `/about` — About

## Stack

React 18, TypeScript, Vite 6, Tailwind CSS 3, shadcn/ui (Radix primitives),
react-router-dom, lucide-react.
