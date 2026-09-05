import React, { useState } from 'react';
import { Activity, ShieldAlert, User, Lock, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { loginUser, createProfile } from '../services/authService';

export default function LoginPage({ onLoginSuccess, onBackToLanding }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [userName, setUserName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'register') {
        const session = createProfile({ userName, identifier, password });
        onLoginSuccess(session);
      } else {
        const session = loginUser(identifier, password);
        onLoginSuccess(session);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    }
  };

  return (
    <div className="login-container">
      {/* Header Bar */}
      <header className="landing-header">
        <div className="landing-nav">
          <div className="brand-group cursor-pointer" onClick={onBackToLanding}>
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

          <div className="header-safety-indicator">
            <ShieldAlert size={16} className="safety-icon" />
            <div className="safety-indicator-text">
              <span className="safety-badge-title">Information Organizer</span>
              <span className="safety-badge-subtitle">Not a Diagnostic Tool</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Form Box */}
      <main className="login-main">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon-badge">
              {mode === 'register' ? <UserPlus size={24} /> : <LogIn size={24} />}
            </div>
            <h2 className="login-title">
              {mode === 'register' ? 'Create User Profile' : 'Sign In to MedLens'}
            </h2>
            <p className="login-subtitle">
              {mode === 'register'
                ? 'Set up your local user profile to manage and organize patient records.'
                : 'Enter your credentials to access your clinical workspace.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              <LogIn size={15} /> Login
            </button>
            <button
              type="button"
              className={`login-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              <UserPlus size={15} /> Create Profile
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="process-error-banner">
              <ShieldAlert size={16} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Login / Register Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="userNameInput" className="form-label">
                  User Name
                </label>
                <div className="input-icon-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    id="userNameInput"
                    type="text"
                    className="form-input with-icon"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Sreekanth"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="identifierInput" className="form-label">
                Gmail or Mobile Number
              </label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="identifierInput"
                  type="text"
                  className="form-input with-icon"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. sreekanth@gmail.com or 9876543210"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="passwordInput"
                  type="password"
                  className="form-input with-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-login-submit">
              {mode === 'register' ? 'Create Profile' : 'Login'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Hackathon Security Notice */}
          <div className="login-demo-notice">
            <ShieldAlert size={16} className="notice-icon" />
            <p>
              <strong>Demo Authentication System:</strong> Credentials and profiles are stored locally
              in this browser for hackathon demonstration purposes. Do not enter real production credentials or sensitive medical passwords.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

