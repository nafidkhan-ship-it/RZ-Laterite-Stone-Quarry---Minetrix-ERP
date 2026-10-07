import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { Customer } from '../types/quarry';
import { Building2, Plus, Search, Edit2, Trash2, CheckCircle2, X, Phone, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface CustomerManagementViewProps {
  onViewCustomerLedger: (customerId: string) => void;
}

export const CustomerManagementView: React.FC<CustomerManagementViewProps> = ({
  onViewCustomerLedger,
}) => {
  const { customers, loads, payments, addCustomer, updateCustomer, deleteCustomer } = useQuarry();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState<Customer | null>(null);

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [openingBalance, setOpeningBalance] = useState(0);
  const [remarks, setRemarks] = useState('');

  const openAddModal = () => {
    setEditingCust(null);
    setName('');
    setPhone('');
    setDestination('');
    setOpeningBalance(0);
    setRemarks('');
    setModalOpen(true);
  };

  const openEditModal = (cust: Customer) => {
    setEditingCust(cust);
    setName(cust.name);
    setPhone(cust.phone);
    setDestination(cust.destination);
    setOpeningBalance(cust.openingBalance);
    setRemarks(cust.remarks || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingCust) {
      updateCustomer(editingCust.id, {
        name,
        phone,
        destination,
        openingBalance: Number(openingBalance) || 0,
        remarks,
      });
    } else {
      addCustomer({
        name,
        phone,
        destination,
        openingBalance: Number(openingBalance) || 0,
        remarks,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, custName: string) => {
    if (window.confirm(`Are you sure you want to delete customer ${custName}?`)) {
      deleteCustomer(id);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.destination.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141a] border border-[#232736]">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Customer Master
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Builders, contractors, dealers and project sites directory
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736]">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, contact phone, delivery site destination..."
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Grid of Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => {
          const custLoads = loads.filter((l) => l.customerId === c.id);
          const totalSales = custLoads.reduce((sum, l) => sum + l.customerSaleAmount, 0);
          const totalPaid = payments
            .filter((p) => p.customerId === c.id)
            .reduce((sum, p) => sum + p.amount, 0);
          const currentBalance = c.openingBalance + totalSales - totalPaid;

          return (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-gray-100">{c.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      currentBalance > 0
                        ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                    }`}
                  >
                    Due: {formatCurrency(currentBalance)}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span className="font-mono text-gray-300">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span className="truncate">{c.destination}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1f2332] flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono text-[11px]">
                  {custLoads.length} Loads Delivered
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewCustomerLedger(c.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#1a1e2b] hover:bg-[#252a3c] text-[#d4af37] text-xs font-semibold"
                  >
                    Ledger →
                  </button>
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1 text-gray-400 hover:text-white rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1 text-rose-400 hover:text-rose-300 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101218] border border-[#262c3e] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262c3e]">
              <h3 className="font-cinzel font-bold text-base text-gray-100">
                {editingCust ? 'Edit Customer' : 'Add New Customer'}
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
                  Customer / Company Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metro Builders"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-bold text-gray-100 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 94470 00000"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Primary Site Destination *
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Perinthalmanna Commercial Site"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Opening Balance (₹)
                </label>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Remarks / Credit Terms
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Notes"
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
                  <span>{editingCust ? 'Update Customer' : 'Save Customer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
