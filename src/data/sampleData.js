export const emptyPatientInfo = {
  patientIdName: '',
  age: '',
  sex: 'Select sex',
  symptoms: '',
  existingConditions: '',
  allergies: '',
  medications: '',
};

export const initialPatientInfo = {
  patientIdName: 'PL-20481 · Jordan Lee',
  age: '42',
  sex: 'Female',
  symptoms: 'Fatigue, intermittent mild headaches, cold intolerance',
  existingConditions: 'No chronic conditions recorded',
  allergies: 'Penicillin',
  medications: 'Multivitamin daily',
};

export const initialReportText = `LABORATORY REPORT
Patient: Jordan Lee (ID: PL-20481)
Date: Oct 24, 2024
Lab Ref: LAB-88391

COMPLETE BLOOD COUNT & METABOLIC PANEL:
- Hemoglobin: 13.8 g/dL (Reference Range: 12.0 - 16.0 g/dL)
- LDL Cholesterol: 142 mg/dL (Reference Range: Not provided)
- Vitamin D (25-OH): 18 ng/mL (Reference Range: 30 - 100 ng/mL)
- TSH (Thyroid Stimulating Hormone): 2.4 mIU/L (Reference Range: 0.4 - 4.0 mIU/L)
- Fasting Glucose: 108 mg/dL (Reference Range: 70 - 99 mg/dL)
`;

export const initialRecords = [
  {
    id: 'rec-1',
    test: 'Hemoglobin',
    value: '13.8',
    unit: 'g/dL',
    range: '12.0 – 16.0',
    status: 'NORMAL',
    date: 'Oct 24, 2024',
    observation: 'Within expected source range',
    source: 'Extracted from report',
  },
  {
    id: 'rec-2',
    test: 'LDL Cholesterol',
    value: '142',
    unit: 'mg/dL',
    range: 'Not provided',
    status: 'UNKNOWN',
    date: 'Oct 24, 2024',
    observation: 'Source report omitted reference range for classification',
    source: 'Extracted from report',
  },
  {
    id: 'rec-3',
    test: 'Vitamin D (25-OH)',
    value: '18',
    unit: 'ng/mL',
    range: '30 – 100',
    status: 'LOW',
    date: 'Oct 24, 2024',
    observation: 'Below provided source range',
    source: 'Extracted from report',
  },
  {
    id: 'rec-4',
    test: 'TSH (Thyroid Stimulating)',
    value: '2.4',
    unit: 'mIU/L',
    range: '0.4 – 4.0',
    status: 'NORMAL',
    date: 'Oct 24, 2024',
    observation: 'Within expected source range',
    source: 'Extracted from report',
  },
  {
    id: 'rec-5',
    test: 'Fasting Glucose',
    value: '108',
    unit: 'mg/dL',
    range: '70 – 99',
    status: 'HIGH',
    date: 'Oct 24, 2024',
    observation: 'Above provided source range',
    source: 'Extracted from report',
  },
];

export const initialAISummary = `The processed medical report contains 5 clinical lab observations recorded on Oct 24, 2024. 
- Hemoglobin (13.8 g/dL) and TSH (2.4 mIU/L) are marked within the reference ranges specified in the source report.
- Fasting Glucose (108 mg/dL) is marked above the specified source range (70 - 99 mg/dL).
- Vitamin D (18 ng/mL) is marked below the specified source range (30 - 100 ng/mL).
- LDL Cholesterol (142 mg/dL) is reported without a reference range in the source document, so its classification status is marked UNKNOWN.`;
