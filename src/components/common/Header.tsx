import React, { useState, useEffect, useRef } from 'react';
import { useQuarry } from '../../context/QuarryContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import { Plus, UserCheck, Menu, Clock, Calendar, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenNewLoad: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewLoad, onToggleSidebar }) => {
  const { currentUser } = useQuarry();
  const { user, signOut } = useAuth();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="no-print sticky top-0 z-40 bg-[#090a0d]/90 backdrop-blur-md border-b border-[#222633] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-[#141722] hover:bg-[#1e2330] text-[#d4af37] border border-[#262b3a] transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Logo size="md" className="hidden sm:flex" />
        <Logo size="sm" variant="icon" className="sm:hidden" />
        
        <div className="sm:hidden flex flex-col leading-tight">
          <span className="font-cinzel font-black text-sm gold-gradient-text tracking-wider">
            RZ MINETRIX
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#d4af37]/80">
            Quarry ERP
          </span>
        </div>
      </div>

      {/* Middle: Live Date/Time for Quarry Operations */}
      <div className="hidden md:flex items-center gap-4 px-3 py-1.5 rounded-full bg-[#12141a] border border-[#222633] text-xs text-gray-400">
        <div className="flex items-center gap-1.5 text-gray-300">
          <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{dateStr}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-600" />
        <div className="flex items-center gap-1.5 font-mono text-gray-200">
          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Right: Authenticated User Profile Menu + Quick New Load Button */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Verified User Profile Pill & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#13151c] hover:bg-[#191d29] border border-[#282d3d] transition-all cursor-pointer shadow-sm group"
            title="Account & Session Menu"
          >
            {/* User Avatar */}
            <div className="relative">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#d4af37]/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#9c7816] text-black font-black flex items-center justify-center text-xs shadow">
                  {currentUser[0]}
                </div>
              )}
              {/* Google Verified indicator badge */}
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#13151c]"
                title="Verified Google Account"
              />
            </div>

            {/* User Details */}
            <div className="hidden sm:flex flex-col text-left leading-none">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Entered By:
                </span>
                <span className="text-xs font-bold text-[#f3c64c] group-hover:text-[#ffe685]">
                  {currentUser}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono truncate max-w-[140px] mt-0.5">
                {user?.email || (currentUser === 'Nafid' ? 'nafidkhan@racezoneventures.com' : 'aflah@racezoneventures.com')}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-200 transition-transform" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#12141a] border border-[#282f42] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
              <div className="pb-2 border-b border-[#222736]">
                <div className="flex items-center gap-2.5">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#d4af37]/60"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#d4af37] text-black font-black flex items-center justify-center text-sm shadow">
                      {currentUser[0]}
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-xs text-gray-100 truncate">
                      {user?.name || (currentUser === 'Nafid' ? 'Nafid Khan' : 'Aflah RZ')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono truncate">
                      {user?.email || (currentUser === 'Nafid' ? 'nafidkhan@racezoneventures.com' : 'aflah@racezoneventures.com')}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 px-2 py-1 rounded-lg bg-[#0a0b0e] border border-[#1f2434] flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">Identity:</span>
                  <span className="font-bold text-[#d4af37] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Verified Operator
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 px-1 leading-relaxed">
                All loads, gate passes and ledgers are recorded under your verified identity.
              </div>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  signOut();
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 border border-rose-900/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick New Load Button */}
        <button
          onClick={onOpenNewLoad}
          className="gold-btn px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden xs:inline">New Load</span>
        </button>
      </div>
    </header>
  );
};
