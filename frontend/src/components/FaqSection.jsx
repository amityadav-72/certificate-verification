import React, { useState } from "react";

const faqs = [
  {
    q: "How does certificate verification work?",
    a: "Every certificate issued by the AWS Student Builder Group contains a unique Credential ID. Enter that ID in the portal and we'll instantly confirm the recipient's name, role or event, and issue date — giving you a verified, authentic result.",
  },
  {
    q: "What types of credentials can I verify?",
    a: "The portal verifies three categories: Core Team Member (organisational roles within the Cloud Club), Volunteer (event support and coordination roles), and Event Attendee (participation in workshops, bootcamps, and study jams).",
  },
  {
    q: "Can I look up credentials without the Certificate ID?",
    a: 'Yes. Switch to the "Filter & Browse" tab to search by cohort year, credential type, event name, or the recipient\'s name — no Certificate ID needed.',
  },
  {
    q: "How do I add this credential to my LinkedIn profile?",
    a: 'After verifying your certificate, click "Add to LinkedIn". The portal pre-fills your credential name, organisation, issue date, and verification URL so you can add it to your LinkedIn Licenses & Certifications section in seconds.',
  },
  {
    q: "Can I download or print my certificate?",
    a: 'Click "Print / Save PDF" on your verified certificate. The page automatically hides all UI elements and formats only the certificate in a landscape A4 layout, ready to print or export as a PDF.',
  },
  {
    q: "Who issues these certificates?",
    a: "Certificates are issued by the AWS Student Builder Group at PR Pote Patil College of Engineering & Management (PRPCEM), Amravati, Maharashtra, India — an official AWS-recognised student community.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button
        className="faq-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <svg
          className="faq-chevron"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="faq-body fade-in">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="faq-section" id="faq">
      {/* Section heading */}
      <div className="faq-heading-wrap">
        <span className="section-eyebrow">Got questions?</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-sub">
          Everything you need to know about the AWS Student Builder Group credential verification portal.
        </p>
      </div>

      {/* Two-column accordion grid */}
      <div className="faq-accordion-grid">
        {faqs.map((f, i) => (
          <FaqItem key={i} question={f.q} answer={f.a} />
        ))}
      </div>

      {/* Still need help CTA */}
      <div className="faq-cta-wrap">
        <p>Still have questions?</p>
        <a href="mailto:awssbgprpcem@gmail.com" className="faq-cta-btn">
          Contact Us
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
