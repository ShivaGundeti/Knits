'use client';

import React, { useState } from 'react';
import { Order, ProductionStage, SizeBreakdown } from '@/types';
import { OrderStore } from '@/utils/store';
import { PlusCircle, Calendar, ShieldCheck, Check, ArrowLeft } from 'lucide-react';

interface OrderSetupFormProps {
  onOrderCreated: (order: Order) => void;
  onCancel: () => void;
}

export const OrderSetupForm: React.FC<OrderSetupFormProps> = ({
  onOrderCreated,
  onCancel
}) => {
  const [poNumber, setPoNumber] = useState('B-PO-89100');
  const [buyerId, setBuyerId] = useState('buyer-uk-b');
  const [buyerName, setBuyerName] = useState('Company B (UK)');
  const [buyerCountry, setBuyerCountry] = useState('United Kingdom');
  const [style, setStyle] = useState("Men's organic cotton hoodie, olive");
  const [color, setColor] = useState('Olive Green #4B5320');
  const [unitAssigned, setUnitAssigned] = useState('Unit 1 (Avinashi Road)');
  const [exFactoryDate, setExFactoryDate] = useState('2026-12-10');
  
  // Size quantities
  const [sizeS, setSizeS] = useState(1500);
  const [sizeM, setSizeM] = useState(3000);
  const [sizeL, setSizeL] = useState(3000);
  const [sizeXL, setSizeXL] = useState(1500);

  const totalQuantity = sizeS + sizeM + sizeL + sizeXL;

  const handleBuyerSelect = (id: string) => {
    setBuyerId(id);
    if (id === 'buyer-uk-b') {
      setBuyerName('Company B (UK)');
      setBuyerCountry('United Kingdom');
    } else {
      setBuyerName('Company C (Germany)');
      setBuyerCountry('Germany');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sizeBreakdown: SizeBreakdown[] = [
      { size: 'S', quantity: sizeS },
      { size: 'M', quantity: sizeM },
      { size: 'L', quantity: sizeL },
      { size: 'XL', quantity: sizeXL }
    ];

    // Standard automated TNA Milestone Template
    const milestones = [
      { stage: 'Cutting' as ProductionStage, targetDate: '2026-11-18', targetQty: totalQuantity, completedQty: 0, status: 'green' as const },
      { stage: 'Printing' as ProductionStage, targetDate: '2026-11-24', targetQty: totalQuantity, completedQty: 0, status: 'green' as const },
      { stage: 'Stitching' as ProductionStage, targetDate: '2026-12-02', targetQty: totalQuantity, completedQty: 0, status: 'green' as const },
      { stage: 'Finishing' as ProductionStage, targetDate: '2026-12-07', targetQty: totalQuantity, completedQty: 0, status: 'green' as const },
      { stage: 'Packed' as ProductionStage, targetDate: exFactoryDate, targetQty: totalQuantity, completedQty: 0, status: 'green' as const }
    ];

    const newOrder = OrderStore.createOrder({
      poNumber,
      buyerId,
      buyerName,
      buyerCountry,
      style,
      color,
      totalQuantity,
      sizeBreakdown,
      unitAssigned,
      currentStage: 'Cutting',
      stageQuantityCompleted: 0,
      exFactoryDate,
      milestones
    });

    onOrderCreated(newOrder);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order Board</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">New Order & TNA Milestone Setup</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Setup buyer purchase order, style size breakdown, and automated Time-and-Action milestones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PO Number</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Buyer (Client)</label>
              <select
                value={buyerId}
                onChange={(e) => handleBuyerSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="buyer-uk-b">Company B (UK)</option>
                <option value="buyer-de-c">Company C (Germany)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Style Description</label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Color / Pantone</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Unit & Ex-Factory Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Allocated Production Unit</label>
              <select
                value={unitAssigned}
                onChange={(e) => setUnitAssigned(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Unit 1 (Avinashi Road)">Unit 1 (Avinashi Road) - 350 stitchers</option>
                <option value="Unit 2 (Palladam)">Unit 2 (Palladam) - 300 stitchers</option>
                <option value="Unit 3 (Tiruppur City)">Unit 3 (Tiruppur City) - 250 stitchers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Ex-Factory Date</label>
              <input
                type="date"
                value={exFactoryDate}
                onChange={(e) => setExFactoryDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
          </div>

          {/* Size Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Size Breakdown Quantities</span>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                Total: {totalQuantity.toLocaleString()} pcs
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Size S</label>
                <input
                  type="number"
                  value={sizeS}
                  onChange={(e) => setSizeS(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Size M</label>
                <input
                  type="number"
                  value={sizeM}
                  onChange={(e) => setSizeM(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Size L</label>
                <input
                  type="number"
                  value={sizeL}
                  onChange={(e) => setSizeL(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Size XL</label>
                <input
                  type="number"
                  value={sizeXL}
                  onChange={(e) => setSizeXL(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Automated TNA Template preview note */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Automated TNA Milestone Generation:</strong> Saving will generate staged targets for Cutting, Printing, Stitching, Finishing, and Packing with automated run-rate tracking.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
            >
              Create Order & Launch TNA
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

