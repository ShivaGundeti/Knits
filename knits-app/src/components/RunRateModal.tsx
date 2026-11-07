'use client';

import React from 'react';
import { RunRateCalculation } from '@/types';
import { X, AlertTriangle, CheckCircle2, AlertCircle, ArrowRight, Calculator } from 'lucide-react';

interface RunRateModalProps {
  poNumber: string;
  style: string;
  calculation: RunRateCalculation;
  onClose: () => void;
}

export const RunRateModal: React.FC<RunRateModalProps> = ({
  poNumber,
  style,
  calculation,
  onClose
}) => {
  const isRed = calculation.severity === 'red';
  const isAmber = calculation.severity === 'amber';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
        
        {/* Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isRed ? 'bg-rose-50 border-rose-200' : isAmber ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isRed ? 'bg-rose-600 text-white' : isAmber ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {isRed ? <AlertTriangle className="w-5 h-5" /> : isAmber ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Run-Rate Delay Analysis</h3>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isRed ? 'bg-rose-100 text-rose-800' : isAmber ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {calculation.severity} status
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{poNumber} • {style}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Headline Alert */}
          <div className={`p-4 rounded-xl text-sm border font-medium ${
            isRed 
              ? 'bg-rose-50/70 border-rose-200 text-rose-900' 
              : isAmber 
              ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          }`}>
            <p className="leading-relaxed">{calculation.headlineExplanation}</p>
          </div>

          {/* Key Metric Comparison Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Required Pace (Target)</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900">{calculation.requiredDailyRunRate}</span>
                <span className="text-xs text-slate-600 font-medium">pcs / day</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">To ship before Ex-factory</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Actual Floor Output</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold ${
                  calculation.actualDailyRunRate < calculation.requiredDailyRunRate ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  {calculation.actualDailyRunRate}
                </span>
                <span className="text-xs text-slate-600 font-medium">pcs / day</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Rolling average of latest shifts</p>
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100/70 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-slate-500" />
                Mathematical Breakdown
              </span>
              <span className="text-[11px] text-slate-500">Excludes factory Sundays</span>
            </div>
            <div className="p-4 space-y-2.5 text-xs text-slate-700 font-mono bg-white">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Remaining pieces ($Q_{'{rem}'}$):</span>
                <span className="font-semibold text-slate-900">{calculation.remainingQty.toLocaleString()} pcs</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Working days left ($D_{'{left}'}$):</span>
                <span className="font-semibold text-slate-900">{calculation.workingDaysLeft} days</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Required calculation:</span>
                <span className="font-semibold text-indigo-700">{calculation.detailedFormula.reqDailyFormula}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Speed variance:</span>
                <span className={`font-semibold ${calculation.runRateDeficit < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {calculation.detailedFormula.speedComparison}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Projected completion date:</span>
                <span className={`font-bold ${calculation.delayDays > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {calculation.projectedCompletionDate} ({calculation.delayDays > 0 ? `+${calculation.delayDays} days late` : 'On Time'})
                </span>
              </div>
            </div>
          </div>

          {/* Financial Risk Notice */}
          {isRed && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Financial Impact Alert:</span> Missing ex-factory results in air freight penalty (₹3.5 Lakh) or 5% buyer discount (₹1.05 Lakh) if not recovered 14 days in advance.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};

