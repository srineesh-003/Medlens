import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyPatientInfo } from '../data/sampleData.js';
import { processMedicalReport } from '../services/reportProcessor.js';
import { buildFieldConfidenceMap, calculateVerifiedAccuracy } from '../services/accuracyService.js';

test('End-to-End Workflow: Process report and calculate dual OCR metrics', async () => {
  const sampleReport = `
  PATIENT CLINICAL REPORT
  Patient Name: John Doe
  Doctor: Dr. Sarah Jenkins
  Diagnosis: Essential Hypertension
  Medication: Lisinopril 10mg
  Frequency: Once Daily
  Duration: 30 Days
  `;

  const processed = await processMedicalReport(sampleReport, emptyPatientInfo);

  assert.equal(processed.documentType, 'Prescription');
  assert.ok(processed.records.length >= 1);
  assert.ok(processed.extractedFields.doctorName.includes('Dr. Sarah Jenkins'));
  assert.equal(processed.extractedFields.diagnosis, 'Essential Hypertension');

  // Verify Field Confidence Map Generation
  const confidenceMap = buildFieldConfidenceMap(processed.extractedFields, [], 96);
  assert.ok(confidenceMap.doctorName || confidenceMap.medication);

  // Verify User Verified Accuracy Calculation initial unverified state
  const accuracy = calculateVerifiedAccuracy(confidenceMap);
  assert.equal(accuracy.statusText, 'Not yet measured');
});
