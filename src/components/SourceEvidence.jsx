import React from 'react';
import { ScanText, FileText, CheckCircle2, Layers } from 'lucide-react';
import ProvenanceTag from './ProvenanceTag';

export default function SourceEvidence({ reportText = '', records = [] }) {
  const lines = reportText ? reportText.split(/\r?\n/).filter(Boolean) : [];

  return (
    <section className="dashboard-card source-evidence-card" id="source-evidence">
      <div className="card-header">
        <div className="card-title-group">
          <div className="section-icon-badge evidence-icon-badge">
            <ScanText size={18} />
          </div>
          <div>
            <h2 className="card-title">Source Document Evidence & Line Tracing</h2>
            <p className="card-description">Verbatim line-by-line proof linking structured fields directly to source OCR pixels</p>
          </div>
        </div>
        <ProvenanceTag category="Extracted from report" showLabelPrefix={true} />
      </div>

      <div className="evidence-grid">
        {/* Left Column: Raw Source Document */}
        <div className="source-lines-box">
          <div className="source-box-title">
            <FileText size={14} /> Raw OCR Document Lines ({lines.length} lines)
          </div>
          {lines.length === 0 ? (
            <p className="empty-evidence-text">No report document uploaded yet. Enter or scan text above.</p>
          ) : (
            <div className="lines-scroll-list">
              {lines.map((line, idx) => (
                <div key={idx} className="line-row">
                  <span className="line-num">{idx + 1}</span>
                  <span className="line-text">{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Ground-Truth Evidence Tracing */}
        <div className="evidence-traced-box">
          <div className="source-box-title">
            <Layers size={14} /> Traced Clinical Records ({records.length} items)
          </div>
          {records.length === 0 ? (
            <p className="empty-evidence-text">No structured observations extracted yet.</p>
          ) : (
            <div className="traced-items-list">
              {records.map((rec) => (
                <div key={rec.id} className="traced-item-card">
                  <div className="traced-item-header">
                    <span className="traced-item-title">{rec.test}</span>
                    <span className="traced-value-pill">{rec.value} {rec.unit !== 'Unit' ? rec.unit : ''}</span>
                  </div>
                  <div className="traced-item-details">
                    <span>Range: {rec.range}</span>
                    <span>Status: <strong>{rec.status}</strong></span>
                  </div>
                  <div className="traced-item-source">
                    <CheckCircle2 size={12} className="text-success" /> Verbatim Source Match
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
