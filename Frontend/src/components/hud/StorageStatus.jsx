import React, { useState, useEffect } from 'react';

export const StorageStatus = () => {
  const [driveVal, setDriveVal] = useState(0);
  const [coreVal, setCoreVal] = useState(0);

  useEffect(() => {
    // Animate from 0 to actual values on mount
    const timer = setTimeout(() => {
      setDriveVal(84);
      setCoreVal(67);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3.5 sm:space-y-4 font-mono w-full max-w-xs">
      <div>
        <div className="flex justify-between mb-1 text-[8.5px] sm:text-[9px] tracking-widest text-hud-green/80">
          <span>PRIMARY_DRIVE</span>
          <span>{driveVal}%</span>
        </div>
        <div className="w-full h-1.5 bg-hud-green-dark/30 border border-hud-green-dark/60 rounded-sm overflow-hidden relative">
          <div 
            className="h-full bg-hud-green transition-all duration-1000 ease-out shadow-[0_0_8px_#00ffea]"
            style={{ width: `${driveVal}%` }}
          />
          {/* Scanline overlay inside bar */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] animate-[scan-horizontal_3s_linear_infinite]" />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1 text-[8.5px] sm:text-[9px] tracking-widest text-hud-green/80">
          <span>NEURAL_BUFFER</span>
          <span>{coreVal}%</span>
        </div>
        <div className="w-full h-1.5 bg-hud-green-dark/30 border border-hud-green-dark/60 rounded-sm overflow-hidden relative">
          <div 
            className="h-full bg-hud-green/80 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,255,234,0.5)]"
            style={{ width: `${coreVal}%` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] animate-[scan-horizontal_2s_linear_infinite]" />
        </div>
      </div>

      <div className="flex justify-between items-center text-[7.5px] sm:text-[8px] text-hud-green/40 leading-tight pt-1">
        <div>
          D_SECTOR: <span className="text-hud-green/60">0x88291</span> <br />
          ALLOC_VOL: <span className="text-hud-green/60">409.2 GB</span>
        </div>
        <div className="text-right">
          SYS_HEALTH: <span className="text-hud-cyan animate-pulse">OPTIMAL</span> <br />
          BUFF_RATE: <span className="text-hud-green/60">4.2 GB/S</span>
        </div>
      </div>
    </div>
  );
};