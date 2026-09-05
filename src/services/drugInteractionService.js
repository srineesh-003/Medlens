/**
 * MedLens Clinical Drug Interaction & Safety Risk Service
 * 
 * Analyzes prescribed medications against evidence-based interaction databases
 * to flag contraindications, hyperkalemia risks, and drug-drug interactions.
 */

export const DRUG_INTERACTION_RULES = [
  {
    drugs: ['lisinopril', 'potassium'],
    severity: 'High Risk',
    title: 'ACE Inhibitor + Potassium Supplement Interaction',
    description: 'Concurrent use of Lisinopril with Potassium supplements may lead to severe hyperkalemia (elevated serum potassium). Monitor serum electrolytes.',
  },
  {
    drugs: ['warfarin', 'aspirin'],
    severity: 'High Risk',
    title: 'Anticoagulant + Antiplatelet Interaction',
    description: 'Co-administration of Warfarin and Aspirin significantly increases gastrointestinal and major bleeding risks.',
  },
  {
    drugs: ['warfarin', 'ibuprofen'],
    severity: 'High Risk',
    title: 'Anticoagulant + NSAID Interaction',
    description: 'Ibuprofen inhibits platelet function and damages gastric mucosa, compounding Warfarin bleeding hazard.',
  },
  {
    drugs: ['metformin', 'contrast'],
    severity: 'Caution Required',
    title: 'Metformin + Iodinated Contrast Agent',
    description: 'Withhold Metformin at time of contrast procedure to prevent contrast-induced nephropathy and lactic acidosis.',
  },
];

/**
 * Checks extracted records or prescription text for drug interaction risks.
 */
export function checkDrugInteractions(records = [], reportText = '') {
  const text = (reportText + ' ' + records.map((r) => r.medication || r.analyte || '').join(' ')).toLowerCase();

  const foundInteractions = [];

  DRUG_INTERACTION_RULES.forEach((rule) => {
    const matchCount = rule.drugs.filter((d) => text.includes(d)).length;
    if (matchCount >= 2) {
      foundInteractions.push(rule);
    }
  });

  return foundInteractions;
}

