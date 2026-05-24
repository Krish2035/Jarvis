import React, { useState, useEffect } from 'react';

export const TimeDateDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const start = Date.now();
    const elapsedTimer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(elapsedTimer);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).toUpperCase();
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  const formatElapsed = (sec) => {
    const hrs = String(Math.floor(sec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const secs = String(sec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="relative border-l-4 border-hud-green pl-6 py-3 bg-hud-green/[0.03] backdrop-blur-sm corner-bracket max-w-sm">
      {/* Decorative top header line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-hud-green/20" />
      
      <div className="text-3xl font-black font-orbitron tracking-tight text-glow animate-flicker">
        {formatTime(time)}
      </div>

      <div className="text-[10px] tracking-[0.25em] text-hud-green/60 mt-1 font-bold">
        {formatDate(time)}
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-hud-green/10 text-[9px] text-hud-green/40">
        <span>LOC_SYS: GMT+05:30</span>
        <span className="font-mono">MET: {formatElapsed(elapsed)}</span>
      </div>
    </div>
  );
};