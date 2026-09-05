import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function SafetyNotice() {
  return (
    <footer className="safety-notice-card" id="safety-notice">
      <div className="safety-notice-container">
        <div className="safety-icon-wrapper">
          <ShieldCheck size={24} className="safety-shield-icon" />
        </div>
        <div className="safety-notice-content">
          <h4 className="safety-notice-title">Safety & Non-Diagnostic Notice</h4>
          <p className="safety-notice-text">
            MedLens organizes and summarizes provided medical information. It does not provide diagnosis or treatment advice. Consult a qualified healthcare professional for medical decisions.
          </p>
        </div>
        <div className="safety-notice-badge">
          <Info size={14} /> Phase 2 Provenance Verified
        </div>
      </div>
    </footer>
  );
}
