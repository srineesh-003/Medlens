import React from 'react';
import { Sparkles, ShieldAlert, Download, Printer } from 'lucide-react';
import ProvenanceTag from './ProvenanceTag';

export default function AISummary({ aiSummaryText, onDownloadPDF = () => window.print() }) {
  return (
    <section className="dashboard-card ai-summary-card" id="ai-summary">
      <div className="card-header">
        <div className="card-title-group">
          <div className="section-icon-badge ai-icon-badge">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="card-title">AI-Generated Summary</h2>
            <p className="card-description">Structured organization of current clinical observations</p>
          </div>
        </div>
        <div className="header-actions-group">
          <button
            type="button"
            className="btn btn-secondary btn-sm print-hide"
            onClick={onDownloadPDF}
            title="Download PDF report of full workspace findings"
          >
            <Download size={14} /> Download PDF Report
          </button>
          <ProvenanceTag category="AI generated" showLabelPrefix={true} />
        </div>
      </div>

      <div className="summary-body">
        <div className="summary-text-box">
          <p className="summary-content">{aiSummaryText}</p>
        </div>

        <div className="summary-disclaimer-box">
          <ShieldAlert size={18} className="disclaimer-icon" />
          <span className="disclaimer-text">
            This summary organizes the available information and does not provide a diagnosis or treatment recommendation.
          </span>
        </div>
      </div>
    </section>
  );
}
