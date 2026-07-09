# AWS Student Builder Group — Certificate Verification Portal

A full-stack web application for verifying credentials issued by the AWS Student Builder Group, PRPCEM.

## Architecture

```
├── backend/       # Python FastAPI — serves data from Azure Table Storage
└── frontend/      # React (Vite) — user-facing verification portal
```

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env       # fill in your Azure credentials
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies `/api` to the backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check + Azure config status |
| `GET` | `/api/verify/{cert_id}` | Verify a single certificate by ID |
| `GET` | `/api/certificates?year=&type=&event=&name=` | Filter & browse credentials |

## Environment Variables (Backend)

| Variable | Description |
|----------|-------------|
| `AZURE_STORAGE_ACCOUNT` | Your Azure Storage Account name |
| `AZURE_TABLE_NAME` | Table name (default: `certificates`) |
| `AZURE_TABLE_SAS_TOKEN` | SAS token with read/query access |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) |
