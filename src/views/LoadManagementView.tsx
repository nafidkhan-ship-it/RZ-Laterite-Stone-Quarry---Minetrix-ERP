import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { LoadOrder, LoadStatus } from '../types/quarry';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Ticket,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface LoadManagementViewProps {
  onOpenNewLoad: (initialData?: Partial<LoadOrder>) => void;
  onViewGatePass: (gatePassNumber: string) => void;
}

export const LoadManagementView: React.FC<LoadManagementViewProps> = ({
  onOpenNewLoad,
  onViewGatePass,
}) => {
  const { loads, deleteLoad, confirmAndGenerateGatePass, currentUser } = useQuarry();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'RZ Mining' | 'Outside'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLoad, setSelectedLoad] = useState<LoadOrder | null>(null);

  // Filtered loads
  const filteredLoads = useMemo(() => {
    return loads.filter((l) => {
      if (categoryFilter !== 'All' && l.vehicleCategory !== categoryFilter) return false;
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches =
          l.loadNumber.toLowerCase().includes(term) ||
          l.vehicleNumber.toLowerCase().includes(term) ||
          l.driver.toLowerCase().includes(term) ||
          l.customerName.toLowerCase().includes(term) ||
          (l.gatePassNumber && l.gatePassNumber.toLowerCase().includes(term)) ||
          l.destination.toLowerCase().includes(term);
        if (!matches) return false;
      }
      return true;
    });
  }, [loads, searchTerm, categoryFilter, statusFilter]);

  const handleDelete = (id: string, loadNum: string) => {
    if (window.confirm(`Are you sure you want to delete Load ${loadNum}? This will remove the transaction record.`)) {
      deleteLoad(id);
      if (selectedLoad?.id === id) setSelectedLoad(null);
    }
  };

  const handleQuickDispatch = (loadId: string) => {
    try {
      const gp = confirmAndGenerateGatePass(loadId);
      onViewGatePass(gp.gatePassNumber);
    } catch (e) {
      alert('Error generating gate pass: ' + String(e));
    }
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141a] border border-[#232736]">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Load & Order Management
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Central quarry load dispatch ledger with live financial reconciliation
          </p>
        </div>

        <button
          onClick={() => onOpenNewLoad()}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Quarry Load</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#12141a] rounded-xl border border-[#232736]">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Load ID, Vehicle, Driver, Customer, GP..."
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 bg-[#161924] p-1 rounded-xl border border-[#262c3e]">
          {(['All', 'RZ Mining', 'Outside'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-[#d4af37] text-black shadow-sm font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Loaded">Loaded</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Gate Pass Generated">Gate Pass Generated</option>
            <option value="Settled">Settled</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px] font-semibold">
                <th className="p-3">Load ID</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Vehicle & Driver</th>
                <th className="p-3">Category</th>
                <th className="p-3">Customer / Destination</th>
                <th className="p-3">Material</th>
                <th className="p-3 text-right">Quarry (₹)</th>
                <th className="p-3 text-right">Customer (₹)</th>
                <th className="p-3 text-right">Net RZ (₹)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Gate Pass</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {filteredLoads.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-gray-500">
                    No loads found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLoads.map((load) => (
                  <tr
                    key={load.id}
                    className="hover:bg-[#161924]/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedLoad(load)}
                  >
                    <td className="p-3 font-mono font-bold text-gray-100">
                      {load.loadNumber}
                      <span className="block text-[9px] text-gray-500 font-normal">
                        by {load.enteredBy}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-300">
                      <div>{formatDate(load.date)}</div>
                      <div className="text-[10px] text-gray-500">{load.time}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-100">{load.vehicleNumber}</div>
                      <div className="text-[11px] text-gray-400">{load.driver}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          load.vehicleCategory === 'RZ Mining'
                            ? 'bg-[#d4af37]/15 text-[#f3c64c] border border-[#d4af37]/30'
                            : 'bg-blue-900/20 text-blue-400 border border-blue-700/30'
                        }`}
                      >
                        {load.vehicleCategory}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-200 truncate max-w-[150px]">
                        {load.customerName}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                        {load.destination}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-200 font-semibold">{load.material}</div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {load.quantity} {load.unit}
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-gray-300">
                      {formatCurrency(load.quarryAmount)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#f3c64c]">
                      {formatCurrency(load.customerSaleAmount)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      {load.vehicleCategory === 'RZ Mining'
                        ? formatCurrency(load.netProfit)
                        : '—'}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          load.status === 'Dispatched' || load.status === 'Gate Pass Generated'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {load.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {load.gatePassNumber ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewGatePass(load.gatePassNumber!);
                          }}
                          className="px-2 py-1 rounded bg-[#1e2332] hover:bg-[#282f44] text-[#d4af37] font-mono text-[10px] font-bold border border-[#d4af37]/30"
                        >
                          {load.gatePassNumber}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickDispatch(load.id);
                          }}
                          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40"
                        >
                          Issue GP
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLoad(load)}
                          className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#1f2434]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(load.id, load.loadNumber)}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-[#1f2434]"
                          title="Delete Load"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Load Drawer / Inspection Modal */}
      {selectedLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141c] border border-[#252b3d] w-full max-w-2xl rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#252b3d]">
              <div>
                <span className="font-mono text-xs text-[#d4af37] font-bold">
                  {selectedLoad.loadNumber}
                </span>
                <h3 className="text-base font-bold text-gray-100 font-cinzel">
                  Load & Accounting Inspection
                </h3>
              </div>
              <button
                onClick={() => setSelectedLoad(null)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-[#1a1e2b]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#202534]">
                <div className="text-gray-400 text-[10px]">Vehicle</div>
                <div className="font-bold text-gray-100">{selectedLoad.vehicleNumber}</div>
                <div className="text-gray-400 text-[10px]">{selectedLoad.owner} • {selectedLoad.vehicleCategory}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#202534]">
                <div className="text-gray-400 text-[10px]">Driver</div>
                <div className="font-bold text-gray-100">{selectedLoad.driver}</div>
                <div className="text-gray-400 text-[10px]">Trip Driver</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#202534]">
                <div className="text-gray-400 text-[10px]">Customer</div>
                <div className="font-bold text-gray-100 truncate">{selectedLoad.customerName}</div>
                <div className="text-gray-400 text-[10px] truncate">{selectedLoad.destination}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#202534]">
                <div className="text-gray-400 text-[10px]">Material & Qty</div>
                <div className="font-bold text-[#f3c64c]">{selectedLoad.material}</div>
                <div className="font-mono">{selectedLoad.quantity} {selectedLoad.unit}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#202534]">
                <div className="text-gray-400 text-[10px]">Quarry Amount</div>
                <div className="font-bold font-mono text-gray-100">{formatCurrency(selectedLoad.quarryAmount)}</div>
                <div className="text-[10px] text-gray-400">{formatCurrency(selectedLoad.quarryRate)}/unit</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d0f14] border border-[#202534]">
                <div className="text-gray-400 text-[10px]">Customer Sale</div>
                <div className="font-bold font-mono text-[#f3c64c]">{formatCurrency(selectedLoad.customerSaleAmount)}</div>
                <div className="text-[10px] text-gray-400">Paid: {formatCurrency(selectedLoad.paymentReceived)}</div>
              </div>
            </div>

            {selectedLoad.vehicleCategory === 'RZ Mining' && (
              <div className="p-3 bg-[#0d0f14] rounded-xl border border-[#232838] text-xs">
                <div className="font-bold text-gray-300 mb-2">RZ Mining Fleet Cost Breakdown</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-400 font-mono">
                  <div>Driver Batta: <span className="text-gray-200">{formatCurrency(selectedLoad.driverBatta)}</span></div>
                  <div>Vehicle Rent: <span className="text-gray-200">{formatCurrency(selectedLoad.vehicleTripRent)}</span></div>
                  <div>Loading Charge: <span className="text-gray-200">{formatCurrency(selectedLoad.loadingCharge)}</span></div>
                  <div>Diesel: <span className="text-gray-200">{formatCurrency(selectedLoad.diesel)}</span></div>
                  <div>Commission: <span className="text-gray-200">{formatCurrency(selectedLoad.orderCommission)}</span></div>
                  <div className="font-bold text-emerald-400">Net Profit: {formatCurrency(selectedLoad.netProfit)}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-gray-400">
                Entered By: <b className="text-[#d4af37]">{selectedLoad.enteredBy}</b> on {formatDate(selectedLoad.date)} {selectedLoad.time}
              </span>
              {selectedLoad.gatePassNumber && (
                <button
                  onClick={() => {
                    const gpNum = selectedLoad.gatePassNumber!;
                    setSelectedLoad(null);
                    onViewGatePass(gpNum);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs"
                >
                  View Gate Pass ({selectedLoad.gatePassNumber})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
