import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Glowing top accent line matching main site */}
      <div className="footer-glow-line" aria-hidden="true" />

      <div className="footer-shell">
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand-col">
            <a href="/" className="footer-logo-link" aria-label="AWS SBG Credential Portal Home">
              <img
                src="https://awssbgprpcem.blob.core.windows.net/public/AWS%20SBG%20logo.png"
                alt="AWS Student Builder Group"
                className="footer-logo-img"
              />
              <span className="footer-logo-text">Student Builder Group<br/>PRPCEM</span>
            </a>
            <p className="footer-brand-desc">
              Empowering student innovators at PRPCEM to build, learn, and lead in cloud computing and artificial intelligence.
            </p>

            {/* Social icons */}
            <div className="footer-socials">
              <a href="https://www.meetup.com/aws-sbg-at-prpotepatil-college-of-eng-mgmt/" target="_blank" rel="noreferrer" className="footer-social-icon meetup" aria-label="Meetup">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19.24 5.29a3.63 3.63 0 0 0-1.64-2.32A3.6 3.6 0 0 0 14.9 2.5a3.63 3.63 0 0 0-2.38 1.2l-6.24 7.2a1.5 1.5 0 0 0 .2 2.11 1.5 1.5 0 0 0 2.11-.2l5.38-6.2a.5.5 0 0 1 .76.65l-5.38 6.2a2.5 2.5 0 0 1-3.52.33 2.5 2.5 0 0 1-.33-3.52l6.24-7.2a4.62 4.62 0 0 1 3.04-1.53 4.6 4.6 0 0 1 3.41 1.01 4.62 4.62 0 0 1 1.67 3.9 4.6 4.6 0 0 1-1.4 3l-7.87 7.2a5.5 5.5 0 0 1-7.76-.44 5.5 5.5 0 0 1 .44-7.76l7.5-6.87a.5.5 0 0 1 .68.73L4.41 9.97a4.5 4.5 0 0 0-.36 6.35 4.5 4.5 0 0 0 6.35.36l7.87-7.2a3.6 3.6 0 0 0 1.1-2.35z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="footer-social-icon linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-icon github" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/awssbgprpcem" target="_blank" rel="noreferrer" className="footer-social-icon instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Portal links column */}
          <div className="footer-links-col">
            <h4>This Portal</h4>
            <ul>
              <li><a href="/">Verify by ID</a></li>
              <li><a href="/?tab=filter">Browse Directory</a></li>
            </ul>
          </div>

          {/* Community links column */}
          <div className="footer-links-col">
            <h4>Community</h4>
            <ul>
              <li><a href="https://awssbgprpcem.tech" target="_blank" rel="noreferrer">Main Website</a></li>
              <li><a href="https://awssbgprpcem.tech/events" target="_blank" rel="noreferrer">Events</a></li>
              <li><a href="https://awssbgprpcem.tech/team" target="_blank" rel="noreferrer">Our Team</a></li>
              <li><a href="https://awssbgprpcem.tech/resources" target="_blank" rel="noreferrer">Resources</a></li>
              <li><a href="https://awssbgprpcem.tech/about" target="_blank" rel="noreferrer">About Us</a></li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="footer-links-col">
            <h4>Reach Us</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="footer-contact-icon">📍</span>
                <span>PRPCEM, Amravati, MH, India</span>
              </li>
              <li>
                <span className="footer-contact-icon">📧</span>
                <a href="mailto:awssbgprpcem@gmail.com">awssbgprpcem@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright strip */}
        <div className="footer-bottom">
          <p>© {year} AWS Student Builder Group PRPCEM. All rights reserved.</p>
          <p className="footer-bottom-note">AWS Student Builder Group • PRPCEM, Amravati.</p>
        </div>
      </div>
    </footer>
  );
}
