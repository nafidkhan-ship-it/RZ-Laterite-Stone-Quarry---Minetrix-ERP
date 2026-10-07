import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { Staff } from '../types/quarry';
import { UserSquare2, Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { formatCurrency, formatDate, getTodayDateString } from '../utils/formatters';

export const StaffManagementView: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useQuarry();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [salaryType, setSalaryType] = useState<Staff['salaryType']>('Monthly');
  const [basicSalary, setBasicSalary] = useState(0);
  const [dailyWage, setDailyWage] = useState(0);
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<Staff['status']>('Active');

  const openAddModal = () => {
    setEditingStaff(null);
    setEmployeeId(`EMP-0${staff.length + 1}`);
    setName('');
    setPhone('');
    setRole('Quarry Worker');
    setSalaryType('Daily Wage');
    setBasicSalary(0);
    setDailyWage(800);
    setAddress('');
    setStatus('Active');
    setModalOpen(true);
  };

  const openEditModal = (stf: Staff) => {
    setEditingStaff(stf);
    setEmployeeId(stf.employeeId);
    setName(stf.name);
    setPhone(stf.phone);
    setRole(stf.role);
    setSalaryType(stf.salaryType);
    setBasicSalary(stf.basicSalary);
    setDailyWage(stf.dailyWage);
    setAddress(stf.address || '');
    setStatus(stf.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        employeeId,
        name,
        phone,
        role,
        salaryType,
        basicSalary: Number(basicSalary),
        dailyWage: Number(dailyWage),
        address,
        status,
      });
    } else {
      addStaff({
        employeeId,
        name,
        phone,
        role,
        joiningDate: getTodayDateString(),
        salaryType,
        basicSalary: Number(basicSalary),
        dailyWage: Number(dailyWage),
        address,
        status,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, sName: string) => {
    if (window.confirm(`Delete staff profile for ${sName}?`)) {
      deleteStaff(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserSquare2 className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Staff Master
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Supervisors, machine operators, weighbridge staff and pit security
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* Staff Cards / Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px] font-semibold">
                <th className="p-3">Emp ID</th>
                <th className="p-3">Staff Name</th>
                <th className="p-3">Designation / Role</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Compensation Type</th>
                <th className="p-3 text-right">Wage / Salary Rate</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-[#161924]">
                  <td className="p-3 font-mono font-bold text-[#d4af37]">{member.employeeId}</td>
                  <td className="p-3 font-bold text-gray-100">{member.name}</td>
                  <td className="p-3 text-gray-200">{member.role}</td>
                  <td className="p-3 font-mono text-gray-300">{member.phone}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1e2332] text-gray-200 border border-[#2d3448]">
                      {member.salaryType}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-gray-100">
                    {member.salaryType === 'Monthly'
                      ? `${formatCurrency(member.basicSalary)} / month`
                      : `${formatCurrency(member.dailyWage)} / day`}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {member.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditModal(member)}
                        className="p-1 text-gray-400 hover:text-white rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-1 text-rose-400 hover:text-rose-300 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101218] border border-[#262c3e] w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262c3e]">
              <h3 className="font-cinzel font-bold text-base text-gray-100">
                {editingStaff ? 'Edit Staff Member' : 'Register New Staff'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-bold text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Weighbridge Incharge"
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Salary Type *
                  </label>
                  <select
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value as any)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                  >
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Monthly">Monthly Salary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    {salaryType === 'Monthly' ? 'Basic Monthly (₹)' : 'Daily Wage (₹)'} *
                  </label>
                  <input
                    type="number"
                    value={salaryType === 'Monthly' ? basicSalary : dailyWage}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      if (salaryType === 'Monthly') setBasicSalary(val);
                      else setDailyWage(val);
                    }}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Address / Site Quarters
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
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
                  className="gold-btn px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
