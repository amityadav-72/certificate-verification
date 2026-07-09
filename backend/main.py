"""
AWS Student Builder Group — Certificate Verification API

A FastAPI backend that serves credential data from Azure Table Storage
(or mock data when Azure is not configured).
"""

import csv
import io
import logging
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from services.azure_table import verify_by_id, query_certificates, upload_certificates

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


# ─── Upload CSV and ingest into Azure Table ──────────

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload a CSV file containing certificate data.
    Parses the file and upserts the records into the database.
    """
    # 1. Validate file type / extension
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
    except Exception as exc:
        logger.error("Failed to decode uploaded file: %s", exc)
        raise HTTPException(status_code=400, detail="Invalid file encoding. Must be UTF-8.")

    # 2. Parse CSV
    try:
        csv_reader = csv.DictReader(io.StringIO(decoded))
        
        # Verify headers or reader format
        if csv_reader.fieldnames is None:
            raise HTTPException(status_code=400, detail="Empty CSV file or invalid headers.")
        
        # Strip whitespace from fieldnames (headers)
        fieldnames = [f.strip() for f in csv_reader.fieldnames if f]
        
        entities = []
        for row_idx, row in enumerate(csv_reader, start=1):
            # Clean row values
            clean_row = {}
            for k, v in row.items():
                if k:
                    clean_row[k.strip()] = v.strip() if v is not None else ""
            
            # Check for required fields
            pk = clean_row.get("PartitionKey")
            rk = clean_row.get("RowKey")
            
            if not pk or not rk:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Row {row_idx} is missing PartitionKey or RowKey."
                )
            
            entities.append(clean_row)
            
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Failed to parse CSV file: %s", exc)
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(exc)}")

    if not entities:
        raise HTTPException(status_code=400, detail="No valid certificate records found in the CSV.")

    # 3. Upload to storage service
    try:
        result = upload_certificates(entities)
        return {
            "message": "CSV processing completed.",
            "success_count": result["success_count"],
            "failed_count": result["failed_count"],
            "errors": result["errors"],
            "source": result["source"]
        }
    except Exception as exc:
        logger.error("Failed to upload certificates: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to save data to the table storage.")


# ─── Verify student by details (Name, Event, Year) ───

@app.get("/api/verify-details")
def verify_details(
    name: str = Query(..., description="Recipient name"),
    event: str = Query(..., description="Event or role name"),
    year: str = Query(..., description="Cohort year"),
):
    """
    Verify if a student is present by checking all three fields: Name, Event, and Year.
    """
    name = name.strip()
    event = event.strip()
    year = year.strip()

    if not name or not event or not year:
        raise HTTPException(status_code=400, detail="Name, Event, and Year are all required.")

    try:
        results = query_certificates(year=year, event_name=event, recipient_name=name)
    except Exception as exc:
        logger.error("Verify details query failed: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to query the data source.")

    if not results:
        raise HTTPException(status_code=404, detail="Student not found with the specified details.")

    # Match the name, event, and year exactly (case-insensitive) for high-accuracy verify
    filtered_exact = []
    for r in results:
        r_name = (r.get("RecipientName") or "").lower()
        r_event = (r.get("EventOrRoleName") or "").lower()
        r_year = str(r.get("PartitionKey") or "")
        if name.lower() in r_name and event.lower() in r_event and year == r_year:
            filtered_exact.append(r)

    if not filtered_exact:
        raise HTTPException(status_code=404, detail="Student not found with the specified exact details.")

    return {"data": filtered_exact[0], "present": True, "source": "azure" if settings.is_azure_configured else "mock"}
