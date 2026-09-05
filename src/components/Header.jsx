import React from 'react';
import { Activity, ShieldAlert, Home, LayoutDashboard, FolderOpen, User, LogOut } from 'lucide-react';

export default function Header({
  onGoHome,
  activeTab = 'dashboard',
  onTabChange,
  savedCount = 0,
  currentUser = null,
  onLogout = null,
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group cursor-pointer" onClick={onGoHome} title="Return to Landing Page">
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
          <nav className="header-nav-tabs">
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
                  title="Logout session (saved records remain intact)"
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
