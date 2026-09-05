import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Ban, X } from 'lucide-react';

export default function SafetyGuardrailsModal({ onClose }) {
  return (
    <div className="otp-modal-overlay" onClick={onClose}>
      <div className="crop-modal-card guardrails-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="guardrails-modal-header">
          <div className="guardrails-header-title">
            <div className="guardrails-badge-icon">
              <ShieldCheck size={24} className="text-teal" />
            </div>
            <div>
              <h3>MedLens Clinical Safety & Guardrails</h3>
              <p>Responsible AI Mandate & Non-Diagnostic Architecture Standards</p>
            </div>
          </div>
          <button type="button" className="btn-icon-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="guardrails-modal-body">
          {/* Important Regulatory Notice Banner */}
          <div className="regulatory-notice-banner">
            <AlertTriangle size={20} className="notice-banner-icon" />
            <div>
              <h4>Important Regulatory Notice</h4>
              <p>
                MedLens is an information organization and clinical synthesis aid. It is strictly <strong>NOT</strong> a medical diagnostic device, does not formulate differential diagnoses, and does not prescribe therapies or medication dosage alterations.
              </p>
            </div>
          </div>

          {/* Two-Column Matrix: What MedLens Does vs Strict Prohibitions */}
          <div className="guardrails-columns-grid">
            {/* Column 1: What MedLens Does */}
            <div className="guardrail-column does-column">
              <div className="column-header">
                <CheckCircle2 size={18} className="column-header-icon success" />
                <h4>What MedLens Does</h4>
              </div>
              <ul className="guardrail-list">
                <li>Ingests and standardizes multi-source clinical PDFs and lab documents.</li>
                <li>Preserves explicit source report reference ranges verbatim.</li>
                <li>Flags Low/Normal/High based exclusively on report-supplied boundaries.</li>
                <li>Detects conflicting records for human clinician review.</li>
                <li>Maintains cryptographic SHA-256 and immutable audit trails.</li>
              </ul>
            </div>

            {/* Column 2: Strict Prohibitions */}
            <div className="guardrail-column prohibitions-column">
              <div className="column-header">
                <Ban size={18} className="column-header-icon danger" />
                <h4>Strict Prohibitions</h4>
              </div>
              <ul className="guardrail-list">
                <li>Never invents or assumes missing laboratory reference ranges.</li>
                <li>Never generates speculative diagnoses or prognoses.</li>
                <li>Never recommends starting, stopping, or modifying medications.</li>
                <li>Never overwrites conflicting clinical records automatically.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="guardrails-modal-footer">
          <button type="button" className="btn btn-teal-submit" onClick={onClose}>
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
}

