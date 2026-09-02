import { Play, SkipForward, Activity } from 'lucide-react';

export const AudioPlayer = () => (
  <div className="border border-hud-green/10 p-3 bg-hud-green/[0.02] w-full max-w-xs md:w-56 relative corner-bracket hover:bg-hud-green/[0.05] transition-all duration-300">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5 text-hud-cyan">
        <Activity size={12} className="animate-pulse" />
        <span className="text-[8px] font-bold tracking-wider">UPLINK_AUDIO_STREAM</span>
      </div>
      {/* Animated spectrum analyzer simulation */}
      <div className="flex gap-[2px] h-3 items-end">
        <span className="w-[1.5px] bg-hud-cyan animate-[wave-1_0.8s_ease-in-out_infinite]" />
        <span className="w-[1.5px] bg-hud-cyan animate-[wave-3_0.5s_ease-in-out_infinite]" />
        <span className="w-[1.5px] bg-hud-cyan animate-[wave-2_0.9s_ease-in-out_infinite]" />
        <span className="w-[1.5px] bg-hud-cyan animate-[wave-1_0.6s_ease-in-out_infinite_0.1s]" />
      </div>
    </div>
    
    <div className="text-[9.5px] sm:text-[10px] truncate mb-3 italic text-white/95 tracking-wide">
      Scrolls of Aryavart - Maddi's World
    </div>
    
    <div className="flex justify-between items-center text-hud-green/50">
      <div className="flex gap-3">
        <Play size={11} fill="currentColor" className="hover:text-hud-cyan cursor-pointer transition-colors" />
        <SkipForward size={11} fill="currentColor" className="hover:text-hud-cyan cursor-pointer transition-colors" />
      </div>
      <div className="text-[8px] tracking-wider font-mono">02:44 / 07:12</div>
    </div>
  </div>
);