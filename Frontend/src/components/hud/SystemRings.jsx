import React from 'react';
import { Mic } from 'lucide-react';
import axios from 'axios';

export const SystemRings = ({ isListening, setIsListening, speak, setNews, setStatus, onCommandTranscribed }) => {
  
  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
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

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setStatus("ANALYZING...");
      console.log("User said:", transcript);
      
      // Update command log history
      if (onCommandTranscribed) {
        onCommandTranscribed(transcript);
      }

      try {
        // Post to backend
        const { data } = await axios.post('http://localhost:5000/api/process-command', { 
          transcript 
        });
        
        // Update news panels
        setNews(data.articles || []);
        
        // Reset status
        setStatus("ONLINE");

        // Synthesize voice
        if (data.speech) {
          speak(data.speech); 
        } else {
          speak("I have updated the holographic grid with the requested data, sir.");
        }
        
      } catch (err) {
        console.error("Backend Connection Failed:", err);
        setStatus("ERROR");
        speak("Sir, I'm having trouble reaching the local server. Please check the backend console.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus((prev) => prev === "LISTENING..." ? "ONLINE" : prev);
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
      setStatus("ERROR");
      if(event.error === 'not-allowed') {
        speak("Sir, microphone access has been denied.");
      }
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative flex items-center justify-center w-72 h-72">
        
        {/* Decorative corner brackets of the reactor core */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-hud-green/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-hud-green/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-hud-green/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-hud-green/30" />

        {/* Ring 1 (Outermost): Custom 3-segment arc rotating reverse */}
        <div 
          className={`absolute w-[280px] h-[280px] border-2 border-hud-green/20 rounded-full transition-all duration-700 ${
            isListening ? 'animate-[spin-slow-reverse_6s_linear_infinite] border-hud-cyan/50 scale-105' : 'animate-spin-slow-reverse'
          }`}
          style={{ clipPath: 'polygon(0 0, 40% 0, 40% 100%, 0% 100%, 100% 100%, 100% 80%, 0 80%)' }} 
        />
        
        {/* Ring 2: Medium speed forward arc */}
        <div 
          className={`absolute w-[256px] h-[256px] border border-dashed border-hud-green/20 rounded-full transition-all duration-700 ${
            isListening ? 'animate-[spin-medium_3s_linear_infinite] border-hud-cyan/40 scale-105' : 'animate-spin-medium'
          }`}
        />

        {/* Ring 3: Solid thin circle with gap */}
        <div 
          className="absolute w-[238px] h-[238px] border border-hud-green/10 rounded-full animate-spin-slow"
          style={{ clipPath: 'polygon(10% 0, 90% 0, 90% 90%, 10% 90%)' }} 
        />

        {/* Ring 4: Solid tech accent rings */}
        <div 
          className={`absolute w-[210px] h-[210px] border-2 border-hud-green-dark/40 rounded-full transition-all duration-500 ${
            isListening ? 'border-hud-cyan/60 scale-95' : ''
          }`}
        />

        {/* Hexagonal inner decorator behind the mic */}
        <svg className="absolute w-[180px] h-[180px] opacity-25 animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
          <polygon 
            points="50,5 90,25 90,75 50,95 10,75 10,25" 
            fill="none" 
            stroke="var(--color-hud-green)" 
            strokeWidth="0.8" 
          />
        </svg>

        {/* Waveform Visualizer: Surrounds the center button */}
        <div className="absolute flex gap-[3px] justify-center items-center h-12 w-44 z-10 pointer-events-none">
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
          disabled={isListening}
          className={`relative h-44 w-44 rounded-full flex items-center justify-center transition-all duration-700 z-20 cursor-pointer ${
            isListening 
              ? 'bg-hud-cyan border-hud-cyan shadow-[0_0_80px_rgba(0,255,234,0.6)] scale-90' 
              : 'bg-black/95 border-2 border-hud-green-dark hover:border-hud-cyan shadow-[0_0_40px_rgba(0,255,234,0.15)] hover:scale-105'
          }`}
        >
          {/* Inner ring overlay */}
          <div className="absolute inset-3 rounded-full border border-hud-green/10 animate-pulse" />
          
          <Mic 
            className={`${isListening ? 'text-black scale-110' : 'text-hud-green group-hover:text-hud-cyan'} transition-all duration-500`} 
            size={40} 
            strokeWidth={1.5}
          />
          
          {/* Pulse Ripple Effect */}
          {isListening && (
            <div className="absolute inset-[-12px] rounded-full animate-[ping_1.8s_ease-in-out_infinite] border border-hud-cyan/50" />
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] font-black font-orbitron text-hud-green tracking-[0.4em] uppercase animate-pulse">
          {isListening ? "NEURAL LINK TRANSMITTING" : "NEURAL UPLINK READY"}
        </p>
        <p className="text-[8px] text-hud-green/30 tracking-[0.15em] mt-1.5 font-mono uppercase">
          BIOMETRIC AUTH: SECURE // LVL_7
        </p>
      </div>
    </div>
  );
};