export const ScanlineOverlay = () => (
  <>
    <div className="fixed inset-0 pointer-events-none opacity-10" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 50%), linear-gradient(90deg, rgba(255,0,0,0.01), rgba(0,255,0,0.02), rgba(0,0,255,0.01))`
    }} />
    <div className="fixed inset-0 pointer-events-none opacity-5 animate-[scan_6s_linear_infinite]" style={{
      height: '1px', background: 'linear-gradient(to right, transparent, var(--color-hud-green), transparent)'
    }} />
  </>
);