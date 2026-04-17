export const StorageStatus = () => (
  <div className="space-y-4 font-mono">
    <div>
      <div className="flex justify-between mb-1">
        <span>PRIMARY_DRIVE</span>
        <span>84%</span>
      </div>
      <div className="w-48 h-1 bg-hud-green-dark">
        <div className="h-full bg-hud-green w-[84%] animate-pulse"></div>
      </div>
    </div>
    <div className="text-[9px] text-hud-green/40 leading-tight">
      D_SECTOR: 0x88291 <br />
      STATUS: OPTIMAL
    </div>
  </div>
);