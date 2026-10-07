import React from 'react';
import { LayoutDashboard, Truck, Ticket, Coins, Menu, Plus } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSidebar: () => void;
  onOpenNewLoad: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSidebar,
  onOpenNewLoad,
}) => {
  return (
    <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f14]/95 backdrop-blur-md border-t border-[#222633] px-2 py-1.5 flex items-center justify-around">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === 'dashboard' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </button>

      <button
        onClick={() => onSelectTab('loads')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === 'loads' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Truck className="w-5 h-5" />
        <span>Loads</span>
      </button>

      {/* Floating Center Action Button */}
      <button
        onClick={onOpenNewLoad}
        className="w-12 h-12 -mt-6 rounded-full gold-btn flex items-center justify-center shadow-lg shadow-[#d4af37]/30 border-2 border-[#0d0f14]"
        title="Create New Load"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      <button
        onClick={() => onSelectTab('gate_pass')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === 'gate_pass' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Ticket className="w-5 h-5" />
        <span>Gate Pass</span>
      </button>

      <button
        onClick={onOpenSidebar}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium text-gray-400 hover:text-[#d4af37] transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span>All Modules</span>
      </button>
    </nav>
  );
};
