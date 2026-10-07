import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  variant?: 'full' | 'icon' | 'print';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    splash: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
    splash: 'text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-[0.2em]',
    lg: 'text-xs tracking-[0.25em]',
    xl: 'text-sm tracking-[0.25em]',
    splash: 'text-base tracking-[0.3em]',
  };

  const isPrint = variant === 'print';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Quarry Polygonal Emblem Icon */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-xl flex items-center justify-center overflow-hidden ${
          isPrint
            ? 'bg-black text-white border border-black'
            : 'bg-gradient-to-br from-[#1c1e24] via-[#12141a] to-[#08090b] border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
        }`}
      >
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 drop-shadow">
          <defs>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE79A" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA820A" />
            </linearGradient>
          </defs>
          {/* Isometric Diamond Cut Laterite Stone */}
          <polygon points="50,15 85,35 50,55 15,35" fill="url(#logoGold)" opacity="0.95" />
          <polygon points="15,35 50,55 50,85 15,65" fill="#A07915" opacity="0.85" />
          <polygon points="50,55 85,35 85,65 50,85" fill="#785507" opacity="0.95" />
          {/* Monogram Cut */}
          <path
            d="M 36,44 L 46,44 Q 52,44 52,49 Q 52,54 46,54 L 40,54 L 40,65"
            fill="none"
            stroke="#0a0b0d"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 52,48 L 62,48 L 54,63 L 64,63"
            fill="none"
            stroke="#FFE79A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {variant !== 'icon' && (
        <div className="flex flex-col select-none leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-cinzel font-black uppercase tracking-wider ${textSizes[size]} ${
                isPrint ? 'text-black font-bold' : 'gold-gradient-text'
              }`}
            >
              RZ MINETRIX
            </span>
          </div>
          <span
            className={`font-semibold uppercase text-[#c59d28] mt-1 ${subTextSizes[size]} ${
              isPrint ? 'text-gray-700 font-medium' : 'text-[#cfa42f]'
            }`}
          >
            Laterite Stone Quarry
          </span>
        </div>
      )}
    </div>
  );
};
