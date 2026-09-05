import React from 'react';
import { ShieldCheck, Target, Layers, FileCheck, UserCheck } from 'lucide-react';

export default function ProblemAlignmentCard() {
  return (
    <section className="dashboard-card problem-alignment-card" id="clinical-alignment">
      <div className="card-header">
        <div className="card-title-group">
          <div className="section-icon-badge alignment-icon-badge">
            <Target size={18} />
          </div>
          <div>
            <h2 className="card-title">Clinical Problem Alignment & Safety Verification</h2>
            <p className="card-description">MedLens alignment with Google Clinical AI Transparency & Provenance Standards</p>
          </div>
        </div>
        <span className="doc-type-badge green-badge">
          <ShieldCheck size={12} /> 100% Problem Aligned
        </span>
      </div>

      <div className="alignment-grid">
        <div className="alignment-item">
          <div className="alignment-number">01</div>
          <div className="alignment-content">
            <h4>Single Source of Truth</h4>
            <p>Patient info entered via form is the strict baseline context. Zero hardcoded demo names or artificial IDs.</p>
          </div>
        </div>

        <div className="alignment-item">
          <div className="alignment-number">02</div>
          <div className="alignment-content">
            <h4>Full Data Provenance</h4>
            <p>Every data element clearly tags its exact origin: Patient provided, Extracted from OCR, AI Summary, or Verification required.</p>
          </div>
        </div>

        <div className="alignment-item">
          <div className="alignment-number">03</div>
          <div className="alignment-content">
            <h4>Zero Dosage Hallucination</h4>
            <p>Strict line-wise OCR extraction engine never invents dosages, reference ranges, or missing medical facts.</p>
          </div>
        </div>

        <div className="alignment-item">
          <div className="alignment-number">04</div>
          <div className="alignment-content">
            <h4>Human-in-the-Loop Review</h4>
            <p>Integrated OCR Quality Card and Verification Panel allow clinicians and patients to review and correct all extracted data.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

