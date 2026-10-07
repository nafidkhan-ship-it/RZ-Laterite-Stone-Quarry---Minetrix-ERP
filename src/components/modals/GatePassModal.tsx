import React from 'react';
import { GatePass } from '../../types/quarry';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Logo } from '../common/Logo';
import { Printer, Share2, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface GatePassModalProps {
  gatePass: GatePass | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GatePassModal: React.FC<GatePassModalProps> = ({
  gatePass,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !gatePass) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `*RZ MINETRIX - GATE PASS*\nPass No: ${gatePass.gatePassNumber}\nDate: ${gatePass.date} ${gatePass.time}\nVehicle: ${gatePass.vehicleNumber} (${gatePass.driver})\nCustomer: ${gatePass.customerName}\nDestination: ${gatePass.destination}\nMaterial: ${gatePass.material}\nQuantity: ${gatePass.quantity} ${gatePass.unit}\nAmount: ${formatCurrency(gatePass.totalBillAmount)} (${gatePass.paymentStatus})\nEntered By: ${gatePass.enteredBy}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gate Pass ${gatePass.gatePassNumber}`,
          text,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(text);
        alert('Gate Pass details copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Gate Pass details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#101218] border border-[#262c3e] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Top Action Bar (hidden in print) */}
        <div className="no-print px-5 py-3.5 bg-[#141722] border-b border-[#262c3e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <span className="font-cinzel font-bold text-sm text-gray-200">
              Quarry Gate Pass Viewer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#202534] hover:bg-[#2b3246] text-gray-200 border border-[#2f364c] flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Print A5 / A4</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#202534] hover:bg-[#2b3246] text-gray-200 border border-[#2f364c] flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-[#1a1e2b] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Gate Pass Document */}
        <div className="p-4 sm:p-6 printable-document bg-white text-black text-xs">
          {/* Header */}
          <div className="border-b-2 border-black pb-3 mb-3 text-center">
            <div className="flex items-center justify-between mb-1">
              <div className="text-left">
                <span className="font-cinzel text-lg font-black tracking-wider block leading-tight text-black">
                  RZ MINETRIX
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-700 block">
                  Laterite Stone Quarry
                </span>
                <span className="text-[9px] text-gray-600 block">
                  Govt. Approved Mining Lease & Weighbridge
                </span>
              </div>
              <div className="text-right">
                <span className="inline-block border-2 border-black px-2.5 py-0.5 font-mono font-black text-sm tracking-wide bg-gray-100">
                  {gatePass.gatePassNumber}
                </span>
                <span className="block text-[9px] font-bold text-gray-600 mt-0.5">
                  Load Ref: {gatePass.loadNumber}
                </span>
              </div>
            </div>

            <div className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-0.5 rounded-sm">
              Official Quarry Gate Pass / Vehicle Clearance
            </div>
          </div>

          {/* Details Table */}
          <table className="w-full border-collapse border border-black mb-3 text-[11px]">
            <tbody>
              <tr className="border-b border-black">
                <td className="w-1/4 p-1.5 bg-gray-100 font-bold border-r border-black">
                  Date & Time:
                </td>
                <td className="w-1/4 p-1.5 border-r border-black font-mono">
                  {formatDate(gatePass.date)} {gatePass.time}
                </td>
                <td className="w-1/4 p-1.5 bg-gray-100 font-bold border-r border-black">
                  Vehicle Category:
                </td>
                <td className="w-1/4 p-1.5 font-bold">
                  {gatePass.vehicleCategory}
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                  Vehicle Reg No:
                </td>
                <td className="p-1.5 border-r border-black font-mono font-black text-xs">
                  {gatePass.vehicleNumber}
                </td>
                <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                  Driver Name:
                </td>
                <td className="p-1.5 font-bold">
                  {gatePass.driver}
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                  Vehicle Owner:
                </td>
                <td className="p-1.5 border-r border-black">
                  {gatePass.owner}
                </td>
                <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                  Customer / Client:
                </td>
                <td className="p-1.5 font-bold">
                  {gatePass.customerName}
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                  Destination:
                </td>
                <td colSpan={3} className="p-1.5">
                  {gatePass.destination}
                </td>
              </tr>

              <tr className="border-b border-black bg-gray-50">
                <td className="p-1.5 font-bold border-r border-black">
                  Stone Quality / Material:
                </td>
                <td className="p-1.5 border-r border-black font-bold">
                  {gatePass.material}
                </td>
                <td className="p-1.5 font-bold border-r border-black">
                  Quantity Loaded:
                </td>
                <td className="p-1.5 font-mono font-black text-xs">
                  {gatePass.quantity} {gatePass.unit.toUpperCase()}
                </td>
              </tr>

              <tr>
                <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                  Payment Status:
                </td>
                <td className="p-1.5 border-r border-black font-bold">
                  {gatePass.paymentStatus} ({formatCurrency(gatePass.amountCollected)})
                </td>
                <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                  Total Bill Amount:
                </td>
                <td className="p-1.5 font-mono font-black text-xs">
                  {formatCurrency(gatePass.totalBillAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Remarks */}
          {gatePass.remarks && (
            <div className="border border-black p-1.5 mb-3 text-[10px] bg-gray-50">
              <span className="font-bold">Remarks: </span>
              {gatePass.remarks}
            </div>
          )}

          {/* Footer & Signatures */}
          <div className="pt-6 grid grid-cols-3 gap-2 text-center text-[10px] mt-4">
            <div>
              <div className="border-t border-black pt-1 font-bold">
                Driver Signature
              </div>
              <span className="text-[9px] text-gray-600 font-mono">
                {gatePass.driver}
              </span>
            </div>

            <div>
              <div className="border-t border-black pt-1 font-bold">
                Entered By
              </div>
              <span className="text-[9px] text-gray-800 font-bold">
                {gatePass.enteredBy} (Quarry Staff)
              </span>
            </div>

            <div>
              <div className="border-t border-black pt-1 font-bold">
                Security / Gate Incharge
              </div>
              <span className="text-[9px] text-gray-600 font-mono">
                Cleared & Dispatched
              </span>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-4 pt-1.5 text-center text-[8px] text-gray-500">
            RZ MINETRIX LATERITE STONE QUARRY • SINGLE QUARRY OPERATIONS ERP • GENERATED ON {gatePass.date} {gatePass.time}
          </div>
        </div>

        {/* Modal Bottom buttons */}
        <div className="no-print p-4 bg-[#141722] border-t border-[#262c3e] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Stock reduced & quarry ledger updated</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-gray-300 bg-[#202534] hover:bg-[#2c3347]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
