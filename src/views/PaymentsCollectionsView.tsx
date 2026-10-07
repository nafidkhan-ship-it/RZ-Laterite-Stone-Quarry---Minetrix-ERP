import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { HandCoins, Plus, Search, Trash2 } from 'lucide-react';

interface PaymentsCollectionsViewProps {
  onOpenPaymentModal: () => void;
}

export const PaymentsCollectionsView: React.FC<PaymentsCollectionsViewProps> = ({
  onOpenPaymentModal,
}) => {
  const { payments, deleteCustomerPayment } = useQuarry();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.customerName.toLowerCase().includes(term) ||
      (p.reference && p.reference.toLowerCase().includes(term)) ||
      (p.remarks && p.remarks.toLowerCase().includes(term)) ||
      p.paymentMode.toLowerCase().includes(term)
    );
  });

  const totalCollected = filtered.reduce((sum, p) => sum + p.amount, 0);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this payment receipt? Ledger balance will be adjusted.')) {
      deleteCustomerPayment(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Customer Collections & Payments
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Log Cash, UPI, Bank transfers and Cheque receipts against customer balances
          </p>
        </div>

        <button
          onClick={onOpenPaymentModal}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record New Collection</span>
        </button>
      </div>

      {/* KPI & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736] flex items-center justify-between sm:col-span-1">
          <span className="text-xs text-gray-400">Total Filtered Inflow:</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {formatCurrency(totalCollected)}
          </span>
        </div>

        <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736] sm:col-span-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, reference, payment mode..."
              className="w-full bg-[#161924] border border-[#262c3e] rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-3">Receipt Date</th>
                <th className="p-3">Customer / Company</th>
                <th className="p-3 text-right">Amount Received (₹)</th>
                <th className="p-3 text-center">Payment Mode</th>
                <th className="p-3">Txn Reference</th>
                <th className="p-3">Remarks</th>
                <th className="p-3 text-center">Entered By</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No payment receipts found.
                  </td>
                </tr>
              ) : (
                filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#161924]">
                    <td className="p-3 font-mono text-gray-300">{formatDate(pay.date)}</td>
                    <td className="p-3 font-bold text-gray-100">{pay.customerName}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      +{formatCurrency(pay.amount)}
                    </td>
                    <td className="p-3 text-center font-bold text-gray-300">{pay.paymentMode}</td>
                    <td className="p-3 font-mono text-gray-300">{pay.reference || '—'}</td>
                    <td className="p-3 text-gray-400 text-[11px]">{pay.remarks || '—'}</td>
                    <td className="p-3 text-center font-bold text-gray-300">{pay.enteredBy}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(pay.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
