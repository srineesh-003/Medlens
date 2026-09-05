import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDrugInteractions, DRUG_INTERACTION_RULES } from '../services/drugInteractionService.js';

test('checkDrugInteractions detects Lisinopril + Potassium interaction', () => {
  const text = 'Patient prescribed Lisinopril 10mg and Potassium 20mEq supplement';
  const interactions = checkDrugInteractions([], text);

  assert.equal(interactions.length, 1);
  assert.equal(interactions[0].severity, 'High Risk');
  assert.ok(interactions[0].title.includes('ACE Inhibitor'));
});

test('checkDrugInteractions returns empty when no contraindications present', () => {
  const text = 'Patient taking Paracetamol 500mg for headache';
  const interactions = checkDrugInteractions([], text);

  assert.equal(interactions.length, 0);
});
