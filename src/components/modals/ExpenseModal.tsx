import React, { useState } from 'react';
import { useQuarry } from '../../context/QuarryContext';
import { ExpenseCategory, PaymentMode } from '../../types/quarry';
import { getTodayDateString } from '../../utils/formatters';
import { X, Receipt, CheckCircle2 } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Loading',
  'Labour',
  'Diesel',
  'Electricity',
  'Water',
  'Machinery',
  'Maintenance',
  'Spare Parts',
  'Transport',
  'Vehicle Expense',
  'Driver Expense',
  'Staff Salary',
  'Staff Advance',
  'Food/Kitchen',
  'Rent',
  'Repair',
  'Office Expense',
  'Royalty/Government',
  'Other Expense',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, drivers, staff, currentUser, addQuarryExpense } = useQuarry();

  const [category, setCategory] = useState<ExpenseCategory>('Diesel');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [staffName, setStaffName] = useState('');
  const [reference, setReference] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    addQuarryExpense({
      date: getTodayDateString(),
      category,
      description,
      amount: Number(amount),
      paymentMode,
      vehicleNumber: vehicleNumber || undefined,
      driverName: driverName || undefined,
      staffName: staffName || undefined,
      reference: reference || undefined,
      enteredBy: currentUser,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#101218] border border-[#262c3e] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="px-5 py-3.5 bg-[#141722] border-b border-[#262c3e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-400" />
            <h3 className="font-cinzel font-bold text-sm text-gray-100">
              Record Quarry Expense
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
                required
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || '')}
                placeholder="e.g. 2400"
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-sm font-mono font-bold text-rose-400 focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Description / Reason *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Diesel fuel for JCB excavator 30L"
              className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Receipt / Ref No
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Bill / Invoice ref"
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Optional Tagging to Vehicle, Driver or Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#0c0e14] rounded-xl border border-[#1f2434] text-xs">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                Tag Vehicle (Optional)
              </label>
              <select
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full bg-[#161924] border border-[#2a3044] rounded-lg px-2 py-1 text-xs text-gray-200"
              >
                <option value="">None</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.vehicleNumber}>
                    {v.vehicleNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                Tag Driver (Optional)
              </label>
              <select
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-[#161924] border border-[#2a3044] rounded-lg px-2 py-1 text-xs text-gray-200"
              >
                <option value="">None</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                Tag Staff (Optional)
              </label>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full bg-[#161924] border border-[#2a3044] rounded-lg px-2 py-1 text-xs text-gray-200"
              >
                <option value="">None</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gold-btn px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
