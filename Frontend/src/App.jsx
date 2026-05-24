import { useState, useEffect, useRef } from 'react';
import { Search, Wifi, Settings, Terminal, ShieldAlert } from 'lucide-react';

/* --- HUD Components --- */
import { TimeDateDisplay } from './components/hud/TimeDateDisplay';
import { StorageStatus } from './components/hud/StorageStatus';
import { AudioPlayer } from './components/hud/AudioPlayer';
import { SystemRings } from './components/hud/SystemRings';
import { NewsHologrid } from './components/hud/NewsHologrid';
import { SidebarData } from './components/hud/SidebarData';
import { ScanlineOverlay } from './components/hud/ScanlineOverlay';
import { CustomCrosshair } from './components/hud/CustomCrosshair';
import { RadarDisplay } from './components/hud/RadarDisplay';
import { CommandLog } from './components/hud/CommandLog';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [news, setNews] = useState([]); 
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState("OFFLINE");
  const [commandHistory, setCommandHistory] = useState([]);

  // Boot sequence animation state machine
  const [bootStage, setBootStage] = useState(0); 
  const [bootLogs, setBootLogs] = useState([]);
  const [showAccessBtn, setShowAccessBtn] = useState(false);
  
  const synthRef = useRef(window.speechSynthesis);

  // Spoken voice assistant setup
  const speak = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    // Prioritize high-quality UK English Male voices for the iconic JARVIS accent
    const jarvisVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Google UK English Male"));
    if (jarvisVoice) utterance.voice = jarvisVoice;
    utterance.pitch = 0.82; 
    utterance.rate = 0.98;
    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    const loadVoices = () => synthRef.current.getVoices();
    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  // Boot sequence simulator
  useEffect(() => {
    if (isInitialized) return;

    const logLines = [
      "JARVIS OS V7.4.2 INITIALIZING...",
      "LOADING NEURAL INTERFACE KERNEL...",
      "SYNCHRONIZING AUDIO WAVEFORM TRANSLATORS...",
      "CONNECTING TO GROQ LLAMA CORE...",
      "VERIFYING LOCAL UPLINK PORTS...",
      "ESTABLISHING SECURE API TUNNELING...",
      "SCANNING ENVIRONMENT DATA STREAMS...",
      "RETRIEVING GEOLOCATION SENSORS...",
      "BIOMETRIC ENCRYPTION KEY SYNCED [AES-256]...",
      "READY FOR NEURAL AUTHENTICATION."
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < logLines.length) {
        setBootLogs(prev => [...prev, logLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setBootStage(1); // Proceed to authorization prompt
        setTimeout(() => {
          setShowAccessBtn(true);
        }, 800);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const initializeSystem = () => {
    setIsInitialized(true);
    setStatus("ONLINE");
    setTimeout(() => speak("Jarvis interface online. Neural link established. Good morning, sir."), 500);
  };

  const addCommandToHistory = (text) => {
    const timeString = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    setCommandHistory(prev => [
      { text, timestamp: timeString },
      ...prev.slice(0, 8)
    ]);
  };

  // Boot UI Render State
  if (!isInitialized) {
    return (
      <div className="h-screen bg-[#000c0a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none bg-grid font-mono">
        <ScanlineOverlay />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,234,0.1)_0%,transparent_70%)]" />

        {/* Center rotating boot core */}
        <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-hud-green/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-2 border border-hud-cyan/40 rounded-full animate-spin-slow-reverse" />
          <Terminal size={28} className="text-hud-cyan animate-pulse" />
        </div>

        {/* Scrolling console log simulator */}
        <div className="w-full max-w-lg h-48 border border-hud-green/10 bg-black/60 backdrop-blur-md p-4 rounded-sm mb-6 text-left overflow-y-auto no-scrollbar relative">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-hud-green/40" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-hud-green/40" />
          
          <div className="space-y-1 text-[9px] text-hud-green/60">
            {bootLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-hud-cyan">&gt;&gt;</span>
                <span className="tracking-wide">{log}</span>
              </div>
            ))}
            {bootStage === 0 && (
              <div className="inline-block w-1.5 h-3 bg-hud-cyan animate-[boot-blink_0.8s_infinite] ml-1" />
            )}
          </div>
        </div>

        {bootStage === 1 && (
          <div className="animate-fade-in flex flex-col items-center">
            <h1 className="font-bold text-sm tracking-[0.4em] text-hud-cyan uppercase mb-1 font-orbitron animate-[glitch_2s_infinite]">
              SYSTEM AUTHENTICATION REQUIRED
            </h1>
            <p className="text-[9px] text-hud-green/40 tracking-[0.15em] mb-6">
              BIOMETRIC PROTOCOL MARK-VII // IP SECURE
            </p>

            {showAccessBtn && (
              <button 
                onClick={initializeSystem} 
                className="group relative px-10 py-3.5 border border-hud-cyan text-hud-cyan font-bold tracking-[0.25em] overflow-hidden bg-transparent cursor-pointer font-orbitron text-xs transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,234,0.4)]"
              >
                <span className="relative z-10">ESTABLISH LINK</span>
                <div className="absolute inset-0 bg-hud-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen bg-hud-background p-4 md:p-6 font-mono relative overflow-x-hidden overflow-y-auto md:overflow-hidden text-[9px] uppercase tracking-wider text-hud-green select-none bg-grid">
      
      <ScanlineOverlay />
      
      {/* Dynamic Cursor Crosshair (Hidden on mobile) */}
      <div className="hidden md:block">
        <CustomCrosshair />
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 md:grid-rows-6 h-full w-full gap-5 z-10 relative">

        {/* LEFT COLUMN PANEL: Time, Diagnostics & Radar */}
        <div className="md:col-span-3 md:row-span-6 flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-5">
            <TimeDateDisplay />
            
            {/* Top Diagnostics Cluster */}
            <div className="border border-hud-green/10 bg-hud-green/[0.02] p-4 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-green/30" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-green/30" />
              
              <h2 className="text-hud-cyan font-bold mb-3 tracking-[0.2em] font-orbitron flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-hud-cyan rounded-full animate-ping" />
                SYSTEM_ANALYTICS
              </h2>
              <StorageStatus />
            </div>
          </div>

          {/* New Radar Segment */}
          <div className="border border-hud-green/10 bg-hud-green/[0.02] p-4 relative flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-green/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-green/30" />
            
            <div className="text-[8px] text-hud-green/50 w-full mb-3 tracking-widest font-bold text-left">
              SECTOR_RADAR_MAP
            </div>
            <RadarDisplay />
          </div>
        </div>

        {/* CENTER INTERFACE COLUMN: Active Reactor System Core */}
        <div className="md:col-span-6 md:row-span-6 flex items-center justify-center min-h-[350px] md:min-h-0 relative">
          {/* Ambient Glow behind reactor core */}
          <div className="absolute w-[360px] h-[360px] bg-hud-cyan/[0.02] rounded-full filter blur-3xl pointer-events-none" />
          
          <SystemRings 
            isListening={isListening} 
            setIsListening={setIsListening} 
            speak={speak} 
            setNews={setNews} 
            setStatus={setStatus}
            onCommandTranscribed={addCommandToHistory}
          />
        </div>

        {/* RIGHT COLUMN PANEL: Stream, Status & Console log */}
        <div className="md:col-span-3 md:row-span-6 flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-4">
            {/* System Uplink Status */}
            <div className="flex justify-between items-center border border-hud-green/15 p-3 bg-hud-green/[0.02] relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-green/30" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-green/30" />
              
              <div className="flex items-center space-x-2 text-hud-green/60 font-bold">
                <Search size={12} className="text-hud-cyan" />
                <span>SCAN_MONITOR</span>
              </div>
              <div className="text-hud-green font-bold pl-4">
                STATUS: <span className={isListening ? "animate-pulse text-hud-cyan" : "text-white"}>{status}</span>
              </div>
            </div>

            {/* News Data Hologrid */}
            <div className="max-h-[38vh] overflow-y-auto custom-scrollbar pr-1 relative news-mask">
              <NewsHologrid news={news} />
            </div>
          </div>

          {/* New Console history logger */}
          <CommandLog commands={commandHistory} />
        </div>

        {/* BOTTOM WIDGET BAR: Music Control & Environment */}
        <div className="md:col-span-12 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-hud-green/10 pt-4 mt-2">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <AudioPlayer />
            <div className="flex items-center space-x-2.5 text-hud-green/55">
              <Settings size={12} className="animate-spin-slow text-hud-cyan" />
              <span>CORE_CONFIGURATION: SYS_MARK_VII</span>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-hud-green/10 pt-3 md:pt-0">
            <div className="bg-hud-green/[0.02] border border-hud-green/10 p-3 relative">
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-hud-green/30" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-hud-green/30" />
              <SidebarData />
            </div>
            
            <div className="flex items-center space-x-2 text-hud-cyan animate-pulse whitespace-nowrap bg-hud-cyan/5 px-3 py-1.5 border border-hud-cyan/10">
              <Wifi size={12} />
              <span className="font-bold tracking-widest text-[8px]">LINK_SECURED</span>
            </div>
          </div>
        </div>

      </div>

      <div className="hidden lg:block absolute bottom-3 left-1/2 -translate-x-1/2 text-[7px] text-hud-green/20 tracking-[1.8em] pointer-events-none font-mono">
        JARVIS-MARK-VII-TERMINAL-LINK-SECURED
      </div>
    </div>
  );
}

export default App;