import React from "react";

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand */}
        <a href="/" className="header-brand" aria-label="AWS Student Builder Group Credential Portal">
          <img
            src="https://awssbgprpcem.blob.core.windows.net/public/AWS%20SBG%20logo.png"
            alt="AWS Student Builder Group"
            className="header-logo-img"
          />
          <div className="header-brand-text">
            <span className="header-brand-name">AWS Student Builder Group</span>
            <span className="header-brand-sub">PRPCEM • Credential Verification Portal</span>
          </div>
        </a>

        {/* Right controls */}
        <div className="header-controls">
          {/* Theme toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* External link to main site */}
          <a
            href="https://awssbgprpcem.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="header-cta-btn"
          >
            Main Website
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
