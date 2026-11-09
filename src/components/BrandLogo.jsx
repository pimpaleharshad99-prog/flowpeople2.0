import React from 'react';
import { FP_IMAGES } from '../assets/fpImages';

export default function BrandLogo({ variant = 'navbar', className = '' }) {
  if (variant === 'hero3d') {
    return (
      <div className={`logo-3d-stage flex flex-col items-center select-none ${className}`}>
        <div className="relative flex items-center justify-center">
          {/* Subtle Rotating Ambient Halo */}
          <div className="logo-orbit-ring pointer-events-none absolute -inset-6 rounded-full border border-[#FFE4B8]/30 opacity-70 blur-[1px]" />
          
          {/* 3D Floating Squircle Emblem */}
          <div className="logo-3d-emblem relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-[28px] overflow-hidden bg-[#FFFDF9]/15 p-0.5 border-2 border-[#FFF5E4]/80 shadow-[0_0_45px_rgba(255,228,184,0.35)] transition-all duration-300">
            <img 
              src={FP_IMAGES.fp_logo} 
              alt="Flowpeople by Fluxora Logo" 
              className="h-full w-full object-cover rounded-[26px]" 
            />
          </div>
        </div>

        {/* Hero Name Lockup */}
        <div className="mt-4 flex flex-col items-center leading-none">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]">
            <span className="text-white">Flow</span>
            <span className="text-[#FFE4B8]">people</span>
          </div>
          <div className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.34em] text-[#FFF5E4] drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
            BY FLUXORA
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden border border-[#E8D2B5]/40 shadow-sm bg-gradient-to-br from-[#590907] via-[#981C14] to-[#E0AF84]">
          <img src={FP_IMAGES.fp_logo} alt="Flowpeople by Fluxora Logo" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Flow</span>
            <span className="text-[#FFE4B8]">people</span>
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#FFF5E4]/85">
            BY FLUXORA
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'kiosk') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <div className="h-6 w-6 rounded-lg overflow-hidden border border-white/20">
          <img src={FP_IMAGES.fp_logo} alt="Flowpeople Logo" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xs font-bold text-white tracking-tight">
            Flow<span className="text-[#FFE4B8]">people</span>
          </span>
          <span className="text-[7px] font-semibold uppercase tracking-[0.24em] text-[#FFF5E4]/85">
            BY FLUXORA
          </span>
        </div>
      </div>
    );
  }

  // Default: navbar
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-sm border border-[#E8D2B5]/50 bg-gradient-to-br from-[#590907] via-[#981C14] to-[#E0AF84]">
        <img src={FP_IMAGES.fp_logo} alt="Flowpeople by Fluxora Logo" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[17px] font-bold tracking-tight">
          <span className="text-[#242321]">Flow</span>
          <span className="text-[#590907]">people</span>
        </span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#590907]/75">
          BY FLUXORA
        </span>
      </div>
    </div>
  );
}

