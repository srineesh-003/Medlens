import React from 'react';
import { User } from 'lucide-react';
import ProvenanceTag from './ProvenanceTag';

export default function PatientInfo({ patientInfo, setPatientInfo }) {
  const handleChange = (field, value) => {
    setPatientInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="dashboard-card patient-info-card" id="patient-info">
      <div className="card-header">
        <div className="card-title-group">
          <div className="section-icon-badge">
            <User size={18} />
          </div>
          <div>
            <h2 className="card-title">Patient Information</h2>
            <p className="card-description">Essential context provided directly by or for the patient</p>
          </div>
        </div>
        <ProvenanceTag category="Patient provided" showLabelPrefix={true} />
      </div>

      <div className="form-grid">
        <div className="form-group col-span-2">
          <label htmlFor="patientIdName" className="form-label">Patient ID / Name</label>
          <input
            id="patientIdName"
            type="text"
            className="form-input"
            value={patientInfo.patientIdName}
            onChange={(e) => handleChange('patientIdName', e.target.value)}
            placeholder="e.g. PL-20481 · Jordan Lee"
          />
        </div>

        <div className="form-group col-span-1">
          <label htmlFor="patientAge" className="form-label">Age</label>
          <input
            id="patientAge"
            type="text"
            className="form-input"
            value={patientInfo.age}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder="e.g. 42"
          />
        </div>

        <div className="form-group col-span-1">
          <label htmlFor="patientSex" className="form-label">Sex</label>
          <select
            id="patientSex"
            className="form-select"
            value={patientInfo.sex}
            onChange={(e) => handleChange('sex', e.target.value)}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Intersex">Intersex</option>
            <option value="Other / Unspecified">Other / Unspecified</option>
          </select>
        </div>

        <div className="form-group col-span-4">
          <label htmlFor="patientSymptoms" className="form-label">Symptoms</label>
          <input
            id="patientSymptoms"
            type="text"
            className="form-input"
            value={patientInfo.symptoms}
            onChange={(e) => handleChange('symptoms', e.target.value)}
            placeholder="e.g. Fatigue, intermittent headaches, cold intolerance"
          />
        </div>

        <div className="form-group col-span-2">
          <label htmlFor="existingConditions" className="form-label">Existing Conditions</label>
          <input
            id="existingConditions"
            type="text"
            className="form-input"
            value={patientInfo.existingConditions}
            onChange={(e) => handleChange('existingConditions', e.target.value)}
            placeholder="e.g. Hypertension, Hypothyroidism"
          />
        </div>

        <div className="form-group col-span-2">
          <label htmlFor="patientAllergies" className="form-label">Allergies</label>
          <input
            id="patientAllergies"
            type="text"
            className="form-input"
            value={patientInfo.allergies}
            onChange={(e) => handleChange('allergies', e.target.value)}
            placeholder="e.g. Penicillin, Latex, None"
          />
        </div>

        <div className="form-group col-span-4">
          <label htmlFor="currentMedications" className="form-label">Current Medications</label>
          <input
            id="currentMedications"
            type="text"
            className="form-input"
            value={patientInfo.medications}
            onChange={(e) => handleChange('medications', e.target.value)}
            placeholder="e.g. Levothyroxine 50mcg daily, Multivitamin"
          />
        </div>
      </div>
    </section>
  );
}

