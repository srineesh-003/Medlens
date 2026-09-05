import React from 'react';
import { ShieldAlert, HelpCircle } from 'lucide-react';

export default function TopSafetyBanner({ onOpenGuardrails }) {
  return (
    <div
      className="top-safety-banner bg-gradient-to-r from-teal-950 via-slate-950 to-indigo-950 text-white text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-teal-900/50 z-50 sticky top-0"
      role="region"
      aria-label="Clinical Non-Diagnostic Safety Warning"
    >
      <div className="flex items-center gap-2 max-w-5xl truncate">
        <span className="inline-flex items-center gap-1 font-bold text-teal-300 uppercase tracking-wider text-[10px] bg-teal-950/90 px-2 py-0.5 rounded border border-teal-700/50 shrink-0">
          <ShieldAlert size={12} className="text-teal-400" /> Non-Diagnostic System
        </span>
        <span className="text-slate-300 text-xs truncate hidden sm:inline">
          MedLens organizes and explains documented records. It does not diagnose, prescribe, or replace qualified healthcare professionals.
        </span>
      </div>
      <button
        type="button"
        className="text-[11px] text-teal-300 hover:text-white underline underline-offset-2 flex items-center gap-1 cursor-pointer transition shrink-0 ml-2 border-none bg-transparent"
        onClick={onOpenGuardrails}
        aria-label="Open Safety Standards Modal"
      >
        <HelpCircle size={12} /> Safety Standards
      </button>
    </div>
  );
}
