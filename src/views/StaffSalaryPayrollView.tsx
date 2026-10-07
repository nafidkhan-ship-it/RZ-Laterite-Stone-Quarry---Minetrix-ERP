import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { StaffAdvance, StaffPayroll, PaymentMode } from '../types/quarry';
import { formatCurrency, formatDate, getTodayDateString } from '../utils/formatters';
import { Wallet, Plus, Printer, CheckCircle2, X, Users, DollarSign } from 'lucide-react';

export const StaffSalaryPayrollView: React.FC = () => {
  const {
    staff,
    advances,
    payrolls,
    generateMonthlyPayroll,
    addStaffAdvance,
    deleteStaffAdvance,
    currentUser,
  } = useQuarry();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [payslipModalData, setPayslipModalData] = useState<StaffPayroll | null>(null);

  // Form for advance
  const [advanceStaffId, setAdvanceStaffId] = useState(staff[0]?.id || '');
  const [advanceAmount, setAdvanceAmount] = useState<number | ''>('');
  const [advanceReason, setAdvanceReason] = useState('');
  const [advanceMode, setAdvanceMode] = useState<PaymentMode>('Cash');

  const handleGeneratePayroll = () => {
    generateMonthlyPayroll(selectedMonth);
  };

  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = staff.find((s) => s.id === advanceStaffId);
    if (!stf || !advanceAmount) return;

    addStaffAdvance({
      date: getTodayDateString(),
      staffId: stf.id,
      employeeName: stf.name,
      amount: Number(advanceAmount),
      reason: advanceReason,
      paymentMode: advanceMode,
      deductionMonth: selectedMonth,
      enteredBy: currentUser,
    });

    setAdvanceModalOpen(false);
    setAdvanceAmount('');
    setAdvanceReason('');
  };

  const monthPayrolls = payrolls.filter((p) => p.month === selectedMonth);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Staff Salary, Payroll & Advances
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Transparent payroll formula: Gross + Overtime + Bonus - Advance - Deductions = Net Salary
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-gray-100 font-mono"
          />

          <button
            onClick={handleGeneratePayroll}
            className="gold-btn px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
          >
            Compute / Refresh Payroll
          </button>

          <button
            onClick={() => setAdvanceModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1e2332] hover:bg-[#282f44] text-[#d4af37] border border-[#d4af37]/40 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Give Staff Advance</span>
          </button>
        </div>
      </div>

      {/* Payroll Statement Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="p-4 bg-[#161924] border-b border-[#232736] flex items-center justify-between">
          <h3 className="font-cinzel font-bold text-sm text-gray-200">
            Payroll Statement for {selectedMonth}
          </h3>
          <span className="text-xs text-gray-400">
            {monthPayrolls.length} Active Staff Calculated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#141722] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-3">Staff Name & Role</th>
                <th className="p-3">Salary Type</th>
                <th className="p-3 text-right">Basic / Daily Rate</th>
                <th className="p-3 text-center">Days Present</th>
                <th className="p-3 text-right">Gross Salary (₹)</th>
                <th className="p-3 text-right">Overtime Pay (₹)</th>
                <th className="p-3 text-right text-rose-400">Advance Deducted (₹)</th>
                <th className="p-3 text-right font-bold text-emerald-400">Net Salary (₹)</th>
                <th className="p-3 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {monthPayrolls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    Click <b>"Compute / Refresh Payroll"</b> to calculate monthly salaries from attendance.
                  </td>
                </tr>
              ) : (
                monthPayrolls.map((row) => (
                  <tr key={row.id} className="hover:bg-[#161924]">
                    <td className="p-3">
                      <div className="font-bold text-gray-100">{row.employeeName}</div>
                      <div className="text-[10px] text-gray-400">{row.role}</div>
                    </td>
                    <td className="p-3 text-gray-300">{row.salaryType}</td>
                    <td className="p-3 text-right font-mono text-gray-200">
                      {formatCurrency(row.basicSalaryOrDailyRate)}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-400">
                      {row.presentDays} days
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-gray-100">
                      {formatCurrency(row.grossSalary)}
                    </td>
                    <td className="p-3 text-right font-mono text-gray-300">
                      {formatCurrency(row.overtimePay)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-400">
                      -{formatCurrency(row.advanceDeduction)}
                    </td>
                    <td className="p-3 text-right font-mono font-black text-emerald-400 text-sm">
                      {formatCurrency(row.netSalary)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setPayslipModalData(row)}
                        className="px-2 py-1 rounded bg-[#1e2332] hover:bg-[#2a3147] text-[#d4af37] text-xs font-semibold"
                      >
                        Payslip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Advances Log Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-4 space-y-3">
        <h3 className="font-cinzel font-bold text-sm text-gray-200">
          Staff Advance History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Staff Name</th>
                <th className="p-2.5 text-right">Advance Amount (₹)</th>
                <th className="p-2.5">Deduction Month</th>
                <th className="p-2.5">Reason</th>
                <th className="p-2.5 text-center">Entered By</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {advances.map((adv) => (
                <tr key={adv.id} className="hover:bg-[#161924]">
                  <td className="p-2.5 font-mono text-gray-300">{formatDate(adv.date)}</td>
                  <td className="p-2.5 font-bold text-gray-100">{adv.employeeName}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-rose-400">
                    -{formatCurrency(adv.amount)}
                  </td>
                  <td className="p-2.5 font-mono text-gray-300">{adv.deductionMonth}</td>
                  <td className="p-2.5 text-gray-400">{adv.reason || 'Requested'}</td>
                  <td className="p-2.5 text-center font-bold text-gray-300">{adv.enteredBy}</td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => deleteStaffAdvance(adv.id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Give Advance Modal */}
      {advanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101218] border border-[#262c3e] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262c3e]">
              <h3 className="font-cinzel font-bold text-base text-gray-100">
                Issue Staff Salary Advance
              </h3>
              <button
                onClick={() => setAdvanceModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdvanceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Select Staff Member *
                </label>
                <select
                  value={advanceStaffId}
                  onChange={(e) => setAdvanceStaffId(e.target.value)}
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Advance Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(Number(e.target.value) || '')}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono font-bold text-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={advanceMode}
                    onChange={(e) => setAdvanceMode(e.target.value as any)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Reason for Advance
                </label>
                <input
                  type="text"
                  value={advanceReason}
                  onChange={(e) => setAdvanceReason(e.target.value)}
                  placeholder="e.g. Medical, personal necessity"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdvanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Disburse Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {payslipModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#101218] border border-[#262c3e] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="no-print p-4 bg-[#141722] border-b border-[#262c3e] flex items-center justify-between">
              <h3 className="font-cinzel font-bold text-sm text-gray-100">Staff Payslip</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="gold-btn px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Payslip</span>
                </button>
                <button
                  onClick={() => setPayslipModalData(null)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 printable-document bg-white text-black text-xs font-sans">
              <div className="border-b-2 border-black pb-3 mb-3 text-center">
                <h2 className="font-cinzel text-lg font-black tracking-wider text-black">
                  RZ MINETRIX • LATERITE STONE QUARRY
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700 block">
                  Staff Payslip & Salary Statement • {payslipModalData.month}
                </span>
              </div>

              <table className="w-full border-collapse border border-black mb-3 text-[11px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1.5 bg-gray-100 font-bold border-r border-black w-1/3">
                      Staff Name:
                    </td>
                    <td className="p-1.5 border-r border-black font-bold">
                      {payslipModalData.employeeName}
                    </td>
                    <td className="p-1.5 bg-gray-100 font-bold border-r border-black">Role:</td>
                    <td className="p-1.5">{payslipModalData.role}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                      Days Present:
                    </td>
                    <td className="p-1.5 border-r border-black font-mono">
                      {payslipModalData.presentDays} Days
                    </td>
                    <td className="p-1.5 bg-gray-100 font-bold border-r border-black">Overtime:</td>
                    <td className="p-1.5 font-mono">{payslipModalData.overtimeHours} hrs</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                      Gross Calculated:
                    </td>
                    <td className="p-1.5 border-r border-black font-mono font-bold">
                      {formatCurrency(payslipModalData.grossSalary)}
                    </td>
                    <td className="p-1.5 bg-gray-100 font-bold border-r border-black">
                      Overtime Pay:
                    </td>
                    <td className="p-1.5 font-mono font-bold">
                      {formatCurrency(payslipModalData.overtimePay)}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 bg-gray-100 font-bold border-r border-black text-rose-800">
                      Advance Deduction:
                    </td>
                    <td colSpan={3} className="p-1.5 font-mono font-bold text-rose-800">
                      -{formatCurrency(payslipModalData.advanceDeduction)}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-bold text-xs">
                    <td className="p-2 border-r border-black">NET SALARY PAYABLE:</td>
                    <td colSpan={3} className="p-2 font-mono font-black text-sm">
                      {formatCurrency(payslipModalData.netSalary)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-8 grid grid-cols-2 gap-4 text-center text-[10px]">
                <div>
                  <div className="border-t border-black pt-1">Employee Signature</div>
                </div>
                <div>
                  <div className="border-t border-black pt-1 font-bold">Quarry Management Seal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
