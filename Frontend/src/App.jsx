import { useState, useEffect, useRef } from 'react';
import { Search, Wifi, WifiOff, Settings, Terminal, Download, Sparkles, Volume2, VolumeX, Shield, Radio, Activity, Cpu } from 'lucide-react';

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

/* --- PWA & Connectivity Services --- */
import { 
  subscribeOnlineStatus, 
  subscribeInstallPrompt, 
  triggerPWAInstall, 
  isPWAInstalled 
} from './services/pwaManager';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [news, setNews] = useState([]); 
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState("OFFLINE");
  const [commandHistory, setCommandHistory] = useState([]);
  
  // PWA & Connectivity state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Mobile Active HUD Sector Tab: 'core' | 'radar' | 'intel' | 'logs'
  const [activeMobileTab, setActiveMobileTab] = useState('core');

  // Boot sequence animation state machine
  const [bootStage, setBootStage] = useState(0); 
  const [bootLogs, setBootLogs] = useState([]);
  const [showAccessBtn, setShowAccessBtn] = useState(false);
  
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Spoken voice assistant setup
  const speak = (text) => {
    if (!synthRef.current || soundMuted) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synthRef.current.getVoices();
      // Prioritize high-quality UK English Male voices for the iconic JARVIS accent
      const jarvisVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Google UK English Male") || v.name.includes("Daniel"));
      if (jarvisVoice) utterance.voice = jarvisVoice;
      utterance.pitch = 0.84; 
      utterance.rate = 0.98;
      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  useEffect(() => {
    if (synthRef.current) {
      const loadVoices = () => synthRef.current.getVoices();
      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Subscribe to PWA Install Prompt and Online Status
  useEffect(() => {
    const unsubOnline = subscribeOnlineStatus((online) => {
      setIsOnline(online);
      if (isInitialized) {
        setStatus(online ? "ONLINE" : "STANDALONE");
      }
    });

    const unsubInstall = subscribeInstallPrompt((canInstall) => {
      setCanInstallPWA(canInstall);
    });

    setIsStandalone(isPWAInstalled());

    return () => {
      unsubOnline();
      unsubInstall();
    };
  }, [isInitialized]);

  // Boot sequence simulator
  useEffect(() => {
    if (isInitialized) return;

    const logLines = [
      "JARVIS OS MARK-VII INITIALIZING...",
      "LOADING NEURAL INTERFACE KERNEL...",
      "SYNCHRONIZING PWA OFFLINE CACHE...",
      "INITIALIZING LOCAL SPEECH SYNTHESIZERS...",
      "VERIFYING LOCAL UPLINK PORTS...",
      "ESTABLISHING SECURE API TUNNELING...",
      "SCANNING ENVIRONMENT SENSOR ARRAYS...",
      "RETRIEVING GEOLOCATION SENSORS...",
      "BIOMETRIC ENCRYPTION KEY SYNCED [AES-256]...",
      "STANDALONE PWA CORE READY FOR AUTHENTICATION."
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
        }, 600);
      }
    }, 240);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const initializeSystem = () => {
    setIsInitialized(true);
    setStatus(navigator.onLine ? "ONLINE" : "STANDALONE");
    setTimeout(() => {
      const welcomeMsg = navigator.onLine 
        ? "Jarvis interface online. Neural link established. Good day, sir." 
        : "Jarvis standalone offline interface online. Local neural matrices operating with nominal power.";
      speak(welcomeMsg);
    }, 400);
  };

  const handleInstallClick = async () => {
    const installed = await triggerPWAInstall();
    if (installed) {
      speak("JARVIS Mark VII Progressive Web Application deployment successful, sir.");
      setCanInstallPWA(false);
    }
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
      ...prev.slice(0, 10)
    ]);
  };

  // Boot UI Render State
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#000c0a] flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-hidden select-none bg-grid font-mono">
        <ScanlineOverlay />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,234,0.1)_0%,transparent_70%)]" />

        {/* Center rotating boot core */}
        <div className="relative mb-6 sm:mb-8 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-hud-green/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-2 border border-hud-cyan/40 rounded-full animate-spin-slow-reverse" />
          <Terminal size={26} className="text-hud-cyan animate-pulse" />
        </div>

        {/* Scrolling console log simulator */}
        <div className="w-full max-w-md sm:max-w-lg h-44 sm:h-48 border border-hud-green/15 bg-black/70 backdrop-blur-md p-3.5 sm:p-4 rounded-sm mb-5 sm:mb-6 text-left overflow-y-auto no-scrollbar relative">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-hud-green/50" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-hud-green/50" />
          
          <div className="space-y-1 text-[8.5px] sm:text-[9px] text-hud-green/70">
            {bootLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-hud-cyan font-bold">&gt;&gt;</span>
                <span className="tracking-wide">{log}</span>
              </div>
            ))}
            {bootStage === 0 && (
              <div className="inline-block w-1.5 h-3 bg-hud-cyan animate-[boot-blink_0.8s_infinite] ml-1" />
            )}
          </div>
        </div>

        {bootStage === 1 && (
          <div className="animate-fade-in flex flex-col items-center px-2">
            <h1 className="font-bold text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] text-hud-cyan uppercase mb-1 font-orbitron animate-[glitch_2s_infinite] text-center">
              SYSTEM AUTHENTICATION REQUIRED
            </h1>
            <p className="text-[8px] sm:text-[9px] text-hud-green/50 tracking-[0.15em] mb-5 sm:mb-6">
              BIOMETRIC PROTOCOL MARK-VII // PWA OFFLINE COMPLIANT
            </p>

            {showAccessBtn && (
              <button 
                onClick={initializeSystem} 
                className="group relative px-8 sm:px-10 py-3 sm:py-3.5 border border-hud-cyan text-hud-cyan font-bold tracking-[0.25em] overflow-hidden bg-transparent cursor-pointer font-orbitron text-[11px] sm:text-xs transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,234,0.4)] active:scale-95"
              >
                <span className="relative z-10">ESTABLISH LINK</span>
                <div className="absolute inset-0 bg-hud-cyan/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hud-background p-2.5 sm:p-4 md:p-6 font-mono relative overflow-x-hidden text-[9px] uppercase tracking-wider text-hud-green select-none bg-grid flex flex-col justify-between pb-safe">
      
      <ScanlineOverlay />
      
      {/* Dynamic Cursor Crosshair (Desktop pointer only) */}
      <CustomCrosshair />

      {/* TOP STATUS HEADER BAR (Mobile & Desktop) */}
      <header className="flex items-center justify-between border-b border-hud-green/15 pb-2.5 mb-3 sm:mb-4 px-1 z-20 relative">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
          <span className="font-orbitron font-bold text-[10px] sm:text-xs tracking-[0.25em] text-white">
            JARVIS <span className="text-hud-cyan">// MK-VII</span>
          </span>
          <span className="hidden sm:inline-block text-[7.5px] px-2 py-0.5 border border-hud-green/20 bg-hud-green/[0.04] text-hud-green/70">
            {isStandalone ? "STANDALONE PWA" : "PWA CORE V7.4"}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* PWA Install Button */}
          {canInstallPWA && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-hud-cyan/10 border border-hud-cyan text-hud-cyan text-[8px] font-orbitron font-bold tracking-widest animate-pulse hover:bg-hud-cyan/20 cursor-pointer transition-all active:scale-95"
            >
              <Download size={10} />
              <span>INSTALL PWA</span>
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundMuted(prev => !prev)}
            aria-label="Toggle Voice Audio"
            className="p-1 sm:px-2 sm:py-1 border border-hud-green/20 text-hud-green/70 hover:text-hud-cyan transition-colors cursor-pointer flex items-center gap-1"
          >
            {soundMuted ? <VolumeX size={12} className="text-hud-orange" /> : <Volume2 size={12} />}
            <span className="hidden sm:inline text-[7.5px]">{soundMuted ? "MUTED" : "VOICE"}</span>
          </button>

          {/* Connectivity Status Pill */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 border text-[7.5px] sm:text-[8px] font-bold tracking-widest ${
            isOnline 
              ? "border-hud-cyan/30 bg-hud-cyan/5 text-hud-cyan" 
              : "border-hud-orange/40 bg-hud-orange/10 text-hud-orange animate-pulse"
          }`}>
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            <span>{isOnline ? "ONLINE" : "STANDALONE"}</span>
          </div>
        </div>
      </header>

      {/* MOBILE SECTOR TAB SWITCHER (Visible on Mobile Screens < md) */}
      <div className="md:hidden flex items-center justify-between border border-hud-green/15 bg-black/60 p-1 mb-3 z-20 relative">
        <button
          onClick={() => setActiveMobileTab('core')}
          className={`flex-1 py-1.5 text-center font-orbitron text-[8px] font-bold tracking-widest transition-colors ${
            activeMobileTab === 'core' 
              ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40 shadow-[0_0_10px_rgba(0,255,234,0.3)]' 
              : 'text-hud-green/50 hover:text-hud-green'
          }`}
        >
          CORE
        </button>
        <button
          onClick={() => setActiveMobileTab('radar')}
          className={`flex-1 py-1.5 text-center font-orbitron text-[8px] font-bold tracking-widest transition-colors ${
            activeMobileTab === 'radar' 
              ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40 shadow-[0_0_10px_rgba(0,255,234,0.3)]' 
              : 'text-hud-green/50 hover:text-hud-green'
          }`}
        >
          RADAR/SYS
        </button>
        <button
          onClick={() => setActiveMobileTab('intel')}
          className={`flex-1 py-1.5 text-center font-orbitron text-[8px] font-bold tracking-widest transition-colors ${
            activeMobileTab === 'intel' 
              ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40 shadow-[0_0_10px_rgba(0,255,234,0.3)]' 
              : 'text-hud-green/50 hover:text-hud-green'
          }`}
        >
          INTEL
        </button>
        <button
          onClick={() => setActiveMobileTab('logs')}
          className={`flex-1 py-1.5 text-center font-orbitron text-[8px] font-bold tracking-widest transition-colors ${
            activeMobileTab === 'logs' 
              ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40 shadow-[0_0_10px_rgba(0,255,234,0.3)]' 
              : 'text-hud-green/50 hover:text-hud-green'
          }`}
        >
          LOGS
        </button>
      </div>

      {/* MAIN HUD INTERFACE CONTAINER */}
      <div className="flex-1 w-full relative z-10 flex flex-col justify-center">
        
        {/* DESKTOP LAYOUT (Grid md:grid-cols-12) */}
        <div className="hidden md:grid md:grid-cols-12 md:grid-rows-6 h-full w-full gap-4 lg:gap-5">

          {/* LEFT COLUMN PANEL: Time, Diagnostics & Radar */}
          <div className="md:col-span-3 md:row-span-6 flex flex-col gap-4 lg:gap-5 justify-between">
            <div className="flex flex-col gap-4 lg:gap-5">
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

            {/* Radar Segment */}
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
          <div className="md:col-span-6 md:row-span-6 flex flex-col items-center justify-center min-h-[350px] md:min-h-0 relative">
            {/* Ambient Glow behind reactor core */}
            <div className="absolute w-[360px] h-[360px] bg-hud-cyan/[0.03] rounded-full filter blur-3xl pointer-events-none" />
            
            <SystemRings 
              isListening={isListening} 
              setIsListening={setIsListening} 
              speak={speak} 
              setNews={setNews} 
              setStatus={setStatus}
              onCommandTranscribed={addCommandToHistory}
              isOnline={isOnline}
            />
          </div>

          {/* RIGHT COLUMN PANEL: Stream, Status & Console log */}
          <div className="md:col-span-3 md:row-span-6 flex flex-col gap-4 lg:gap-5 justify-between">
            <div className="flex flex-col gap-3 lg:gap-4">
              {/* System Uplink Status */}
              <div className="flex justify-between items-center border border-hud-green/15 p-3 bg-hud-green/[0.02] relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-green/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-green/30" />
                
                <div className="flex items-center space-x-2 text-hud-green/60 font-bold">
                  <Search size={12} className="text-hud-cyan" />
                  <span>SCAN_MONITOR</span>
                </div>
                <div className="text-hud-green font-bold pl-4">
                  STATUS: <span className={isListening ? "animate-pulse text-hud-cyan" : (status === 'STANDALONE' ? 'text-hud-orange' : 'text-white')}>{status}</span>
                </div>
              </div>

              {/* News Data Hologrid */}
              <div className="max-h-[36vh] overflow-y-auto custom-scrollbar pr-1 relative news-mask">
                <NewsHologrid news={news} />
              </div>
            </div>

            {/* Console history logger */}
            <CommandLog commands={commandHistory} />
          </div>

        </div>

        {/* MOBILE LAYOUT (Active Tab View for Phones - Vertically Centered) */}
        <div className="md:hidden flex-1 flex flex-col justify-center my-auto w-full py-2">
          
          {/* TAB 1: CORE REACTOR (Centered) */}
          {activeMobileTab === 'core' && (
            <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 animate-fade-in w-full">
              <SystemRings 
                isListening={isListening} 
                setIsListening={setIsListening} 
                speak={speak} 
                setNews={setNews} 
                setStatus={setStatus}
                onCommandTranscribed={addCommandToHistory}
                isOnline={isOnline}
              />
            </div>
          )}

          {/* TAB 2: RADAR & SYSTEM ANALYTICS */}
          {activeMobileTab === 'radar' && (
            <div className="flex-1 flex flex-col justify-center gap-3.5 my-auto animate-fade-in w-full">
              <TimeDateDisplay />
              
              <div className="border border-hud-green/10 bg-hud-green/[0.02] p-3 relative flex flex-col items-center">
                <div className="text-[8px] text-hud-green/50 w-full mb-2 tracking-widest font-bold text-left">
                  SECTOR_RADAR_MAP
                </div>
                <RadarDisplay />
              </div>

              <div className="border border-hud-green/10 bg-hud-green/[0.02] p-3 relative">
                <h2 className="text-hud-cyan font-bold mb-2 tracking-[0.2em] font-orbitron flex items-center gap-1.5 text-[8.5px]">
                  <span className="w-1.5 h-1.5 bg-hud-cyan rounded-full animate-ping" />
                  SYSTEM_ANALYTICS
                </h2>
                <StorageStatus />
              </div>
            </div>
          )}

          {/* TAB 3: INTEL & TELEMETRY STREAM */}
          {activeMobileTab === 'intel' && (
            <div className="flex-1 flex flex-col justify-center gap-3.5 my-auto animate-fade-in w-full">
              <div className="flex justify-between items-center border border-hud-green/15 p-2.5 bg-hud-green/[0.02]">
                <div className="flex items-center space-x-2 text-hud-green/60 font-bold">
                  <Search size={11} className="text-hud-cyan" />
                  <span>NEURAL_DATA_STREAM</span>
                </div>
                <div className="text-hud-green font-bold">
                  STATUS: <span className="text-hud-cyan">{status}</span>
                </div>
              </div>
              <div className="max-h-[55vh] overflow-y-auto custom-scrollbar">
                <NewsHologrid news={news} />
              </div>
            </div>
          )}

          {/* TAB 4: CONSOLE LOGS & AUDIO */}
          {activeMobileTab === 'logs' && (
            <div className="flex-1 flex flex-col justify-center gap-3.5 my-auto animate-fade-in w-full">
              <CommandLog commands={commandHistory} />
              <AudioPlayer />
              <div className="bg-hud-green/[0.02] border border-hud-green/10 p-3 relative">
                <SidebarData />
              </div>
            </div>
          )}

        </div>

      </div>

      {/* BOTTOM WIDGET BAR: Music Control & Environment (Desktop & Tablet) */}
      <footer className="hidden md:flex justify-between items-center gap-4 border-t border-hud-green/10 pt-3 mt-3 z-20 relative">
        <div className="flex items-center gap-6">
          <AudioPlayer />
          <div className="flex items-center space-x-2 text-hud-green/60">
            <Settings size={11} className="animate-spin-slow text-hud-cyan" />
            <span>CORE_CONFIGURATION: SYS_MARK_VII // PWA_ENABLED</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="bg-hud-green/[0.02] border border-hud-green/10 p-2 relative">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-hud-green/30" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-hud-green/30" />
            <SidebarData />
          </div>
          
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 border ${
            isOnline 
              ? "border-hud-cyan/20 bg-hud-cyan/5 text-hud-cyan animate-pulse" 
              : "border-hud-orange/30 bg-hud-orange/5 text-hud-orange"
          }`}>
            {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
            <span className="font-bold tracking-widest text-[8px]">
              {isOnline ? "LINK_SECURED" : "OFFLINE_STANDALONE"}
            </span>
          </div>
        </div>
      </footer>

      {/* Bottom Footer Watermark (Desktop only) */}
      <div className="hidden lg:block text-center text-[7px] text-hud-green/20 tracking-[1.5em] pointer-events-none font-mono mt-1">
        JARVIS-MARK-VII-TACTICAL-PWA-LINK-ACTIVE
      </div>

    </div>
  );
}

export default App;