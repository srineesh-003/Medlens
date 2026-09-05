import React, { useState } from 'react';
import { Table, Info, Filter, Plus, Trash2, FileCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProvenanceTag from './ProvenanceTag';

export default function StructuredRecord({ records, setRecords, documentType = 'Laboratory Report' }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    test: '',
    value: '',
    unit: '',
    range: '',
    status: 'NORMAL',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    observation: '',
    source: 'Extracted from report',
  });

  const filteredRecords = filterStatus === 'ALL'
    ? records
    : records.filter((r) => r.status.toUpperCase() === filterStatus);

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newRecord.test || !newRecord.value) return;

    const recordToAdd = {
      ...newRecord,
      id: `rec-${Date.now()}`,
    };

    setRecords([...records, recordToAdd]);
    setNewRecord({
      test: '',
      value: '',
      unit: '',
      range: '',
      status: 'NORMAL',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      observation: '',
      source: 'Extracted from report',
    });
    setShowAddModal(false);
  };

  const handleDeleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  return (
    <section className="dashboard-card record-card" id="structured-record">
      <div className="card-header flex-between">
        <div className="card-title-group">
          <div className="section-icon-badge">
            <Table size={18} />
          </div>
          <div>
            <h2 className="card-title">Structured Medical Record</h2>
            <p className="card-description">Extracted and structured measurements verbatim from source documents</p>
          </div>
        </div>
        <div className="header-actions-group">
          <span className="doc-type-badge">
            <FileCheck size={13} /> {documentType}
          </span>
          <ProvenanceTag category="Extracted from report" showLabelPrefix={true} />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAddModal(!showAddModal)}
          >
            <Plus size={14} /> Add Row
          </button>
        </div>
      </div>

      <div className="record-controls-bar">
        <div className="filter-group">
          <Filter size={14} className="filter-icon" />
          <span className="filter-label">Filter Status:</span>
          {['ALL', 'NORMAL', 'LOW', 'HIGH', 'UNKNOWN'].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-chip ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
              {st !== 'ALL' && (
                <span className="chip-count">
                  {records.filter((r) => r.status.toUpperCase() === st).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="records-count">
          Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> entries
        </div>
      </div>

      {showAddModal && (
        <form onSubmit={handleAddRecord} className="add-row-form">
          <h4 className="add-row-title">Add Manual Record Entry</h4>
          <div className="add-row-grid">
            <input
              type="text"
              placeholder="Item / Test Name *"
              required
              className="form-input"
              value={newRecord.test}
              onChange={(e) => setNewRecord({ ...newRecord, test: e.target.value })}
            />
            <input
              type="text"
              placeholder="Value / Dosage *"
              required
              className="form-input"
              value={newRecord.value}
              onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
            />
            <input
              type="text"
              placeholder="Unit (e.g. mg/dL, Tablet)"
              className="form-input"
              value={newRecord.unit}
              onChange={(e) => setNewRecord({ ...newRecord, unit: e.target.value })}
            />
            <input
              type="text"
              placeholder="Reference Range / Frequency"
              className="form-input"
              value={newRecord.range}
              onChange={(e) => setNewRecord({ ...newRecord, range: e.target.value })}
            />
            <select
              className="form-select"
              value={newRecord.status}
              onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })}
            >
              <option value="NORMAL">NORMAL</option>
              <option value="LOW">LOW</option>
              <option value="HIGH">HIGH</option>
              <option value="UNKNOWN">UNKNOWN</option>
            </select>
            <input
              type="text"
              placeholder="Observation note"
              className="form-input col-span-2"
              value={newRecord.observation}
              onChange={(e) => setNewRecord({ ...newRecord, observation: e.target.value })}
            />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-sm">Save Entry</button>
              <button
                type="button"
                className="btn btn-tertiary btn-sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="medical-table">
          <thead>
            <tr>
              <th>{documentType === 'Prescription' ? 'Prescribed Item' : 'Test Name'}</th>
              <th>{documentType === 'Prescription' ? 'Dosage / Detail' : 'Value'}</th>
              <th>Unit</th>
              <th>{documentType === 'Prescription' ? 'Instruction / Frequency' : 'Reference Range'}</th>
              <th>Status</th>
              <th>Date</th>
              <th>Observation</th>
              <th>Source</th>
              <th className="th-action"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((rec) => (
                <tr key={rec.id} className={rec.status.toUpperCase() === 'UNKNOWN' ? 'row-unknown' : ''}>
                  <td className="font-semibold text-primary">{rec.test}</td>
                  <td className="font-mono font-medium">{rec.value}</td>
                  <td className="text-secondary">{rec.unit}</td>
                  <td className="font-mono text-secondary">{rec.range}</td>
                  <td>
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="text-muted text-sm">{rec.date}</td>
                  <td className="text-secondary text-sm">{rec.observation}</td>
                  <td>
                    <ProvenanceTag category={rec.source} showLabelPrefix={false} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-icon-danger"
                      title="Remove entry"
                      onClick={() => handleDeleteRecord(rec.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="empty-table-cell">
                  No extracted records match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="unknown-explanation-box">
        <Info size={16} className="info-icon" />
        <div className="explanation-content">
          <strong>Understanding UNKNOWN Status & Factual Extraction:</strong>
          <span>
            {" "}An <strong>UNKNOWN</strong> status signifies that the source medical document omitted reference range or instruction details for classification.
            MedLens extracts strictly verbatim data and never invents missing reference ranges or unmentioned lab tests.
          </span>
        </div>
      </div>
    </section>
  );
}
