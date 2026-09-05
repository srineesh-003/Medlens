import test from 'node:test';
import assert from 'node:assert';
import { processMedicalReport } from '../services/reportProcessor.js';

test('Report Processor - Tabular Prescription Extraction', async () => {
  const sampleText = `kand DATE
Age 33 - Male - 34 kg 2026-09-05
DIAGNOSIS
Fever & Cold
MEDICATIONS
DRUG DOSAGE ~~ FREQUENCY DURATION INSTRUCTIONS
Acetaminophen 00 Every 6 hours a Do not exceed
nop 500mg as needed 5days 4000mg in 24 hours`;

  const result = await processMedicalReport(sampleText, {});

  assert.strictEqual(result.documentType, 'Prescription');
  assert.strictEqual(result.extractedFields.medication, 'Acetaminophen');
  assert.strictEqual(result.extractedFields.strength, '500mg');
  assert.strictEqual(result.extractedFields.diagnosis, 'Fever & Cold');
  assert.strictEqual(result.extractedFields.patientName, 'Kand');
  assert.strictEqual(result.extractedFields.instructions, 'Do Not Exceed 4000mg In 24 Hours');
});

test('Report Processor - Empty Input Rejection', async () => {
  await assert.rejects(
    async () => {
      await processMedicalReport('', {});
    },
    {
      message: 'Report text is empty. Please enter, paste, or upload medical document content.',
    }
  );
});

