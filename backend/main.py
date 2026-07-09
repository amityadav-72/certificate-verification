"""
AWS Student Builder Group — Certificate Verification API

A FastAPI backend that serves credential data from Azure Table Storage
(or mock data when Azure is not configured).
"""

import logging
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from services.azure_table import verify_by_id, query_certificates

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AWS SBG Certificate Verification API",
    description="Backend API for verifying AWS Student Builder Group credentials.",
    version="1.0.0",
)

# CORS — allow the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ─── Health check ────────────────────────────────

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "azure_configured": settings.is_azure_configured,
    }


# ─── Verify a single certificate by ID ──────────

@app.get("/api/verify/{cert_id}")
def verify_certificate(cert_id: str):
    """
    Look up a certificate by its unique Credential ID (RowKey).
    Returns the certificate data or a 404 error.
    """
    try:
        result = verify_by_id(cert_id)
    except Exception as exc:
        logger.error("Verification failed: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to query the data source.")

    if result is None:
        raise HTTPException(status_code=404, detail="Certificate not found.")

    return {"data": result, "source": "azure" if settings.is_azure_configured else "mock"}


# ─── Filter / Browse certificates ────────────────

@app.get("/api/certificates")
def list_certificates(
    year: str = Query(default="all", description="Cohort year, e.g. 2026"),
    type: str = Query(default="all", alias="type", description="Credential type"),
    event: str = Query(default="", description="Event or role name search"),
    name: str = Query(default="", description="Recipient name search"),
):
    """
    Query certificates with optional filters.
    Returns a list of matching credential records.
    """
    try:
        results = query_certificates(
            year=year,
            cert_type=type,
            event_name=event if event else None,
            recipient_name=name if name else None,
        )
    except Exception as exc:
        logger.error("Query failed: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to query the data source.")

    return {"data": results, "count": len(results)}
