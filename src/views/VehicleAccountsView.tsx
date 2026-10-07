import React, { useState, useMemo } from 'react';
import { useQuarry } from '../context/QuarryContext';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';
import { Car, TrendingUp, Filter, Eye } from 'lucide-react';

export const VehicleAccountsView: React.FC = () => {
  const { vehicles, loads } = useQuarry();

  // Filter only RZ Mining vehicles for accounting
  const rzVehicles = useMemo(
    () => vehicles.filter((v) => v.category === 'RZ Mining'),
    [vehicles]
  );

  const [selectedVehicleNum, setSelectedVehicleNum] = useState<string>(
    rzVehicles[0]?.vehicleNumber || ''
  );

  // Compute accounting metrics per RZ vehicle
  const vehicleStats = useMemo(() => {
    return rzVehicles.map((veh) => {
      const vehLoads = loads.filter((l) => l.vehicleNumber === veh.vehicleNumber);
      const trips = vehLoads.length;
      const totalQty = vehLoads.reduce((sum, l) => sum + l.quantity, 0);
      const quarryPurchase = vehLoads.reduce((sum, l) => sum + l.quarryAmount, 0);
      const customerSales = vehLoads.reduce((sum, l) => sum + l.customerSaleAmount, 0);
      const driverCost = vehLoads.reduce((sum, l) => sum + l.driverBatta, 0);
      const vehicleRent = vehLoads.reduce((sum, l) => sum + l.vehicleTripRent, 0);
      const loadingCharge = vehLoads.reduce((sum, l) => sum + l.loadingCharge, 0);
      const diesel = vehLoads.reduce((sum, l) => sum + l.diesel, 0);
      const commission = vehLoads.reduce((sum, l) => sum + l.orderCommission, 0);
      const otherExpenses = vehLoads.reduce((sum, l) => sum + l.otherExpense, 0);
      const totalExpenses = driverCost + vehicleRent + loadingCharge + diesel + commission + otherExpenses;
      const net = customerSales - quarryPurchase - totalExpenses;

      return {
        vehicle: veh,
        trips,
        totalQty,
        quarryPurchase,
        customerSales,
        driverCost,
        vehicleRent,
        loadingCharge,
        diesel,
        commission,
        otherExpenses,
        totalExpenses,
        net,
        loadsList: vehLoads,
      };
    });
  }, [rzVehicles, loads]);

  const activeStat = vehicleStats.find((s) => s.vehicle.vehicleNumber === selectedVehicleNum) || vehicleStats[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#12141a] border border-[#232736] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold font-cinzel text-gray-100">
              RZ Mining Vehicle Accounts Ledger
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Strict fleet profit & loss accounting for RZ Minetrix internal tippers
          </p>
        </div>

        {/* Vehicle Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#161924] p-1 rounded-xl border border-[#262c3e]">
          {rzVehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicleNum(v.vehicleNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedVehicleNum === v.vehicleNumber
                  ? 'bg-[#d4af37] text-black shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {v.vehicleNumber} ({v.driver})
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards for Selected Vehicle */}
      {activeStat && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-[#12141a] border border-[#232736]">
            <div className="text-[10px] text-gray-400">Total Trips</div>
            <div className="text-xl font-bold font-mono text-gray-100">{activeStat.trips}</div>
            <div className="text-[10px] text-gray-500">{formatNumber(activeStat.totalQty)} pcs</div>
          </div>

          <div className="p-3 rounded-xl bg-[#12141a] border border-[#232736]">
            <div className="text-[10px] text-gray-400">Quarry Purchase</div>
            <div className="text-xl font-bold font-mono text-gray-100">{formatCurrency(activeStat.quarryPurchase)}</div>
            <div className="text-[10px] text-gray-500">Base quarry cost</div>
          </div>

          <div className="p-3 rounded-xl bg-[#12141a] border border-[#d4af37]/30">
            <div className="text-[10px] text-[#d4af37]">Customer Sales</div>
            <div className="text-xl font-bold font-mono text-[#f3c64c]">{formatCurrency(activeStat.customerSales)}</div>
            <div className="text-[10px] text-gray-500">Gross billed</div>
          </div>

          <div className="p-3 rounded-xl bg-[#12141a] border border-[#232736]">
            <div className="text-[10px] text-gray-400">Driver Batta</div>
            <div className="text-xl font-bold font-mono text-rose-400">{formatCurrency(activeStat.driverCost)}</div>
            <div className="text-[10px] text-gray-500">₹600 / trip</div>
          </div>

          <div className="p-3 rounded-xl bg-[#12141a] border border-[#232736]">
            <div className="text-[10px] text-gray-400">Trip Expenses</div>
            <div className="text-xl font-bold font-mono text-rose-400">{formatCurrency(activeStat.totalExpenses)}</div>
            <div className="text-[10px] text-gray-500">Rent, Diesel, Loading</div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-[#12141a] to-[#141d14] border border-emerald-500/40">
            <div className="text-[10px] text-emerald-400 font-bold">Net Vehicle Profit</div>
            <div className="text-xl font-bold font-mono text-emerald-400">{formatCurrency(activeStat.net)}</div>
            <div className="text-[10px] text-gray-400">After all deductions</div>
          </div>
        </div>
      )}

      {/* RZ Fleet Financial Performance Overview Table */}
      <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-4 space-y-3">
        <h3 className="font-cinzel font-bold text-sm text-gray-200">
          All RZ Mining Vehicles Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                <th className="p-2.5">Vehicle</th>
                <th className="p-2.5">Driver</th>
                <th className="p-2.5 text-right">Trips</th>
                <th className="p-2.5 text-right">Quantity</th>
                <th className="p-2.5 text-right">Quarry Cost (₹)</th>
                <th className="p-2.5 text-right">Customer Sales (₹)</th>
                <th className="p-2.5 text-right">Batta (₹)</th>
                <th className="p-2.5 text-right">Trip Rent (₹)</th>
                <th className="p-2.5 text-right">Diesel (₹)</th>
                <th className="p-2.5 text-right">Loading (₹)</th>
                <th className="p-2.5 text-right">Net Profit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]">
              {vehicleStats.map((st) => (
                <tr
                  key={st.vehicle.id}
                  onClick={() => setSelectedVehicleNum(st.vehicle.vehicleNumber)}
                  className={`cursor-pointer transition-colors ${
                    selectedVehicleNum === st.vehicle.vehicleNumber
                      ? 'bg-[#181d2a]'
                      : 'hover:bg-[#161924]'
                  }`}
                >
                  <td className="p-2.5 font-mono font-bold text-gray-100">{st.vehicle.vehicleNumber}</td>
                  <td className="p-2.5 text-gray-300">{st.vehicle.driver}</td>
                  <td className="p-2.5 text-right font-mono font-bold">{st.trips}</td>
                  <td className="p-2.5 text-right font-mono">{formatNumber(st.totalQty)} pcs</td>
                  <td className="p-2.5 text-right font-mono text-gray-300">{formatCurrency(st.quarryPurchase)}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#f3c64c]">{formatCurrency(st.customerSales)}</td>
                  <td className="p-2.5 text-right font-mono text-gray-300">{formatCurrency(st.driverCost)}</td>
                  <td className="p-2.5 text-right font-mono text-gray-300">{formatCurrency(st.vehicleRent)}</td>
                  <td className="p-2.5 text-right font-mono text-gray-300">{formatCurrency(st.diesel)}</td>
                  <td className="p-2.5 text-right font-mono text-gray-300">{formatCurrency(st.loadingCharge)}</td>
                  <td className="p-2.5 text-right font-mono font-black text-emerald-400">{formatCurrency(st.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History for Selected Vehicle */}
      {activeStat && (
        <div className="bg-[#12141a] rounded-2xl border border-[#232736] p-4 space-y-3">
          <h3 className="font-cinzel font-bold text-sm text-gray-200">
            Trip Ledgers for {activeStat.vehicle.vehicleNumber} ({activeStat.vehicle.driver})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#161924] border-b border-[#232736] text-gray-400 text-[11px]">
                  <th className="p-2.5">Date & Time</th>
                  <th className="p-2.5">Load ID / GP</th>
                  <th className="p-2.5">Customer & Site</th>
                  <th className="p-2.5">Material & Qty</th>
                  <th className="p-2.5 text-right">Customer Sale</th>
                  <th className="p-2.5 text-right">Quarry Cost</th>
                  <th className="p-2.5 text-right">Batta</th>
                  <th className="p-2.5 text-right">Rent</th>
                  <th className="p-2.5 text-right">Loading</th>
                  <th className="p-2.5 text-right">Diesel</th>
                  <th className="p-2.5 text-right">Comm.</th>
                  <th className="p-2.5 text-right">Trip Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2230]">
                {activeStat.loadsList.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-6 text-center text-gray-500">
                      No trip dispatches recorded yet for this vehicle.
                    </td>
                  </tr>
                ) : (
                  activeStat.loadsList.map((ld) => (
                    <tr key={ld.id} className="hover:bg-[#161924]">
                      <td className="p-2.5 font-mono">{formatDate(ld.date)} {ld.time}</td>
                      <td className="p-2.5 font-mono font-bold text-[#d4af37]">{ld.gatePassNumber || ld.loadNumber}</td>
                      <td className="p-2.5 font-medium text-gray-200">{ld.customerName}</td>
                      <td className="p-2.5">{ld.material} ({ld.quantity} {ld.unit})</td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#f3c64c]">{formatCurrency(ld.customerSaleAmount)}</td>
                      <td className="p-2.5 text-right font-mono text-gray-300">{formatCurrency(ld.quarryAmount)}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(ld.driverBatta)}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(ld.vehicleTripRent)}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(ld.loadingCharge)}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(ld.diesel)}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(ld.orderCommission)}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-400">{formatCurrency(ld.netProfit)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
