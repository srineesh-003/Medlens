import test from 'node:test';
import assert from 'node:assert/strict';
import { scanMedicalImage } from '../services/ocrService.js';

test('scanMedicalImage catches invalid file gracefully in Node environment', async () => {
  const dummyFile = 'non_existent_file.png';
  try {
    const result = await scanMedicalImage(dummyFile);
    assert.equal(typeof result, 'object');
  } catch (err) {
    assert.ok(err.message.includes('Failed to extract text from medical image'));
  }
});
