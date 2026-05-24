export const ScanlineOverlay = () => (
  <>
    {/* Very thin CRT line grid overlay */}
    <div 
      className="fixed inset-0 pointer-events-none opacity-[0.08] z-[9990]" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.03), rgba(0, 0, 255, 0.02))`
      }} 
    />
    
    {/* Sweeping laser scanner line */}
    <div 
      className="fixed inset-0 pointer-events-none opacity-[0.06] animate-[scan_5s_linear_infinite] z-[9991]" 
      style={{
        height: '2px', 
        background: 'linear-gradient(to right, transparent, var(--color-hud-green), transparent)',
        boxShadow: '0 0 10px var(--color-hud-green), 0 0 20px var(--color-hud-green)'
      }} 
    />

    {/* Glitch flickering ambient overlay */}
    <div className="fixed inset-0 pointer-events-none bg-hud-cyan/[0.005] animate-flicker z-[9989]" />
  </>
);