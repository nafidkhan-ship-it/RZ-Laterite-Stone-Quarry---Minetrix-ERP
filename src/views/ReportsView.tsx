import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { formatCurrency, formatNumber, formatDate, getTodayDateString } from '../utils/formatters';
import { FileBarChart, Printer, Calendar, Download, Filter } from 'lucide-react';

type ReportType =
  | 'daily_quarry'
  | 'monthly_quarry'
  | 'vehicle_report'
  | 'driver_report'
  | 'customer_report'
  | 'attendance_report'
  | 'expense_report'
  | 'gate_pass_report';

export const ReportsView: React.FC = () => {
  const {
    loads,
    gatePasses,
    production,
    stock,
    income,
    expenses,
    payments,
    customers,
    vehicles,
    drivers,
    staff,
    attendance,
  } = useQuarry();

  const [activeReport, setActiveReport] = useState<ReportType>('daily_quarry');
  const [dateFilter, setDateFilter] = useState(getTodayDateString());
  const [monthFilter, setMonthFilter] = useState('2026-10');

  // Filtered dataset
  const dayLoads = loads.filter((l) => l.date === dateFilter);
  const dayGatePasses = gatePasses.filter((g) => g.date === dateFilter);
  const dayProduction = production.filter((p) => p.date === dateFilter);
  const dayExpenses = expenses.filter((e) => e.date === dateFilter);
  const dayPayments = payments.filter((p) => p.date === dateFilter);

  const totalDayLoads = dayLoads.length;
  const totalDayQty = dayLoads.reduce((sum, l) => sum + (l.unit === 'pcs' ? l.quantity : 0), 0);
  const totalDaySales = dayLoads.reduce((sum, l) => sum + l.quarryAmount, 0);
  const totalDayCustSales = dayLoads.reduce((sum, l) => sum + l.customerSaleAmount, 0);
  const totalDayCollections = dayPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalDayExpenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const dayNet = totalDayCollections - totalDayExpenses;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Operations & Accounts Reports
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Audit-ready reports with date-based filtering and instant A4 printing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#12141a] rounded-xl border border-[#232736]">
        {[
          { id: 'daily_quarry', label: 'Daily Quarry Report' },
          { id: 'monthly_quarry', label: 'Monthly Summary' },
          { id: 'vehicle_report', label: 'Vehicle Fleet Report' },
          { id: 'driver_report', label: 'Driver Batta Report' },
          { id: 'customer_report', label: 'Customer Aging' },
          { id: 'attendance_report', label: 'Staff Attendance' },
          { id: 'expense_report', label: 'Expense Audit' },
          { id: 'gate_pass_report', label: 'Gate Pass Clearance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id as ReportType)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeReport === tab.id
                ? 'bg-[#d4af37] text-black font-bold shadow'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#181b24]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Filter Bar */}
      <div className="p-3 bg-[#12141a] rounded-xl border border-[#232736] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-400">Filter Period:</span>
          {activeReport === 'monthly_quarry' ? (
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-[#161924] border border-[#262c3e] rounded-lg px-3 py-1 text-xs text-gray-200 font-mono"
            />
          ) : (
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-[#161924] border border-[#262c3e] rounded-lg px-3 py-1 text-xs text-gray-200 font-mono"
            />
          )}
        </div>

        <span className="text-xs text-[#d4af37] font-mono">
          Report Status: Active Reconciled
        </span>
      </div>

      {/* Printable Report Canvas */}
      <div className="p-6 printable-document bg-[#12141a] rounded-2xl border border-[#232736] text-xs space-y-4">
        {/* Report Printable Header */}
        <div className="border-b border-[#232736] pb-3 flex items-start justify-between">
          <div>
            <h3 className="font-cinzel font-bold text-lg text-gray-100">
              RZ MINETRIX • LATERITE STONE QUARRY
            </h3>
            <p className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
              {activeReport.replace('_', ' ').toUpperCase()} • {dateFilter}
            </p>
          </div>
          <div className="text-right text-[11px] text-gray-400 font-mono">
            Generated: {new Date().toLocaleString('en-IN')}
          </div>
        </div>

        {/* 1. Daily Quarry Report */}
        {activeReport === 'daily_quarry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#0d0f14] rounded-xl border border-[#202534]">
                <div className="text-[10px] text-gray-400">Total Loads</div>
                <div className="text-xl font-bold font-mono text-gray-100">{totalDayLoads}</div>
              </div>
              <div className="p-3 bg-[#0d0f14] rounded-xl border border-[#202534]">
                <div className="text-[10px] text-gray-400">Total Quantity</div>
                <div className="text-xl font-bold font-mono text-[#f3c64c]">{formatNumber(totalDayQty)} pcs</div>
              </div>
              <div className="p-3 bg-[#0d0f14] rounded-xl border border-[#202534]">
                <div className="text-[10px] text-gray-400">Quarry Sales</div>
                <div className="text-xl font-bold font-mono text-gray-100">{formatCurrency(totalDaySales)}</div>
              </div>
              <div className="p-3 bg-[#0d0f14] rounded-xl border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400">Collections</div>
                <div className="text-xl font-bold font-mono text-emerald-400">{formatCurrency(totalDayCollections)}</div>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                  <th className="p-2">Load ID</th>
                  <th className="p-2">Vehicle / Driver</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2 text-right">Quarry Amount</th>
                  <th className="p-2 text-right">Customer Sale</th>
                  <th className="p-2 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2230]">
                {dayLoads.map((l) => (
                  <tr key={l.id}>
                    <td className="p-2 font-mono font-bold text-[#d4af37]">{l.loadNumber}</td>
                    <td className="p-2">{l.vehicleNumber} ({l.driver})</td>
                    <td className="p-2">{l.vehicleCategory}</td>
                    <td className="p-2">{l.customerName}</td>
                    <td className="p-2 text-right font-mono">{formatCurrency(l.quarryAmount)}</td>
                    <td className="p-2 text-right font-mono font-bold text-[#f3c64c]">{formatCurrency(l.customerSaleAmount)}</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-400">
                      {l.vehicleCategory === 'RZ Mining' ? formatCurrency(l.netProfit) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Monthly Quarry Report */}
        {activeReport === 'monthly_quarry' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#0d0f14] rounded-xl border border-[#202534] space-y-2">
              <h4 className="font-bold text-sm text-[#d4af37]">Month Financial Synthesis ({monthFilter})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>Total Month Deliveries: <b className="text-gray-100">{loads.length} Loads</b></div>
                <div>Customer Revenue: <b className="text-[#f3c64c]">{formatCurrency(loads.reduce((s, l) => s + l.customerSaleAmount, 0))}</b></div>
                <div>Quarry Production: <b className="text-emerald-400">{formatNumber(production.reduce((s, p) => s + p.quantity, 0))} pcs</b></div>
                <div>Total Expenses: <b className="text-rose-400">{formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</b></div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Vehicle Fleet Report */}
        {activeReport === 'vehicle_report' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2">Reg Number</th>
                <th className="p-2">Owner & Driver</th>
                <th className="p-2">Category</th>
                <th className="p-2 text-right">Trips</th>
                <th className="p-2 text-right">Gross Sales (₹)</th>
                <th className="p-2 text-right">Operating Costs (₹)</th>
                <th className="p-2 text-right">Net Return (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {vehicles.map((v) => {
                const vLoads = loads.filter((l) => l.vehicleNumber === v.vehicleNumber);
                const sales = vLoads.reduce((sum, l) => sum + l.customerSaleAmount, 0);
                const exp = vLoads.reduce((sum, l) => sum + l.totalExpense, 0);
                const net = vLoads.reduce((sum, l) => sum + l.netProfit, 0);
                return (
                  <tr key={v.id}>
                    <td className="p-2 font-mono font-bold text-gray-100">{v.vehicleNumber}</td>
                    <td className="p-2">{v.owner} • {v.driver}</td>
                    <td className="p-2">{v.category}</td>
                    <td className="p-2 text-right font-mono font-bold">{vLoads.length}</td>
                    <td className="p-2 text-right font-mono text-[#f3c64c]">{formatCurrency(sales)}</td>
                    <td className="p-2 text-right font-mono text-rose-400">{formatCurrency(exp)}</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-400">
                      {v.category === 'RZ Mining' ? formatCurrency(net) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 4. Driver Report */}
        {activeReport === 'driver_report' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2">Driver Name</th>
                <th className="p-2">Assigned Tipper</th>
                <th className="p-2">Category</th>
                <th className="p-2 text-right">Trips</th>
                <th className="p-2 text-right">Total Batta Earned</th>
                <th className="p-2 text-right">Balance Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {drivers.map((d) => {
                const dLoads = loads.filter((l) => l.driver === d.name);
                const batta = dLoads.reduce((s, l) => s + l.driverBatta, 0);
                return (
                  <tr key={d.id}>
                    <td className="p-2 font-bold text-gray-100">{d.name}</td>
                    <td className="p-2 font-mono text-gray-300">{d.vehicle}</td>
                    <td className="p-2">{d.category}</td>
                    <td className="p-2 text-right font-mono">{dLoads.length}</td>
                    <td className="p-2 text-right font-mono font-bold text-[#f3c64c]">{formatCurrency(batta)}</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-400">{formatCurrency(batta)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 5. Customer Report */}
        {activeReport === 'customer_report' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2">Customer / Client</th>
                <th className="p-2">Destination</th>
                <th className="p-2 text-right">Total Loads</th>
                <th className="p-2 text-right">Total Billed</th>
                <th className="p-2 text-right">Total Paid</th>
                <th className="p-2 text-right">Outstanding Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {customers.map((c) => {
                const cLoads = loads.filter((l) => l.customerId === c.id);
                const sales = cLoads.reduce((s, l) => s + l.customerSaleAmount, 0);
                const paid = payments.filter((p) => p.customerId === c.id).reduce((s, p) => s + p.amount, 0);
                const balance = c.openingBalance + sales - paid;
                return (
                  <tr key={c.id}>
                    <td className="p-2 font-bold text-gray-100">{c.name}</td>
                    <td className="p-2 text-gray-300">{c.destination}</td>
                    <td className="p-2 text-right font-mono">{cLoads.length}</td>
                    <td className="p-2 text-right font-mono text-[#f3c64c]">{formatCurrency(sales)}</td>
                    <td className="p-2 text-right font-mono text-emerald-400">{formatCurrency(paid)}</td>
                    <td className="p-2 text-right font-mono font-bold text-rose-400">{formatCurrency(balance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 6. Attendance Report */}
        {activeReport === 'attendance_report' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2">Date</th>
                <th className="p-2">Staff Member</th>
                <th className="p-2">Status</th>
                <th className="p-2">Overtime</th>
                <th className="p-2">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td className="p-2 font-mono text-gray-300">{formatDate(a.date)}</td>
                  <td className="p-2 font-bold text-gray-100">{a.employeeName}</td>
                  <td className="p-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {a.status}
                    </span>
                  </td>
                  <td className="p-2 font-mono">{a.overtimeHours} hrs</td>
                  <td className="p-2 text-gray-400">{a.enteredBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 7. Expense Report */}
        {activeReport === 'expense_report' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2">Date</th>
                <th className="p-2">Category</th>
                <th className="p-2">Particulars</th>
                <th className="p-2 text-right">Amount (₹)</th>
                <th className="p-2 text-center">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td className="p-2 font-mono text-gray-300">{formatDate(e.date)}</td>
                  <td className="p-2 font-bold text-gray-200">{e.category}</td>
                  <td className="p-2">{e.description}</td>
                  <td className="p-2 text-right font-mono font-bold text-rose-400">{formatCurrency(e.amount)}</td>
                  <td className="p-2 text-center text-gray-300">{e.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 8. Gate Pass Clearance Report */}
        {activeReport === 'gate_pass_report' && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2">GP No</th>
                <th className="p-2">Date & Time</th>
                <th className="p-2">Vehicle / Driver</th>
                <th className="p-2">Customer & Site</th>
                <th className="p-2">Material & Qty</th>
                <th className="p-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {gatePasses.map((g) => (
                <tr key={g.id}>
                  <td className="p-2 font-mono font-bold text-[#f3c64c]">{g.gatePassNumber}</td>
                  <td className="p-2 font-mono">{formatDate(g.date)} {g.time}</td>
                  <td className="p-2">{g.vehicleNumber} ({g.driver})</td>
                  <td className="p-2">{g.customerName}</td>
                  <td className="p-2">{g.material} ({g.quantity} {g.unit})</td>
                  <td className="p-2 text-right font-mono font-bold">{formatCurrency(g.totalBillAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
