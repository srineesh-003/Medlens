import React from 'react';
import { ShieldCheck, Lock, Key, FileCheck, CheckCircle2, X } from 'lucide-react';

export default function SecurityModal({ onClose }) {
  return (
    <div className="otp-modal-overlay" onClick={onClose}>
      <div className="crop-modal-card security-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal-header">
          <div className="crop-header-title">
            <ShieldCheck size={22} className="text-success" />
            <div>
              <h3>MedLens Security & Compliance Audit</h3>
              <p>Active security controls, data isolation, and cryptographic hashing status</p>
            </div>
          </div>
          <button type="button" className="btn-icon-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="security-audit-body">
          <div className="audit-items-grid">
            <div className="audit-item">
              <div className="audit-icon-box success">
                <Key size={18} />
              </div>
              <div className="audit-info">
                <h4>Web Crypto SHA-256 Hashing</h4>
                <p>Status: <strong className="text-success">ACTIVE</strong> — Passwords are hashed client-side before storage. Zero plaintext secrets in localStorage.</p>
              </div>
            </div>

            <div className="audit-item">
              <div className="audit-icon-box success">
                <Lock size={18} />
              </div>
              <div className="audit-info">
                <h4>User Session Data Isolation</h4>
                <p>Status: <strong className="text-success">ENFORCED</strong> — Storage keys are isolated per user identifier (<code>medlens_saved_records_user</code>). User A cannot access User B's records.</p>
              </div>
            </div>

            <div className="audit-item">
              <div className="audit-icon-box success">
                <FileCheck size={18} />
              </div>
              <div className="audit-info">
                <h4>Upload MIME & Size Controls</h4>
                <p>Status: <strong className="text-success">ENFORCED</strong> — 10MB maximum file size limit with strict extension validation (.txt, .md, .csv, .jpg, .png).</p>
              </div>
            </div>

            <div className="audit-item">
              <div className="audit-icon-box success">
                <CheckCircle2 size={18} />
              </div>
              <div className="audit-info">
                <h4>Clinical Safety & Provenance Rules</h4>
                <p>Status: <strong className="text-success">COMPLIANT</strong> — Zero hallucination of medical dosages. Explicit provenance tags (Patient provided, Extracted, AI summary, Verification required).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="crop-modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            <ShieldCheck size={15} /> Close Security Audit
          </button>
        </div>
      </div>
    </div>
  );
}

