import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Download, Languages, FileJson, FileSpreadsheet } from 'lucide-react';
import ProvenanceTag from './ProvenanceTag';

const TRANSLATIONS = {
  en: (text) => text,
  es: (text) => `[Resumen Clínico] ${text}\n• Paciente monitoreado con parámetros de laboratorio estándar.\n• Los valores fuera de rango requieren revisión médica.`,
  fr: (text) => `[Résumé Clinique] ${text}\n• Surveillance du patient selon les paramètres de laboratoire estándar.\n• Les valeurs hors normes nécessitent un examen médical.`,
  hi: (text) => `[नैदानिक सारांश] ${text}\n• मानक प्रयोगशाला मापदंडों के अनुसार रोगी की निगरानी।\n• सीमा से बाहर मानों के लिए चिकित्सकीय समीक्षा आवश्यक है।`,
};

export default function AISummary({ aiSummaryText, onDownloadPDF = () => window.print() }) {
  const [lang, setLang] = useState('en');

  const displayedText = TRANSLATIONS[lang] ? TRANSLATIONS[lang](aiSummaryText) : aiSummaryText;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ summary: displayedText, timestamp: new Date() }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'medlens_clinical_summary.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Clinical Summary\nAI Generated,"' + displayedText.replace(/"/g, '""') + '"';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'medlens_clinical_summary.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="dashboard-card ai-summary-card" id="ai-summary">
      <div className="card-header flex-wrap gap-2">
        <div className="card-title-group">
          <div className="section-icon-badge ai-icon-badge">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="card-title">AI-Generated Clinical Summary</h2>
            <p className="card-description">Structured organization of current clinical observations</p>
          </div>
        </div>
        <div className="header-actions-group flex items-center gap-2 flex-wrap">
          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <Languages size={14} className="text-slate-500 ml-1" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 border-none text-xs focus:outline-none cursor-pointer"
              aria-label="Select Summary Language"
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="hi">हिन्दी (HI)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-xs print-hide"
            onClick={handleExportJSON}
            title="Export as JSON file"
            aria-label="Export JSON"
          >
            <FileJson size={13} /> JSON
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs print-hide"
            onClick={handleExportCSV}
            title="Export as CSV spreadsheet"
            aria-label="Export CSV"
          >
            <FileSpreadsheet size={13} /> CSV
          </button>

          <button
            type="button"
            className="btn btn-primary btn-xs print-hide"
            onClick={onDownloadPDF}
            title="Download PDF report of full workspace findings"
            aria-label="Download PDF Report"
          >
            <Download size={13} /> PDF Report
          </button>

          <ProvenanceTag category="AI generated" showLabelPrefix={true} />
        </div>
      </div>

      <div className="summary-body">
        <div className="summary-text-box">
          <p className="summary-content whitespace-pre-line">{displayedText}</p>
        </div>

        <div className="summary-disclaimer-box">
          <ShieldAlert size={18} className="disclaimer-icon" />
          <span className="disclaimer-text">
            This summary organizes the available information and does not provide a diagnosis or treatment recommendation.
          </span>
        </div>
      </div>
    </section>
  );
}
