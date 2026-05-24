import React, { useState, useEffect } from 'react';

export const RadarDisplay = () => {
  const [blips, setBlips] = useState([]);

  useEffect(() => {
    // Generate random blips periodically
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 50; // Random distance from center
      const x = 75 + Math.cos(angle) * radius;
      const y = 75 + Math.sin(angle) * radius;
      
      const newBlip = {
        id: Date.now(),
        x,
        y,
      };

      setBlips((prev) => [...prev.slice(-3), newBlip]); // Keep last 4 blips max
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-44 h-44 border border-hud-green/10 bg-hud-green/[0.01] rounded-full flex items-center justify-center overflow-hidden">
      {/* Concentric helper grids */}
      <div className="absolute w-[85%] h-[85%] border border-dashed border-hud-green/10 rounded-full" />
      <div className="absolute w-[60%] h-[60%] border border-hud-green/5 rounded-full" />
      <div className="absolute w-[35%] h-[35%] border border-dashed border-hud-green/10 rounded-full" />
      
      {/* Crosshair coordinate lines */}
      <div className="absolute w-full h-[1px] bg-hud-green/10" />
      <div className="absolute h-full w-[1px] bg-hud-green/10" />

      {/* Radar sweep indicator */}
      <div className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none">
        <div 
          className="w-[50%] h-[50%] absolute top-0 left-1/2 -translate-x-full origin-bottom-right"
          style={{
            background: 'linear-gradient(45deg, var(--color-hud-green) 0%, transparent 80%)',
            opacity: 0.18,
            clipPath: 'polygon(100% 100%, 0 0, 100% 0)'
          }}
        />
      </div>

      {/* Dynamic pinging blips */}
      {blips.map((blip) => (
        <div
          key={blip.id}
          className="absolute w-1.5 h-1.5 bg-hud-cyan rounded-full pointer-events-none"
          style={{
            left: `${blip.x}px`,
            top: `${blip.y}px`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px #00ffea, 0 0 20px #00ffea'
          }}
        >
          {/* Pulsing ring around the blip */}
          <div className="absolute inset-[-6px] border border-hud-cyan/60 rounded-full animate-[blip-fade_1.5s_ease-out_infinite]" />
        </div>
      ))}

      {/* Center lock point */}
      <div className="w-1 h-1 bg-hud-cyan rounded-full z-10 shadow-[0_0_6px_#00ffea]" />
      
      {/* Display text */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] text-hud-green/45 tracking-[0.2em] font-mono whitespace-nowrap">
        SCANNING_RANGE_500M
      </div>
    </div>
  );
};
