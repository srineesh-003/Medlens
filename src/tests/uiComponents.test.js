import test from 'node:test';
import assert from 'node:assert/strict';
import { initialRecords, initialPatientInfo } from '../data/sampleData.js';
import { checkDrugInteractions } from '../services/drugInteractionService.js';
import { analyzeConsistency } from '../services/consistencyChecker.js';
import { buildFieldConfidenceMap, calculateVerifiedAccuracy } from '../services/accuracyService.js';

test('UI Data Contract: sampleData schema integrity', () => {
  assert.ok(Array.isArray(initialRecords));
  assert.ok(initialRecords.length > 0);
  assert.ok(initialPatientInfo.patientIdName);
});

test('UI Component Logic: Field confidence map handles missing values', () => {
  const emptyMap = buildFieldConfidenceMap({}, [], 85);
  assert.equal(emptyMap.patientName.extractedValue, 'Not provided');
  assert.equal(emptyMap.patientName.verifiedValue, 'Not provided');
  assert.equal(emptyMap.patientName.isPresent, false);

  const accuracy = calculateVerifiedAccuracy(emptyMap);
  assert.equal(accuracy.fieldsVerifiedCount, 0);
  assert.equal(accuracy.statusText, 'Not yet measured');
});

test('UI Component Logic: Consistency checker warning flags', () => {
  const records = [{ test: 'Blood Glucose', value: '150', unit: 'mg/dL' }];
  const patient = { patientIdName: 'John', age: '50' };
  const text = 'John Blood Glucose 150 mg/dL';

  const result = analyzeConsistency(records, patient, text);
  assert.ok(Array.isArray(result.consistentItems));
  assert.ok(Array.isArray(result.verificationWarnings));
});

test('UI Component Logic: Drug interaction contraindication checker', () => {
  const records = [{ medication: 'Lisinopril' }, { medication: 'Potassium' }];
  const text = 'Lisinopril 10mg and Potassium 20mEq';

  const interactions = checkDrugInteractions(records, text);
  assert.equal(interactions.length, 1);
  assert.equal(interactions[0].severity, 'High Risk');
});
