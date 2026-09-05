import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Edit3, Check, RefreshCcw, HelpCircle } from 'lucide-react';
import { calculateVerifiedAccuracy } from '../services/accuracyService';

export default function OCRQualityCard({
  overallConfidence = 92,
  fieldMap = {},
  setFieldMap = () => {},
  isOcrActive = false,
}) {
  const [editingKey, setEditingKey] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const fieldsList = Object.values(fieldMap).filter((f) => f.isPresent);
  const totalFieldsExtracted = fieldsList.length;
  const highConfidenceCount = fieldsList.filter((f) => f.confidenceRating === 'High confidence').length;
  const needsVerificationCount = totalFieldsExtracted - highConfidenceCount;

  const verifiedStats = calculateVerifiedAccuracy(fieldMap);

  const handleStartEdit = (field) => {
    setEditingKey(field.key);
    setTempValue(field.verifiedValue);
  };

  const handleSaveEdit = (key) => {
    setFieldMap((prevMap) => {
      const field = prevMap[key];
      if (!field) return prevMap;
      const isSame = tempValue.trim().toLowerCase() === field.extractedValue.trim().toLowerCase();
      return {
        ...prevMap,
        [key]: {
          ...field,
          verifiedValue: tempValue.trim(),
          isVerified: true,
          isCorrect: isSame,
        },
      };
    });
    setEditingKey(null);
  };

  const handleQuickVerify = (key) => {
    setFieldMap((prevMap) => {
      const field = prevMap[key];
      if (!field) return prevMap;
      return {
        ...prevMap,
        [key]: {
          ...field,
          isVerified: true,
          isCorrect: true,
        },
      };
    });
  };

  const handleVerifyAll = () => {
    setFieldMap((prevMap) => {
      const next = { ...prevMap };
      Object.keys(next).forEach((k) => {
        if (next[k].isPresent) {
          next[k] = { ...next[k], isVerified: true };
        }
      });
      return next;
    });
  };

  return (
    <section className="dashboard-card ocr-quality-card" id="ocr-quality">
      <div className="card-header">
        <div className="card-title-group">
          <div className="section-icon-badge ocr-icon-badge">
            <Cpu size={18} />
          </div>
          <div>
            <h2 className="card-title">OCR Quality & Verification Metrics</h2>
            <p className="card-description">Engine confidence ratings vs. human-verified extraction accuracy</p>
          </div>
        </div>
        <div className="header-actions-group">
          <span className="doc-type-badge engine-badge">
            <Cpu size={12} /> Tesseract Engine Active
          </span>
        </div>
      </div>

      {overallConfidence < 70 && (
        <div className="process-error-banner warning-theme">
          <AlertTriangle size={16} className="warning-icon" />
          <span>Low OCR confidence detected — please verify all extracted fields against the source document.</span>
        </div>
      )}

      {/* Grid comparing Engine Confidence vs Verified Accuracy */}
      <div className="ocr-metrics-grid">
        {/* Card 1: Engine OCR Confidence */}
        <div className="ocr-stat-box engine-box">
          <div className="stat-box-header">
            <h3 className="stat-box-title">
              <Cpu size={15} /> OCR Engine Confidence
            </h3>
            <span className="stat-pill-label">Automated</span>
          </div>

          <div className="stat-hero-number">
            <span className="hero-value">{overallConfidence}%</span>
            <span className="hero-label">Overall Document Confidence</span>
          </div>

          <div className="stat-breakdown-list">
            <div className="breakdown-row">
              <span className="breakdown-label">Fields Extracted:</span>
              <span className="breakdown-value">{totalFieldsExtracted}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-label">High Confidence Fields (≥85%):</span>
              <span className="breakdown-value text-success">{highConfidenceCount}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-label">Needs Verification:</span>
              <span className="breakdown-value text-amber">{needsVerificationCount}</span>
            </div>
          </div>
        </div>

        {/* Card 2: User Verified Extraction */}
        <div className="ocr-stat-box verified-box">
          <div className="stat-box-header">
            <h3 className="stat-box-title">
              <ShieldCheck size={15} /> Verified Extraction Accuracy
            </h3>
            <span className="stat-pill-label green-theme">Human Ground-Truth</span>
          </div>

          <div className="stat-hero-number">
            {verifiedStats.verifiedAccuracyPercentage !== null ? (
              <span className="hero-value green-text">{verifiedStats.verifiedAccuracyPercentage}%</span>
            ) : (
              <span className="hero-value muted-text">Not yet measured</span>
            )}
            <span className="hero-label">Verified Field Accuracy</span>
          </div>

          <div className="stat-breakdown-list">
            <div className="breakdown-row">
              <span className="breakdown-label">Fields Verified:</span>
              <span className="breakdown-value">{verifiedStats.fieldsVerifiedCount} / {totalFieldsExtracted}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-label">Correct Extracted:</span>
              <span className="breakdown-value text-success">{verifiedStats.correctCount}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-label">Corrected by User:</span>
              <span className="breakdown-value text-info">{verifiedStats.correctedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Field Verification List */}
      <div className="field-verification-container">
        <div className="verification-section-header">
          <h4 className="verification-subtitle">
            <CheckCircle2 size={16} className="text-primary" /> Field-Level OCR Verification & Corrections
          </h4>
          {fieldsList.length > 0 && (
            <button type="button" className="btn btn-tertiary btn-xs" onClick={handleVerifyAll}>
              <Check size={12} /> Verify All Fields As Correct
            </button>
          )}
        </div>

        {fieldsList.length === 0 ? (
          <p className="empty-fields-text">No extracted fields available for verification yet. Upload or scan a report above.</p>
        ) : (
          <div className="fields-verification-table">
            <div className="table-header-row">
              <span>Medical Field</span>
              <span>Extracted Value (Source Ground-Truth)</span>
              <span>Engine Confidence</span>
              <span>Verification Status</span>
              <span>Action</span>
            </div>

            {fieldsList.map((field) => {
              const isEditing = editingKey === field.key;
              const badgeClass =
                field.confidenceRating === 'High confidence'
                  ? 'badge-high'
                  : field.confidenceRating === 'Medium confidence'
                  ? 'badge-medium'
                  : 'badge-low';

              return (
                <div key={field.key} className={`table-data-row ${field.isVerified ? 'verified-row' : ''}`}>
                  <span className="field-label-cell">{field.label}</span>

                  <span className="extracted-val-cell">
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input form-input-sm"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className={field.verifiedValue !== field.extractedValue ? 'corrected-value-text' : ''}>
                        {field.verifiedValue}
                      </span>
                    )}
                  </span>

                  <span className="confidence-cell">
                    <span className={`confidence-badge ${badgeClass}`}>
                      {field.confidenceScore ? `${field.confidenceScore}% (${field.confidenceRating})` : 'N/A'}
                    </span>
                  </span>

                  <span className="status-cell">
                    {field.isVerified ? (
                      field.isCorrect ? (
                        <span className="verify-tag tag-correct">
                          <Check size={12} /> Correct
                        </span>
                      ) : (
                        <span className="verify-tag tag-corrected">
                          <Edit3 size={12} /> Corrected
                        </span>
                      )
                    ) : (
                      <span className="verify-tag tag-pending">
                        <HelpCircle size={12} /> Unverified
                      </span>
                    )}
                  </span>

                  <span className="action-cell">
                    {isEditing ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => handleSaveEdit(field.key)}
                      >
                        Save
                      </button>
                    ) : (
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => handleStartEdit(field)}
                          title="Edit extracted value"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        {!field.isVerified && (
                          <button
                            type="button"
                            className="btn btn-tertiary btn-xs"
                            onClick={() => handleQuickVerify(field.key)}
                            title="Confirm as correct"
                          >
                            <Check size={12} /> Verify
                          </button>
                        )}
                      </div>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="accuracy-disclaimer-notice">
          <AlertTriangle size={14} className="disclaimer-icon" />
          <span>Accuracy is based on user-verified fields and is not a guarantee of medical accuracy.</span>
        </div>
      </div>
    </section>
  );
}
