/**
 * MedLens OCR Accuracy & Field Verification Service
 * 
 * Rules:
 * 1. Differentiate Engine Confidence % from Verified Extraction Accuracy %.
 * 2. Never fake or hardcode accuracy scores.
 * 3. Verified Accuracy is ONLY calculated after comparing extracted values with user-verified values.
 * 4. Fields absent from source ("Not provided" / "Unknown") are NOT counted as OCR errors.
 * 5. Ground truth is strictly the source document/user verification, never AI outputs.
 */

export const TRACKED_FIELDS = [
  { key: 'patientName', label: 'Patient Name' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'date', label: 'Date' },
  { key: 'medication', label: 'Medication' },
  { key: 'strength', label: 'Strength / Dosage' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'duration', label: 'Duration' },
  { key: 'instructions', label: 'Instructions' },
  { key: 'diagnosis', label: 'Diagnosis' },
];

/**
 * Calculates initial OCR confidence state from OCR engine results and extracted record fields.
 */
export function buildFieldConfidenceMap(extractedFields = {}, ocrWords = [], overallConfidence = 92) {
  const map = {};

  TRACKED_FIELDS.forEach(({ key, label }) => {
    const value = extractedFields[key] || 'Not provided';
    const isPresent = value !== 'Not provided' && value !== 'Unknown' && value.trim() !== '';

    let confidenceScore = overallConfidence;

    // If word confidence list is available, estimate field confidence from matching words
    if (isPresent && ocrWords && ocrWords.length > 0) {
      const fieldWords = value.toLowerCase().split(/\s+/);
      const matched = ocrWords.filter((w) => fieldWords.some((fw) => fw.includes(w.text.toLowerCase()) || w.text.toLowerCase().includes(fw)));
      if (matched.length > 0) {
        const sum = matched.reduce((acc, curr) => acc + curr.confidence, 0);
        confidenceScore = Math.round(sum / matched.length);
      }
    }

    let confidenceRating = 'High confidence';
    if (confidenceScore < 70) {
      confidenceRating = 'Low confidence';
    } else if (confidenceScore < 85) {
      confidenceRating = 'Medium confidence';
    }

    map[key] = {
      key,
      label,
      extractedValue: isPresent ? value : 'Not provided',
      verifiedValue: isPresent ? value : 'Not provided',
      isPresent,
      confidenceScore: isPresent ? confidenceScore : null,
      confidenceRating: isPresent ? confidenceRating : 'N/A',
      isVerified: false,
      isCorrect: true,
    };
  });

  return map;
}

/**
 * Calculates verified accuracy stats based on user-verified fields.
 */
export function calculateVerifiedAccuracy(fieldMap) {
  if (!fieldMap) {
    return {
      fieldsVerifiedCount: 0,
      correctCount: 0,
      correctedCount: 0,
      verifiedAccuracyPercentage: null, // "Not yet measured"
      statusText: 'Not yet measured',
    };
  }

  const fields = Object.values(fieldMap).filter((f) => f.isPresent);
  const verifiedFields = fields.filter((f) => f.isVerified);

  if (verifiedFields.length === 0) {
    return {
      fieldsVerifiedCount: 0,
      correctCount: 0,
      correctedCount: 0,
      verifiedAccuracyPercentage: null,
      statusText: 'Not yet measured',
    };
  }

  const correctCount = verifiedFields.filter((f) => f.isCorrect).length;
  const correctedCount = verifiedFields.length - correctCount;
  const accuracyPct = Math.round((correctCount / verifiedFields.length) * 100 * 10) / 10;

  return {
    fieldsVerifiedCount: verifiedFields.length,
    correctCount,
    correctedCount,
    verifiedAccuracyPercentage: accuracyPct,
    statusText: `${accuracyPct}% verified accuracy (${correctCount}/${verifiedFields.length} fields correct)`,
  };
}
