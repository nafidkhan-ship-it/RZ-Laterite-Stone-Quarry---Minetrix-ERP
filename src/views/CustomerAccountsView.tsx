import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { Customer } from '../types/quarry';
import { formatCurrency, formatNumber, formatDate, getTodayDateString } from '../utils/formatters';
import { BookOpen, FileSpreadsheet, Printer, Share2, Plus, Coins, Filter } from 'lucide-react';

interface CustomerAccountsViewProps {
  initialCustomerId?: string;
  onOpenStatementModal: (customer: Customer, dateRange: { from: string; to: string }) => void;
  onOpenPaymentModal: (customerId: string) => void;
}

export const CustomerAccountsView: React.FC<CustomerAccountsViewProps> = ({
  initialCustomerId,
  onOpenStatementModal,
  onOpenPaymentModal,
}) => {
  const { customers, loads, payments } = useQuarry();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialCustomerId || (customers[0]?.id || '')
  );
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Ledger calculation with running balance
  const ledgerEntries = useMemo(() => {
    if (!currentCustomer) return [];

    // Filter loads for this customer
    const custLoads = loads.filter((l) => {
      if (l.customerId !== currentCustomer.id) return false;
      if (dateFrom && l.date < dateFrom) return false;
      if (dateTo && l.date > dateTo) return false;
      return true;
    });

    // Filter payments for this customer
    const custPayments = payments.filter((p) => {
      if (p.customerId !== currentCustomer.id) return false;
      if (dateFrom && p.date < dateFrom) return false;
      if (dateTo && p.date > dateTo) return false;
      return true;
    });

    // Combine and sort by date ascending
    const combined = [
      ...custLoads.map((l) => ({
        type: 'DEBIT_SALE' as const,
        date: l.date,
        time: l.time,
        ref: l.gatePassNumber || l.loadNumber,
        loadId: l.loadNumber,
        gpNo: l.gatePassNumber || '—',
        vehicle: `${l.vehicleNumber} (${l.driver})`,
        material: l.material,
        quantity: `${l.quantity} ${l.unit}`,
        rate: l.customerSaleRate,
        amount: l.customerSaleAmount,
        payment: 0,
        remarks: l.remarks,
      })),
      ...custPayments.map((p) => ({
        type: 'CREDIT_PAYMENT' as const,
        date: p.date,
        time: '',
        ref: p.reference || 'PAYMENT',
        loadId: '—',
        gpNo: '—',
        vehicle: '—',
        material: 'Payment Received',
        quantity: '—',
        rate: 0,
        amount: 0,
        payment: p.amount,
        remarks: `${p.paymentMode} Receipt: ${p.remarks || ''}`,
      })),
    ];

    combined.sort((a, b) => (a.date > b.date ? 1 : -1));

    // Calculate running balance
    let running = currentCustomer.openingBalance;
    return combined.map((entry) => {
      if (entry.type === 'DEBIT_SALE') {
        running += entry.amount;
      } else {
        running -= entry.payment;
      }
      return {
        ...entry,
        balance: running,
      };
    });
  }, [currentCustomer, loads, payments, dateFrom, dateTo]);

  const totalSales = ledgerEntries
    .filter((e) => e.type === 'DEBIT_SALE')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPaid = ledgerEntries
    .filter((e) => e.type === 'CREDIT_PAYMENT')
    .reduce((sum, e) => sum + e.payment, 0);

  const closingBalance =
    (currentCustomer?.openingBalance || 0) + totalSales - totalPaid;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Customer Accounts & Ledger
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Complete date-wise statement of loads delivered, payments received and outstanding balance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentCustomer && (
            <>
              <button
                onClick={() => onOpenPaymentModal(currentCustomer.id)}
                className="gold-btn px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>

              <button
                onClick={() =>
                  onOpenStatementModal(currentCustomer, { from: dateFrom, to: dateTo })
                }
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1e2332] hover:bg-[#272e42] text-[#d4af37] border border-[#d4af37]/40 flex items-center gap-1.5 shadow"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Generate Official Bill / Statement</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Customer Switcher & Date Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#12141a] rounded-xl border border-[#232736]">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Select Customer
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-bold text-gray-100 focus:outline-none focus:border-[#d4af37]"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Date From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-gray-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Date To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-gray-200"
          />
        </div>
      </div>

      {/* Customer Summary Cards */}
      {currentCustomer && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#12141a] border border-[#232736]">
            <div className="text-[10px] text-gray-400">Opening Balance</div>
            <div className="text-xl font-bold font-mono text-gray-100">
              {formatCurrency(currentCustomer.openingBalance)}
            </div>
            <div className="text-[10px] text-gray-500">Initial ledger balance</div>
          </div>

          <div className="p-3 rounded-xl bg-[#12141a] border border-[#d4af37]/30">
            <div className="text-[10px] text-[#d4af37]">Total Sales (Deliveries)</div>
            <div className="text-xl font-bold font-mono text-[#f3c64c]">
              {formatCurrency(totalSales)}
            </div>
            <div className="text-[10px] text-gray-500">
              {ledgerEntries.filter((e) => e.type === 'DEBIT_SALE').length} loads
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#12141a] border border-emerald-500/30">
            <div className="text-[10px] text-emerald-400">Total Payments Received</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {formatCurrency(totalPaid)}
            </div>
            <div className="text-[10px] text-gray-500">All payment receipts</div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-[#12141a] to-[#1e1414] border border-rose-500/40">
            <div className="text-[10px] text-rose-400 font-bold">Outstanding Balance</div>
            <div className="text-xl font-bold font-mono text-rose-400">
              {formatCurrency(closingBalance)}
            </div>
            <div className="text-[10px] text-gray-400">Current client payable</div>
          </div>
        </div>
      )}

      {/* Date-wise Detailed Ledger Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="p-4 bg-[#161924] border-b border-[#232736] flex items-center justify-between">
          <h3 className="font-cinzel font-bold text-sm text-gray-200">
            Date-Wise Transaction Statement
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {ledgerEntries.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#141722] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-3">Date</th>
                <th className="p-3">Ref / GP No</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Material / Description</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Rate (₹)</th>
                <th className="p-3 text-right text-rose-400">Debit (Sales ₹)</th>
                <th className="p-3 text-right text-emerald-400">Credit (Paid ₹)</th>
                <th className="p-3 text-right font-bold">Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {ledgerEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No transactions recorded for this customer yet.
                  </td>
                </tr>
              ) : (
                ledgerEntries.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#161924]">
                    <td className="p-3 font-mono text-gray-300">{formatDate(row.date)}</td>
                    <td className="p-3 font-mono font-bold text-[#d4af37]">{row.ref}</td>
                    <td className="p-3 font-mono text-gray-300">{row.vehicle}</td>
                    <td className="p-3 text-gray-200 font-medium">
                      {row.material}
                      {row.remarks && (
                        <span className="block text-[10px] text-gray-500">{row.remarks}</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono">{row.quantity}</td>
                    <td className="p-3 text-right font-mono text-gray-400">
                      {row.rate > 0 ? formatCurrency(row.rate) : '—'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-400">
                      {row.amount > 0 ? formatCurrency(row.amount) : '—'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      {row.payment > 0 ? formatCurrency(row.payment) : '—'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-gray-100">
                      {formatCurrency(row.balance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
