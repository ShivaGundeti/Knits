'use client';

import React from 'react';
import { Order } from '@/types';
import { calculateRunRate } from '@/utils/runRate';
import { Eye, Shield, Lock, Calendar, CheckCircle2, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface BuyerPortalViewProps {
  orders: Order[];
  currentBuyerId: string;
}

export const BuyerPortalView: React.FC<BuyerPortalViewProps> = ({
  orders,
  currentBuyerId
}) => {
  // STRICT TENANT ISOLATION ENFORCEMENT:
  // A buyer MUST NEVER see orders belonging to another buyer
  const buyerOrders = orders.filter(o => o.buyerId === currentBuyerId);
  const currentBuyerName = buyerOrders[0]?.buyerName || (currentBuyerId === 'buyer-uk-b' ? 'Company B (UK)' : 'Company C (Germany)');

  return (
    <div className="space-y-6">
      
      {/* Buyer Header Banner with Compliance Verification Stamp */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Verified Buyer Sourcing Portal
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-1 text-white">{currentBuyerName}</h2>
            <p className="text-xs text-emerald-100/80 mt-1">
              Live production milestones and factory floor inspection photos from Company A (Tiruppur).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-emerald-200">Tenant Isolated: ID {currentBuyerId}</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {buyerOrders.map(order => {
          const runRate = calculateRunRate(order);
          const isRed = runRate.severity === 'red';
          const progressPct = Math.round((order.stageQuantityCompleted / order.totalQuantity) * 100);

          // Only buyer-visible verified logs
          const buyerLogs = order.logs.filter(l => l.visibleToBuyer);

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-900">{order.poNumber}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {order.style}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Ex-Factory Date:</span>
                    <span className="font-bold font-mono text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                      {order.exFactoryDate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span>Color: <strong>{order.color}</strong></span>
                  <span>•</span>
                  <span>Order Quantity: <strong>{order.totalQuantity.toLocaleString()} pcs</strong></span>
                  <span>•</span>
                  <span>Current Stage: <strong className="text-emerald-700">{order.currentStage}</strong></span>
                  <span>•</span>
                  <span>Produced: <strong>{order.stageQuantityCompleted.toLocaleString()} pcs ({progressPct}%)</strong></span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${isRed ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, progressPct)}%` }}
                  ></div>
                </div>
              </div>

              {/* TNA Milestones Timeline */}
              <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Production Milestone Schedule
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {order.milestones.map((m, idx) => {
                    const isDone = m.completedQty >= m.targetQty;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs ${
                          isDone 
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">{m.stage}</span>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">Target: {m.targetDate}</div>
                        <div className="text-[11px] font-semibold mt-1">
                          {m.completedQty.toLocaleString()} / {m.targetQty.toLocaleString()} pcs
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Production Proof Photos */}
              <div className="p-6">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  Verified Floor Photos & Quality Status ({buyerLogs.length})
                </h4>

                {buyerLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">
                    Daily photos are undergoing quality review by merchandisers and will appear here once approved.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {buyerLogs.map(log => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col"
                      >
                        {log.photoUrl && (
                          <div className="h-40 w-full overflow-hidden bg-slate-200">
                            <img
                              src={log.photoUrl}
                              alt="Batch verification"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-3.5 flex-1 flex flex-col justify-between text-xs">
                          <div>
                            <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                              <span>{log.stage} Stage</span>
                              <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">
                              {log.englishTranslation}
                            </p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Status: <strong>{log.confirmedCategory}</strong></span>
                            <span className="text-emerald-700 font-semibold">QA Approved</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Revision Compliance Trail */}
              {order.dateChangeHistory.length > 0 && (
                <div className="p-6 bg-slate-50/70 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Contract Date Change Audit Trail
                  </h4>
                  <div className="space-y-2">
                    {order.dateChangeHistory.map(hist => (
                      <div key={hist.id} className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex justify-between font-mono text-[11px] text-slate-400 mb-0.5">
                          <span>Recorded on {hist.changedAt}</span>
                          <span className="font-semibold text-slate-900">{hist.oldDate} → {hist.newDate}</span>
                        </div>
                        <p className="text-slate-800 font-medium">Reason: {hist.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

