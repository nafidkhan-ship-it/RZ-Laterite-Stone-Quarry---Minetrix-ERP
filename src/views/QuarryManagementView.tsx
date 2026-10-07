import React from 'react';
import { useQuarry } from '../context/QuarryContext';
import { formatNumber, formatCurrency, getTodayDateString } from '../utils/formatters';
import { Mountain, CheckCircle2, ShieldCheck, Activity, AlertTriangle, Compass, Layers, Wrench } from 'lucide-react';

export const QuarryManagementView: React.FC = () => {
  const { production, stock, gatePasses } = useQuarry();

  const today = getTodayDateString();
  const todayProd = production
    .filter((p) => p.date === today && p.unit === 'pcs')
    .reduce((sum, p) => sum + p.quantity, 0);

  const target = 2500;
  const progressPercent = Math.min(100, Math.round((todayProd / target) * 100));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Site Operations Management
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Geological bench monitoring, pit machinery deployment & lease statutory compliance
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-gray-200">Pit A & B Active Operational</span>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="p-5 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-gray-200 uppercase tracking-wider">
            Today Extraction Target: {formatNumber(todayProd)} / {formatNumber(target)} pcs
          </span>
          <span className="font-mono font-bold text-[#f3c64c]">{progressPercent}% Achieved</span>
        </div>
        <div className="w-full bg-[#1c202e] h-3 rounded-full overflow-hidden">
          <div
            className="gold-btn h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3 Active Geological Benches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-bold text-sm text-gray-100">Bench #3 (North Face)</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              1st Quality
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Dense, high-compaction laterite rock stratum. Yields premium construction blocks.
          </p>
          <div className="text-xs font-mono text-gray-300">
            Current Stock: <b>{formatNumber(stock['Laterite Stone — 1st'])} pcs</b>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-bold text-sm text-gray-100">Bench #2 (East Wing)</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              2nd Quality
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Standard residential foundation & boundary grade stone cutting bench.
          </p>
          <div className="text-xs font-mono text-gray-300">
            Current Stock: <b>{formatNumber(stock['Laterite Stone — 2nd'])} pcs</b>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-bold text-sm text-gray-100">Bench #1 (Overburden)</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              3rd Quality
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Rubble stone and land filling material sorting layer.
          </p>
          <div className="text-xs font-mono text-gray-300">
            Current Stock: <b>{stock['Laterite Stone — 3rd']} loads</b>
          </div>
        </div>
      </div>

      {/* Machinery Deployment & Regulatory Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
          <div className="flex items-center gap-2 text-gray-200 font-bold text-sm">
            <Wrench className="w-4 h-4 text-[#d4af37]" />
            <span>Heavy Machinery Deployment</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0d0f14] flex justify-between items-center">
              <div>
                <span className="font-bold text-gray-200 block">JCB 215 Heavy Excavator</span>
                <span className="text-[10px] text-gray-500">Operator: Mujeeb • Bench #3</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                Operating
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0f14] flex justify-between items-center">
              <div>
                <span className="font-bold text-gray-200 block">High-Torque Stone Cutting Saw #1</span>
                <span className="text-[10px] text-gray-500">Precision horizontal stone slitting</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                Operating
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0f14] flex justify-between items-center">
              <div>
                <span className="font-bold text-gray-200 block">Weighbridge & Electronic Scale</span>
                <span className="text-[10px] text-gray-500">Operator: Suresh • Calibrated Gate</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
          <div className="flex items-center gap-2 text-gray-200 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Statutory Lease & Safety Status</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0d0f14] flex justify-between items-center">
              <span className="text-gray-300">Govt. Mining Lease:</span>
              <span className="font-mono font-bold text-emerald-400">Valid & Inspected</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0f14] flex justify-between items-center">
              <span className="text-gray-300">Groundwater & Drainage:</span>
              <span className="font-bold text-gray-200">Clear • Pumping Normal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0f14] flex justify-between items-center">
              <span className="text-gray-300">Quarry Perimeter Security:</span>
              <span className="font-bold text-gray-200">Raghavan on Duty</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0f14] flex justify-between items-center">
              <span className="text-gray-300">First Aid & Site Safety:</span>
              <span className="font-bold text-emerald-400">Full Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
