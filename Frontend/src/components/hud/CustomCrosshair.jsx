import { useEffect, useState } from 'react';

export const CustomCrosshair = () => {
  const [pos, setPos]           = useState({ x: -100, y: -100 });
  const [ghost, setGhost]       = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Only activate custom crosshair for fine pointer / mouse devices
    const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    setIsPointerDevice(isFinePointer);

    if (!isFinePointer) return;

    let frame;
    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMove = (e) => {
      target = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
    };

    // Ghost trails with slight lag
    const animate = () => {
      setGhost(prev => ({
        x: prev.x + (target.x - prev.x) * 0.14,
        y: prev.y + (target.y - prev.y) * 0.14,
      }));
      frame = requestAnimationFrame(animate);
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!isPointerDevice) return null;

  const SIZE = 44;

  return (
    <>
      {/* Ghost / trailing circle */}
      <div
        className="fixed pointer-events-none z-[9996] hidden md:block"
        style={{
          transform: `translate(${ghost.x - SIZE}px, ${ghost.y - SIZE}px)`,
          width: SIZE * 2, height: SIZE * 2,
        }}
      >
        <div
          className="w-full h-full rounded-full border border-hud-cyan/15"
          style={{ boxShadow: '0 0 10px rgba(0,255,234,0.1)' }}
        />
      </div>

      {/* Main crosshair */}
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{
          transform: `translate(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px)`,
          width: SIZE, height: SIZE,
          transition: 'transform 0.04s linear',
        }}
      >
        {/* Outer ring */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-150 ${
            clicking ? 'border-hud-cyan scale-75' : 'border-hud-cyan/40'
          }`}
          style={{ boxShadow: clicking ? '0 0 12px rgba(0,255,234,0.6)' : 'none' }}
        />

        {/* Corner brackets — top-left */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-hud-cyan/80" />
        {/* Corner brackets — top-right */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-hud-cyan/80" />
        {/* Corner brackets — bottom-left */}
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-hud-cyan/80" />
        {/* Corner brackets — bottom-right */}
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-hud-cyan/80" />

        {/* Crosshair lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-px bg-hud-cyan/20" />
          <div className="absolute h-full w-px bg-hud-cyan/20" />
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-1.5 h-1.5 rounded-full bg-hud-cyan transition-all duration-150 ${
              clicking ? 'scale-150' : ''
            }`}
            style={{ boxShadow: '0 0 8px #00ffea, 0 0 20px rgba(0,255,234,0.4)' }}
          />
        </div>
      </div>

      {/* Coordinate readout */}
      <div
        className="fixed pointer-events-none z-[9999] text-hud-cyan/40 font-mono hidden md:block"
        style={{
          left: pos.x + 22,
          top: pos.y + 16,
          fontSize: '8px',
          letterSpacing: '0.1em',
        }}
      >
        {pos.x.toString().padStart(4, '0')},{pos.y.toString().padStart(4, '0')}
      </div>
    </>
  );
};