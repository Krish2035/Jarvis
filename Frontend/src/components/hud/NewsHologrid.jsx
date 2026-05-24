import React from 'react';
import { Activity, ExternalLink } from 'lucide-react';

/**
 * NewsHologrid Component
 * Renders the live data stream packets in the top-right HUD sector.
 */
export const NewsHologrid = ({ news }) => {
  // Standby state when no data is being streamed
  if (!news || news.length === 0) {
    return (
      <div className="border border-hud-green/10 p-12 text-center bg-black/40 backdrop-blur-md relative overflow-hidden group">
        {/* Dynamic corner bracket elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-green/30" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-hud-green/30" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-hud-green/30" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-green/30" />

        <p className="animate-pulse tracking-[0.4em] text-hud-green/30 text-[9px] uppercase font-mono py-6">
          AWAITING NEURAL DATA STREAM...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {news.slice(0, 10).map((item, i) => (
        <div 
          key={i} 
          className="relative group border-l-2 border-hud-green/20 p-4 bg-hud-green/[0.02] hover:bg-hud-green/[0.07] transition-all duration-300 animate-slide-in-right opacity-0"
          style={{ 
            animationDelay: `${i * 120}ms`,
            animationFillMode: 'forwards'
          }}
        >
          {/* Decorative Corner Accents: Top-Left & Bottom-Right */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-hud-green/30" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-hud-green/30 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Packet Header: ID and Uplink Status */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-[7.5px] text-hud-green/45 flex items-center gap-1.5 font-mono">
              <Activity size={9} className="animate-pulse text-hud-cyan" />
              PACKET_0x{((i + 1) * 231).toString(16).toUpperCase()}_{i}
            </span>
            <span className="text-[7px] text-hud-cyan/50 font-bold font-mono uppercase tracking-widest animate-pulse">
              SYNCED_OK
            </span>
          </div>

          {/* News Title: High visibility uppercase with hover glitch effect */}
          <h3 className="text-[10px] font-black text-white/90 leading-snug mb-2 tracking-widest uppercase group-hover:text-hud-cyan transition-colors font-orbitron group-hover:animate-[glitch-2_0.3s_ease-in-out_infinite]">
            {item.title}
          </h3>

          {/* Holographic Description Snippet */}
          <p className="text-[9px] text-hud-green/50 line-clamp-2 italic font-light leading-relaxed mb-3 font-mono">
            {item.description || "HOLOGRAPHIC DATA STREAM ACTIVE. ENCRYPTION PROTOCOLS VERIFIED."}
          </p>

          {/* Metadata Footer: Filetype and External Link */}
          <div className="flex justify-between items-center pt-2 border-t border-hud-green/10">
            <div className="flex gap-4">
              <span className="text-[7px] text-hud-green/30 font-mono uppercase">
                FILE: GZMO
              </span>
              <span className="text-[7px] text-hud-green/35 font-mono uppercase">
                STAMP: {item.pubDate ? new Date(item.pubDate).toLocaleTimeString() : new Date().toLocaleTimeString()}
              </span>
            </div>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-hud-green/40 hover:text-hud-cyan transition-colors flex items-center gap-1"
            >
              <span className="text-[6.5px] tracking-wider uppercase font-mono opacity-0 group-hover:opacity-100 transition-opacity">EXTRACT</span>
              <ExternalLink size={9} />
            </a>
          </div>

          {/* Vertical Scanner Line Effect on Hover */}
          <div className="absolute top-0 left-0 w-[2px] h-full bg-hud-cyan/60 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
        </div>
      ))}
    </div>
  );
};