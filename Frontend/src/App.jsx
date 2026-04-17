import { useState, useEffect, useRef } from 'react';
import { Search, Wifi, Settings, Terminal } from 'lucide-react';

/* --- HUD Components --- */
import { TimeDateDisplay } from './components/hud/TimeDateDisplay';
import { StorageStatus } from './components/hud/StorageStatus';
import { AudioPlayer } from './components/hud/AudioPlayer';
import { SystemRings } from './components/hud/SystemRings';
import { NewsHologrid } from './components/hud/NewsHologrid';
import { SidebarData } from './components/hud/SidebarData';
import { ScanlineOverlay } from './components/hud/ScanlineOverlay';
import { CustomCrosshair } from './components/hud/CustomCrosshair';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [news, setNews] = useState([]); 
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState("OFFLINE");
  const synthRef = useRef(window.speechSynthesis);

  const speak = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const jarvisVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Google UK English Male"));
    if (jarvisVoice) utterance.voice = jarvisVoice;
    utterance.pitch = 0.85; 
    utterance.rate = 0.95;
    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    const loadVoices = () => synthRef.current.getVoices();
    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) synthRef.current.onvoiceschanged = loadVoices;
  }, []);

  const initializeSystem = () => {
    setIsInitialized(true);
    setStatus("ONLINE");
    setTimeout(() => speak("Jarvis interface online. Neural link established."), 600);
  };

  if (!isInitialized) {
    return (
      <div className="h-screen bg-[#000c0a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent"></div>
        <div className="relative border-2 border-hud-green/30 p-6 md:p-10 rounded-full animate-pulse">
          <Terminal size={40} className="text-hud-green" />
        </div>
        <h1 className="font-bold text-lg md:text-2xl tracking-[0.3em] md:tracking-[0.5em] text-hud-green mt-6 uppercase">
          System Authentication
        </h1>
        <button onClick={initializeSystem} className="mt-8 group relative px-8 py-3 border border-hud-green text-hud-green font-bold tracking-widest overflow-hidden">
          <span className="relative z-10 text-xs md:text-sm">ACCESS SYSTEM</span>
          <div className="absolute inset-0 bg-hud-green translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
      </div>
    );
  }

  return (
    // min-h-screen with overflow-y-auto ensures mobile users can scroll down through the clusters
    <div className="min-h-screen md:h-screen bg-hud-background p-4 md:p-8 font-mono relative overflow-x-hidden overflow-y-auto md:overflow-hidden text-[10px] uppercase tracking-wider text-hud-green select-none bg-grid">
      
      <ScanlineOverlay />
      {/* Disable crosshair on mobile as it interferes with touch events */}
      <div className="hidden md:block"><CustomCrosshair /></div>

      <div className="flex flex-col md:block h-full w-full space-y-10 md:space-y-0">

        {/* TOP CLUSTER: Time and Diagnostics */}
        <div className="md:absolute md:top-10 md:left-10 space-y-6 z-10">
          <TimeDateDisplay />
          {/* Hide secondary analytics on very small mobile screens to save space */}
          <div className="hidden sm:block pt-4 border-l border-hud-green-dark pl-4">
            <h2 className="text-hud-green/40 mb-3 tracking-[0.2em] animate-pulse">DRIVE_ANALYTICS</h2>
            <StorageStatus />
          </div>
        </div>

        {/* CENTER CLUSTER: Core Interface */}
        <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 flex justify-center py-6 md:py-0">
          <div className="scale-90 md:scale-100">
            <SystemRings 
              isListening={isListening} 
              setIsListening={setIsListening} 
              speak={speak} 
              setNews={setNews} 
              setStatus={setStatus}
            />
          </div>
        </div>

        {/* RIGHT CLUSTER: Data Stream */}
        <div className="md:absolute md:top-20 md:right-10 flex flex-col items-center md:items-end w-full md:w-[28vw] z-10">
          <div className="flex space-x-6 border-b border-hud-green/20 pb-4 w-full justify-between md:justify-end mb-4 bg-black/10 backdrop-blur-sm px-2">
             <div className="flex items-center space-x-2 opacity-50">
              <Search size={14} />
              <span>SCAN_MODE</span>
            </div>
            <div className="text-hud-green font-bold border-l border-hud-green/20 pl-6">
              STATUS: <span className={isListening ? "animate-pulse text-cyan-400" : ""}>{status}</span>
            </div>
          </div>

          <div className="w-full max-h-[45vh] md:max-h-[48vh] overflow-y-auto custom-scrollbar pr-2 mb-6">
            <NewsHologrid news={news} />
          </div>
          <div className="w-full h-[1px] bg-gradient-to-l from-hud-green/30 to-transparent hidden md:block"></div>
        </div>

        {/* BOTTOM CLUSTERS: Env Data & Config */}
        <div className="md:absolute md:bottom-10 md:right-10 flex flex-col items-center md:items-end z-10">
          <div className="bg-hud-green/5 border-l-2 md:border-l-0 md:border-r-2 border-hud-green p-4 md:pr-6 md:py-4 backdrop-blur-sm w-full md:w-auto">
            <SidebarData />
          </div>
        </div>

        <div className="md:absolute md:bottom-10 md:left-10 space-y-6 z-10 pb-12 md:pb-0">
          <AudioPlayer />
          <div className="flex items-center justify-between md:justify-start space-x-6 border-t border-hud-green-dark pt-4 px-2">
            <div className="flex items-center space-x-2">
              <Settings size={14} className="animate-spin-slow text-hud-green/50" />
              <span>CORE_CONFIG</span>
            </div>
            <div className="flex items-center space-x-2 text-hud-green">
              <Wifi size={14} />
              <span className="animate-pulse">LINK_STABLE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-4 left-1/2 -translate-x-1/2 text-[7px] text-hud-green/20 tracking-[1.5em] pointer-events-none">
        JARVIS-MARK-VII-TERMINAL-LINK-SECURED
      </div>
    </div>
  );
}

export default App;