import React, { useState } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { AttendanceStatus } from '../types/quarry';
import { getTodayDateString, formatDate } from '../utils/formatters';
import { CalendarCheck, Check, Clock, UserCheck } from 'lucide-react';

export const StaffAttendanceView: React.FC = () => {
  const { staff, attendance, markAttendance, bulkMarkAttendance, currentUser } = useQuarry();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // Current day attendance map
  const todayAttendance = attendance.filter((a) => a.date === selectedDate);
  const statusMap = new Map(todayAttendance.map((a) => [a.staffId, a.status]));

  const handleStatusChange = (staffId: string, status: AttendanceStatus) => {
    const member = staff.find((s) => s.id === staffId);
    if (!member) return;

    markAttendance({
      date: selectedDate,
      staffId,
      employeeName: member.name,
      status,
      inTime: status === 'Present' ? '07:00 AM' : undefined,
      outTime: status === 'Present' ? '06:00 PM' : undefined,
      overtimeHours: 0,
      remarks: '',
      enteredBy: currentUser,
    });
  };

  const handleMarkAllPresent = () => {
    const activeStaff = staff.filter((s) => s.status === 'Active');
    bulkMarkAttendance(
      selectedDate,
      activeStaff.map((s) => ({
        staffId: s.id,
        status: 'Present',
        remarks: 'Bulk marked present',
      }))
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              Quarry Staff Daily Attendance
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Track daily site presence, overtime hours and leaves for automatic monthly payroll
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#161924] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-gray-100 font-mono"
          />

          <button
            onClick={handleMarkAllPresent}
            className="gold-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-3">Emp ID</th>
                <th className="p-3">Staff Name</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Salary Type</th>
                <th className="p-3 text-center">Status for {formatDate(selectedDate)}</th>
                <th className="p-3 text-center">Action / Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {staff
                .filter((s) => s.status === 'Active')
                .map((member) => {
                  const currentStatus = statusMap.get(member.id) || 'Absent';
                  return (
                    <tr key={member.id} className="hover:bg-[#161924]">
                      <td className="p-3 font-mono font-bold text-[#d4af37]">
                        {member.employeeId}
                      </td>
                      <td className="p-3 font-bold text-gray-100">{member.name}</td>
                      <td className="p-3 text-gray-300">{member.role}</td>
                      <td className="p-3 text-gray-400">{member.salaryType}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : currentStatus === 'Half Day'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : currentStatus === 'Leave'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(['Present', 'Half Day', 'Absent', 'Leave'] as AttendanceStatus[]).map(
                            (st) => (
                              <button
                                key={st}
                                onClick={() => handleStatusChange(member.id, st)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                  currentStatus === st
                                    ? 'bg-[#d4af37] text-black shadow-sm'
                                    : 'bg-[#181b24] text-gray-400 hover:text-white'
                                }`}
                              >
                                {st}
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
