"""
Azure Table Storage service layer.

Provides functions to query the Azure Table for certificate verification
and filtered browsing.
"""

import logging
from azure.data.tables import TableServiceClient, TableClient
from azure.core.exceptions import (
    ResourceNotFoundError,
    HttpResponseError,
    ServiceRequestError,
)
from config import settings

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────
# Mock data (used when Azure is not configured)
# ──────────────────────────────────────────────

MOCK_CERTIFICATES = {
    "AWS-TEAM-2026-001": {
        "PartitionKey": "2026",
        "RowKey": "AWS-TEAM-2026-001",
        "RecipientName": "Alex Rivera",
        "CertificateType": "Core Team Member",
        "EventOrRoleName": "Lead Community Organizer",
        "IssueDate": "2026-07-08",
        "Description": (
            "Recognized for exceptional leadership and orchestration of the "
            "AWS Student Builder Group community."
        ),
        "IssuedBy": "AWS Student Builder Group",
        "ExpiryDate": "N/A",
    },
    "AWS-VOL-2026-005": {
        "PartitionKey": "2026",
        "RowKey": "AWS-VOL-2026-005",
        "RecipientName": "Siddharth Sharma",
        "CertificateType": "Volunteer",
        "EventOrRoleName": "Technical Event Coordinator",
        "IssueDate": "2026-06-15",
        "Description": (
            "Awarded in appreciation for volunteer coordination during the "
            "annual Cloud Genesis Hackathon 2026."
        ),
        "IssuedBy": "AWS Student Builder Group",
        "ExpiryDate": "N/A",
    },
    "AWS-EVT-2026-042": {
        "PartitionKey": "2026",
        "RowKey": "AWS-EVT-2026-042",
        "RecipientName": "Emily Chen",
        "CertificateType": "Event Attendee",
        "EventOrRoleName": "AWS Cloud Practitioner Intensive Bootcamp",
        "IssueDate": "2026-05-20",
        "Description": (
            "Successfully attended and completed the intensive hands-on bootcamp "
            "covering core AWS services, security, and architecture principles."
        ),
        "IssuedBy": "AWS Student Builder Group",
        "ExpiryDate": "2028-05-20",
    },
    "AWS-TEAM-2025-002": {
        "PartitionKey": "2025",
        "RowKey": "AWS-TEAM-2025-002",
        "RecipientName": "Sarah Connor",
        "CertificateType": "Core Team Member",
        "EventOrRoleName": "Vice President & Treasurer",
        "IssueDate": "2025-12-10",
        "Description": (
            "Recognized for managing financial accounts and organizing regional "
            "community events for the AWS Student Builder Group."
        ),
        "IssuedBy": "AWS Student Builder Group",
        "ExpiryDate": "N/A",
    },
    "AWS-EVT-2026-105": {
        "PartitionKey": "2026",
        "RowKey": "AWS-EVT-2026-105",
        "RecipientName": "Marcus Wright",
        "CertificateType": "Event Attendee",
        "EventOrRoleName": "Serverless Architecture Workshop",
        "IssueDate": "2026-04-18",
        "Description": (
            "Successfully attended the serverless workshop, deploying CRUD APIs "
            "using AWS Lambda, API Gateway, and DynamoDB."
        ),
        "IssuedBy": "AWS Student Builder Group",
        "ExpiryDate": "2028-04-18",
    },
    "AWS-VOL-2025-010": {
        "PartitionKey": "2025",
        "RowKey": "AWS-VOL-2025-010",
        "RecipientName": "Kyle Reese",
        "CertificateType": "Volunteer",
        "EventOrRoleName": "Technical Workshop Support",
        "IssueDate": "2025-09-05",
        "Description": (
            "Awarded in recognition of technical assistance provided to over "
            "50 students during the AWS Cloud Essentials Study Jam."
        ),
        "IssuedBy": "AWS Student Builder Group",
        "ExpiryDate": "N/A",
    },
}


def _get_table_client() -> TableClient:
    """Create an Azure TableClient using the SAS token from config."""
    sas = settings.azure_table_sas_token
    if not sas.startswith("?"):
        sas = "?" + sas

    endpoint = f"{settings.table_endpoint}/{settings.azure_table_name}{sas}"
    return TableClient.from_table_url(endpoint)


# ──────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────


def verify_by_id(cert_id: str) -> dict | None:
    """
    Look up a single certificate by its RowKey (Certificate ID).
    Returns the entity dict or None if not found.
    """
    cert_id = cert_id.strip()
    if not cert_id:
        return None

    if not settings.is_azure_configured:
        return MOCK_CERTIFICATES.get(cert_id)

    try:
        client = _get_table_client()
        filter_str = f"RowKey eq '{cert_id}'"
        entities = list(client.query_entities(filter_str, results_per_page=1))
        return dict(entities[0]) if entities else None
    except (ResourceNotFoundError, HttpResponseError, ServiceRequestError) as exc:
        logger.error("Azure Table query failed for id=%s: %s", cert_id, exc)
        raise
    except Exception as exc:
        logger.error("Unexpected error during verify: %s", exc)
        raise


def query_certificates(
    year: str | None = None,
    cert_type: str | None = None,
    event_name: str | None = None,
    recipient_name: str | None = None,
) -> list[dict]:
    """
    Query certificates with optional filters.
    Filters applied server-side where possible, rest client-side.
    """
    if not settings.is_azure_configured:
        return _filter_mock(year, cert_type, event_name, recipient_name)

    try:
        client = _get_table_client()

        # Build OData filter (only PartitionKey and CertificateType are efficient server-side)
        filters: list[str] = []
        if year and year != "all":
            filters.append(f"PartitionKey eq '{year}'")
        if cert_type and cert_type != "all":
            filters.append(f"CertificateType eq '{cert_type}'")

        filter_str = " and ".join(filters) if filters else None
        entities = list(client.query_entities(filter_str) if filter_str else client.list_entities())

        results = [dict(e) for e in entities]

        # Client-side filtering for text search fields
        if event_name:
            q = event_name.lower()
            results = [r for r in results if r.get("EventOrRoleName", "").lower().find(q) >= 0]
        if recipient_name:
            q = recipient_name.lower()
            results = [r for r in results if r.get("RecipientName", "").lower().find(q) >= 0]

        return results

    except (ResourceNotFoundError, HttpResponseError, ServiceRequestError) as exc:
        logger.error("Azure Table query failed: %s", exc)
        raise
    except Exception as exc:
        logger.error("Unexpected error during query: %s", exc)
        raise


def _filter_mock(
    year: str | None,
    cert_type: str | None,
    event_name: str | None,
    recipient_name: str | None,
) -> list[dict]:
    """Filter mock certificates in memory."""
    results = list(MOCK_CERTIFICATES.values())

    if year and year != "all":
        results = [r for r in results if r["PartitionKey"] == year]
    if cert_type and cert_type != "all":
        results = [r for r in results if r["CertificateType"] == cert_type]
    if event_name:
        q = event_name.lower()
        results = [r for r in results if q in r.get("EventOrRoleName", "").lower()]
    if recipient_name:
        q = recipient_name.lower()
        results = [r for r in results if q in r.get("RecipientName", "").lower()]

    return results
