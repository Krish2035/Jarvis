import React, { useState, useEffect } from 'react';

export const TimeDateDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time: 12-hour format with AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // This enables 12-hour format
    }).toUpperCase(); // Uppercase for the JARVIS feel (e.g., 03:35:12 PM)
  };

  // Format Date: e.g., FRIDAY, APR 17
  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <div className="border-l-4 border-hud-green pl-6 py-2 bg-hud-green/5 backdrop-blur-sm">
      <div className="text-4xl font-black tracking-tighter text-glow">
        {formatTime(time)}
      </div>
      <div className="text-[10px] tracking-[0.4em] text-hud-green/60 mt-1 font-bold">
        {formatDate(time)}
      </div>
    </div>
  );
};