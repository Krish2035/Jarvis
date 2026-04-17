import { useEffect, useState } from 'react';

export const CustomCrosshair = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{ transform: `translate(${position.x - 20}px, ${position.y - 20}px)` }}
    >
      {/* The Crosshair Circle */}
      <div className="relative w-10 h-10 border border-hud-green/30 rounded-full flex items-center justify-center">
        <div className="absolute w-full h-[1px] bg-hud-green/20"></div>
        <div className="absolute h-full w-[1px] bg-hud-green/20"></div>
        <div className="w-1 h-1 bg-hud-green rounded-full shadow-[0_0_8px_#00ffea]"></div>
      </div>
    </div>
  );
};