import React from 'react';
import { UserCheck, FileText, Sparkles, AlertTriangle } from 'lucide-react';

const provenanceConfig = {
  'Patient provided': {
    theme: 'provenance-patient',
    icon: UserCheck,
    label: 'Patient provided',
  },
  'Extracted from report': {
    theme: 'provenance-report',
    icon: FileText,
    label: 'Extracted from report',
  },
  'AI generated': {
    theme: 'provenance-ai',
    icon: Sparkles,
    label: 'AI generated',
  },
  'AI generated — Verification required': {
    theme: 'provenance-verification',
    icon: AlertTriangle,
    label: 'AI generated — Verification required',
  },
};

export default function ProvenanceTag({ category, className = '', showLabelPrefix = true }) {
  const config = provenanceConfig[category] || provenanceConfig['Extracted from report'];
  const Icon = config.icon;

  return (
    <span className={`provenance-tag ${config.theme} ${className}`}>
      <Icon size={12} className="provenance-icon" />
      <span className="provenance-text">
        {category === 'AI generated — Verification required'
          ? config.label
          : showLabelPrefix
          ? `Source: ${config.label}`
          : config.label}
      </span>
    </span>
  );
}
