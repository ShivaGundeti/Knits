'use client';

import React, { useState } from 'react';
import { Order, DelaySeverity } from '@/types';
import { calculateRunRate } from '@/utils/runRate';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  Filter, 
  FileText, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Download
} from 'lucide-react';

interface OrderBoardProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenRunRate: (order: Order) => void;
  onExportPdf: (buyerFilter?: string) => void;
}

export const OrderBoard: React.FC<OrderBoardProps> = ({
  orders,
  onSelectOrder,
  onOpenRunRate,
  onExportPdf
}) => {
  const [buyerFilter, setBuyerFilter] = useState<string>('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Compute calculated metrics for all orders
  const ordersWithRunRate = orders.map(order => ({
    order,
    runRate: calculateRunRate(order)
  }));

  // Filtering
  const filtered = ordersWithRunRate.filter(({ order, runRate }) => {
    if (buyerFilter !== 'all' && order.buyerId !== buyerFilter) return false;
    if (unitFilter !== 'all' && !order.unitAssigned.toLowerCase().includes(unitFilter.toLowerCase())) return false;
    if (severityFilter !== 'all' && runRate.severity !== severityFilter) return false;
    return true;
  });

  // Summary statistics
  const totalOrders = orders.length;
  const redCount = ordersWithRunRate.filter(o => o.runRate.severity === 'red').length;
  const amberCount = ordersWithRunRate.filter(o => o.runRate.severity === 'amber').length;
  const greenCount = ordersWithRunRate.filter(o => o.runRate.severity === 'green').length;
  const totalVolume = orders.reduce((sum, o) => sum + o.totalQuantity, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Export Orders</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalOrders}</span>
            <span className="text-xs text-slate-500">({totalVolume.toLocaleString()} pcs)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">Tiruppur Units 1, 2 & 3</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Critical Delay Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-rose-600">{redCount}</span>
            <span className="text-xs text-rose-600 font-semibold">orders</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-medium">Air freight risk: ₹3.5L/order</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tight Schedule (Amber)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-600">{amberCount}</span>
            <span className="text-xs text-amber-600 font-semibold">orders</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium">Within 80-99% run-rate pace</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">On Track (Green)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-600">{greenCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">orders</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">Ex-factory deadline safe</div>
        </div>
      </div>

      {/* Filter Bar & Export Actions */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Buyer Filter */}
          <select
            value={buyerFilter}
            onChange={(e) => setBuyerFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Buyers (UK & EU)</option>
            <option value="buyer-uk-b">Company B (UK)</option>
            <option value="buyer-de-c">Company C (Germany)</option>
          </select>

          {/* Unit Filter */}
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Production Units</option>
            <option value="Unit 1">Unit 1 (Avinashi Road)</option>
            <option value="Unit 2">Unit 2 (Palladam)</option>
            <option value="Unit 3">Unit 3 (Tiruppur City)</option>
          </select>

          {/* Status Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="red">🔴 Critical Delay Only</option>
            <option value="amber">🟡 Amber Tight Pace</option>
            <option value="green">🟢 Green On Track</option>
          </select>
        </div>

        {/* Export Status PDF Button */}
        <button
          onClick={() => onExportPdf(buyerFilter === 'all' ? undefined : buyerFilter)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export Status Report (PDF)
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(({ order, runRate }) => {
          const isRed = runRate.severity === 'red';
          const isAmber = runRate.severity === 'amber';
          const progressPct = Math.round((order.stageQuantityCompleted / order.totalQuantity) * 100);

          return (
            <div
              key={order.id}
              className={`group bg-white rounded-2xl border transition-all hover:shadow-md cursor-pointer overflow-hidden ${
                isRed 
                  ? 'border-rose-200 hover:border-rose-300' 
                  : isAmber 
                  ? 'border-amber-200 hover:border-amber-300' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => onSelectOrder(order)}
            >
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm tracking-tight">{order.poNumber}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {order.buyerName}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isRed 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : isAmber 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isRed ? 'bg-rose-500' : isAmber ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    {runRate.severity}
                  </span>
                </div>

                <h4 className="font-semibold text-slate-900 text-sm">{order.style}</h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>Color: {order.color}</span>
                  <span>•</span>
                  <span>{order.unitAssigned}</span>
                </p>
              </div>

              {/* Progress & Current Stage */}
              <div className="px-5 py-3 bg-slate-50/70 border-y border-slate-100">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-600">
                    Stage: <strong className="text-indigo-600">{order.currentStage}</strong>
                  </span>
                  <span className="text-slate-900 font-bold">
                    {order.stageQuantityCompleted.toLocaleString()} / {order.totalQuantity.toLocaleString()} pcs ({progressPct}%)
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isRed ? 'bg-rose-500' : isAmber ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, progressPct)}%` }}
                  ></div>
                </div>
              </div>

              {/* Run-Rate Delay Banner */}
              <div className="p-5 pt-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ex-Factory: <strong>{order.exFactoryDate}</strong></span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {runRate.workingDaysLeft} work days left
                  </span>
                </div>

                {/* Run-rate comparison chip */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRunRate(order);
                  }}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                    isRed 
                      ? 'bg-rose-50/50 border-rose-200 text-rose-900 hover:bg-rose-100/60' 
                      : isAmber 
                      ? 'bg-amber-50/50 border-amber-200 text-amber-900 hover:bg-amber-100/60' 
                      : 'bg-emerald-50/50 border-emerald-200 text-emerald-900 hover:bg-emerald-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isRed ? (
                      <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-[11px]">
                        Needed: {runRate.requiredDailyRunRate}/day | Doing: {runRate.actualDailyRunRate}/day
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {isRed ? `Late by +${runRate.delayDays} days (${runRate.projectedCompletionDate})` : 'Pacing on track'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{order.logs.length} floor shift logs</span>
                  <span className="font-medium text-indigo-600 hover:underline flex items-center gap-1">
                    Manage details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

