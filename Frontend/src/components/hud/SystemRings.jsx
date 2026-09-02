import React, { useState } from 'react';
import { Mic, Send, Sparkles, AlertCircle, WifiOff } from 'lucide-react';
import axios from 'axios';
import { processOfflineCommand } from '../../services/offlineEngine';

export const SystemRings = ({ 
  isListening, 
  setIsListening, 
  speak, 
  setNews, 
  setStatus, 
  onCommandTranscribed,
  isOnline = true
}) => {
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick Command Presets for rapid interaction
  const quickCommands = [
    "Capital of Gujarat",
    "System Status",
    "Battery Diagnostic",
    "What time is it",
    "Protocol Mark 7",
    "Jarvis Quote"
  ];

  const handleCommandExecution = async (transcript) => {
    if (!transcript || !transcript.trim()) return;
    const commandText = transcript.trim();
    
    setIsProcessing(true);
    setStatus("ANALYZING...");
    console.log("[JARVIS INSTRUCTION]:", commandText);

    // Update command log history
    if (onCommandTranscribed) {
      onCommandTranscribed(commandText);
    }

    // Try Backend Uplink if online, otherwise use local Offline Neural Matrix
    if (navigator.onLine) {
      // Determine endpoints to try (Vite proxy /api first, direct localhost:5000 second)
      const endpoints = ['/api/process-command'];
      if (import.meta.env.VITE_API_URL) {
        const customUrl = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/process-command`;
        if (!endpoints.includes(customUrl)) {
          endpoints.unshift(customUrl);
        }
      }
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (!endpoints.includes('http://127.0.0.1:5000/api/process-command')) {
          endpoints.push('http://127.0.0.1:5000/api/process-command');
        }
      }

      for (const endpoint of endpoints) {
        try {
          const { data } = await axios.post(endpoint, { transcript: commandText }, { timeout: 7000 });

          if (data && (data.speech || data.answer)) {
            const speechText = data.speech || data.answer;
            setNews(data.articles || []);
            setStatus("ONLINE");
            setIsProcessing(false);
            speak(speechText);
            return;
          }
        } catch (networkErr) {
          console.warn(`[JARVIS UPLINK]: Failed on ${endpoint}:`, networkErr.message);
        }
      }
    }

    // OFFLINE NEURAL MATRIX FALLBACK
    try {
      setStatus("STANDALONE");
      const offlineResult = await processOfflineCommand(commandText);
      setNews(offlineResult.articles || []);
      speak(offlineResult.speech);
      setStatus("STANDALONE");
    } catch (offlineErr) {
      console.error("[JARVIS OFFLINE ERROR]:", offlineErr);
      setStatus("ERROR");
      speak("Sir, local subsystems encountered an unexpected calculation anomaly.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleListen = () => {
    // Trigger subtle haptic feedback on mobile if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. You can type commands in the holographic terminal below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("LISTENING...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleCommandExecution(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus((prev) => prev === "LISTENING..." ? (navigator.onLine ? "ONLINE" : "STANDALONE") : prev);
    };

    recognition.onerror = (event) => {
      console.warn("Speech Error:", event.error);
      setIsListening(false);
      setStatus("ERROR");
      if (event.error === 'not-allowed') {
        speak("Microphone access has been denied, sir. You can type your command in the terminal below.");
      }
    };

    recognition.start();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;
    const cmd = textInput;
    setTextInput('');
    handleCommandExecution(cmd);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto select-none w-full max-w-md mx-auto px-2">
      
      {/* Dynamic ARC Reactor Display - Scaled for Mobile & Desktop */}
      <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 transition-all">
        
        {/* Decorative corner brackets of the reactor core */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-hud-green/40" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-hud-green/40" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-hud-green/40" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-hud-green/40" />

        {/* Ring 1 (Outermost): Custom 3-segment arc rotating reverse */}
        <div 
          className={`absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] border-2 border-hud-green/20 rounded-full transition-all duration-700 ${
            isListening ? 'animate-[spin-slow-reverse_6s_linear_infinite] border-hud-cyan/60 scale-105' : 'animate-spin-slow-reverse'
          }`}
          style={{ clipPath: 'polygon(0 0, 40% 0, 40% 100%, 0% 100%, 100% 100%, 100% 80%, 0 80%)' }} 
        />
        
        {/* Ring 2: Medium speed forward arc */}
        <div 
          className={`absolute w-[200px] h-[200px] sm:w-[256px] sm:h-[256px] border border-dashed border-hud-green/20 rounded-full transition-all duration-700 ${
            isListening ? 'animate-[spin-medium_3s_linear_infinite] border-hud-cyan/50 scale-105' : 'animate-spin-medium'
          }`}
        />

        {/* Ring 3: Solid thin circle with gap */}
        <div 
          className="absolute w-[180px] h-[180px] sm:w-[238px] sm:h-[238px] border border-hud-green/15 rounded-full animate-spin-slow"
          style={{ clipPath: 'polygon(10% 0, 90% 0, 90% 90%, 10% 90%)' }} 
        />

        {/* Ring 4: Solid tech accent rings */}
        <div 
          className={`absolute w-[160px] h-[160px] sm:w-[210px] sm:h-[210px] border-2 border-hud-green-dark/40 rounded-full transition-all duration-500 ${
            isListening ? 'border-hud-cyan/70 scale-95' : ''
          }`}
        />

        {/* Hexagonal inner decorator behind the mic */}
        <svg className="absolute w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] opacity-25 animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
          <polygon 
            points="50,5 90,25 90,75 50,95 10,75 10,25" 
            fill="none" 
            stroke="var(--color-hud-green)" 
            strokeWidth="0.8" 
          />
        </svg>

        {/* Waveform Visualizer: Surrounds the center button */}
        <div className="absolute flex gap-[2.5px] sm:gap-[3px] justify-center items-center h-10 sm:h-12 w-36 sm:w-44 z-10 pointer-events-none">
          <div className={`wave-bar ${isListening ? 'active-1' : 'idle'}`} />
          <div className={`wave-bar ${isListening ? 'active-2' : 'idle'}`} />
          <div className={`wave-bar ${isListening ? 'active-3' : 'idle'}`} />
          <div className={`wave-bar ${isListening ? 'active-4' : 'idle'}`} />
          <div className={`wave-bar ${isListening ? 'active-5' : 'idle'}`} />
          <div className={`wave-bar ${isListening ? 'active-3' : 'idle'}`} />
          <div className={`wave-bar ${isListening ? 'active-2' : 'idle'}`} />
          <div className={`wave-bar ${isListening ? 'active-1' : 'idle'}`} />
        </div>

        {/* Mic Button Core */}
        <button 
          onClick={handleListen}
          disabled={isListening || isProcessing}
          aria-label="Activate Voice Command"
          className={`relative h-34 w-34 sm:h-44 sm:w-44 rounded-full flex items-center justify-center transition-all duration-500 z-20 cursor-pointer active:scale-95 ${
            isListening 
              ? 'bg-hud-cyan border-hud-cyan shadow-[0_0_60px_rgba(0,255,234,0.7)] scale-95' 
              : 'bg-black/95 border-2 border-hud-green-dark hover:border-hud-cyan shadow-[0_0_35px_rgba(0,255,234,0.15)] hover:scale-105'
          }`}
        >
          {/* Inner ring overlay */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border border-hud-green/15 animate-pulse" />
          
          <Mic 
            className={`${isListening ? 'text-black scale-115' : 'text-hud-green group-hover:text-hud-cyan'} transition-all duration-300`} 
            size={32} 
            strokeWidth={1.7}
          />
          
          {/* Pulse Ripple Effect */}
          {isListening && (
            <div className="absolute inset-[-10px] rounded-full animate-[ping_1.8s_ease-in-out_infinite] border border-hud-cyan/60" />
          )}
        </button>
      </div>

      {/* Status Bar */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-[9px] sm:text-[10px] font-black font-orbitron text-hud-green tracking-[0.3em] sm:tracking-[0.4em] uppercase animate-pulse">
          {isListening 
            ? "NEURAL LINK TRANSMITTING" 
            : isProcessing 
              ? "DECODING NEURAL INSTRUCTION..." 
              : !isOnline 
                ? "OFFLINE STANDALONE PROTOCOL READY"
                : "NEURAL UPLINK READY"}
        </p>
        <p className="text-[7.5px] sm:text-[8px] text-hud-green/40 tracking-[0.15em] mt-1 font-mono uppercase flex items-center justify-center gap-1.5">
          {!isOnline ? (
            <span className="text-hud-orange flex items-center gap-1">
              <WifiOff size={9} /> STANDALONE PWA CACHE ACTIVE
            </span>
          ) : (
            <span>BIOMETRIC AUTH: SECURE // MARK-VII</span>
          )}
        </p>
      </div>

      {/* Holographic Text Command Input (Mobile & Desktop Accessible) */}
      <form 
        onSubmit={handleTextSubmit} 
        className="w-full mt-4 sm:mt-5 relative flex items-center border border-hud-green/20 bg-black/60 backdrop-blur-md px-3 py-2 rounded-sm group focus-within:border-hud-cyan transition-colors"
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hud-cyan/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hud-cyan/50" />

        <span className="text-hud-cyan font-bold text-xs mr-2 font-mono">&gt;</span>
        <input 
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={isOnline ? "ENTER COMMAND OR SPEAK..." : "ENTER OFFLINE INSTRUCTION..."}
          className="bg-transparent text-white font-mono text-[9px] sm:text-[10px] tracking-wider uppercase placeholder:text-hud-green/30 outline-none flex-1 w-full"
        />

        <button 
          type="submit" 
          disabled={!textInput.trim() || isProcessing}
          aria-label="Send Command"
          className="text-hud-cyan/70 hover:text-hud-cyan disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-colors cursor-pointer"
        >
          <Send size={12} />
        </button>
      </form>

      {/* Quick Command Chips for Fast Touch on Mobile */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-3 sm:mt-3.5 w-full">
        {quickCommands.map((cmd, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleCommandExecution(cmd)}
            disabled={isProcessing || isListening}
            className="text-[7.5px] font-mono tracking-wider uppercase px-2 py-1 bg-hud-green/[0.04] hover:bg-hud-cyan/15 border border-hud-green/15 hover:border-hud-cyan/40 text-hud-green/70 hover:text-white rounded-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>

    </div>
  );
};