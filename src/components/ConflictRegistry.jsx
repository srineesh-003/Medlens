import React from 'react';
import { AlertTriangle, CheckCircle2, Check, ShieldAlert } from 'lucide-react';
import ProvenanceTag from './ProvenanceTag';

export default function ConflictRegistry({ warnings = [], onToggleReviewed = () => {} }) {
  const pendingCount = warnings.filter((w) => !w.isReviewed).length;

  return (
    <section className="dashboard-card conflict-registry-card" id="review-verify">
      <div className="card-header">
        <div className="card-title-group">
          <div className="section-icon-badge verification-icon-badge">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className="card-title">Information Requiring Verification ({pendingCount} Pending)</h2>
            <p className="card-description">Flagged clinical data differences between patient context and report findings</p>
          </div>
        </div>
        <div className="header-actions-group">
          <span className="doc-type-badge warning-theme-badge">
            <ShieldAlert size={12} /> Data Provenance Check
          </span>
        </div>
      </div>

      {warnings.length === 0 ? (
        <div className="process-success-banner">
          <CheckCircle2 size={16} className="success-icon" />
          <span>No information inconsistencies detected. Extracted report findings align with patient context.</span>
        </div>
      ) : (
        <div className="conflict-cards-list">
          {warnings.map((item) => (
            <div
              key={item.id}
              className={`conflict-item-card ${item.isReviewed ? 'reviewed-card' : ''}`}
            >
              <div className="conflict-card-header">
                <div className="conflict-title-box">
                  <AlertTriangle size={16} className="conflict-alert-icon" />
                  <h3 className="conflict-card-title">{item.title}</h3>
                  <span className="conflict-category-pill">{item.category}</span>
                </div>
                <ProvenanceTag
                  category="AI generated — Verification required"
                  showLabelPrefix={false}
                />
              </div>

              <p className="conflict-card-desc">{item.description}</p>

              <div className="conflict-card-footer">
                <button
                  type="button"
                  className={`btn ${item.isReviewed ? 'btn-secondary' : 'btn-warning-action'} btn-sm`}
                  onClick={() => onToggleReviewed(item.id)}
                >
                  <Check size={14} />
                  {item.isReviewed ? 'Reviewed (Undo)' : 'Mark as Reviewed'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
