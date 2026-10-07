import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { formatCurrency, formatDate, getTodayDateString } from '../utils/formatters';
import { Coins, Calendar, ArrowUpRight, ArrowDownRight, Wallet, Printer } from 'lucide-react';

export const DailyAccountView: React.FC = () => {
  const { income, expenses, payments, advances } = useQuarry();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [openingCash, setOpeningCash] = useState<number>(10000); // configurable base opening cash

  // Compute daily transactions
  const dailyData = useMemo(() => {
    // 1. Collections from customers (Cash/Direct) on this date
    const dayCollections = payments
      .filter((p) => p.date === selectedDate)
      .reduce((sum, p) => sum + p.amount, 0);

    // 2. Direct material sales & quarry incomes on this date
    const dayIncomes = income
      .filter((i) => i.date === selectedDate && i.category !== 'Customer Collections')
      .reduce((sum, i) => sum + i.amount, 0);

    // 3. Quarry expenses on this date
    const dayExpensesList = expenses.filter((e) => e.date === selectedDate);
    const dayQuarryExpenses = dayExpensesList
      .filter((e) => e.category !== 'Staff Advance' && e.category !== 'Driver Expense')
      .reduce((sum, e) => sum + e.amount, 0);

    // 4. Staff payments & advances on this date
    const dayStaffPayments = advances
      .filter((a) => a.date === selectedDate)
      .reduce((sum, a) => sum + a.amount, 0);

    // 5. Driver payments (batta payouts)
    const dayDriverPayments = dayExpensesList
      .filter((e) => e.category === 'Driver Expense')
      .reduce((sum, e) => sum + e.amount, 0);

    // Total in & out
    const totalInflow = dayCollections + dayIncomes;
    const totalOutflow = dayQuarryExpenses + dayStaffPayments + dayDriverPayments;
    const closingBalance = openingCash + totalInflow - totalOutflow;

    return {
      dayCollections,
      dayIncomes,
      dayQuarryExpenses,
      dayStaffPayments,
      dayDriverPayments,
      totalInflow,
      totalOutflow,
      closingBalance,
    };
  }, [income, expenses, payments, advances, selectedDate, openingCash]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Daily Account (Cash Book)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Opening Cash + Collections + Incomes - Quarry Expenses - Staff/Driver Payouts = Closing Cash
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-gray-100 font-mono"
          />
          <button
            onClick={() => window.print()}
            className="gold-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Daily Cash Equation Visualizer */}
      <div className="p-5 rounded-2xl bg-[#12141a] border border-[#232736] space-y-4">
        <div className="flex items-center justify-between border-b border-[#232736] pb-3">
          <h3 className="font-cinzel font-bold text-sm text-gray-200">
            Cash Flow Reconciliation for {formatDate(selectedDate)}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Opening Cash (₹):</span>
            <input
              type="number"
              value={openingCash}
              onChange={(e) => setOpeningCash(Number(e.target.value) || 0)}
              className="w-24 bg-[#161924] border border-[#262c3e] rounded px-2 py-0.5 font-mono text-gray-100 font-bold"
            />
          </div>
        </div>

        {/* The Formal Formula Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          {/* 1. Opening Cash */}
          <div className="p-3 rounded-xl bg-[#0b0c10] border border-[#202534] text-center">
            <span className="text-[10px] text-gray-400 block">Opening Cash</span>
            <span className="text-base font-bold font-mono text-gray-200 block mt-1">
              {formatCurrency(openingCash)}
            </span>
          </div>

          {/* 2. + Collections */}
          <div className="p-3 rounded-xl bg-[#0b0c10] border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-400 block font-bold">(+) Collections</span>
            <span className="text-base font-bold font-mono text-emerald-400 block mt-1">
              +{formatCurrency(dailyData.dayCollections)}
            </span>
          </div>

          {/* 3. + Sales / Incomes */}
          <div className="p-3 rounded-xl bg-[#0b0c10] border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-400 block font-bold">(+) Sales / Incomes</span>
            <span className="text-base font-bold font-mono text-emerald-400 block mt-1">
              +{formatCurrency(dailyData.dayIncomes)}
            </span>
          </div>

          {/* 4. - Quarry Expenses */}
          <div className="p-3 rounded-xl bg-[#0b0c10] border border-rose-500/30 text-center">
            <span className="text-[10px] text-rose-400 block font-bold">(-) Quarry Exp.</span>
            <span className="text-base font-bold font-mono text-rose-400 block mt-1">
              -{formatCurrency(dailyData.dayQuarryExpenses)}
            </span>
          </div>

          {/* 5. - Staff Payments */}
          <div className="p-3 rounded-xl bg-[#0b0c10] border border-rose-500/30 text-center">
            <span className="text-[10px] text-rose-400 block font-bold">(-) Staff Payments</span>
            <span className="text-base font-bold font-mono text-rose-400 block mt-1">
              -{formatCurrency(dailyData.dayStaffPayments)}
            </span>
          </div>

          {/* 6. - Driver Payments */}
          <div className="p-3 rounded-xl bg-[#0b0c10] border border-rose-500/30 text-center">
            <span className="text-[10px] text-rose-400 block font-bold">(-) Driver Payouts</span>
            <span className="text-base font-bold font-mono text-rose-400 block mt-1">
              -{formatCurrency(dailyData.dayDriverPayments)}
            </span>
          </div>

          {/* 7. = Closing Balance */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#12141a] to-[#1e1a12] border border-[#d4af37]/60 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#d4af37] block font-bold">(=) Closing Cash</span>
            <span className="text-lg font-black font-mono text-[#f3c64c] block mt-1">
              {formatCurrency(dailyData.closingBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Details Listed Below */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inflows Today */}
        <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#232736]">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>Cash Inflows Today</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              +{formatCurrency(dailyData.totalInflow)}
            </span>
          </div>

          <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
            {payments
              .filter((p) => p.date === selectedDate)
              .map((p) => (
                <div
                  key={p.id}
                  className="p-2 rounded-lg bg-[#0e1017] border border-[#1d2232] flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-gray-200 block">{p.customerName}</span>
                    <span className="text-[10px] text-gray-400">{p.paymentMode} • {p.remarks}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">+{formatCurrency(p.amount)}</span>
                </div>
              ))}

            {income
              .filter((i) => i.date === selectedDate && i.category !== 'Customer Collections')
              .map((inc) => (
                <div
                  key={inc.id}
                  className="p-2 rounded-lg bg-[#0e1017] border border-[#1d2232] flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-gray-200 block">{inc.description}</span>
                    <span className="text-[10px] text-gray-400">{inc.category} • {inc.paymentMode}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">+{formatCurrency(inc.amount)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Outflows Today */}
        <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#232736]">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
              <ArrowDownRight className="w-4 h-4" />
              <span>Cash Outflows & Expenses Today</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">
              -{formatCurrency(dailyData.totalOutflow)}
            </span>
          </div>

          <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
            {expenses
              .filter((e) => e.date === selectedDate)
              .map((exp) => (
                <div
                  key={exp.id}
                  className="p-2 rounded-lg bg-[#0e1017] border border-[#1d2232] flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-gray-200 block">{exp.description}</span>
                    <span className="text-[10px] text-gray-400">{exp.category} • {exp.paymentMode}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">-{formatCurrency(exp.amount)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
