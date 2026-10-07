import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { ExpenseCategory } from '../types/quarry';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Receipt, Plus, Search, Filter, Trash2 } from 'lucide-react';

interface QuarryExpensesViewProps {
  onOpenExpenseModal: () => void;
}

export const QuarryExpensesView: React.FC<QuarryExpensesViewProps> = ({
  onOpenExpenseModal,
}) => {
  const { expenses, deleteQuarryExpense } = useQuarry();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          e.description.toLowerCase().includes(term) ||
          (e.vehicleNumber && e.vehicleNumber.toLowerCase().includes(term)) ||
          (e.driverName && e.driverName.toLowerCase().includes(term)) ||
          (e.staffName && e.staffName.toLowerCase().includes(term)) ||
          e.category.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [expenses, searchTerm, selectedCategory]);

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this expense record?')) {
      deleteQuarryExpense(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Operating Expenses
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Diesel, loading charges, driver batta, machinery, repairs, site salaries & kitchen
          </p>
        </div>

        <button
          onClick={onOpenExpenseModal}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Quarry Expense</span>
        </button>
      </div>

      {/* KPI & Search/Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736] flex items-center justify-between sm:col-span-1">
          <span className="text-xs text-gray-400">Total Filtered:</span>
          <span className="text-lg font-mono font-bold text-rose-400">
            {formatCurrency(totalExpenseAmount)}
          </span>
        </div>

        <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736] sm:col-span-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search description, vehicle, driver, staff..."
              className="w-full bg-[#161924] border border-[#262c3e] rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736] sm:col-span-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
          >
            <option value="All">All Categories</option>
            <option value="Loading">Loading</option>
            <option value="Diesel">Diesel</option>
            <option value="Driver Expense">Driver Expense</option>
            <option value="Vehicle Expense">Vehicle Expense</option>
            <option value="Machinery">Machinery</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Spare Parts">Spare Parts</option>
            <option value="Staff Salary">Staff Salary</option>
            <option value="Staff Advance">Staff Advance</option>
            <option value="Labour">Labour</option>
            <option value="Electricity">Electricity</option>
            <option value="Food/Kitchen">Food/Kitchen</option>
            <option value="Other Expense">Other Expense</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount (₹)</th>
                <th className="p-3 text-center">Payment</th>
                <th className="p-3">Tagged Entity</th>
                <th className="p-3 text-center">Entered By</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No expense entries found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#161924]">
                    <td className="p-3 font-mono text-gray-300">{formatDate(exp.date)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1e2332] text-gray-200 border border-[#2d3448]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3 text-gray-200 font-medium">
                      {exp.description}
                      {exp.reference && (
                        <span className="block text-[10px] text-gray-500 font-mono">
                          Ref: {exp.reference}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-400 text-sm">
                      -{formatCurrency(exp.amount)}
                    </td>
                    <td className="p-3 text-center font-bold text-gray-300">{exp.paymentMode}</td>
                    <td className="p-3 text-gray-400">
                      {exp.vehicleNumber && (
                        <span className="block text-[11px] font-mono text-[#f3c64c]">
                          Veh: {exp.vehicleNumber}
                        </span>
                      )}
                      {exp.driverName && (
                        <span className="block text-[11px] text-gray-300">
                          Driver: {exp.driverName}
                        </span>
                      )}
                      {exp.staffName && (
                        <span className="block text-[11px] text-gray-300">
                          Staff: {exp.staffName}
                        </span>
                      )}
                      {!exp.vehicleNumber && !exp.driverName && !exp.staffName && '—'}
                    </td>
                    <td className="p-3 text-center text-gray-400">{exp.enteredBy}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(exp.id)}
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
