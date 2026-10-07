import React from 'react';
import {
  LayoutDashboard,
  Mountain,
  Truck,
  Ticket,
  Car,
  Users,
  Building2,
  BookOpen,
  DollarSign,
  PackageCheck,
  Boxes,
  TrendingUp,
  Receipt,
  UserSquare2,
  CalendarCheck,
  Wallet,
  HandCoins,
  Percent,
  FileBarChart,
  FileSpreadsheet,
  Coins,
  Settings,
  X,
} from 'lucide-react';
import { useQuarry } from '../../context/QuarryContext';

export type NavTab =
  | 'dashboard'
  | 'quarry_mgmt'
  | 'loads'
  | 'gate_pass'
  | 'vehicles'
  | 'drivers'
  | 'customers'
  | 'customer_accounts'
  | 'driver_accounts'
  | 'vehicle_accounts'
  | 'production'
  | 'stock'
  | 'income'
  | 'expenses'
  | 'staff'
  | 'attendance'
  | 'salary'
  | 'payments'
  | 'rates'
  | 'reports'
  | 'bill_generator'
  | 'daily_account'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavGroup {
  label: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { loads, gatePasses, stock } = useQuarry();

  const totalDispatches = gatePasses.length;
  const activeLoads = loads.filter((l) => l.status === 'Draft' || l.status === 'Loaded').length;

  const groups: NavGroup[] = [
    {
      label: 'QUARRY OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'quarry_mgmt', label: 'Quarry Management', icon: Mountain },
        {
          id: 'loads',
          label: 'Load / Order Mgmt',
          icon: Truck,
          badge: activeLoads > 0 ? activeLoads : undefined,
        },
        {
          id: 'gate_pass',
          label: 'Gate Pass System',
          icon: Ticket,
          badge: totalDispatches,
        },
        { id: 'production', label: 'Production Log', icon: PackageCheck },
        {
          id: 'stock',
          label: 'Stock Management',
          icon: Boxes,
          badge: `${(stock['Laterite Stone — 1st'] / 1000).toFixed(1)}k`,
        },
      ],
    },
    {
      label: 'FLEET & DRIVERS',
      items: [
        { id: 'vehicles', label: 'Vehicle Master', icon: Car },
        { id: 'drivers', label: 'Driver Master', icon: Users },
        { id: 'vehicle_accounts', label: 'Vehicle Accounts (RZ)', icon: Car },
        { id: 'driver_accounts', label: 'Driver Accounts', icon: DollarSign },
      ],
    },
    {
      label: 'CUSTOMERS & BILLING',
      items: [
        { id: 'customers', label: 'Customer Master', icon: Building2 },
        { id: 'customer_accounts', label: 'Customer Accounts', icon: BookOpen },
        { id: 'payments', label: 'Payments / Collections', icon: HandCoins },
        { id: 'bill_generator', label: 'Statement / Invoices', icon: FileSpreadsheet, badge: 'A4 PDF' },
      ],
    },
    {
      label: 'QUARRY ACCOUNTS & CASH',
      items: [
        { id: 'daily_account', label: 'Daily Account (Cash)', icon: Coins },
        { id: 'income', label: 'Quarry Income', icon: TrendingUp },
        { id: 'expenses', label: 'Quarry Expenses', icon: Receipt },
      ],
    },
    {
      label: 'STAFF & PAYROLL',
      items: [
        { id: 'staff', label: 'Staff Master', icon: UserSquare2 },
        { id: 'attendance', label: 'Staff Attendance', icon: CalendarCheck },
        { id: 'salary', label: 'Salary / Payroll', icon: Wallet },
      ],
    },
    {
      label: 'SYSTEM & CONFIG',
      items: [
        { id: 'rates', label: 'Rate Master', icon: Percent },
        { id: 'reports', label: 'Quarry Reports', icon: FileBarChart },
        { id: 'settings', label: 'Settings & Backup', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`no-print fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d0f14] border-r border-[#222633] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#222633]">
          <div className="flex flex-col">
            <span className="font-cinzel font-black text-sm gold-gradient-text tracking-wider">
              RZ MINETRIX
            </span>
            <span className="text-[10px] uppercase text-[#d4af37]/80">
              Quarry Operations
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-[#161922]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Item Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-widest text-[#d4af37]/60 uppercase">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d4af37]/15 to-[#d4af37]/5 text-[#f3c64c] border-l-3 border-[#d4af37] shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#151821]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#d4af37]'
                            : 'text-gray-500 group-hover:text-gray-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                          isActive
                            ? 'bg-[#d4af37] text-black'
                            : 'bg-[#1e222e] text-gray-400 group-hover:text-gray-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Quarry Status Pill */}
        <div className="p-3 border-t border-[#222633] bg-[#090a0d]">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#13161f] border border-[#232735]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-gray-200 leading-tight">
                  Quarry Live Active
                </span>
                <span className="text-[9px] text-gray-500">Pit Operations Normal</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
              RZ-1
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
