import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { Driver, VehicleCategory } from '../types/quarry';
import { Users, Plus, Search, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { getTodayDateString } from '../utils/formatters';

export const DriverManagementView: React.FC = () => {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver, loads } = useQuarry();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('Outside');
  const [salaryType, setSalaryType] = useState<Driver['salaryType']>('Trip Batta');
  const [status, setStatus] = useState<Driver['status']>('Active');
  const [remarks, setRemarks] = useState('');

  const openAddModal = () => {
    setEditingDriver(null);
    setName('');
    setPhone('');
    setVehicle(vehicles[0]?.vehicleNumber || '');
    setCategory('Outside');
    setSalaryType('Trip Batta');
    setStatus('Active');
    setRemarks('');
    setModalOpen(true);
  };

  const openEditModal = (drv: Driver) => {
    setEditingDriver(drv);
    setName(drv.name);
    setPhone(drv.phone);
    setVehicle(drv.vehicle);
    setCategory(drv.category);
    setSalaryType(drv.salaryType);
    setStatus(drv.status);
    setRemarks(drv.remarks || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingDriver) {
      updateDriver(editingDriver.id, {
        name,
        phone,
        vehicle,
        category,
        salaryType,
        status,
        remarks,
      });
    } else {
      addDriver({
        name,
        phone,
        vehicle,
        category,
        joiningDate: getTodayDateString(),
        salaryType,
        status,
        remarks,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, drvName: string) => {
    if (window.confirm(`Are you sure you want to delete driver ${drvName}?`)) {
      deleteDriver(id);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      d.phone.toLowerCase().includes(term) ||
      d.vehicle.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12141a] border border-[#232736]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Driver Master
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Quarry driver roster, assignment, vehicle link and contact directory
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Driver</span>
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
            placeholder="Search driver name, phone, assigned vehicle..."
            className="w-full bg-[#161924] border border-[#262c3e] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Driver List Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px] font-semibold">
                <th className="p-3">Driver Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Assigned Vehicle</th>
                <th className="p-3">Category</th>
                <th className="p-3">Compensation Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total Completed Trips</th>
                <th className="p-3">Remarks</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {filteredDrivers.map((drv) => {
                const completedTrips = loads.filter((l) => l.driver === drv.name).length;
                return (
                  <tr key={drv.id} className="hover:bg-[#161924]/60 transition-colors">
                    <td className="p-3 font-bold text-gray-100">{drv.name}</td>
                    <td className="p-3 font-mono text-gray-300">{drv.phone}</td>
                    <td className="p-3 font-mono text-[#f3c64c] font-bold">{drv.vehicle}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          drv.category === 'RZ Mining'
                            ? 'bg-[#d4af37]/15 text-[#f3c64c] border border-[#d4af37]/30'
                            : 'bg-blue-900/20 text-blue-400 border border-blue-700/30'
                        }`}
                      >
                        {drv.category}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">{drv.salaryType}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {drv.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-gray-200">
                      {completedTrips} trips
                    </td>
                    <td className="p-3 text-gray-400 text-[11px]">{drv.remarks || '—'}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(drv)}
                          className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#1f2434]"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(drv.id, drv.name)}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-[#1f2434]"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                {editingDriver ? 'Edit Driver' : 'Add New Driver'}
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
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pasha"
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
                  placeholder="+91 98460 00000"
                  className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Assigned Vehicle
                  </label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.vehicleNumber}>
                        {v.vehicleNumber} ({v.owner})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                    className="w-full bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-gray-100"
                  >
                    <option value="Outside">Outside</option>
                    <option value="RZ Mining">RZ Mining</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Remarks / Notes
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
                  <span>{editingDriver ? 'Update Driver' : 'Save Driver'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
