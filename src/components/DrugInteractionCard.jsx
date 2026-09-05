import React from 'react';
import { Pill, AlertTriangle, ShieldCheck } from 'lucide-react';
import { checkDrugInteractions } from '../services/drugInteractionService';

export default function DrugInteractionCard({ records = [], reportText = '' }) {
  const interactions = checkDrugInteractions(records, reportText);

  return (
    <div id="drug-interactions" className="card drug-interaction-card space-y-3 mb-6">
      <div className="card-header border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Pill size={18} />
          </div>
          <div>
            <h3 className="card-title text-base font-bold text-slate-900 dark:text-slate-100">
              Drug Interaction & Safety Contraindication Checker
            </h3>
            <p className="card-subtitle text-xs text-slate-500 dark:text-slate-400">
              Evidence-based pharmacology interaction analysis
            </p>
          </div>
        </div>
        <span
          className={`badge text-[11px] font-semibold flex items-center gap-1 ${
            interactions.length > 0
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {interactions.length > 0 ? (
            <>
              <AlertTriangle size={12} /> {interactions.length} Interactions Flagged
            </>
          ) : (
            <>
              <ShieldCheck size={12} /> 0 Contraindications Detected
            </>
          )}
        </span>
      </div>

      {interactions.length > 0 ? (
        <div className="space-y-2">
          {interactions.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
            >
              <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-600 text-white">
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span>No drug-drug contraindications or severe hyperkalemia interactions detected in current report text.</span>
        </div>
      )}
    </div>
  );
}

