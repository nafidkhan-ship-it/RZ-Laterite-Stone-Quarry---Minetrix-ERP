import React, { useState } from 'react';
import { useQuarry } from '../../context/QuarryContext';
import { PaymentMode } from '../../types/quarry';
import { getTodayDateString } from '../../utils/formatters';
import { X, HandCoins, CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultCustomerId,
}) => {
  const { customers, currentUser, addCustomerPayment, addQuarryIncome } = useQuarry();

  const [customerId, setCustomerId] = useState(defaultCustomerId || (customers[0]?.id || ''));
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [reference, setReference] = useState('');
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    if (!cust || !amount) return;

    const numericAmount = Number(amount);
    const date = getTodayDateString();

    addCustomerPayment({
      date,
      customerId,
      customerName: cust.name,
      amount: numericAmount,
      paymentMode,
      reference,
      remarks,
      enteredBy: currentUser,
    });

    // Also record in Quarry Income under 'Customer Collections'
    addQuarryIncome({
      date,
      category: 'Customer Collections',
      description: `Collection from ${cust.name} (${remarks || paymentMode})`,
      reference: reference || 'DIRECT-RCPT',
      amount: numericAmount,
      paymentMode,
      customerId,
      customerName: cust.name,
      enteredBy: currentUser,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#101218] border border-[#262c3e] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-[#141722] border-b border-[#262c3e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-cinzel font-bold text-sm text-gray-100">
              Record Customer Collection / Payment
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Select Customer *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-[#d4af37]"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Amount Received (₹) *
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || '')}
              placeholder="e.g. 15000"
              className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-[#d4af37]"
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
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank">Bank NEFT / IMPS</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Ref / Txn No
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="UPI ref or Cheque #"
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. On-account balance settlement"
              className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
            />
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
              <span>Record Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
