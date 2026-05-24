import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const SidebarData = () => {
  const [weather, setWeather] = useState({
    temp: '30.0°C',
    humidity: '62%',
    wind: '12.0 KM/H',
    condition: 'CLEAR',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );
        const data = response.data.current;
        
        // Map WMO Weather Codes to simple strings
        const codeMap = {
          0: 'CLEAR',
          1: 'MAINLY CLEAR', 2: 'PARTLY CLOUDY', 3: 'OVERCAST',
          45: 'FOGGY', 48: 'DEPOSITING FOG',
          51: 'LIGHT DRIZZLE', 53: 'DRIZZLE', 55: 'HEAVY DRIZZLE',
          61: 'SLIGHT RAIN', 63: 'RAIN', 65: 'HEAVY RAIN',
          71: 'SLIGHT SNOW', 73: 'SNOW', 75: 'HEAVY SNOW',
          77: 'SNOW GRAINS',
          80: 'LIGHT SHOWERS', 81: 'SHOWERS', 82: 'HEAVY SHOWERS',
          85: 'SNOW SHOWERS', 86: 'HEAVY SNOW SHOWERS',
          95: 'THUNDERSTORM', 96: 'TS STORM WITH HAIL', 99: 'HEAVY TS STORM'
        };

        const condition = codeMap[data.weather_code] || 'ATMOSPHERIC_OK';

        setWeather({
          temp: `${data.temperature_2m.toFixed(1)}°C`,
          humidity: `${data.relative_humidity_2m}%`,
          wind: `${data.wind_speed_10m.toFixed(1)} KM/H`,
          condition: condition.toUpperCase(),
        });
      } catch (err) {
        console.error('Weather Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default fallback (e.g. New Delhi coordinate)
          fetchWeather(28.6139, 77.2090);
        }
      );
    } else {
      fetchWeather(28.6139, 77.2090);
    }
  }, []);

  return (
    <div className="font-mono text-[9px] w-full min-w-[200px]">
      <div className="text-[10px] border-b border-hud-green/20 pb-1.5 mb-2 font-bold tracking-[0.2em] text-hud-green">
        ATMOSPHERIC_STATUS
      </div>
      
      {loading ? (
        <div className="animate-pulse text-hud-green/40 uppercase tracking-[0.15em] py-2">
          &gt; Scanning Atmospheric Data...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-hud-green/80">
          <div>CONDITION: <span className="text-white font-bold">{weather.condition}</span></div>
          <div>TEMP: <span className="text-white font-bold">{weather.temp}</span></div>
          <div>HUMIDITY: <span className="text-white font-bold">{weather.humidity}</span></div>
          <div>WIND: <span className="text-white font-bold">{weather.wind}</span></div>
        </div>
      )}

      <div className="border-t border-hud-green/20 mt-3 pt-2 text-[8px] text-hud-green/45 leading-relaxed tracking-wider">
        NEURAL UPLINK ENCRYPTION: <span className="text-hud-cyan font-bold">256-BIT AES</span> <br />
        CORE ENGINE: <span className="text-hud-cyan font-bold">LLAMA-3.1-8B-INSTANT</span>
      </div>
    </div>
  );
};