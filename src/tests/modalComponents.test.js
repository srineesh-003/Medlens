import test from 'node:test';
import assert from 'node:assert/strict';
import { GEMINI_CONFIG } from '../services/geminiService.js';
import { initiateLogin, initiateRegistration, isValidEmail, isValidMobile, isValidPassword } from '../services/authService.js';

test('Modal Logic: Auth modal validation rules', () => {
  assert.equal(isValidEmail('test@medlens.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidMobile('1234567890'), true);
  assert.equal(isValidMobile('123'), false);
  assert.equal(isValidPassword('Pass123'), true);
  assert.equal(isValidPassword('123'), false);
});

test('Modal Logic: Registration & OTP initiation contract', async () => {
  const result = await initiateRegistration({
    userName: 'Dr. John Test',
    identifier: 'john.test@medlens.com',
    password: 'Password123',
  });

  assert.ok(result.pendingUser);
  assert.ok(result.otpSession);
  assert.equal(result.otpSession.code.length, 6);
  assert.equal(result.otpSession.attemptsLeft, 3);
});

test('Modal Logic: Google Gemini AI Audit configuration contract', () => {
  assert.equal(GEMINI_CONFIG.model, 'gemini-1.5-flash');
  assert.equal(GEMINI_CONFIG.temperature, 0.1);
  assert.ok(Array.isArray(GEMINI_CONFIG.safetySettings));
  assert.equal(GEMINI_CONFIG.safetySettings.length, 4);
});
