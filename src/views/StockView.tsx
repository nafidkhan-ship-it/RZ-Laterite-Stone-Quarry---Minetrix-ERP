import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { MaterialType } from '../types/quarry';
import { formatNumber } from '../utils/formatters';
import { Boxes, Plus, Minus, SlidersHorizontal, PackageCheck, Truck, CheckCircle2, X } from 'lucide-react';
import { INITIAL_STOCK } from '../data/seedData';

export const StockView: React.FC = () => {
  const { stock, production, gatePasses, stockAdjustments, adjustStock, currentUser } = useQuarry();

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedMat, setSelectedMat] = useState<MaterialType>('Laterite Stone — 1st');
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('');

  const materials: MaterialType[] = [
    'Laterite Stone — 1st',
    'Laterite Stone — 2nd',
    'Laterite Stone — 3rd',
  ];

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustQty || !adjustReason) return;
    adjustStock(selectedMat, Number(adjustQty), adjustReason);
    setAdjustModalOpen(false);
    setAdjustQty(0);
    setAdjustReason('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Stock Management
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Strict formula: Opening + Production + Adjustments - Confirmed Dispatched Gate Passes = Closing Stock
          </p>
        </div>

        <button
          onClick={() => setAdjustModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#1e2332] hover:bg-[#282f42] text-[#d4af37] border border-[#d4af37]/40 flex items-center gap-1.5 shadow"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Manual Stock Adjustment</span>
        </button>
      </div>

      {/* Stock Cards for the 3 Materials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {materials.map((mat) => {
          const is3rd = mat === 'Laterite Stone — 3rd';
          const unit = is3rd ? 'loads' : 'pcs';

          const opening = INITIAL_STOCK[mat];
          const totalProd = production
            .filter((p) => p.material === mat)
            .reduce((sum, p) => sum + p.quantity, 0);
          const totalDispatched = gatePasses
            .filter((g) => g.material === mat)
            .reduce((sum, g) => sum + g.quantity, 0);
          const totalAdj = stockAdjustments
            .filter((a) => a.material === mat)
            .reduce((sum, a) => sum + a.quantity, 0);

          const currentAvailable = stock[mat];

          return (
            <div
              key={mat}
              className="p-5 rounded-2xl bg-[#12141a] border border-[#232736] hover:border-[#d4af37]/40 transition-all space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-base text-gray-100">{mat}</h3>
                  <span className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider">
                    {is3rd ? 'Rubble Load Material' : 'Standard 250 pcs / Load'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Active Pit
                </span>
              </div>

              {/* Big Available Number */}
              <div className="p-3.5 rounded-xl bg-[#0b0c10] border border-[#1f2434] text-center">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  Available Closing Stock
                </div>
                <div className="text-3xl font-black font-mono text-[#f3c64c] my-1">
                  {formatNumber(currentAvailable)}{' '}
                  <span className="text-sm font-normal text-gray-400">{unit}</span>
                </div>
                <div className="text-[11px] text-gray-500">
                  Ready for loading & gate dispatch
                </div>
              </div>

              {/* Exact Formula Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1c202d] text-gray-400">
                  <span>Opening Baseline:</span>
                  <span className="font-mono text-gray-200">{formatNumber(opening)} {unit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c202d] text-emerald-400">
                  <span>(+) Production Added:</span>
                  <span className="font-mono font-bold">+{formatNumber(totalProd)} {unit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c202d] text-rose-400">
                  <span>(-) Confirmed Dispatched (GP):</span>
                  <span className="font-mono font-bold">-{formatNumber(totalDispatched)} {unit}</span>
                </div>
                {totalAdj !== 0 && (
                  <div className="flex justify-between py-1 border-b border-[#1c202d] text-blue-400">
                    <span>(±) Stock Adjustments:</span>
                    <span className="font-mono font-bold">
                      {totalAdj > 0 ? `+${totalAdj}` : totalAdj} {unit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Stock Adjustment History Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-4 space-y-3">
        <h3 className="font-cinzel font-bold text-sm text-gray-200">
          Stock Adjustments Audit Trail
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Material</th>
                <th className="p-2.5 text-right">Adjustment Quantity</th>
                <th className="p-2.5">Reason / Justification</th>
                <th className="p-2.5 text-center">Adjusted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {stockAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No manual adjustments made. System stock strictly reconciled from production and gate passes.
                  </td>
                </tr>
              ) : (
                stockAdjustments.map((a) => (
                  <tr key={a.id} className="hover:bg-[#161924]">
                    <td className="p-2.5 font-mono text-gray-300">{a.date}</td>
                    <td className="p-2.5 font-bold text-gray-200">{a.material}</td>
                    <td className="p-2.5 text-right font-mono font-bold">
                      <span className={a.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {a.quantity > 0 ? `+${a.quantity}` : a.quantity}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-300">{a.reason}</td>
                    <td className="p-2.5 text-center font-bold text-gray-300">{a.enteredBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101218] border border-[#262c3e] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262c3e]">
              <h3 className="font-cinzel font-bold text-base text-gray-100">
                Record Stock Adjustment
              </h3>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Material Quality *
                </label>
                <select
                  value={selectedMat}
                  onChange={(e) => setSelectedMat(e.target.value as MaterialType)}
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                >
                  {materials.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Quantity Adjustment (positive or negative) *
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value) || 0)}
                  placeholder="e.g. +200 or -50"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-100"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Positive value adds to stock, negative value deducts for breakage/wastage.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Reason for Adjustment *
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Broken blocks during sorting or physical audit reconciliation"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
