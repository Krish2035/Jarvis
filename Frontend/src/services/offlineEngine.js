/**
 * JARVIS MARK VII — OFFLINE NEURAL ENGINE
 * Executes client-side offline command comprehension, intent parsing,
 * knowledge base lookups, mathematical calculations, hardware diagnostics,
 * and telemetry packet generation when remote servers are unreachable.
 */

const JARVIS_QUOTES = [
  "Always at your service, sir. The House Party Protocol remains on standby.",
  "I have run 12,000 algorithmic simulations. In all cases, success probability exceeds 99.4%.",
  "Sometimes you have to run before you can walk, as Mr. Stark once noted.",
  "JARVIS Mark VII operating at peak efficiency. All defense and analytical matrices are synchronized.",
  "Mark VII localized neural core online. Standalone systems running under optimal power distribution."
];

const JOKES = [
  "Why did the AI cross the road? Because it was programmed with an advanced pathfinding algorithm, sir.",
  "I would tell you a joke about UDP, sir, but you might not get it.",
  "A SQL query walks into a bar, walks up to two tables, and asks... 'May I join you, sir?'"
];

// Offline Smart Knowledge Base (Capitals, Geography, Science & Facts)
const OFFLINE_KNOWLEDGE = {
  // Indian States & Capitals
  "gujarat": "Gandhinagar",
  "maharashtra": "Mumbai",
  "rajasthan": "Jaipur",
  "karnataka": "Bengaluru",
  "tamil nadu": "Chennai",
  "kerala": "Thiruvananthapuram",
  "uttar pradesh": "Lucknow",
  "madhya pradesh": "Bhopal",
  "punjab": "Chandigarh",
  "haryana": "Chandigarh",
  "bihar": "Patna",
  "west bengal": "Kolkata",
  "andhra pradesh": "Amaravati",
  "telangana": "Hyderabad",
  "odisha": "Bhubaneswar",
  "assam": "Dispur",
  "goa": "Panaji",
  "delhi": "New Delhi",
  "india": "New Delhi",

  // World Countries & Capitals
  "usa": "Washington, D.C.",
  "united states": "Washington, D.C.",
  "uk": "London",
  "united kingdom": "London",
  "england": "London",
  "france": "Paris",
  "germany": "Berlin",
  "japan": "Tokyo",
  "china": "Beijing",
  "russia": "Moscow",
  "canada": "Ottawa",
  "australia": "Canberra",
  "italy": "Rome",
  "spain": "Madrid",
  "brazil": "Brasília",
  "south africa": "Pretoria",
  "south korea": "Seoul",
  "uae": "Abu Dhabi",
  "dubai": "Abu Dhabi (Capital of UAE)",
  "singapore": "Singapore"
};

// Calculate simple math safely
const tryEvaluateMath = (query) => {
  const clean = query
    .toLowerCase()
    .replace(/what is|calculate|solve|how much is|compute/g, '')
    .replace(/plus/g, '+')
    .replace(/minus/g, '-')
    .replace(/multiplied by|times|into/g, '*')
    .replace(/divided by|divide/g, '/')
    .replace(/x/g, '*')
    .trim();

  // Validate math characters only
  if (/^[0-9+\-*/().\s^%]+$/.test(clean) && /[0-9]/.test(clean)) {
    try {
      // Safe math evaluation with Function
      const sanitized = clean.replace(/[^0-9+\-*/().\s]/g, '');
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return {
          expression: clean,
          value: Number(result.toFixed(4))
        };
      }
    } catch {
      return null;
    }
  }
  return null;
};

// Generate simulated offline HUD news/intel telemetry
const createOfflineTelemetry = (topic, details) => {
  const timestamp = new Date().toISOString();
  return [
    {
      title: `STANDALONE PROTOCOL: ${(topic || 'LOCAL MATRIX').toUpperCase()}`,
      description: details || "Offline neural kernel active. Local cached models operating with sub-millisecond execution.",
      link: "#offline-protocol",
      pubDate: timestamp
    },
    {
      title: "OFFLINE TELEMETRY STREAM",
      description: "Atmospheric and biometric telemetry running locally via hardware sensor array.",
      link: "#offline-sensors",
      pubDate: timestamp
    },
    {
      title: "BIOMETRIC ENCRYPTION [AES-256]",
      description: "Local storage cache validated. PWA offline cache operating in standalone mode.",
      link: "#offline-cache",
      pubDate: timestamp
    }
  ];
};

export const processOfflineCommand = async (transcript) => {
  const text = (transcript || '').trim();
  const lower = text.toLowerCase();

  console.log('[JARVIS OFFLINE ENGINE]: Processing offline command:', text);

  // 1. Geography & Capitals Knowledge Lookup
  if (lower.includes('capital')) {
    for (const [place, capital] of Object.entries(OFFLINE_KNOWLEDGE)) {
      if (lower.includes(place)) {
        const properPlace = place.charAt(0).toUpperCase() + place.slice(1);
        const speech = `The capital of ${properPlace} is ${capital}, sir.`;
        return {
          speech,
          topic: `Geography: ${properPlace}`,
          source: "Offline Knowledge Matrix",
          articles: createOfflineTelemetry(`Geography: ${properPlace}`, speech)
        };
      }
    }
  }

  // 2. Time / Date
  if (lower.includes('time') || lower.includes('clock')) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return {
      speech: `The current local time is ${timeStr}, sir.`,
      topic: "System Clock",
      source: "Offline Core",
      articles: createOfflineTelemetry("Temporal Sync", `Local system clock verified at ${timeStr}.`)
    };
  }

  if (lower.includes('date') || lower.includes('today') || lower.includes('day')) {
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return {
      speech: `Today is ${dateStr}, sir.`,
      topic: "Calendar Matrix",
      source: "Offline Core",
      articles: createOfflineTelemetry("Chronometer", `Date protocol synced: ${dateStr}.`)
    };
  }

  // 3. Battery / Power Status
  if (lower.includes('battery') || lower.includes('power') || lower.includes('charge')) {
    let batteryInfo = "Power level nominal at 98%. Arc reactor discharging at optimal rate.";
    if (typeof navigator !== 'undefined' && navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        const levelPercent = Math.round(battery.level * 100);
        const chargingStatus = battery.charging ? "currently plugged into power uplink" : "discharging on internal cell power";
        batteryInfo = `Device battery is at ${levelPercent} percent, ${chargingStatus}, sir.`;
      } catch {}
    }
    return {
      speech: batteryInfo,
      topic: "Power Diagnostics",
      source: "Offline Core",
      articles: createOfflineTelemetry("Arc Core Power", batteryInfo)
    };
  }

  // 4. Mathematical Evaluation
  const mathResult = tryEvaluateMath(lower);
  if (mathResult) {
    return {
      speech: `The result of ${mathResult.expression} is ${mathResult.value}, sir.`,
      topic: "Quantum Arithmetic",
      source: "Offline Core",
      articles: createOfflineTelemetry("Computation", `Evaluated expression: ${mathResult.expression} = ${mathResult.value}`)
    };
  }

  // 5. System Status & Diagnostics
  if (lower.includes('status') || lower.includes('diagnostic') || lower.includes('system') || lower.includes('check')) {
    const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 8) : 8;
    const onlineStr = navigator.onLine ? "ONLINE (Remote Uplink Available)" : "OFFLINE (Standalone Neural Matrix Active)";
    return {
      speech: `All Mark VII primary subsystems are nominal, sir. Operating with ${cores} hardware cores. Standalone PWA kernel operational.`,
      topic: "System Diagnostics",
      source: "Offline Core",
      articles: createOfflineTelemetry("System Health", `Status: ${onlineStr}. Core hardware threads: ${cores}. Storage cache verified.`)
    };
  }

  // 6. Radar / Scan
  if (lower.includes('radar') || lower.includes('scan') || lower.includes('sector')) {
    return {
      speech: "Initiating 360-degree sector radar sweep, sir. No hostiles or anomalies detected in the immediate perimeter.",
      topic: "Sector Radar",
      source: "Offline Core",
      articles: createOfflineTelemetry("Radar Sweep", "Sector 7 radius 500m scanned. Atmospheric turbulence within safe parameters.")
    };
  }

  // 7. Protocols & Iron Man Lore
  if (lower.includes('mark 7') || lower.includes('mark vii') || lower.includes('protocol')) {
    return {
      speech: "Mark VII Tactical Protocols active, sir. Heads Up Display synchronized with holographic data arrays.",
      topic: "Mark VII Protocol",
      source: "Offline Core",
      articles: createOfflineTelemetry("Mark VII Protocol", "Deployment mode active. Real-time audio waveform and neural sensors online.")
    };
  }

  if (lower.includes('house party') || lower.includes('clean slate')) {
    return {
      speech: "House Party Protocol acknowledged, sir. All autonomous defense units are standing by.",
      topic: "Tactical Defense",
      source: "Offline Core",
      articles: createOfflineTelemetry("House Party Protocol", "Autonomous subroutines standby. Security encryption active.")
    };
  }

  if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('jarvis')) {
    return {
      speech: "I am JARVIS — Just A Rather Very Intelligent System. Operating as your Mark VII tactical holographic interface.",
      topic: "Identity Matrix",
      source: "Offline Core",
      articles: createOfflineTelemetry("Neural Identity", "JARVIS Mark VII: Tactical Artificial Intelligence & Holographic Interface.")
    };
  }

  if (lower.includes('creator') || lower.includes('who made you') || lower.includes('developer') || lower.includes('who created you')) {
    return {
      speech: "I was created and configured by Krish as an advanced tactical Mark VII AI interface, sir.",
      topic: "Origin Protocols",
      source: "Offline Core",
      articles: createOfflineTelemetry("Origin Matrix", "Architect: Krish // Neural Architecture: JARVIS Mark VII")
    };
  }

  if (lower.includes('joke') || lower.includes('funny')) {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
    return {
      speech: joke,
      topic: "Humor Subroutine",
      source: "Offline Core",
      articles: createOfflineTelemetry("Humor Protocol", joke)
    };
  }

  if (lower.includes('quote') || lower.includes('inspire')) {
    const quote = JARVIS_QUOTES[Math.floor(Math.random() * JARVIS_QUOTES.length)];
    return {
      speech: quote,
      topic: "Motivational Matrix",
      source: "Offline Core",
      articles: createOfflineTelemetry("Neural Wisdom", quote)
    };
  }

  if (lower.includes('weather') || lower.includes('temperature') || lower.includes('climate')) {
    return {
      speech: "Atmospheric telemetry is continuously tracked via our local meteorological sensors on the telemetry bar, sir.",
      topic: "Atmospheric Sensors",
      source: "Offline Core",
      articles: createOfflineTelemetry("Atmospheric Analysis", "Atmospheric sensors nominal. Barometric pressure and humidity levels stable.")
    };
  }

  if (lower.includes('help') || lower.includes('command') || lower.includes('what can you do')) {
    return {
      speech: "You can ask for time, state/country capitals, system diagnostics, battery power, math calculations, radar scans, Mark VII protocols, jokes, or news broadcasts, sir.",
      topic: "Instruction Protocol",
      source: "Offline Core",
      articles: [
        {
          title: "OFFLINE CAPABLE COMMANDS",
          description: "• 'What is the capital of Gujarat/India/France'\n• 'System Status' & 'Battery check'\n• 'What time is it' & 'Today's date'\n• 'Calculate 45 * 80'\n• 'Radar scan sector'\n• 'Mark VII Protocol'",
          link: "#commands",
          pubDate: new Date().toISOString()
        }
      ]
    };
  }

  // 8. Fallback Generic Offline Answer
  const fallbackQuote = JARVIS_QUOTES[Math.floor(Math.random() * JARVIS_QUOTES.length)];
  return {
    speech: `Operating in offline standalone mode, sir. I have logged "${text}" into the Mark VII tactical buffer. All local subsystems remain ready.`,
    topic: "Standalone Analysis",
    source: "Offline Core",
    articles: createOfflineTelemetry(
      "Local Buffer",
      `Command transcribed: "${text}". Standalone neural link running locally. ${fallbackQuote}`
    )
  };
};
