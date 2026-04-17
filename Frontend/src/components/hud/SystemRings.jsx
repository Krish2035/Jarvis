import { Mic } from 'lucide-react';
import axios from 'axios';

export const SystemRings = ({ isListening, setIsListening, speak, setNews, setStatus }) => {
  
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
      // Optional: A shorter, non-intrusive sound or silence so he doesn't talk over you
      // speak("Listening."); 
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setStatus("ANALYZING...");
      console.log("User said:", transcript);
      
      try {
        // Post to your backend
        const { data } = await axios.post('http://localhost:5000/api/process-command', { 
          transcript 
        });
        
        // 1. Update the Right-Side News Panel
        setNews(data.articles || []);
        
        // 2. Update Status
        setStatus("ONLINE");

        // 3. JARVIS SPEAKS: Clear previous speech and say the answer
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
      // If status wasn't changed by onresult/onerror, reset it
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
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Outer HUD Rings */}
        <div 
          className="absolute inset-[-25px] border-2 border-hud-green/20 rounded-full animate-[spin_12s_linear_infinite]" 
          style={{ clipPath: 'polygon(0 0, 30% 0, 30% 100%, 0% 100%)' }} 
        />
        <div 
          className="absolute inset-[-40px] border border-hud-green/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" 
          style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 70% 100%)' }} 
        />
        
        {/* Mic Button Core */}
        <button 
          onClick={handleListen}
          disabled={isListening}
          className={`relative h-56 w-56 rounded-full flex items-center justify-center transition-all duration-700 z-20 ${
            isListening 
              ? 'bg-hud-green shadow-[0_0_100px_rgba(0,255,234,0.7)] scale-110' 
              : 'bg-black/80 border-2 border-hud-green-dark hover:border-hud-green shadow-[0_0_30px_rgba(0,255,234,0.2)]'
          }`}
        >
          <div className="absolute inset-4 rounded-full border border-hud-green/10 animate-pulse" />
          
          <Mic 
            className={`${isListening ? 'text-black scale-125' : 'text-hud-green'} transition-all duration-500`} 
            size={60} 
            strokeWidth={1.5}
          />
          
          {isListening && (
            <div className="absolute inset-[-10px] rounded-full animate-[ping_1.5s_ease-in-out_infinite] border-2 border-hud-green/40"></div>
          )}
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[11px] font-bold text-hud-green tracking-[0.6em] uppercase animate-pulse">
          {isListening ? "Neural Uplink Active" : "Neural Link Standby"}
        </p>
        <p className="text-[8px] text-hud-green/30 tracking-[0.2em] mt-2 italic font-mono uppercase">
          Biometric Authorization: Verified
        </p>
      </div>
    </div>
  );
};