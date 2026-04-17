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
      <div className="border border-hud-green/10 p-16 text-center bg-black/40 backdrop-blur-md">
        <p className="animate-pulse tracking-[0.5em] text-hud-green/30 text-[10px] uppercase font-mono">
          AWAITING DATA STREAM...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {news.map((item, i) => (
        <div 
          key={i} 
          className="relative group border-l-2 border-hud-green/20 p-4 bg-hud-green/5 hover:bg-hud-green/10 transition-all duration-300"
        >
          {/* Decorative Corner Accents: Top-Left & Bottom-Right */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-green/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-green/40 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Packet Header: ID and Uplink Status */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-[8px] text-hud-green/40 flex items-center gap-2 font-mono">
              <Activity size={10} className="animate-pulse" />
              PACKET_0x443_{i}
            </span>
            <span className="text-[7px] text-hud-green/30 italic font-mono uppercase tracking-widest">
              UPLINK_STABLE
            </span>
          </div>

          {/* News Title: High visibility uppercase */}
          <h3 className="text-[11px] font-bold text-white/90 leading-tight mb-2 tracking-widest uppercase group-hover:text-hud-green transition-colors font-mono">
            {item.title}
          </h3>

          {/* Holographic Description Snippet */}
          <p className="text-[9px] text-hud-green/50 line-clamp-2 italic font-light leading-relaxed mb-3 font-mono">
            {item.description || "HOLOGRAPHIC DATA STREAM ACTIVE. CONNECTION SECURE."}
          </p>

          {/* Metadata Footer: Filetype and External Link */}
          <div className="flex justify-between items-center pt-2 border-t border-hud-green/10">
            <div className="flex gap-4">
              <span className="text-[7px] text-hud-green/20 font-mono uppercase">
                FILETYPE: GZMO
              </span>
              <span className="text-[7px] text-hud-green/20 font-mono uppercase">
                STAMP: {item.pubDate ? new Date(item.pubDate).toLocaleTimeString() : "N/A"}
              </span>
            </div>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-hud-green/40 hover:text-hud-green transition-colors"
            >
              <ExternalLink size={10} />
            </a>
          </div>

          {/* Vertical Scanner Line Effect on Hover */}
          <div className="absolute top-0 left-0 w-[2px] h-full bg-hud-green/40 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
        </div>
      ))}
    </div>
  );
};