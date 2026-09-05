import test from 'node:test';
import assert from 'node:assert';
import { buildFieldConfidenceMap, calculateVerifiedAccuracy } from '../services/accuracyService.js';

test('Accuracy Service - Unverified Accuracy Initial State', () => {
  const extracted = {
    patientName: 'Kand',
    medication: 'Acetaminophen',
    strength: '500mg',
    frequency: 'Every 6 Hours',
  };

  const fieldMap = buildFieldConfidenceMap(extracted, [], 95);
  const accuracy = calculateVerifiedAccuracy(fieldMap);

  assert.strictEqual(accuracy.verifiedAccuracyPercentage, null);
  assert.strictEqual(accuracy.statusText, 'Not yet measured');
  assert.strictEqual(accuracy.fieldsVerifiedCount, 0);
});

test('Accuracy Service - Calculated Verified Accuracy After User Edits', () => {
  const extracted = {
    patientName: 'Kand',
    medication: 'Acetaminophen',
    strength: '500mg',
    frequency: 'Every 6 Hours',
  };

  const fieldMap = buildFieldConfidenceMap(extracted, [], 95);

  // User verifies patientName as correct
  fieldMap.patientName.isVerified = true;
  fieldMap.patientName.isCorrect = true;

  // User verifies medication as correct
  fieldMap.medication.isVerified = true;
  fieldMap.medication.isCorrect = true;

  const accuracy = calculateVerifiedAccuracy(fieldMap);

  assert.strictEqual(accuracy.fieldsVerifiedCount, 2);
  assert.strictEqual(accuracy.correctCount, 2);
  assert.strictEqual(accuracy.verifiedAccuracyPercentage, 100);
});
