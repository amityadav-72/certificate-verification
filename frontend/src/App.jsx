import React, { useState, useEffect } from "react";
import { verifyById, queryCertificates, checkHealth } from "./services/api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FaqSection from "./components/FaqSection";

export default function App() {
  const [activeTab, setActiveTab] = useState("verify");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendUp, setBackendUp] = useState(true);

  // Verify-by-ID state
  const [searchId, setSearchId] = useState("");
  const [searched, setSearched] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  // Filter state
  const [filterYear, setFilterYear] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterEvent, setFilterEvent] = useState("");
  const [filterName, setFilterName] = useState("");
  const [results, setResults] = useState([]);
  const [hasFiltered, setHasFiltered] = useState(false);

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem("app-theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  // Health check on mount
  useEffect(() => {
    checkHealth().then(h => setBackendUp(h.ok));
  }, []);

  const toggleTheme = () => setTheme(p => p === "dark" ? "light" : "dark");

  // ── Verify by ID ──
  const runVerify = async (id) => {
    const target = (id || searchId).trim();
    if (!target) { setError("Please enter a Certificate ID."); setSearched(true); return; }
    setLoading(true); setError(null); setVerifyResult(null); setSearched(true);
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${encodeURIComponent(target)}`;
    window.history.pushState({}, "", url);
    try {
      const res = await verifyById(target);
      if (res.error) setError(res.error);
      else if (res.data) setVerifyResult(res.data);
      else setError("Certificate not found.");
    } catch { setError("An unexpected error occurred."); }
    finally { setLoading(false); }
  };

  // ── Filter browse ──
  const runFilter = async (e) => {
    if (e) e.preventDefault();
    setLoading(true); setError(null); setHasFiltered(true);
    try {
      const res = await queryCertificates({
        year: filterYear,
        type: filterType,
        event: filterEvent,
        name: filterName,
      });
      if (res.error) { setError(res.error); setResults([]); }
      else setResults(res.data);
    } catch { setError("Failed to fetch results."); }
    finally { setLoading(false); }
  };

  const resetFilter = () => {
    setFilterYear("all"); setFilterType("all"); setFilterEvent(""); setFilterName("");
    setResults([]); setHasFiltered(false); setError(null);
  };

  const resetVerify = () => {
    setSearchId(""); setVerifyResult(null); setError(null); setSearched(false);
    window.history.pushState({}, "", window.location.pathname);
  };

  // Badge class helper
  const badgeClass = (type) =>
    type === "Core Team Member" ? "badge-team"
      : type === "Volunteer" ? "badge-vol" : "badge-evt";

  return (
    <div className="page-shell">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="page-main">

        {/* ── Hero ── */}
        <div className="verify-hero fade-in">
          <div className="verify-hero-eyebrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Official Verification Portal
          </div>
          <h2 className="verify-hero-title">Verify Your AWS Cloud Club<br />Credential</h2>
          <p className="verify-hero-sub">
            Authenticate team memberships, volunteer recognition, and event attendance certificates issued by the AWS Student Builder Group, PRPCEM.
          </p>
        </div>

        {/* Backend status warning */}
        {!backendUp && (
          <div className="status-msg error" style={{ maxWidth: 760, margin: "0 auto 1.5rem" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Backend server is not reachable. Make sure the FastAPI server is running on port 8000.</span>
          </div>
        )}

        {/* ── Search card ── */}
        <div className="verify-card glass-card fade-in">
          {/* Tab switcher */}
          <div className="search-tabs">
            <button className={`tab-btn ${activeTab === "verify" ? "active" : ""}`}
              onClick={() => { setActiveTab("verify"); setError(null); }}>
              Verify by ID
            </button>
            <button className={`tab-btn ${activeTab === "filter" ? "active" : ""}`}
              onClick={() => { setActiveTab("filter"); setError(null); }}>
              Filter &amp; Browse
            </button>
          </div>

          {/* Tab 1: Verify by ID */}
          {activeTab === "verify" && (
            <div>
              <form className="search-form" onSubmit={e => { e.preventDefault(); runVerify(); }}>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Enter Certificate ID — e.g. AWS-TEAM-2026-001"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
                <button className="search-btn" type="submit" disabled={loading}>
                  {loading ? <div className="spinner" /> : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      Verify
                    </>
                  )}
                </button>
              </form>
              {searched && <button className="clear-link" onClick={resetVerify}>Clear search</button>}
            </div>
          )}

          {/* Tab 2: Filter & Browse */}
          {activeTab === "filter" && (
            <form className="filter-form" onSubmit={runFilter}>
              <div className="filter-grid">
                <div className="filter-group">
                  <label className="filter-label">Cohort Year</label>
                  <select className="filter-select" value={filterYear} onChange={e => setFilterYear(e.target.value)}>
                    <option value="all">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Credential Type</label>
                  <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="Core Team Member">Core Team Member</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Event Attendee">Event Attendee</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Role or Event Name</label>
                  <input className="search-input" type="text" placeholder="e.g. Serverless, Bootcamp…"
                    value={filterEvent} onChange={e => setFilterEvent(e.target.value)} />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Recipient Name</label>
                  <input className="search-input" type="text" placeholder="e.g. Alex Rivera"
                    value={filterName} onChange={e => setFilterName(e.target.value)} />
                </div>
              </div>
              <div className="filter-actions">
                <button type="button" className="ghost-btn" onClick={resetFilter}>Clear</button>
                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? <div className="spinner" /> : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      Browse Directory
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Status messages */}
          {loading && (
            <div className="status-msg loading">
              <div className="spinner" />
              <span style={{ marginLeft: "0.5rem" }}>Verifying credential…</span>
            </div>
          )}
          {error && !loading && (
            <div className="status-msg error">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ── Verify result (single card, no certificate view) ── */}
        {verifyResult && !loading && activeTab === "verify" && (
          <div className="results-section fade-in">
            <div className="results-header">
              <p className="results-count">✓ Credential Verified</p>
            </div>
            <div className="results-grid">
              <div className="preview-card glass-card" style={{ cursor: "default" }}>
                <div className="preview-top">
                  <h4 className="preview-name">{verifyResult.RecipientName}</h4>
                  <span className={`preview-badge ${badgeClass(verifyResult.CertificateType)}`}>{verifyResult.CertificateType}</span>
                </div>
                <p className="preview-role">{verifyResult.EventOrRoleName}</p>
                {verifyResult.Description && (
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{verifyResult.Description}</p>
                )}
                <div className="preview-bottom">
                  <span>Cohort {verifyResult.PartitionKey}</span>
                  <span className="preview-id">{verifyResult.RowKey}</span>
                </div>
                {verifyResult.IssueDate && (
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", borderTop: "1px solid var(--line)", paddingTop: "0.6rem" }}>
                    Issued: {verifyResult.IssueDate} · By: {verifyResult.IssuedBy || "AWS Student Builder Group"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Filter results grid ── */}
        {activeTab === "filter" && hasFiltered && !loading && (
          <div className="results-section fade-in">
            <div className="results-header">
              <p className="results-count">{results.length} {results.length === 1 ? "credential" : "credentials"} found</p>
            </div>
            {results.length > 0 ? (
              <div className="results-grid">
                {results.map(cert => (
                  <div key={cert.RowKey} className="preview-card glass-card" style={{ cursor: "default" }}>
                    <div className="preview-top">
                      <h4 className="preview-name">{cert.RecipientName}</h4>
                      <span className={`preview-badge ${badgeClass(cert.CertificateType)}`}>{cert.CertificateType}</span>
                    </div>
                    <p className="preview-role">{cert.EventOrRoleName}</p>
                    <div className="preview-bottom">
                      <span>Cohort {cert.PartitionKey}</span>
                      <span className="preview-id">{cert.RowKey}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <p>No credentials match your filters. Try adjusting the criteria above.</p>
              </div>
            )}
          </div>
        )}

        {/* ── FAQ section ── */}
        <FaqSection />

      </main>

      <Footer />
    </div>
  );
}
