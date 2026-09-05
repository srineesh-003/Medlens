import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeConsistency } from '../services/consistencyChecker.js';

test('analyzeConsistency identifies matching records and verification warnings', () => {
  const records = [
    { analyte: 'Blood Glucose', value: '95', unit: 'mg/dL', flag: '' },
    { analyte: 'Hemoglobin A1c', value: '5.6', unit: '%', flag: 'H' },
  ];
  const patientInfo = { patientIdName: 'John Doe', age: '45' };
  const reportText = 'Patient John Doe Blood Glucose 95 mg/dL Hemoglobin A1c 5.6 %';

  const result = analyzeConsistency(records, patientInfo, reportText);

  assert.equal(typeof result, 'object');
  assert.ok(Array.isArray(result.consistentItems));
  assert.ok(Array.isArray(result.verificationWarnings));
});

test('analyzeConsistency handles empty inputs gracefully', () => {
  const result = analyzeConsistency([], {}, '');
  assert.ok(Array.isArray(result.consistentItems));
  assert.ok(Array.isArray(result.verificationWarnings));
  assert.equal(result.consistentItems.length, 0);
});
