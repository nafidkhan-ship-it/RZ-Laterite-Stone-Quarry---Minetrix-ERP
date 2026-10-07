import React, { useState } from 'react';
import { useQuarry } from '../../context/QuarryContext';
import { MaterialType } from '../../types/quarry';
import { getTodayDateString } from '../../utils/formatters';
import { X, PackageCheck, CheckCircle2 } from 'lucide-react';

interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductionModal: React.FC<ProductionModalProps> = ({ isOpen, onClose }) => {
  const { staff, currentUser, addProduction } = useQuarry();

  const [material, setMaterial] = useState<MaterialType>('Laterite Stone — 1st');
  const [quantity, setQuantity] = useState<number>(500);
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Full Day'>('Morning');
  const [operator, setOperator] = useState('Mujeeb');
  const [pitLocation, setPitLocation] = useState('Bench #3 North Face');
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const is3rd = material === 'Laterite Stone — 3rd';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity) return;

    addProduction({
      date: getTodayDateString(),
      material,
      quantity: Number(quantity),
      unit: is3rd ? 'load' : 'pcs',
      shift,
      operator,
      pitLocation,
      remarks,
      enteredBy: currentUser,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#101218] border border-[#262c3e] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-[#141722] border-b border-[#262c3e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-cinzel font-bold text-sm text-gray-100">
              Log Stone Production (Increases Stock)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Stone Quality / Material *
            </label>
            <select
              value={material}
              onChange={(e) => {
                const mat = e.target.value as MaterialType;
                setMaterial(mat);
                if (mat === 'Laterite Stone — 3rd') setQuantity(5);
                else setQuantity(500);
              }}
              className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-[#f3c64c] font-bold focus:outline-none focus:border-[#d4af37]"
            >
              <option value="Laterite Stone — 1st">Laterite Stone — 1st (pcs)</option>
              <option value="Laterite Stone — 2nd">Laterite Stone — 2nd (pcs)</option>
              <option value="Laterite Stone — 3rd">Laterite Stone — 3rd (loads)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Quantity Produced *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-sm font-mono font-bold text-gray-100 focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Quarry Shift
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100"
              >
                <option value="Morning">Morning Shift</option>
                <option value="Evening">Evening Shift</option>
                <option value="Full Day">Full Day Shift</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Machine Operator
              </label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="Operator name"
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Pit / Bench Location
              </label>
              <input
                type="text"
                value={pitLocation}
                onChange={(e) => setPitLocation(e.target.value)}
                placeholder="Bench location"
                className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100"
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
              placeholder="e.g. Clean fine-grained red stone cutting"
              className="w-full bg-[#161924] border border-[#2a3044] rounded-xl px-3 py-2 text-xs text-gray-100"
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
              <span>Add to Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
