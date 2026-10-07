import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { GatePass } from '../types/quarry';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Ticket, Search, Printer, Share2, Eye, ShieldCheck } from 'lucide-react';

interface GatePassViewProps {
  onSelectGatePass: (gatePass: GatePass) => void;
  onOpenNewLoad: () => void;
}

export const GatePassView: React.FC<GatePassViewProps> = ({
  onSelectGatePass,
  onOpenNewLoad,
}) => {
  const { gatePasses } = useQuarry();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPasses = gatePasses.filter((gp) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      gp.gatePassNumber.toLowerCase().includes(term) ||
      gp.loadNumber.toLowerCase().includes(term) ||
      gp.vehicleNumber.toLowerCase().includes(term) ||
      gp.driver.toLowerCase().includes(term) ||
      gp.customerName.toLowerCase().includes(term) ||
      gp.destination.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141a] border border-[#232736]">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Gate Pass System
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Sequential GP clearance records (GP-000001+). Every issued pass reduces live stock.
          </p>
        </div>

        <button
          onClick={onOpenNewLoad}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Ticket className="w-4 h-4 stroke-[2.5]" />
          <span>Issue New Gate Pass</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 bg-[#12141a] rounded-xl border border-[#232736]">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GP Number, Load ID, Vehicle Reg, Driver, Customer..."
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Gate Pass Cards / Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px] font-semibold">
                <th className="p-3">Gate Pass #</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Vehicle & Driver</th>
                <th className="p-3">Category</th>
                <th className="p-3">Customer / Destination</th>
                <th className="p-3">Material & Qty</th>
                <th className="p-3 text-right">Bill Amount</th>
                <th className="p-3 text-center">Payment</th>
                <th className="p-3 text-center">Entered By</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {filteredPasses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    No Gate Passes found.
                  </td>
                </tr>
              ) : (
                filteredPasses.map((gp) => (
                  <tr
                    key={gp.id}
                    className="hover:bg-[#161924]/60 transition-colors cursor-pointer"
                    onClick={() => onSelectGatePass(gp)}
                  >
                    <td className="p-3 font-mono font-bold text-[#f3c64c]">
                      {gp.gatePassNumber}
                      <span className="block text-[9px] text-gray-500 font-normal">
                        Load: {gp.loadNumber}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-300">
                      <div>{formatDate(gp.date)}</div>
                      <div className="text-[10px] text-gray-500">{gp.time}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-100">{gp.vehicleNumber}</div>
                      <div className="text-[11px] text-gray-400">{gp.driver} ({gp.owner})</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          gp.vehicleCategory === 'RZ Mining'
                            ? 'bg-[#d4af37]/15 text-[#f3c64c] border border-[#d4af37]/30'
                            : 'bg-blue-900/20 text-blue-400 border border-blue-700/30'
                        }`}
                      >
                        {gp.vehicleCategory}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-200 truncate max-w-[150px]">
                        {gp.customerName}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                        {gp.destination}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-200 font-semibold">{gp.material}</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">
                        {gp.quantity} {gp.unit} Dispatched
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-gray-100">
                      {formatCurrency(gp.totalBillAmount)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          gp.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {gp.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-gray-300">
                      {gp.enteredBy}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectGatePass(gp);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#1f2434] hover:bg-[#2a3147] text-[#d4af37] text-xs font-semibold flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Print</span>
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
