import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { RateConfig } from '../types/quarry';
import { formatCurrency } from '../utils/formatters';
import { Percent, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RateMasterView: React.FC = () => {
  const { rates, updateRates } = useQuarry();

  // Local state for editing
  const [formRates, setFormRates] = useState<RateConfig>(JSON.parse(JSON.stringify(rates)));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Recalculate totals per load
    const updated = { ...formRates };
    updated.quarryRates['Laterite Stone — 1st'].totalPerLoad =
      updated.quarryRates['Laterite Stone — 1st'].ratePerUnit * 250;
    updated.quarryRates['Laterite Stone — 2nd'].totalPerLoad =
      updated.quarryRates['Laterite Stone — 2nd'].ratePerUnit * 250;
    updated.quarryRates['Laterite Stone — 3rd'].totalPerLoad =
      updated.quarryRates['Laterite Stone — 3rd'].ratePerUnit;

    updated.rzCustomerRates['Laterite Stone — 1st'].totalPerLoad =
      updated.rzCustomerRates['Laterite Stone — 1st'].ratePerUnit * 250;
    updated.rzCustomerRates['Laterite Stone — 2nd'].totalPerLoad =
      updated.rzCustomerRates['Laterite Stone — 2nd'].ratePerUnit * 250;
    updated.rzCustomerRates['Laterite Stone — 3rd'].totalPerLoad =
      updated.rzCustomerRates['Laterite Stone — 3rd'].ratePerUnit;

    updateRates(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Preview calculations
  const q1 = formRates.quarryRates['Laterite Stone — 1st'].ratePerUnit * 250;
  const c1 = formRates.rzCustomerRates['Laterite Stone — 1st'].ratePerUnit * 250;
  const exp1 =
    formRates.loadExpenses.driverBatta +
    formRates.loadExpenses.vehicleTripRent +
    formRates.loadExpenses.loadingCharge +
    formRates.loadExpenses.diesel +
    formRates.loadExpenses.commissions['Laterite Stone — 1st'];
  const net1 = c1 - q1 - exp1;

  const q2 = formRates.quarryRates['Laterite Stone — 2nd'].ratePerUnit * 250;
  const c2 = formRates.rzCustomerRates['Laterite Stone — 2nd'].ratePerUnit * 250;
  const exp2 =
    formRates.loadExpenses.driverBatta +
    formRates.loadExpenses.vehicleTripRent +
    formRates.loadExpenses.loadingCharge +
    formRates.loadExpenses.diesel +
    formRates.loadExpenses.commissions['Laterite Stone — 2nd'];
  const net2 = c2 - q2 - exp2;

  const q3 = formRates.quarryRates['Laterite Stone — 3rd'].ratePerUnit;
  const c3 = formRates.rzCustomerRates['Laterite Stone — 3rd'].ratePerUnit;
  const exp3 =
    formRates.loadExpenses.driverBatta +
    formRates.loadExpenses.vehicleTripRent +
    formRates.loadExpenses.loadingCharge +
    formRates.loadExpenses.diesel +
    formRates.loadExpenses.commissions['Laterite Stone — 3rd'];
  const net3 = c3 - q3 - exp3;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry & Fleet Rate Master
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure base quarry purchase rates, RZ Mining selling prices & per-load trip operating expenses
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Rates Updated Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Base Quarry Rates (All Vehicles) */}
        <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-5 space-y-4">
          <div className="border-b border-[#232736] pb-3">
            <h3 className="font-cinzel font-bold text-sm text-[#d4af37]">
              1. Base Quarry Rates (Received by All Vehicles)
            </h3>
            <p className="text-xs text-gray-400">
              The internal quarry purchase cost per stone unit/load
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-[#0b0c10] border border-[#1f2434] space-y-2">
              <span className="text-xs font-bold text-gray-200">Laterite Stone — 1st</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Rate / pc: ₹</span>
                <input
                  type="number"
                  value={formRates.quarryRates['Laterite Stone — 1st'].ratePerUnit}
                  onChange={(e) =>
                    setFormRates({
                      ...formRates,
                      quarryRates: {
                        ...formRates.quarryRates,
                        'Laterite Stone — 1st': {
                          ...formRates.quarryRates['Laterite Stone — 1st'],
                          ratePerUnit: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                  className="w-24 bg-[#161924] border border-[#282f42] rounded-lg px-2 py-1 text-sm font-mono font-bold text-gray-100"
                />
              </div>
              <div className="text-[11px] text-[#f3c64c] font-mono">
                Standard Load (250 pcs): <b>{formatCurrency(q1)}</b>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0c10] border border-[#1f2434] space-y-2">
              <span className="text-xs font-bold text-gray-200">Laterite Stone — 2nd</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Rate / pc: ₹</span>
                <input
                  type="number"
                  value={formRates.quarryRates['Laterite Stone — 2nd'].ratePerUnit}
                  onChange={(e) =>
                    setFormRates({
                      ...formRates,
                      quarryRates: {
                        ...formRates.quarryRates,
                        'Laterite Stone — 2nd': {
                          ...formRates.quarryRates['Laterite Stone — 2nd'],
                          ratePerUnit: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                  className="w-24 bg-[#161924] border border-[#282f42] rounded-lg px-2 py-1 text-sm font-mono font-bold text-gray-100"
                />
              </div>
              <div className="text-[11px] text-[#f3c64c] font-mono">
                Standard Load (250 pcs): <b>{formatCurrency(q2)}</b>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0c10] border border-[#1f2434] space-y-2">
              <span className="text-xs font-bold text-gray-200">Laterite Stone — 3rd</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Rate / load: ₹</span>
                <input
                  type="number"
                  value={formRates.quarryRates['Laterite Stone — 3rd'].ratePerUnit}
                  onChange={(e) =>
                    setFormRates({
                      ...formRates,
                      quarryRates: {
                        ...formRates.quarryRates,
                        'Laterite Stone — 3rd': {
                          ...formRates.quarryRates['Laterite Stone — 3rd'],
                          ratePerUnit: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                  className="w-28 bg-[#161924] border border-[#282f42] rounded-lg px-2 py-1 text-sm font-mono font-bold text-gray-100"
                />
              </div>
              <div className="text-[11px] text-[#f3c64c] font-mono">
                Rubble Load: <b>{formatCurrency(q3)}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: RZ Mining Customer Selling Rates */}
        <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-5 space-y-4">
          <div className="border-b border-[#232736] pb-3">
            <h3 className="font-cinzel font-bold text-sm text-[#d4af37]">
              2. RZ Mining Customer Selling Rates (Dedicated Fleet Only)
            </h3>
            <p className="text-xs text-gray-400">
              Only RZ Mining vehicles bill customers using these rates
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-[#0b0c10] border border-[#d4af37]/30 space-y-2">
              <span className="text-xs font-bold text-gray-200">Laterite Stone — 1st</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d4af37]">Customer Rate / pc: ₹</span>
                <input
                  type="number"
                  value={formRates.rzCustomerRates['Laterite Stone — 1st'].ratePerUnit}
                  onChange={(e) =>
                    setFormRates({
                      ...formRates,
                      rzCustomerRates: {
                        ...formRates.rzCustomerRates,
                        'Laterite Stone — 1st': {
                          ...formRates.rzCustomerRates['Laterite Stone — 1st'],
                          ratePerUnit: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                  className="w-24 bg-[#161924] border border-[#282f42] rounded-lg px-2 py-1 text-sm font-mono font-bold text-[#f3c64c]"
                />
              </div>
              <div className="text-[11px] text-[#f3c64c] font-mono">
                Standard Customer Load: <b>{formatCurrency(c1)}</b>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0c10] border border-[#d4af37]/30 space-y-2">
              <span className="text-xs font-bold text-gray-200">Laterite Stone — 2nd</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d4af37]">Customer Rate / pc: ₹</span>
                <input
                  type="number"
                  value={formRates.rzCustomerRates['Laterite Stone — 2nd'].ratePerUnit}
                  onChange={(e) =>
                    setFormRates({
                      ...formRates,
                      rzCustomerRates: {
                        ...formRates.rzCustomerRates,
                        'Laterite Stone — 2nd': {
                          ...formRates.rzCustomerRates['Laterite Stone — 2nd'],
                          ratePerUnit: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                  className="w-24 bg-[#161924] border border-[#282f42] rounded-lg px-2 py-1 text-sm font-mono font-bold text-[#f3c64c]"
                />
              </div>
              <div className="text-[11px] text-[#f3c64c] font-mono">
                Standard Customer Load: <b>{formatCurrency(c2)}</b>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0c10] border border-[#d4af37]/30 space-y-2">
              <span className="text-xs font-bold text-gray-200">Laterite Stone — 3rd</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d4af37]">Customer Rate / load: ₹</span>
                <input
                  type="number"
                  value={formRates.rzCustomerRates['Laterite Stone — 3rd'].ratePerUnit}
                  onChange={(e) =>
                    setFormRates({
                      ...formRates,
                      rzCustomerRates: {
                        ...formRates.rzCustomerRates,
                        'Laterite Stone — 3rd': {
                          ...formRates.rzCustomerRates['Laterite Stone — 3rd'],
                          ratePerUnit: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                  className="w-28 bg-[#161924] border border-[#282f42] rounded-lg px-2 py-1 text-sm font-mono font-bold text-[#f3c64c]"
                />
              </div>
              <div className="text-[11px] text-[#f3c64c] font-mono">
                Customer Rubble Load: <b>{formatCurrency(c3)}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: RZ Mining Fleet Load Expenses & Net Profit Preview */}
        <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-5 space-y-4">
          <div className="border-b border-[#232736] pb-3">
            <h3 className="font-cinzel font-bold text-sm text-[#d4af37]">
              3. Fleet Operating Expenses & Net Margin Configuration
            </h3>
            <p className="text-xs text-gray-400">
              Default automated costs posted with every RZ Mining Gate Pass
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-[#0b0c10] rounded-xl border border-[#1f2434] space-y-1">
              <label className="text-gray-400">Driver Batta (₹)</label>
              <input
                type="number"
                value={formRates.loadExpenses.driverBatta}
                onChange={(e) =>
                  setFormRates({
                    ...formRates,
                    loadExpenses: {
                      ...formRates.loadExpenses,
                      driverBatta: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-[#161924] border border-[#282f42] rounded px-2 py-1 font-mono font-bold text-gray-100"
              />
            </div>

            <div className="p-3 bg-[#0b0c10] rounded-xl border border-[#1f2434] space-y-1">
              <label className="text-gray-400">Vehicle Trip Rent (₹)</label>
              <input
                type="number"
                value={formRates.loadExpenses.vehicleTripRent}
                onChange={(e) =>
                  setFormRates({
                    ...formRates,
                    loadExpenses: {
                      ...formRates.loadExpenses,
                      vehicleTripRent: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-[#161924] border border-[#282f42] rounded px-2 py-1 font-mono font-bold text-gray-100"
              />
            </div>

            <div className="p-3 bg-[#0b0c10] rounded-xl border border-[#1f2434] space-y-1">
              <label className="text-gray-400">Loading Charge (₹)</label>
              <input
                type="number"
                value={formRates.loadExpenses.loadingCharge}
                onChange={(e) =>
                  setFormRates({
                    ...formRates,
                    loadExpenses: {
                      ...formRates.loadExpenses,
                      loadingCharge: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-[#161924] border border-[#282f42] rounded px-2 py-1 font-mono font-bold text-gray-100"
              />
            </div>

            <div className="p-3 bg-[#0b0c10] rounded-xl border border-[#1f2434] space-y-1">
              <label className="text-gray-400">Diesel Allocation (₹)</label>
              <input
                type="number"
                value={formRates.loadExpenses.diesel}
                onChange={(e) =>
                  setFormRates({
                    ...formRates,
                    loadExpenses: {
                      ...formRates.loadExpenses,
                      diesel: Number(e.target.value) || 0,
                    },
                  })
                }
                className="w-full bg-[#161924] border border-[#282f42] rounded px-2 py-1 font-mono font-bold text-gray-100"
              />
            </div>

            <div className="p-3 bg-[#0b0c10] rounded-xl border border-[#1f2434] space-y-1">
              <label className="text-gray-400">Comm (1st/2nd ₹)</label>
              <input
                type="number"
                value={formRates.loadExpenses.commissions['Laterite Stone — 1st']}
                onChange={(e) =>
                  setFormRates({
                    ...formRates,
                    loadExpenses: {
                      ...formRates.loadExpenses,
                      commissions: {
                        ...formRates.loadExpenses.commissions,
                        'Laterite Stone — 1st': Number(e.target.value) || 0,
                        'Laterite Stone — 2nd': Number(e.target.value) || 0,
                      },
                    },
                  })
                }
                className="w-full bg-[#161924] border border-[#282f42] rounded px-2 py-1 font-mono font-bold text-gray-100"
              />
            </div>
          </div>

          {/* Automatic Live Profit Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#141822] via-[#0d1016] to-[#121914] border border-emerald-500/30 text-xs">
            <span className="font-bold text-[#d4af37] block mb-2 uppercase tracking-wider">
              Automatic RZ Net Profit Validation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-2.5 rounded-lg bg-[#0b0c10]">
                <div className="text-gray-400 text-[10px]">1st Quality Load</div>
                <div className="text-gray-300">₹{c1} - ₹{q1} - ₹{exp1}</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  Net RZ = {formatCurrency(net1)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0b0c10]">
                <div className="text-gray-400 text-[10px]">2nd Quality Load</div>
                <div className="text-gray-300">₹{c2} - ₹{q2} - ₹{exp2}</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  Net RZ = {formatCurrency(net2)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0b0c10]">
                <div className="text-gray-400 text-[10px]">3rd Quality (Rubble)</div>
                <div className="text-gray-300">₹{c3} - ₹{q3} - ₹{exp3}</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  Net RZ = {formatCurrency(net3)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="gold-btn px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Save Rate Master Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
