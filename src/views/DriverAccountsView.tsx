import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { formatCurrency, formatNumber, formatDate, getTodayDateString } from '../utils/formatters';
import { Users, DollarSign, Plus, CheckCircle2, HandCoins } from 'lucide-react';

export const DriverAccountsView: React.FC = () => {
  const { drivers, loads, expenses, addQuarryExpense, currentUser } = useQuarry();

  const [selectedDriverName, setSelectedDriverName] = useState<string>(
    drivers[0]?.name || ''
  );
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payRemarks, setPayRemarks] = useState('');

  // Compute stats per driver
  const driverAccounts = useMemo(() => {
    return drivers.map((drv) => {
      const drvLoads = loads.filter((l) => l.driver === drv.name);
      const trips = drvLoads.length;
      const totalQty = drvLoads.reduce((sum, l) => sum + l.quantity, 0);

      // Total earned batta
      const totalBattaEarned = drvLoads.reduce((sum, l) => sum + l.driverBatta, 0);

      // Payments made to driver (tracked in expenses tagged to driver)
      const drvExpenses = expenses.filter((e) => e.driverName === drv.name);
      const totalPaidOut = drvExpenses.reduce((sum, e) => sum + e.amount, 0);

      const balance = totalBattaEarned - totalPaidOut;

      return {
        driver: drv,
        trips,
        totalQty,
        totalBattaEarned,
        totalPaidOut,
        balance,
        loads: drvLoads,
        expensesList: drvExpenses,
      };
    });
  }, [drivers, loads, expenses]);

  const activeAccount =
    driverAccounts.find((a) => a.driver.name === selectedDriverName) || driverAccounts[0];

  const handlePayDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || !activeAccount) return;

    addQuarryExpense({
      date: getTodayDateString(),
      category: 'Driver Expense',
      description: `Driver Batta Settlement / Cash to ${activeAccount.driver.name} (${payRemarks || 'Trip Batta'})`,
      amount: Number(payAmount),
      paymentMode: 'Cash',
      driverName: activeAccount.driver.name,
      vehicleNumber: activeAccount.driver.vehicle,
      enteredBy: currentUser,
    });

    setPayModalOpen(false);
    setPayAmount('');
    setPayRemarks('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Driver Accounts & Trip Batta Ledger
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Auto-calculated trip allowances (₹600/load for RZ Mining), cash disbursements & net balances
          </p>
        </div>

        {/* Driver Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#161924] p-1 rounded-xl border border-[#262c3e]">
          {drivers.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDriverName(d.name)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDriverName === d.name
                  ? 'bg-[#d4af37] text-black font-bold shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {d.name} ({d.category})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Driver Overview Cards */}
      {activeAccount && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#232736]">
            <div className="text-[10px] text-gray-400">Total Trips Completed</div>
            <div className="text-2xl font-bold font-mono text-gray-100">{activeAccount.trips}</div>
            <div className="text-[10px] text-gray-500">{formatNumber(activeAccount.totalQty)} pcs delivered</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#d4af37]/30">
            <div className="text-[10px] text-[#d4af37]">Total Batta Earned</div>
            <div className="text-2xl font-bold font-mono text-[#f3c64c]">{formatCurrency(activeAccount.totalBattaEarned)}</div>
            <div className="text-[10px] text-gray-500">From Gate Pass dispatches</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#12141a] border border-[#232736]">
            <div className="text-[10px] text-gray-400">Paid Out / Advance</div>
            <div className="text-2xl font-bold font-mono text-rose-400">{formatCurrency(activeAccount.totalPaidOut)}</div>
            <div className="text-[10px] text-gray-500">Cash / fuel allocations</div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#12141a] to-[#151c14] border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-400 font-bold">Payable Balance</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">{formatCurrency(activeAccount.balance)}</div>
              <div className="text-[10px] text-gray-400">Driver balance due</div>
            </div>
            <button
              onClick={() => {
                setPayAmount(activeAccount.balance > 0 ? activeAccount.balance : '');
                setPayModalOpen(true);
              }}
              className="gold-btn px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* Driver Accounts Summary Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-4 space-y-3">
        <h3 className="font-cinzel font-bold text-sm text-gray-200">
          All Quarry Drivers Batta & Balance Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2.5">Driver</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Vehicle</th>
                <th className="p-2.5 text-right">Trips</th>
                <th className="p-2.5 text-right">Total Quantity</th>
                <th className="p-2.5 text-right">Batta Earned (₹)</th>
                <th className="p-2.5 text-right">Paid Out (₹)</th>
                <th className="p-2.5 text-right">Current Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {driverAccounts.map((acc) => (
                <tr
                  key={acc.driver.id}
                  onClick={() => setSelectedDriverName(acc.driver.name)}
                  className={`cursor-pointer transition-colors ${
                    selectedDriverName === acc.driver.name
                      ? 'bg-[#181d2a]'
                      : 'hover:bg-[#161924]'
                  }`}
                >
                  <td className="p-2.5 font-bold text-gray-100">{acc.driver.name}</td>
                  <td className="p-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.driver.category === 'RZ Mining'
                          ? 'bg-[#d4af37]/15 text-[#f3c64c]'
                          : 'bg-blue-900/20 text-blue-400'
                      }`}
                    >
                      {acc.driver.category}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-gray-300">{acc.driver.vehicle}</td>
                  <td className="p-2.5 text-right font-mono font-bold">{acc.trips}</td>
                  <td className="p-2.5 text-right font-mono">{formatNumber(acc.totalQty)} pcs</td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#f3c64c]">{formatCurrency(acc.totalBattaEarned)}</td>
                  <td className="p-2.5 text-right font-mono text-rose-400">{formatCurrency(acc.totalPaidOut)}</td>
                  <td className="p-2.5 text-right font-mono font-black text-emerald-400">{formatCurrency(acc.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment / Settlement Modal */}
      {payModalOpen && activeAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101218] border border-[#262c3e] w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-cinzel font-bold text-base text-gray-100">
              Pay Trip Batta to {activeAccount.driver.name}
            </h3>
            <p className="text-xs text-gray-400">
              Disburse cash/advance and record immediately in quarry accounts
            </p>

            <form onSubmit={handlePayDriver} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Amount to Disburse (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value) || '')}
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Remarks / Purpose
                </label>
                <input
                  type="text"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  placeholder="e.g. Weekly batta settlement"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
