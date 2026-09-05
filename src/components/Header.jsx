import React, { useState } from 'react';
import { Activity, ShieldAlert, Home, LayoutDashboard, FolderOpen, User, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import SecurityModal from './SecurityModal';

export default function Header({
  onGoHome,
  activeTab = 'dashboard',
  onTabChange,
  savedCount = 0,
  currentUser = null,
  onLogout = null,
}) {
  const [showSecurityAudit, setShowSecurityAudit] = useState(false);

  return (
    <header className="app-header" role="banner">
      {showSecurityAudit && <SecurityModal onClose={() => setShowSecurityAudit(false)} />}

      <div className="header-container">
        <div className="brand-group cursor-pointer" onClick={onGoHome} title="Return to Landing Page" tabIndex={0}>
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
            >
              <LayoutDashboard size={15} /> Workspace Dashboard
            </button>
            <button
              type="button"
              className={`header-nav-tab ${activeTab === 'saved-records' ? 'active' : ''}`}
              onClick={() => onTabChange('saved-records')}
            >
              <FolderOpen size={15} /> Saved Records
              {savedCount > 0 && <span className="nav-badge-count">{savedCount}</span>}
            </button>
          </nav>
        )}

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-tertiary btn-xs security-audit-trigger-btn"
            onClick={() => setShowSecurityAudit(true)}
            title="View live security & compliance audit"
          >
            <ShieldCheck size={14} className="text-success" />
            <span>Security: 100% Audit</span>
          </button>

          <span className="gemini-power-badge" title="Powered by Google Gemini AI Flash models">
            <Sparkles size={13} className="text-purple" /> Powered by Google Gemini AI
          </span>

          {currentUser && (
            <div className="user-profile-bar">
              <div className="user-profile-badge" title={`Logged in as ${currentUser.identifier}`}>
                <User size={15} className="user-avatar-icon" />
                <span className="user-greeting">Hello, {currentUser.userName || 'User'} 👋</span>
              </div>
              {onLogout && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm btn-logout"
                  onClick={onLogout}
                  title="Logout session"
                >
                  <LogOut size={13} /> Logout
                </button>
              )}
            </div>
          )}

          {onGoHome && (
            <button
              type="button"
              className="btn btn-secondary btn-sm header-home-btn"
              onClick={onGoHome}
              title="Back to Landing Page"
            >
              <Home size={14} /> Home
            </button>
          )}

          <div
            className="header-safety-indicator"
            title="MedLens is an information organizer and never diagnoses or prescribes."
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
