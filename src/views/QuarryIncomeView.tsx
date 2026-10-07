import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { IncomeCategory, PaymentMode } from '../types/quarry';
import { formatCurrency, formatDate, getTodayDateString } from '../utils/formatters';
import { TrendingUp, Plus, Search, Trash2, CheckCircle2, X } from 'lucide-react';

export const QuarryIncomeView: React.FC = () => {
  const { income, addQuarryIncome, deleteQuarryIncome, currentUser } = useQuarry();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [category, setCategory] = useState<IncomeCategory>('Material Sales');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');

  const filteredIncome = useMemo(() => {
    return income.filter((inc) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        inc.description.toLowerCase().includes(term) ||
        (inc.reference && inc.reference.toLowerCase().includes(term)) ||
        (inc.customerName && inc.customerName.toLowerCase().includes(term))
      );
    });
  }, [income, searchTerm]);

  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    addQuarryIncome({
      date: getTodayDateString(),
      category,
      description,
      reference,
      amount: Number(amount),
      paymentMode,
      enteredBy: currentUser,
    });

    setModalOpen(false);
    setDescription('');
    setReference('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this income entry?')) {
      deleteQuarryIncome(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Income Ledger
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Material sales revenue, collections, rubble receipts and direct cash inflows
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Direct Income</span>
        </button>
      </div>

      {/* KPI & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736] flex items-center justify-between sm:col-span-1">
          <span className="text-xs text-gray-400">Total Income Listed:</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {formatCurrency(totalIncome)}
          </span>
        </div>

        <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736] sm:col-span-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search income description, reference, customer..."
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
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Reference / GP</th>
                <th className="p-3 text-right">Amount (₹)</th>
                <th className="p-3 text-center">Payment Mode</th>
                <th className="p-3 text-center">Entered By</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No income records found.
                  </td>
                </tr>
              ) : (
                filteredIncome.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#161924]">
                    <td className="p-3 font-mono text-gray-300">{formatDate(inc.date)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/15 text-[#f3c64c] border border-[#d4af37]/30">
                        {inc.category}
                      </span>
                    </td>
                    <td className="p-3 text-gray-200 font-medium">
                      {inc.description}
                      {inc.customerName && (
                        <span className="block text-[10px] text-gray-400">{inc.customerName}</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-gray-300">{inc.reference || '—'}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      +{formatCurrency(inc.amount)}
                    </td>
                    <td className="p-3 text-center font-bold text-gray-300">{inc.paymentMode}</td>
                    <td className="p-3 text-center text-gray-400">{inc.enteredBy}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(inc.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101218] border border-[#262c3e] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262c3e]">
              <h3 className="font-cinzel font-bold text-base text-gray-100">
                Record Quarry Income
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Income Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IncomeCategory)}
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                >
                  <option value="Material Sales">Material Sales</option>
                  <option value="Customer Collections">Customer Collections</option>
                  <option value="Other Income">Other Income</option>
                  <option value="Other Receipts">Other Receipts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Description / Particulars *
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Laterite stone direct counter sale"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || '')}
                    placeholder="e.g. 10750"
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank">Bank</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Reference No / Bill No
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Receipt or bill ref"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Income</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
