import React from 'react';
import {
  FolderOpen,
  Calendar,
  FileText,
  Trash2,
  ExternalLink,
  ArrowLeft,
  ShieldAlert,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function SavedRecords({
  savedRecords = [],
  onViewRecord,
  onDeleteRecord,
  onReturnToDashboard,
}) {
  return (
    <div className="saved-records-container">
      {/* Header Banner */}
      <div className="saved-records-header">
        <div className="saved-records-title-group">
          <div className="saved-records-icon-wrapper">
            <FolderOpen size={24} />
          </div>
          <div>
            <h2 className="saved-records-title">Saved Patient Records</h2>
            <p className="saved-records-subtitle">
              Locally stored clinical records and processed reports ({savedRecords.length}{' '}
              {savedRecords.length === 1 ? 'record' : 'records'})
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onReturnToDashboard}
        >
          <ArrowLeft size={14} /> Return to Current Dashboard
        </button>
      </div>

      {/* Privacy UX Notice */}
      <div className="saved-records-privacy-notice">
        <ShieldAlert size={18} className="privacy-notice-icon" />
        <div className="privacy-notice-text">
          <strong>IMPORTANT PRIVACY NOTICE:</strong> Demo records are stored locally in
          this browser for demonstration purposes. Do not use real patient information.
        </div>
      </div>

      {/* Records List or Empty State */}
      {savedRecords.length === 0 ? (
        <div className="empty-saved-records-card">
          <div className="empty-saved-icon-circle">
            <FolderOpen size={36} />
          </div>
          <h3 className="empty-saved-title">No saved records yet.</h3>
          <p className="empty-saved-text">
            When you process patient info and medical reports in the MedLens dashboard,
            click <strong>"Save Record"</strong> to store and review them here anytime.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onReturnToDashboard}
          >
            Go to Dashboard & Process a Report <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      ) : (
        <div className="saved-records-grid">
          {savedRecords.map((record) => {
            const patientName = record.patientInfo?.patientIdName?.trim() || 'Not provided';
            const ageDisplay = record.patientInfo?.age?.trim()
              ? `Age ${record.patientInfo.age.trim()}`
              : 'Age: Not provided';
            const sexDisplay =
              record.patientInfo?.sex?.trim() && record.patientInfo.sex !== 'Select sex'
                ? record.patientInfo.sex.trim()
                : 'Sex: Not provided';
            const ageSex = `${ageDisplay} • ${sexDisplay}`;

            const recordCount = record.records?.length || 0;
            const warningCount = record.warnings?.length || 0;
            const consistentCount = record.consistentItems?.length || 0;

            return (
              <div key={record.id} className="saved-record-card">
                <div className="saved-card-header">
                  <div className="saved-patient-info">
                    <div className="saved-user-avatar">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="saved-patient-name">{patientName}</h3>
                      <p className="saved-patient-meta">
                        <span className="saved-age-sex">{ageSex}</span>
                      </p>
                    </div>
                  </div>
                  <span className="doc-type-badge">{record.documentType || 'Report'}</span>
                </div>

                <div className="saved-card-body">
                  <div className="saved-meta-row">
                    <span className="saved-meta-item">
                      <Calendar size={13} /> Saved: {record.formattedDate || new Date(record.savedAt).toLocaleDateString()}
                    </span>
                    {record.uploadedFileName && (
                      <span className="saved-meta-item">
                        <FileText size={13} /> {record.uploadedFileName}
                      </span>
                    )}
                  </div>

                  {/* Summary Chips */}
                  <div className="saved-summary-chips">
                    <span className="saved-chip blue-chip">
                      <FileText size={12} /> {recordCount} {recordCount === 1 ? 'Observation' : 'Observations'}
                    </span>
                    {consistentCount > 0 && (
                      <span className="saved-chip green-chip">
                        <CheckCircle2 size={12} /> {consistentCount} Consistent
                      </span>
                    )}
                    {warningCount > 0 && (
                      <span className="saved-chip amber-chip">
                        <AlertTriangle size={12} /> {warningCount} Verification Needed
                      </span>
                    )}
                  </div>

                  {/* AI Summary Preview */}
                  {record.aiSummaryText && (
                    <p className="saved-ai-preview">
                      <Info size={12} className="ai-preview-icon" />{' '}
                      {record.aiSummaryText.slice(0, 140)}
                      {record.aiSummaryText.length > 140 ? '...' : ''}
                    </p>
                  )}
                </div>

                <div className="saved-card-footer">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onViewRecord(record)}
                  >
                    <ExternalLink size={13} /> Open / View Record
                  </button>
                  <button
                    type="button"
                    className="btn btn-tertiary btn-sm btn-delete-saved"
                    onClick={() => onDeleteRecord(record.id)}
                    title="Delete saved record"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
