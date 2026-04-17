export const SidebarData = () => (
  <div className="grid grid-cols-2 gap-x-12 gap-y-2 opacity-60 text-[9px]">
    <div>ATMOSPHERIC: FOG</div>
    <div>TEMP: 30°C</div>
    <div>HUMIDITY: 62%</div>
    <div>VISIBILITY: 4KM</div>
    <div className="col-span-2 border-t border-hud-green-dark mt-2 pt-2 uppercase tracking-tighter">
      Neural link encryption: 256-bit AES <br />
      Core: Llama-3.1-8B-Instant
    </div>
  </div>
);