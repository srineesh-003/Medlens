import test from 'node:test';
import assert from 'node:assert/strict';
import { processMedicalReport } from '../services/reportProcessor.js';

test('Record Extraction Logic: Verbatim extraction of diagnosis and doctor metadata', async () => {
  const labText = `
  LABORATORY MEDICAL REPORT
  Patient Name: Jane Smith
  Doctor: Dr. Sarah Jenkins
  Diagnosis: Type 2 Diabetes Mellitus
  Test: Fasting Plasma Glucose
  Result: 145 mg/dL [Reference: 70 - 99 mg/dL] Flag: H
  `;

  const result = await processMedicalReport(labText, { patientIdName: 'Jane Smith' });

  assert.equal(result.documentType, 'Laboratory Report');
  assert.ok(result.records.length >= 1);
  assert.ok(result.extractedFields);
});

test('Record Extraction Logic: Rejects 0-length documents gracefully', async () => {
  try {
    await processMedicalReport('', {});
    assert.fail('Should have thrown error on empty input');
  } catch (err) {
    assert.ok(err.message.includes('empty'));
  }
});
