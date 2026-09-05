import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import PatientInfo from './components/PatientInfo';
import ReportInput from './components/ReportInput';
import StructuredRecord from './components/StructuredRecord';
import VerificationPanel from './components/VerificationPanel';
import AISummary from './components/AISummary';
import SafetyNotice from './components/SafetyNotice';
import ProvenanceTag from './components/ProvenanceTag';
import SavedRecords from './components/SavedRecords';
import { processMedicalReport } from './services/reportProcessor';
import { analyzeConsistency } from './services/consistencyChecker';
import { getSavedRecords, saveRecord, deleteRecord } from './services/storageService';
import { getCurrentUser, logoutUser } from './services/authService';
import {
  emptyPatientInfo,
  initialPatientInfo,
  initialReportText,
  initialRecords,
  initialAISummary,
} from './data/sampleData';
import {
  User,
  FileText,
  Table,
  Sparkles,
  Shield,
  Layers,
  CheckSquare,
  RefreshCw,
  Save,
  FolderOpen,
  LayoutDashboard,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'saved-records'
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [savedRecords, setSavedRecords] = useState(() => getSavedRecords());

  const [patientInfo, setPatientInfo] = useState(emptyPatientInfo);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [reportText, setReportText] = useState('');
  const [records, setRecords] = useState([]);
  const [documentType, setDocumentType] = useState('Laboratory Report');
  const [aiSummaryText, setAiSummaryText] = useState(
    'Enter or upload a medical document above and click "Process Report" to generate an organized summary.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveToast, setSaveToast] = useState('');

  // Phase 3 Consistency State
  const [consistentItems, setConsistentItems] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // Run consistency check whenever records or patientInfo change
  useEffect(() => {
    if (records.length > 0 || reportText.length > 0) {
      const analysis = analyzeConsistency(records, patientInfo, reportText);
      setConsistentItems(analysis.consistentItems);
      setWarnings(analysis.verificationWarnings);
    } else {
      setConsistentItems([]);
      setWarnings([]);
    }
  }, [records, patientInfo, reportText]);

  const handleGetStarted = () => {
    if (currentUser) {
      setView('dashboard');
    } else {
      setView('login');
    }
  };

  const handleLoginSuccess = (session) => {
    setCurrentUser(session);
    setView('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setView('landing');
  };

  const handleProcessReport = async () => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const result = await processMedicalReport(reportText, patientInfo);
      setDocumentType(result.documentType);
      setRecords(result.records);
      setAiSummaryText(result.aiSummary);

      const analysis = analyzeConsistency(result.records, patientInfo, reportText);
      setConsistentItems(analysis.consistentItems);
      setWarnings(analysis.verificationWarnings);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while processing the report.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleReviewed = (id) => {
    setWarnings((prevWarnings) =>
      prevWarnings.map((w) =>
        w.id === id ? { ...w, isReviewed: !w.isReviewed } : w
      )
    );
  };

  const handleLoadDemoSample = () => {
    setPatientInfo(initialPatientInfo);
    setUploadedFileName('Demo Sample Report');
    setReportText(initialReportText);
    setRecords(initialRecords);
    setDocumentType('Laboratory Report');
    setAiSummaryText(initialAISummary);
    setErrorMessage('');
    setCurrentRecordId(null);
  };

  const handleClearWorkspace = () => {
    setPatientInfo(emptyPatientInfo);
    setUploadedFileName('');
    setReportText('');
    setRecords([]);
    setDocumentType('Laboratory Report');
    setAiSummaryText(
      'Enter or upload a medical document above and click "Process Report" to generate an organized summary.'
    );
    setConsistentItems([]);
    setWarnings([]);
    setCurrentRecordId(null);
    setErrorMessage('');
  };

  const handleSaveRecord = () => {
    const recordToSave = {
      id: currentRecordId,
      patientInfo: { ...patientInfo },
      uploadedFileName,
      documentType,
      reportText,
      records: [...records],
      consistentItems: [...consistentItems],
      warnings: [...warnings],
      aiSummaryText,
    };

    const saved = saveRecord(recordToSave, currentRecordId);
    setCurrentRecordId(saved.id);
    setSavedRecords(getSavedRecords());

    const name = patientInfo.patientIdName?.trim() || 'Patient Record';
    setSaveToast(`✓ Saved record for "${name}" to browser storage`);
    setTimeout(() => {
      setSaveToast('');
    }, 3500);
  };

  const handleViewRecord = (record) => {
    setPatientInfo(record.patientInfo || emptyPatientInfo);
    setUploadedFileName(record.uploadedFileName || '');
    setReportText(record.reportText || '');
    setRecords(record.records || []);
    setDocumentType(record.documentType || 'Laboratory Report');
    setAiSummaryText(record.aiSummaryText || '');
    setConsistentItems(record.consistentItems || []);
    setWarnings(record.warnings || []);
    setCurrentRecordId(record.id);
    setActiveTab('dashboard');
    const name = record.patientInfo?.patientIdName?.trim() || 'Patient Record';
    setSaveToast(`Loaded saved record for ${name}`);
    setTimeout(() => {
      setSaveToast('');
    }, 3500);
  };

  const handleDeleteRecord = (id) => {
    const updated = deleteRecord(id);
    setSavedRecords(updated);
    if (currentRecordId === id) {
      setCurrentRecordId(null);
    }
    setSaveToast('Record deleted from browser storage.');
    setTimeout(() => {
      setSaveToast('');
    }, 2500);
  };

  if (view === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  return (
    <div className="app-container">
      <Header
        onGoHome={() => setView('landing')}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedRecords.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="dashboard-layout">
        {/* Navigation Sidebar */}
        <aside className="sidebar-nav">
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Navigation</h3>
            <nav className="nav-menu">
              <button
                type="button"
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={16} /> Workspace Dashboard
              </button>
              <button
                type="button"
                className={`nav-item ${activeTab === 'saved-records' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved-records')}
              >
                <FolderOpen size={16} /> Saved Records ({savedRecords.length})
              </button>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <div className="sidebar-section">
              <h3 className="sidebar-heading">Sections</h3>
              <nav className="nav-menu">
                <a href="#patient-info" className="nav-item">
                  <User size={16} /> Patient Information
                </a>
                <a href="#medical-report" className="nav-item">
                  <FileText size={16} /> Medical Report Input
                </a>
                <a href="#structured-record" className="nav-item">
                  <Table size={16} /> Structured Record
                </a>
                <a href="#review-verify" className="nav-item">
                  <CheckSquare size={16} /> Review & Verify
                </a>
                <a href="#ai-summary" className="nav-item">
                  <Sparkles size={16} /> AI Summary
                </a>
                <a href="#safety-notice" className="nav-item">
                  <Shield size={16} /> Safety Notice
                </a>
              </nav>
            </div>
          )}

          <div className="sidebar-section provenance-legend-box">
            <h3 className="sidebar-heading">
              <Layers size={14} /> Provenance Legend
            </h3>
            <p className="sidebar-subtext">
              Every data element in MedLens clearly indicates its source:
            </p>
            <div className="legend-tags">
              <div className="legend-item">
                <ProvenanceTag category="Patient provided" showLabelPrefix={false} />
                <span className="legend-desc">Entered directly by patient or intake form</span>
              </div>
              <div className="legend-item">
                <ProvenanceTag category="Extracted from report" showLabelPrefix={false} />
                <span className="legend-desc">Extracted verbatim from lab / clinical document</span>
              </div>
              <div className="legend-item">
                <ProvenanceTag category="AI generated" showLabelPrefix={false} />
                <span className="legend-desc">Organized summary generated by AI</span>
              </div>
              <div className="legend-item">
                <ProvenanceTag category="AI generated — Verification required" showLabelPrefix={false} />
                <span className="legend-desc">Data difference flagged for human review</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Content */}
        <main className="main-workspace">
          {activeTab === 'saved-records' ? (
            <SavedRecords
              savedRecords={savedRecords}
              onViewRecord={handleViewRecord}
              onDeleteRecord={handleDeleteRecord}
              onReturnToDashboard={() => setActiveTab('dashboard')}
            />
          ) : (
            <>
              {/* Welcome Banner */}
              <div className="welcome-banner">
                <div>
                  <h2 className="welcome-title">Clinical Workspace — MedLens Intelligence</h2>
                  <p className="welcome-subtitle">
                    Enter your patient information and medical report below to structure records and verify data provenance.
                  </p>
                </div>
                <div className="banner-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveRecord}
                    title="Save current record and processing results"
                  >
                    <Save size={14} /> Save Record
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleClearWorkspace}
                    title="Clear workspace to enter a new record"
                  >
                    <PlusCircle size={14} /> Add New Record
                  </button>
                </div>
              </div>

              {/* Section 2: Patient Information */}
              <PatientInfo patientInfo={patientInfo} setPatientInfo={setPatientInfo} />

              {/* Section 3: Medical Report Input */}
              <ReportInput
                reportText={reportText}
                setReportText={setReportText}
                onProcessReport={handleProcessReport}
                isProcessing={isProcessing}
                errorMessage={errorMessage}
                uploadedFileName={uploadedFileName}
                setUploadedFileName={setUploadedFileName}
              />

              {/* Section 4: Structured Medical Record */}
              <StructuredRecord records={records} setRecords={setRecords} documentType={documentType} />

              {/* Phase 3: Review & Verify Panel */}
              <VerificationPanel
                consistentItems={consistentItems}
                warnings={warnings}
                onToggleReviewed={handleToggleReviewed}
              />

              {/* Section 5: AI Summary */}
              <AISummary aiSummaryText={aiSummaryText} />

              {/* Section 7 & 8: Safety Notice */}
              <SafetyNotice />
            </>
          )}
        </main>
      </div>

      {/* Floating Save Toast Banner */}
      {saveToast && (
        <div className="save-toast-banner">
          <CheckCircle2 size={16} />
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}
