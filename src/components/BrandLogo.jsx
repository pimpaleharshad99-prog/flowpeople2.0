// src/components/BrandLogo.jsx
import React from 'react';

/**
 * FlowPeople Brand Icon & Logo Emblem
 * Authentic gradient squircle with stylized "F." lettermark and dot mark.
 */
export function BrandEmblem({ size = 38, className = '' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 42%, #06B6D4 100%)',
      }}
      className={`relative flex items-center justify-center rounded-[28%] shadow-md shadow-blue-500/25 select-none ${className}`}
    >
      {/* Subtle top inner ring highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[28%] ring-1 ring-inset ring-white/30" />

      {/* Official FlowPeople F. Lettermark */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[64%] h-[64%] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        aria-hidden="true"
      >
        <path
          d="M 31.5 31.2 A 6.0 6.0 0 0 1 37.7 25.2 C 50.5 25.2 62.0 28.2 67.8 33.8 C 70.4 36.3 68.4 40.5 64.4 39.2 C 58.5 37.2 51.5 36.2 43.4 36.2 A 1.5 1.5 0 0 0 41.9 37.7 L 41.9 46.2 A 1.5 1.5 0 0 0 43.4 47.7 L 54.4 47.7 A 4.9 4.9 0 0 1 54.4 57.5 L 43.4 57.5 A 1.5 1.5 0 0 0 41.9 59.0 L 41.9 68.0 A 5.2 5.2 0 0 1 31.5 68.0 Z"
          fill="#FFFFFF"
        />
        <circle cx="70.6" cy="52.6" r="5.35" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export default function BrandLogo({ variant = 'navbar', theme = 'auto', className = '' }) {
  // 1. Hero 3D Stage Lockup (Centered in Hero)
  if (variant === 'hero3d') {
    return (
      <div className={`logo-3d-stage flex flex-col items-center select-none ${className}`}>
        <div className="relative flex items-center justify-center">
          {/* Subtle Ambient Indigo Glow Ring */}
          <div className="logo-orbit-ring pointer-events-none absolute -inset-6 rounded-full border border-indigo-400/30 opacity-70 blur-[1px]" />
          
          {/* 3D Floating Squircle Emblem */}
          <div className="logo-3d-emblem relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-[32px] overflow-hidden p-1 shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all duration-300">
            <BrandEmblem size={96} className="!w-full !h-full !rounded-[30px]" />
          </div>
        </div>

        {/* Hero Name Lockup */}
        <div className="mt-4 flex flex-col items-center leading-none text-center">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
            <span className="text-white">Flow</span>
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#A78BFA] bg-clip-text text-transparent">
              people
            </span>
          </div>
          <div className="mt-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] text-[#93C5FD] drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
            BY FLUXORA
          </div>
        </div>
      </div>
    );
  }

  // 2. Footer Lockup
  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <BrandEmblem size={40} className="rounded-2xl" />
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Flow</span>
            <span className="bg-gradient-to-r from-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent">people</span>
          </span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-[#94A3B8]">
            BY FLUXORA
          </span>
        </div>
      </div>
    );
  }

  // 3. Reception Biometric Kiosk Terminal Lockup
  if (variant === 'kiosk') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <BrandEmblem size={26} className="rounded-lg" />
        <div className="flex flex-col leading-none">
          <span className="text-xs font-bold text-white tracking-tight">
            Flow<span className="bg-gradient-to-r from-[#60A5FA] to-[#818CF8] bg-clip-text text-transparent">people</span>
          </span>
          <span className="text-[7px] font-bold uppercase tracking-[0.24em] text-[#94A3B8]">
            BY FLUXORA
          </span>
        </div>
      </div>
    );
  }

  // 4. Default / Navbar Lockup (Supports light or dark surfaces)
  const isDark = theme === 'dark' || theme === 'auto';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <BrandEmblem size={38} className="rounded-xl shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="text-[17px] font-extrabold tracking-tight">
          <span className={isDark ? "text-white" : "text-[#0F172A]"}>Flow</span>
          <span className={isDark ? "bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#A78BFA] bg-clip-text text-transparent" : "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent"}>
            people
          </span>
        </span>
        <span className={`mt-0.5 text-[9px] font-bold uppercase tracking-[0.26em] ${isDark ? "text-slate-300" : "text-[#64748B]"}`}>
          BY FLUXORA
        </span>
      </div>
    </div>
  );
}
