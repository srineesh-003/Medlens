import React from 'react';
import { Activity, ShieldAlert, ArrowRight, Table, Layers, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-container">
      {/* Landing Header */}
      <header className="landing-header">
        <div className="landing-nav">
          <div className="brand-group">
            <div className="brand-icon-wrapper">
              <Activity size={22} className="brand-icon" />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">
                Med<span className="brand-accent">Lens</span>
              </h1>
              <p className="brand-subtitle">AI Clinical Information Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Activity size={14} /> Healthcare Information Infrastructure
          </div>
          <h1 className="hero-headline">
            Turn Fragmented Medical Information Into a Clear, Structured Record
          </h1>
          <p className="hero-description">
            MedLens organizes patient information and medical reports into a structured, traceable and reviewable clinical record.
          </p>

          <div className="hero-cta-group">
            <button type="button" className="btn btn-primary btn-hero" onClick={onGetStarted}>
              Get Started <ArrowRight size={18} />
            </button>
          </div>

          <div className="landing-safety-banner">
            <ShieldAlert size={18} className="landing-safety-icon" />
            <span>
              MedLens is an information organizer, not a diagnostic tool. It does not provide diagnosis or treatment recommendations.
            </span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper blue-icon">
              <Table size={22} />
            </div>
            <h3 className="feature-title">Structured Medical Records</h3>
            <p className="feature-text">
              Extract lab measurements and clinical observations into standardized tabular records with LOW, NORMAL, HIGH, and UNKNOWN status classifications.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper purple-icon">
              <Layers size={22} />
            </div>
            <h3 className="feature-title">Source & Provenance Tracking</h3>
            <p className="feature-text">
              Every data element maintains strict origin traceability, explicitly labeled as Patient provided, Extracted from report, or AI generated.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper amber-icon">
              <ShieldCheck size={22} />
            </div>
            <h3 className="feature-title">Human Verification & Review</h3>
            <p className="feature-text">
              Cross-references patient intake profile against report text to flag unlisted medications, missing conditions, or data variances for clinician review.
            </p>
          </div>
        </div>
      </main>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <p>Built for PromptWars • AI Clinical Information Intelligence</p>
      </footer>
    </div>
  );
}

