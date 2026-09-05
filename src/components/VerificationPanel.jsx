import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Check, RotateCcw } from 'lucide-react';
import ProvenanceTag from './ProvenanceTag';

export default function VerificationPanel({ consistentItems = [], warnings = [], onToggleReviewed }) {
  const pendingWarnings = warnings.filter((w) => !w.isReviewed);
  const reviewedWarnings = warnings.filter((w) => w.isReviewed);

  return (
    <section className="dashboard-card verification-panel-card" id="review-verify">
      <div className="card-header flex-between">
        <div className="card-title-group">
          <div className="section-icon-badge verification-icon-badge">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="card-title">Review & Verify</h2>
            <p className="card-description">Cross-reference analysis between patient profile and extracted report data</p>
          </div>
        </div>
        <ProvenanceTag category="AI generated — Verification required" showLabelPrefix={false} />
      </div>

      <div className="verification-body">
        {/* Consistent Information List */}
        <div className="verification-section consistent-section">
          <h3 className="verification-subheading text-success">
            <CheckCircle2 size={16} /> Consistent Information ({consistentItems.length})
          </h3>
          <ul className="consistent-list">
            {consistentItems.map((item, idx) => (
              <li key={idx} className="consistent-item">
                <Check size={14} className="check-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Information Requiring Verification */}
        <div className="verification-section warnings-section">
          <h3 className="verification-subheading text-warning">
            <AlertTriangle size={16} /> Information Requiring Verification ({pendingWarnings.length} Pending)
          </h3>

          {warnings.length === 0 ? (
            <div className="no-warnings-box">
              <CheckCircle2 size={18} className="success-icon" />
              <span>No data contradictions or unlisted information items detected across patient profile and processed report.</span>
            </div>
          ) : (
            <div className="warnings-list">
              {warnings.map((w) => (
                <div key={w.id} className={`warning-card ${w.isReviewed ? 'reviewed' : ''}`}>
                  <div className="warning-card-header">
                    <div className="warning-title-group">
                      <AlertTriangle size={16} className={w.isReviewed ? 'text-muted' : 'warning-amber-icon'} />
                      <span className="warning-card-title">{w.title}</span>
                      <span className="warning-field-tag">{w.field}</span>
                    </div>
                    <ProvenanceTag category="AI generated — Verification required" showLabelPrefix={false} />
                  </div>

                  <p className="warning-description">{w.description}</p>

                  <div className="warning-card-footer">
                    <button
                      type="button"
                      className={`btn btn-sm ${w.isReviewed ? 'btn-secondary' : 'btn-warning-action'}`}
                      onClick={() => onToggleReviewed(w.id)}
                    >
                      {w.isReviewed ? (
                        <>
                          <RotateCcw size={13} /> Marked as Reviewed (Undo)
                        </>
                      ) : (
                        <>
                          <Check size={13} /> Mark as Reviewed
                        </>
                      )}
                    </button>
                    {w.isReviewed && (
                      <span className="reviewed-badge">
                        <Check size={12} /> Human Review Complete
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature 4 Safety Notice */}
        <div className="verification-safety-banner">
          <ShieldCheck size={16} className="safety-banner-icon" />
          <span className="safety-banner-text">
            These findings identify information differences for human review. They are not medical diagnoses or treatment recommendations.
          </span>
        </div>
      </div>
    </section>
  );
}

