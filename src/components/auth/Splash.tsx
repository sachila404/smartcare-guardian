import React, { useEffect } from 'react';
import { SmartShieldLogo } from '../common/SmartShieldLogo';

interface SplashProps {
  onFinish: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#006A53] text-white flex flex-col items-center justify-between py-16 px-6 z-50 select-none">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-6 relative">
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl transform scale-150 animate-pulse" />
          <SmartShieldLogo size={100} variant="light" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          SmartCare Guardian
        </h1>
        <p className="text-emerald-100 text-sm font-medium tracking-wide">
          Intelligent care, when it matters.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        {/* Animated Dot Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/80 animate-ping" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
        <span className="text-[11px] font-semibold tracking-widest text-emerald-200 uppercase">
          INITIALIZING SYSTEMS
        </span>
      </div>
    </div>
  );
};
