'use client';

import React, { useState } from 'react';
import { Order, DelayCategory } from '@/types';
import { OrderStore } from '@/utils/store';
import { calculateRunRate } from '@/utils/runRate';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock, 
  Edit3, 
  Share2, 
  FileCheck2,
  Layers,
  History
} from 'lucide-react';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onRefresh: () => void;
  onOpenRunRate: (order: Order) => void;
}

const DELAY_CATEGORIES: DelayCategory[] = [
  'Machinery Breakdown',
  'Fabric / Material Shortage',
  'Worker Absenteeism',
  'Quality / Shade Defect',
  'Power Outage',
  'Subcontractor Delay',
  'Production Normal',
  'Other'
];

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onBack,
  onRefresh,
  onOpenRunRate
}) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'logs' | 'audit'>('logs');
  const [isEditingExFactory, setIsEditingExFactory] = useState(false);
  const [newExFactoryDate, setNewExFactoryDate] = useState(order.exFactoryDate);
  const [dateChangeReason, setDateChangeReason] = useState('');

  const runRate = calculateRunRate(order);
  const isRed = runRate.severity === 'red';

  // Handle Merchandiser approving or editing AI category
  const handleCategoryChange = (logId: string, newCategory: DelayCategory) => {
    OrderStore.updateLogCategory(order.id, logId, newCategory, true, true);
    onRefresh();
  };

  // Toggle buyer visibility gate
  const handleToggleBuyerVisibility = (logId: string, currentVisible: boolean) => {
    const log = order.logs.find(l => l.id === logId);
    if (!log) return;
    OrderStore.updateLogCategory(order.id, logId, log.confirmedCategory || log.aiSuggestedCategory, log.isConfirmedByMerchandiser, !currentVisible);
    onRefresh();
  };

  // Save new Ex-Factory date with audit reason
  const handleSaveExFactoryDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateChangeReason.trim()) {
      alert('Buyer compliance requires a mandatory justification for ex-factory date changes.');
      return;
    }

    OrderStore.updateExFactoryDate(
      order.id,
      newExFactoryDate,
      'Karthik S. (Merchandiser)',
      dateChangeReason
    );

    setIsEditingExFactory(false);
    setDateChangeReason('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Board</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenRunRate(order)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>View Run-Rate Math</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{order.poNumber}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {order.buyerName} ({order.buyerCountry})
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isRed ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {runRate.severity} status
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-1">{order.style}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span>Color: <strong>{order.color}</strong></span>
              <span>•</span>
              <span>Total Qty: <strong>{order.totalQuantity.toLocaleString()} pcs</strong></span>
              <span>•</span>
              <span>Unit: <strong>{order.unitAssigned}</strong></span>
              <span>•</span>
              <span>Current Stage: <strong className="text-indigo-600">{order.currentStage}</strong></span>
            </div>
          </div>

          {/* Ex-factory Date & Change Dialog */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right">
            <span className="text-xs text-slate-500 font-medium">Ex-Factory Deadline</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
              {order.exFactoryDate}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {runRate.workingDaysLeft} working days remaining
            </p>
            <button
              onClick={() => setIsEditingExFactory(true)}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Change Date (Audit Logged)
            </button>
          </div>
        </div>

        {/* Change Ex-Factory Date Modal/Form */}
        {isEditingExFactory && (
          <form onSubmit={handleSaveExFactoryDate} className="mt-4 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Buyer Compliance: Ex-Factory Date Adjustment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">New Ex-Factory Date</label>
                <input
                  type="date"
                  value={newExFactoryDate}
                  onChange={(e) => setNewExFactoryDate(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason for Buyer Audit</label>
                <input
                  type="text"
                  value={dateChangeReason}
                  onChange={(e) => setDateChangeReason(e.target.value)}
                  placeholder="e.g. Buyer approved 3-day extension due to port vessel reschedule"
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingExFactory(false)}
                className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save & Log Audit Entry
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'logs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Floor Updates & AI Classification ({order.logs.length})
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'milestones'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            TNA Milestone Schedule ({order.milestones.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            Compliance Date Change Audit ({order.dateChangeHistory.length})
          </button>
        </nav>
      </div>

      {/* Tab 1: Floor Logs & Human-In-The-Loop AI Review */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                <strong>Human-in-the-Loop AI Assistant:</strong> Review Tamil voice/text notes. Warnings are visible to buyers <strong>only after</strong> you confirm them.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Merchandiser Gatekeeper
            </span>
          </div>

          <div className="space-y-3">
            {order.logs.map(log => (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Log Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {log.stage} Stage
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      +{log.quantityCompleted.toLocaleString()} pcs completed
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      Logged by <strong>{log.supervisorName}</strong> ({log.supervisorUnit})
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {log.date}
                  </span>
                </div>

                {/* Content: Photo + Side-by-Side Tamil / AI English Translation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  
                  {/* Photo Thumbnail */}
                  {log.photoUrl && (
                    <div className="w-full md:w-36 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img src={log.photoUrl} alt="Stage proof" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Side-by-side note comparison */}
                  <div className="md:col-span-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Original Tamil Note */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Original Supervisor Note (Tamil)
                        </span>
                        <p className="font-medium text-slate-900">
                          {log.rawNoteTamil || 'குறிப்பு இல்லை'}
                        </p>
                      </div>

                      {/* AI Translation & Confidence */}
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI English Translation
                          </span>
                          {log.aiConfidence && (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.2 rounded">
                              {Math.round(log.aiConfidence * 100)}% match
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-slate-800">
                          {log.englishTranslation}
                        </p>
                      </div>

                    </div>

                    {/* Merchandiser Action Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      
                      {/* Category Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">Category:</span>
                        <select
                          value={log.confirmedCategory || log.aiSuggestedCategory}
                          onChange={(e) => handleCategoryChange(log.id, e.target.value as DelayCategory)}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          {DELAY_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>

                        {log.isConfirmedByMerchandiser ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Check className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCategoryChange(log.id, (log.confirmedCategory || log.aiSuggestedCategory) as DelayCategory)}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Approve Category
                          </button>
                        )}
                      </div>

                      {/* Buyer Visibility Toggle */}
                      <button
                        onClick={() => handleToggleBuyerVisibility(log.id, log.visibleToBuyer)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          log.visibleToBuyer
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {log.visibleToBuyer ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{log.visibleToBuyer ? 'Visible to Buyer' : 'Hidden from Buyer'}</span>
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: TNA Milestone Schedule */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Time-and-Action (TNA) Milestone Template</h3>
          <div className="space-y-3">
            {order.milestones.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{m.stage}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      m.status === 'red' ? 'bg-rose-100 text-rose-800' : m.status === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Target Completion Date: <strong>{m.targetDate}</strong></p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">
                    {m.completedQty.toLocaleString()} / {m.targetQty.toLocaleString()} pcs
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {Math.round((m.completedQty / m.targetQty) * 100)}% finished
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Compliance Audit History */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Ex-Factory Date Change Compliance Trail</h3>
          <p className="text-xs text-slate-500">
            Export buyers (UK/EU) require an immutable audit record for every agreed delivery revision.
          </p>

          {order.dateChangeHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No date revisions made. Original contract date strictly maintained.
            </div>
          ) : (
            <div className="space-y-2.5">
              {order.dateChangeHistory.map(audit => (
                <div key={audit.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Changed on <strong>{audit.changedAt}</strong> by <strong>{audit.changedBy}</strong></span>
                    <span className="font-mono text-indigo-700 font-semibold">{audit.oldDate} → {audit.newDate}</span>
                  </div>
                  <p className="text-slate-800 font-medium pt-1">
                    Reason: "{audit.reason}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

