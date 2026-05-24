import React from 'react';
import { Terminal } from 'lucide-react';

export const CommandLog = ({ commands }) => {
  return (
    <div className="w-full border border-hud-green/10 bg-hud-green/[0.02] p-4 relative font-mono text-[9px] min-h-[120px] max-h-[160px] flex flex-col justify-between">
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-green/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-hud-green/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-hud-green/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-green/30" />

      <div>
        <div className="flex items-center justify-between border-b border-hud-green/10 pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 text-hud-green/60 font-bold tracking-wider">
            <Terminal size={10} className="text-hud-cyan animate-pulse" />
            CONSOLE_STREAM
          </span>
          <span className="text-[7.5px] text-hud-cyan/40">BUFFER: 256KB</span>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[90px] pr-1.5 custom-scrollbar">
          {(!commands || commands.length === 0) ? (
            <div className="text-hud-green/30 italic py-2">
              &gt; SYSTEM STANDBY. AWAITING AUDIO UPLINK INSTRUCTIONS...
            </div>
          ) : (
            commands.map((cmd, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-1.5 leading-tight hover:text-white transition-colors animate-fade-in"
              >
                <span className="text-hud-cyan font-bold shrink-0">&gt;</span>
                <div className="flex-1">
                  <span className="text-hud-green/40 mr-1.5">[{cmd.timestamp}]</span>
                  <span className="uppercase tracking-wide">{cmd.text}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-[7px] text-hud-green/30 border-t border-hud-green/10 pt-1.5 mt-2 flex justify-between">
        <span>LOGS_OK // STAT_MONITOR</span>
        <span className="animate-pulse text-hud-cyan font-bold">STREAMING</span>
      </div>
    </div>
  );
};
