import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { formatNumber, formatDate } from '../utils/formatters';
import { PackageCheck, Plus, Search, Trash2 } from 'lucide-react';

interface ProductionViewProps {
  onOpenProductionModal: () => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({ onOpenProductionModal }) => {
  const { production, deleteProduction } = useQuarry();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = production.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.material.toLowerCase().includes(term) ||
      p.operator.toLowerCase().includes(term) ||
      (p.pitLocation && p.pitLocation.toLowerCase().includes(term))
    );
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this production log? Stock will be updated accordingly.')) {
      deleteProduction(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Production Log
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Excavator & machine stone cutting entries that immediately replenish quarry stock
          </p>
        </div>

        <button
          onClick={onOpenProductionModal}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log Stone Production</span>
        </button>
      </div>

      {/* Production Entries Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-3">Date</th>
                <th className="p-3">Material / Quality</th>
                <th className="p-3 text-right">Quantity Produced</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Machine Operator</th>
                <th className="p-3">Pit / Bench Location</th>
                <th className="p-3">Remarks</th>
                <th className="p-3 text-center">Entered By</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No production entries logged yet.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#161924]">
                    <td className="p-3 font-mono text-gray-300">{formatDate(item.date)}</td>
                    <td className="p-3 font-bold text-[#f3c64c]">{item.material}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      +{formatNumber(item.quantity)} {item.unit}
                    </td>
                    <td className="p-3 text-gray-300">{item.shift}</td>
                    <td className="p-3 text-gray-200">{item.operator}</td>
                    <td className="p-3 text-gray-400">{item.pitLocation || 'Main Quarry'}</td>
                    <td className="p-3 text-gray-400 text-[11px]">{item.remarks || '—'}</td>
                    <td className="p-3 text-center font-bold text-gray-300">{item.enteredBy}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
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
