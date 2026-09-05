import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeWithGemini, GEMINI_CONFIG } from '../services/geminiService.js';

test('analyzeWithGemini returns structured stats and fallback when no API key provided', async () => {
  const reportText = 'Patient Glucose: 95 mg/dL';
  const patientInfo = { patientIdName: 'Sarah Connor' };

  const result = await analyzeWithGemini(reportText, patientInfo, '');

  assert.equal(typeof result, 'object');
  assert.equal(result.isLiveGemini, false);
  assert.equal(result.model, 'gemini-1.5-flash');
  assert.ok(result.latencyMs >= 0);
  assert.ok(result.estimatedTokens > 0);
  assert.equal(result.config.model, GEMINI_CONFIG.model);
});
