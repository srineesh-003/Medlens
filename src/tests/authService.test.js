import test from 'node:test';
import assert from 'node:assert';
import { isValidEmail, isValidMobile, isValidPassword } from '../services/authService.js';

test('Security & Auth - Email Validation', () => {
  assert.strictEqual(isValidEmail('doctor@medlens.org'), true);
  assert.strictEqual(isValidEmail('user.name+clinic@domain.co.in'), true);
  assert.strictEqual(isValidEmail('invalid-email'), false);
  assert.strictEqual(isValidEmail('user@'), false);
});

test('Security & Auth - Mobile Number Validation', () => {
  assert.strictEqual(isValidMobile('+14155552671'), true);
  assert.strictEqual(isValidMobile('9876543210'), true);
  assert.strictEqual(isValidMobile('123'), false);
  assert.strictEqual(isValidMobile('abc'), false);
});

test('Security & Auth - Password Validation', () => {
  assert.strictEqual(isValidPassword('Pass1234'), true);
  assert.strictEqual(isValidPassword('123'), false);
});

