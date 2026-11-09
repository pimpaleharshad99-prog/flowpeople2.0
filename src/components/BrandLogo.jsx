import React from 'react';

/**
 * FlowPeople Brand Icon & Logo Emblem
 * Modern Enterprise Tech Blue & Indigo Design (from official design specification)
 */
export function BrandEmblem({ size = 36, className = '' }) {
  return (
    <div
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      className={`relative flex items-center justify-center rounded-[28%] bg-gradient-to-br from-[#38BDF8] via-[#2563EB] to-[#4F46E5] shadow-md shadow-indigo-500/25 select-none ${className}`}
    >
      {/* Luminous Inner Top Highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[28%] ring-1 ring-inset ring-white/35" />
      
      {/* Clean Modern F. Logo Mark */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[62%] h-[62%]"
        aria-hidden="true"
      >
        {/* Modern Rounded F Stem & Bars */}
        <path
          d="M9 8C9 6.89543 9.89543 6 11 6H24C25.1046 6 26 6.89543 26 8C26 9.10457 25.1046 10 24 10H14V14.5H22C23.1046 14.5 24 15.3954 24 16.5C24 17.6046 23.1046 18.5 22 18.5H14V27C14 28.1046 13.1046 29 12 29C10.8954 29 10 28.1046 10 27V8Z"
          fill="white"
        />
        {/* Accent Dot */}
        <circle cx="23.5" cy="26.5" r="2.8" fill="white" />
      </svg>
    </div>
  );
}

export default function BrandLogo({ variant = 'navbar', className = '' }) {
  if (variant === 'hero3d') {
    return (
      <div className={`logo-3d-stage flex flex-col items-center select-none ${className}`}>
        <div className="relative flex items-center justify-center">
          {/* Subtle Ambient Indigo Glow Ring */}
          <div className="logo-orbit-ring pointer-events-none absolute -inset-6 rounded-full border border-indigo-400/30 opacity-70 blur-[1px]" />
          
          {/* 3D Floating Squircle Emblem */}
          <div className="logo-3d-emblem relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-[32px] overflow-hidden p-1 shadow-[0_0_50px_rgba(79,70,229,0.35)] transition-all duration-300">
            <BrandEmblem size={96} className="!w-full !h-full !rounded-[30px]" />
          </div>
        </div>

        {/* Hero Name Lockup */}
        <div className="mt-4 flex flex-col items-center leading-none">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)]">
            <span className="text-white">Flow</span>
            <span className="text-[#60A5FA]">people</span>
          </div>
          <div className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.34em] text-[#93C5FD] drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
            BY FLUXORA
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <BrandEmblem size={40} className="rounded-2xl" />
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Flow</span>
            <span className="text-[#60A5FA]">people</span>
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
            BY FLUXORA
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'kiosk') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <BrandEmblem size={26} className="rounded-lg" />
        <div className="flex flex-col leading-none">
          <span className="text-xs font-bold text-white tracking-tight">
            Flow<span className="text-[#60A5FA]">people</span>
          </span>
          <span className="text-[7px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
            BY FLUXORA
          </span>
        </div>
      </div>
    );
  }

  // Default: navbar / header
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <BrandEmblem size={36} className="rounded-xl" />
      <div className="flex flex-col leading-none">
        <span className="text-[17px] font-bold tracking-tight">
          <span className="text-[#0F172A]">Flow</span>
          <span className="text-[#4F46E5]">people</span>
        </span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.26em] text-[#64748B]">
          BY FLUXORA
        </span>
      </div>
    </div>
  );
}
