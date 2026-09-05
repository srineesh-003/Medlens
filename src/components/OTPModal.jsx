import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertTriangle, ArrowRight, Lock, Clock, Info } from 'lucide-react';

export default function OTPModal({
  identifier,
  mode = 'login',
  otpSession,
  onVerifySuccess,
  onResendOtp,
  onCancel,
}) {
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [expirySeconds, setExpirySeconds] = useState(180);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  // Cooldown & Expiry Timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    if (expirySeconds <= 0) {
      setError('OTP has expired. Please click "Resend OTP" to request a new code.');
      return;
    }

    if (attemptsLeft <= 0) {
      setError('Maximum verification attempts exceeded. Please click "Resend OTP".');
      return;
    }

    if (!otpValue || otpValue.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    if (otpValue.trim() !== otpSession.code) {
      const nextAttempts = attemptsLeft - 1;
      setAttemptsLeft(nextAttempts);
      if (nextAttempts <= 0) {
        setError('Incorrect OTP. Maximum attempts exceeded. Please request a new code.');
      } else {
        setError(`Invalid OTP code. ${nextAttempts} attempt(s) remaining.`);
      }
      return;
    }

    // Success
    onVerifySuccess();
  };

  const handleResend = () => {
    onResendOtp();
    setOtpValue('');
    setError('');
    setCooldown(60);
    setExpirySeconds(180);
    setAttemptsLeft(3);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="crop-modal-overlay">
      <div className="otp-modal-card">
        <div className="otp-card-header">
          <div className="otp-icon-circle">
            <ShieldCheck size={28} />
          </div>
          <h2 className="otp-title">
            {mode === 'register' ? 'Verify Account Registration' : 'Two-Factor Authentication'}
          </h2>
          <p className="otp-subtitle">
            A 6-digit One-Time Password (OTP) has been dispatched to:
            <br />
            <strong>{identifier}</strong>
          </p>
        </div>

        {/* Demo Simulation Alert Banner */}
        <div className="otp-sim-banner">
          <Info size={16} className="sim-icon" />
          <div className="sim-text">
            <span>
              <strong>[SECURITY VERIFICATION SIMULATION]</strong>
              <br />
              Generated 6-Digit OTP: <code className="otp-code-highlight">{otpSession.code}</code>
            </span>
          </div>
        </div>

        {/* Expiry & Attempts Bar */}
        <div className="otp-meta-bar">
          <span className="otp-meta-item">
            <Clock size={14} /> Expiration: <strong>{formatTime(expirySeconds)}</strong>
          </span>
          <span className="otp-meta-item">
            Attempts Left: <strong>{attemptsLeft}/3</strong>
          </span>
        </div>

        {error && (
          <div className="process-error-banner">
            <AlertTriangle size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="otp-form">
          <div className="form-group">
            <label htmlFor="otpInputCode" className="form-label text-center">
              Enter 6-Digit OTP Code
            </label>
            <input
              id="otpInputCode"
              type="text"
              className="form-input otp-number-input"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              maxLength={6}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-otp-submit"
            disabled={expirySeconds <= 0 || attemptsLeft <= 0}
          >
            Verify & Open Dashboard <ArrowRight size={16} />
          </button>
        </form>

        <div className="otp-actions-footer">
          <button
            type="button"
            className="btn btn-tertiary btn-sm"
            onClick={handleResend}
            disabled={cooldown > 0}
          >
            <RefreshCw size={13} className={cooldown > 0 ? '' : 'spin-icon-hover'} />
            {cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

