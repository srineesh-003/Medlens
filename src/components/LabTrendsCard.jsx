import React from 'react';
import { TrendingUp, Activity, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';

const SAMPLE_LAB_TRENDS = [
  {
    analyte: 'Fasting Blood Glucose',
    current: '115 mg/dL',
    numeric: 115,
    min: 70,
    max: 99,
    unit: 'mg/dL',
    status: 'Elevated',
    category: 'High Risk',
    history: ['92 mg/dL (Jan)', '104 mg/dL (Jun)', '115 mg/dL (Today)'],
    percentage: 78,
  },
  {
    analyte: 'Hemoglobin A1c (HbA1c)',
    current: '5.8 %',
    numeric: 5.8,
    min: 4.0,
    max: 5.6,
    unit: '%',
    status: 'Prediabetic',
    category: 'Watch',
    history: ['5.4 % (Jan)', '5.6 % (Jun)', '5.8 % (Today)'],
    percentage: 68,
  },
  {
    analyte: 'LDL Cholesterol',
    current: '128 mg/dL',
    numeric: 128,
    min: 0,
    max: 100,
    unit: 'mg/dL',
    status: 'Above Target',
    category: 'Watch',
    history: ['110 mg/dL (Jan)', '122 mg/dL (Jun)', '128 mg/dL (Today)'],
    percentage: 64,
  },
  {
    analyte: 'Hemoglobin (Hgb)',
    current: '14.2 g/dL',
    numeric: 14.2,
    min: 13.5,
    max: 17.5,
    unit: 'g/dL',
    status: 'Normal Range',
    category: 'Optimal',
    history: ['14.0 g/dL (Jan)', '14.1 g/dL (Jun)', '14.2 g/dL (Today)'],
    percentage: 45,
  },
];

export default function LabTrendsCard({ records = [] }) {
  // If user processed records exist, extract numeric analytes
  const activeTrends = records.length > 0
    ? records.map((r, i) => ({
        analyte: r.analyte || `Observation ${i + 1}`,
        current: `${r.value || '--'} ${r.unit || ''}`.trim(),
        numeric: parseFloat(r.value) || 100,
        min: 70,
        max: 110,
        unit: r.unit || '',
        status: r.flag === 'H' ? 'Elevated' : r.flag === 'L' ? 'Low' : 'Normal Range',
        category: r.flag ? 'Attention' : 'Optimal',
        history: [`Historical Baseline`, `${r.value || '--'} ${r.unit || ''} (Today)`],
        percentage: r.flag === 'H' ? 82 : r.flag === 'L' ? 25 : 50,
      }))
    : SAMPLE_LAB_TRENDS;

  return (
    <div id="lab-trends" className="card lab-trends-card space-y-4">
      <div className="card-header border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="card-title text-base font-bold text-slate-900 dark:text-slate-100">
              Lab Trends & Analyte Longitudinal Tracking
            </h3>
            <p className="card-subtitle text-xs text-slate-500 dark:text-slate-400">
              Biomarker reference ranges and historical progression analysis
            </p>
          </div>
        </div>
        <span className="badge badge-teal flex items-center gap-1 text-[11px] font-semibold">
          <Activity size={12} /> {activeTrends.length} Biomarkers Tracked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTrends.map((trend, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {trend.analyte}
                </h4>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ref Range: {trend.min} - {trend.max} {trend.unit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                  {trend.current}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    trend.status.includes('Normal')
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {trend.status.includes('Normal') ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                  {trend.status}
                </span>
              </div>
            </div>

            {/* Visual Range Indicator Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Low ({trend.min})</span>
                <span>Normal Target</span>
                <span>High ({trend.max})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    trend.status.includes('Normal') ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(trend.percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Historical Progression */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <ArrowUpRight size={12} className="text-teal-500" /> History: {trend.history.join(' → ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
