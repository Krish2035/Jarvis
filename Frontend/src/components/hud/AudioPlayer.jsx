import { Play, SkipForward, Activity } from 'lucide-react';

export const AudioPlayer = () => (
  <div className="border border-hud-green-dark p-3 bg-hud-green/5 w-56">
    <div className="flex items-center justify-between mb-2">
      <Activity size={16} className="text-hud-green animate-bounce" />
      <span className="text-[9px]">UPLINK_AUDIO_STREAM</span>
    </div>
    <div className="text-xs truncate mb-3 italic">Scrolls of Aryavart - Maddi's World</div>
    <div className="flex space-x-4">
      <Play size={14} fill="currentColor" />
      <SkipForward size={14} fill="currentColor" />
      <div className="text-[9px] flex-1 text-right self-center">02:44 / 07:12</div>
    </div>
  </div>
);