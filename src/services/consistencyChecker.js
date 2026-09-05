/**
 * MedLens Consistency & Verification Service
 * 
 * Performs factual cross-referencing between patient-provided information
 * and extracted report observations.
 * 
 * Rules:
 * - Truly matching information -> Consistent Information
 * - Any information differences (missing in one source, unmentioned, or conflicting) -> Information Requiring Verification
 * - All verification findings are labeled "AI generated — Verification required"
 * - Uses Patient Information as SINGLE SOURCE OF TRUTH. No hardcoded names or IDs.
 */

export function analyzeConsistency(records = [], patientInfo = {}, reportText = '') {
  const warnings = [];
  const consistentItems = [];
  let warningId = 1;

  const rawReportLower = (reportText || '').toLowerCase();
  const patientMedsRaw = patientInfo.medications || '';
  const patientMedsLower = patientMedsRaw.toLowerCase();
  const patientConditionsRaw = patientInfo.existingConditions || '';
  const patientConditionsLower = patientConditionsRaw.toLowerCase();
  const patientAllergiesRaw = patientInfo.allergies || '';
  const patientAllergiesLower = patientAllergiesRaw.toLowerCase();
  const patientName = patientInfo.patientIdName?.trim() || '';

  // 1. Patient Identity Verification
  if (patientName) {
    const tokens = patientName.toLowerCase().split(/[\s·•,-]+/).filter((t) => t.length > 1);
    const hasMatch = tokens.length > 0 && tokens.some((t) => rawReportLower.includes(t));
    if (hasMatch) {
      consistentItems.push(`Patient identity (${patientName}) confirmed in source report text.`);
    }
  }

  // 2. Medication Consistency Check
  const commonMedications = [
    'levothyroxine', 'synthroid', 'metformin', 'lisinopril', 'amlodipine',
    'atorvastatin', 'lipitor', 'omeprazole', 'metoprolol', 'albuterol',
    'aspirin', 'ibuprofen', 'multivitamin', 'vitamin d', 'penicillin', 'amoxicillin',
    'acetaminophen'
  ];

  // A. Check medications mentioned in the report text
  const reportMedsFound = [];
  commonMedications.forEach((med) => {
    if (rawReportLower.includes(med)) {
      reportMedsFound.push(med);
      if (patientMedsLower.includes(med)) {
        consistentItems.push(`Medication '${capitalize(med)}' confirmed in both patient profile and source report.`);
      } else if (patientMedsLower.includes('no medications')) {
        warnings.push({
          id: `warn-${warningId++}`,
          title: `Unlisted Medication Mentioned in Report`,
          description: `Potential information inconsistency: The report mentions ${capitalize(med)}, but it is not listed under Current Medications.`,
          field: 'Current Medications',
          category: 'AI generated — Verification required',
          isReviewed: false,
        });
      } else {
        warnings.push({
          id: `warn-${warningId++}`,
          title: `Medication Difference`,
          description: `Potential information inconsistency: The report mentions ${capitalize(med)}, which is not listed in Current Medications (${patientMedsRaw || 'Not provided'}).`,
          field: 'Current Medications',
          category: 'AI generated — Verification required',
          isReviewed: false,
        });
      }
    }
  });

  // B. Check medications listed by patient but NOT mentioned in the report
  if (patientMedsRaw && !patientMedsLower.includes('no medications')) {
    const userMedsList = patientMedsRaw.split(/,|\//).map((m) => m.trim()).filter(Boolean);
    userMedsList.forEach((uMed) => {
      const uMedLower = uMed.toLowerCase();
      const matched = commonMedications.some((cm) => uMedLower.includes(cm) && rawReportLower.includes(cm)) || rawReportLower.includes(uMedLower);
      if (!matched) {
        warnings.push({
          id: `warn-${warningId++}`,
          title: `Patient Medication Not Mentioned in Report`,
          description: `Potential information inconsistency: Current Medications lists '${uMed}', but it is not mentioned in the source medical report.`,
          field: 'Current Medications',
          category: 'AI generated — Verification required',
          isReviewed: false,
        });
      }
    });
  }

  // 3. Existing Conditions Consistency Check
  const commonConditions = [
    'hypertension', 'diabetes', 'hypothyroidism', 'hyperthyroidism',
    'asthma', 'anemia', 'hyperlipidemia', 'kidney disease', 'fever', 'cold'
  ];

  // A. Conditions in report but not in patient profile
  commonConditions.forEach((cond) => {
    if (rawReportLower.includes(cond)) {
      if (patientConditionsLower.includes(cond)) {
        consistentItems.push(`Condition '${capitalize(cond)}' confirmed in both patient profile and source report.`);
      } else {
        warnings.push({
          id: `warn-${warningId++}`,
          title: `Unlisted Condition in Report`,
          description: `Potential information inconsistency: The report mentions ${capitalize(cond)}, but it is not listed under Existing Conditions.`,
          field: 'Existing Conditions',
          category: 'AI generated — Verification required',
          isReviewed: false,
        });
      }
    }
  });

  // B. Conditions in patient profile but not in report
  if (patientConditionsRaw && !patientConditionsLower.includes('no chronic') && !patientConditionsLower.includes('no conditions')) {
    const userConditionsList = patientConditionsRaw.split(/,|\//).map((c) => c.trim()).filter(Boolean);
    userConditionsList.forEach((uCond) => {
      const uCondLower = uCond.toLowerCase();
      const matched = commonConditions.some((cc) => uCondLower.includes(cc) && rawReportLower.includes(cc)) || rawReportLower.includes(uCondLower);
      if (!matched) {
        warnings.push({
          id: `warn-${warningId++}`,
          title: `Patient Condition Not Mentioned in Report`,
          description: `Potential information inconsistency: Existing Conditions lists '${uCond}', but it is not mentioned in the source medical report.`,
          field: 'Existing Conditions',
          category: 'AI generated — Verification required',
          isReviewed: false,
        });
      }
    });
  }

  // 4. Allergy Conflict Check
  if (patientAllergiesRaw && !patientAllergiesLower.includes('none')) {
    const allergyList = patientAllergiesRaw.split(/,|\//).map((a) => a.trim()).filter(Boolean);
    allergyList.forEach((allergy) => {
      const allergyLower = allergy.toLowerCase();
      if (allergyLower.length > 2 && rawReportLower.includes(allergyLower)) {
        warnings.push({
          id: `warn-${warningId++}`,
          title: `Reported Allergy Mentioned in Report`,
          description: `Potential information inconsistency: Patient information lists '${allergy}' under Allergies, and '${allergy}' is mentioned in the report text.`,
          field: 'Allergies',
          category: 'AI generated — Verification required',
          isReviewed: false,
        });
      } else {
        consistentItems.push(`Allergy entry '${allergy}' checked against source report text (no allergen conflicts detected).`);
      }
    });
  }

  // 5. Test Measurement Variance Check
  const testMap = {};
  records.forEach((rec) => {
    const normTest = rec.test.toLowerCase();
    if (!testMap[normTest]) {
      testMap[normTest] = [];
    }
    testMap[normTest].push(rec);
  });

  Object.keys(testMap).forEach((tName) => {
    const testList = testMap[tName];
    if (testList.length > 1) {
      const firstVal = testList[0].value;
      const hasDiff = testList.some((t) => t.value !== firstVal);
      if (hasDiff) {
        warnings.push({
          id: `warn-${warningId++}`,
          title: `Multiple Test Measurements Differ`,
          description: `Information variance: Test '${testList[0].test}' appears ${testList.length} times with differing values (${testList.map((t) => t.value).join(', ')}).`,
          field: 'Structured Medical Record',
          category: 'AI generated — Verification required',
          isReviewed: false,
        });
      } else {
        consistentItems.push(`Multiple entries for '${testList[0].test}' report identical measurements (${firstVal}).`);
      }
    }
  });

  // Default consistent item if alignment confirmed
  if (consistentItems.length === 0 && patientName) {
    consistentItems.push(`Patient identity (${patientName}) and profile parameters recorded.`);
  }

  return {
    consistentItems,
    verificationWarnings: warnings,
    analyzedAt: new Date().toISOString(),
  };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
