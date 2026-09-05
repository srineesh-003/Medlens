import React, { useState } from 'react';
import { Activity, ShieldAlert, Home, LayoutDashboard, FolderOpen, LogOut, ShieldCheck, Sparkles, Sun, Moon } from 'lucide-react';
import SecurityModal from './SecurityModal';
import SafetyGuardrailsModal from './SafetyGuardrailsModal';
import GoogleAIAuditModal from './GoogleAIAuditModal';

export default function Header({
  onGoHome,
  activeTab = 'dashboard',
  onTabChange,
  savedCount = 0,
  currentUser = null,
  onLogout = null,
  doctorName = 'Dr. Sarah Jenkins',
}) {
  const [showSecurityAudit, setShowSecurityAudit] = useState(false);
  const [showGuardrailsModal, setShowGuardrailsModal] = useState(false);
  const [showGoogleAiModal, setShowGoogleAiModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark-theme');
  };

  return (
    <header className="app-header" role="banner">
      {showSecurityAudit && <SecurityModal onClose={() => setShowSecurityAudit(false)} />}
      {showGuardrailsModal && <SafetyGuardrailsModal onClose={() => setShowGuardrailsModal(false)} />}
      {showGoogleAiModal && <GoogleAIAuditModal isOpen={showGoogleAiModal} onClose={() => setShowGoogleAiModal(false)} />}

      <div className="header-container">
        <div
          className="brand-group cursor-pointer"
          onClick={onGoHome}
          title="Return to Landing Page"
          tabIndex={0}
          role="button"
          aria-label="MedLens Home"
        >
          <div className="brand-icon-wrapper">
            <Activity size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">
              Med<span className="brand-accent">Lens</span>
            </h1>
            <p className="brand-subtitle">AI Clinical Information Intelligence</p>
          </div>
        </div>

        {onTabChange && (
          <nav className="header-nav-tabs" role="navigation" aria-label="Main Navigation">
            <button
              type="button"
              className={`header-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => onTabChange('dashboard')}
              aria-label="Workspace Dashboard"
            >
              <LayoutDashboard size={15} /> Workspace Dashboard
            </button>
            <button
              type="button"
              className={`header-nav-tab ${activeTab === 'saved-records' ? 'active' : ''}`}
              onClick={() => onTabChange('saved-records')}
              aria-label="Saved Records"
            >
              <FolderOpen size={15} /> Saved Records
              {savedCount > 0 && <span className="nav-badge-count">{savedCount}</span>}
            </button>
          </nav>
        )}

        <div className="header-actions">
          {/* Guardrails Active Status Pill */}
          <button
            type="button"
            className="btn btn-tertiary btn-xs guardrails-status-pill"
            onClick={() => setShowGuardrailsModal(true)}
            title="Click to view Clinical Safety & Guardrails Mandate"
            aria-label="Clinical Guardrails Active Status"
          >
            <span className="pulse-dot"></span>
            <span>Guardrails Active</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn btn-secondary btn-xs theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Light / Dark Theme"
            aria-label="Toggle display theme"
          >
            {isDarkMode ? <Sun size={13} className="text-amber" /> : <Moon size={13} />}
            <span>{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>

          {/* Security Audit Button */}
          <button
            type="button"
            className="btn btn-tertiary btn-xs security-audit-trigger-btn"
            onClick={() => setShowSecurityAudit(true)}
            title="View live security & compliance audit"
            aria-label="Security Audit 100%"
          >
            <ShieldCheck size={14} className="text-success" />
            <span>Security: 100% Audit</span>
          </button>

          {/* Google Gemini AI Audit Badge */}
          <button
            type="button"
            className="gemini-power-badge cursor-pointer border-none bg-transparent"
            onClick={() => setShowGoogleAiModal(true)}
            title="Click to view Google Gemini AI Integration Audit"
            aria-label="Google Gemini AI Integration Audit"
          >
            <Sparkles size={13} className="text-purple" /> Powered by Google Gemini AI ⚡
          </button>

          {/* Clinician / Doctor Profile Bar */}
          <div className="clinician-profile-bar" title={`Attending Physician: ${doctorName}`}>
            <div className="clinician-avatar">SJ</div>
            <div className="clinician-details">
              <span className="clinician-name">{doctorName}</span>
              <span className="clinician-role">CLINICIAN • Active Auth</span>
            </div>
          </div>

          {currentUser && onLogout && (
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-logout"
              onClick={onLogout}
              title="Logout session"
              aria-label="Logout user session"
            >
              <LogOut size={13} /> Logout
            </button>
          )}

          {onGoHome && (
            <button
              type="button"
              className="btn btn-secondary btn-sm header-home-btn"
              onClick={onGoHome}
              title="Back to Landing Page"
              aria-label="Navigate to Landing Page"
            >
              <Home size={14} /> Home
            </button>
          )}

          <div
            className="header-safety-indicator cursor-pointer"
            onClick={() => setShowGuardrailsModal(true)}
            title="Click to view MedLens Clinical Safety Mandate"
            role="button"
            aria-label="Safety indicator"
            tabIndex={0}
          >
            <ShieldAlert size={16} className="safety-icon" />
            <div className="safety-indicator-text">
              <span className="safety-badge-title">Information Organizer</span>
              <span className="safety-badge-subtitle">Not a Diagnostic Tool</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
