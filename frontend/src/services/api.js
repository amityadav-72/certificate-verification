/**
 * API service — communicates with the FastAPI backend.
 * All Azure logic is now server-side; the frontend just makes fetch calls.
 */

const API_BASE = "/api";

/**
 * Verify a single certificate by its Credential ID.
 * @param {string} certId
 * @returns {Promise<{data: object|null, error: string|null}>}
 */
export async function verifyById(certId) {
  try {
    const res = await fetch(`${API_BASE}/verify/${encodeURIComponent(certId.trim())}`);
    if (res.status === 404) {
      return { data: null, error: "Certificate not found." };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null, error: body.detail || `Server error (${res.status})` };
    }
    const json = await res.json();
    return { data: json.data, error: null };
  } catch (err) {
    console.error("API verifyById error:", err);
    return { data: null, error: "Could not reach the server. Is the backend running?" };
  }
}

/**
 * Query certificates with filters.
 * @param {{ year?: string, type?: string, event?: string, name?: string }} filters
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export async function queryCertificates(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.year && filters.year !== "all") params.set("year", filters.year);
    if (filters.type && filters.type !== "all") params.set("type", filters.type);
    if (filters.event) params.set("event", filters.event);
    if (filters.name) params.set("name", filters.name);

    const res = await fetch(`${API_BASE}/certificates?${params.toString()}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: [], error: body.detail || `Server error (${res.status})` };
    }
    const json = await res.json();
    return { data: json.data || [], error: null };
  } catch (err) {
    console.error("API queryCertificates error:", err);
    return { data: [], error: "Could not reach the server. Is the backend running?" };
  }
}

/**
 * Check if the backend is up and whether Azure is configured.
 * @returns {Promise<{ok: boolean, azureConfigured: boolean}>}
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { ok: false, azureConfigured: false };
    const json = await res.json();
    return { ok: true, azureConfigured: json.azure_configured || false };
  } catch {
    return { ok: false, azureConfigured: false };
  }
}
