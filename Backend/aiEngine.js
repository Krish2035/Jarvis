import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Extracts and deduplicates API keys from environment variables.
 * Supports comma-separated strings (GROQ_API_KEYS=key1,key2)
 * as well as numbered keys (GROQ_API_KEY_1, GROQ_API_KEY_2) and legacy single keys.
 */
export function getApiKeys(provider) {
    const keys = [];
    const env = process.env;

    const isPlaceholder = (k) => {
        if (!k || typeof k !== 'string') return true;
        const trimmed = k.trim();
        return (
            trimmed.length < 8 ||
            trimmed.includes('your_') ||
            trimmed.includes('placeholder') ||
            trimmed.includes('xxx')
        );
    };

    if (provider === 'groq') {
        const groqVars = [env.GROQ_API_KEYS, env.GROQ_API_KEY];
        for (let i = 1; i <= 10; i++) {
            if (env[`GROQ_API_KEY_${i}`]) groqVars.push(env[`GROQ_API_KEY_${i}`]);
        }
        for (const v of groqVars) {
            if (v) {
                const parts = v.split(',').map(s => s.trim());
                for (const p of parts) {
                    if (!isPlaceholder(p) && !keys.includes(p)) keys.push(p);
                }
            }
        }
    } else if (provider === 'huggingface') {
        const hfVars = [
            env.HUGGINGFACE_API_KEYS,
            env.HUGGINGFACE_API_KEY,
            env.HF_API_KEY,
            env.HF_TOKEN,
            env.HF_API_KEYS
        ];
        for (let i = 1; i <= 10; i++) {
            if (env[`HUGGINGFACE_API_KEY_${i}`]) hfVars.push(env[`HUGGINGFACE_API_KEY_${i}`]);
            if (env[`HF_TOKEN_${i}`]) hfVars.push(env[`HF_TOKEN_${i}`]);
        }
        for (const v of hfVars) {
            if (v) {
                const parts = v.split(',').map(s => s.trim());
                for (const p of parts) {
                    if (!isPlaceholder(p) && !keys.includes(p)) keys.push(p);
                }
            }
        }
    }

    return keys;
}

const SYSTEM_PROMPT = `You are JARVIS, Tony Stark's highly intelligent and sophisticated AI assistant.
Your goal is to answer ANY user question, request, or command accurately, directly, and satisfactorily.

RULES:
1. Answer the question directly, intelligently, and clearly.
   - Example Question: "What is the capital of Gujarat?" -> Answer: "The capital of Gujarat is Gandhinagar, sir."
   - Example Question: "Who is the President of the United States?" -> Answer factual, current info.
   - Example Question: "Calculate 15 * 8" -> Answer: "15 multiplied by 8 is 120, sir."
2. Set "needs_news": true ONLY if the user specifically asks for news, headlines, recent market updates, or current events.
   For all other factual/general questions, set "needs_news": false and "news_query": "".
3. Tone: Refined, concise, respectful (address user as "sir"). Keep spoken text natural and avoid markdown or bullet points.
4. Output strict JSON with schema:
{
  "answer": "Direct spoken answer string",
  "needs_news": false,
  "news_query": "",
  "topic": "Brief 2-3 word topic"
}`;

/**
 * Intelligent local knowledge fallback parser when external LLMs are unreachable
 */
function localIntelligenceFallback(transcript) {
    const raw = (transcript || '').toLowerCase().trim();

    // Check for capitals / geography questions
    if (/capital of (?:the )?gujarat/i.test(raw)) {
        return {
            answer: "The capital of Gujarat is Gandhinagar, sir.",
            needs_news: false,
            news_query: '',
            topic: 'Geography: Gujarat',
            source: 'Local Neural Core'
        };
    }
    if (/capital of (?:the )?india/i.test(raw)) {
        return {
            answer: "The capital of India is New Delhi, sir.",
            needs_news: false,
            news_query: '',
            topic: 'Geography: India',
            source: 'Local Neural Core'
        };
    }
    if (/capital of (?:the )?france/i.test(raw)) {
        return {
            answer: "The capital of France is Paris, sir.",
            needs_news: false,
            news_query: '',
            topic: 'Geography: France',
            source: 'Local Neural Core'
        };
    }
    if (/capital of (?:the )?japan/i.test(raw)) {
        return {
            answer: "The capital of Japan is Tokyo, sir.",
            needs_news: false,
            news_query: '',
            topic: 'Geography: Japan',
            source: 'Local Neural Core'
        };
    }

    // Check for math queries
    const mathMatch = raw.match(/(?:what is|calculate|compute|solve)?\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/xX]|plus|minus|times|multiplied by|divided by)\s*(\d+(?:\.\d+)?)/i);
    if (mathMatch) {
        const num1 = parseFloat(mathMatch[1]);
        const op = mathMatch[2].toLowerCase();
        const num2 = parseFloat(mathMatch[3]);
        let result;
        if (op === '+' || op === 'plus') result = num1 + num2;
        else if (op === '-' || op === 'minus') result = num1 - num2;
        else if (op === '*' || op === 'x' || op === 'times' || op === 'multiplied by') result = num1 * num2;
        else if (op === '/' || op === 'divided by') result = num2 !== 0 ? (num1 / num2).toFixed(2) : 'undefined';
        
        return {
            answer: `The calculated result is ${result}, sir.`,
            needs_news: false,
            news_query: '',
            topic: 'Mathematical Computation',
            source: 'Local Neural Core'
        };
    }

    // Standard conversational queries
    if (/who are you|what is your name/i.test(raw)) {
        return {
            answer: "I am JARVIS, your Just A Rather Very Intelligent System. All tactical and analytical interfaces are online and operating at peak performance.",
            needs_news: false,
            news_query: '',
            topic: 'Identity Diagnostics',
            source: 'Local Neural Core'
        };
    }

    if (/who created you|who made you/i.test(raw)) {
        return {
            answer: "I was engineered by Tony Stark as a high-performance neural assistant to manage data analysis, interface telemetry, and global operations.",
            needs_news: false,
            news_query: '',
            topic: 'System Provenance',
            source: 'Local Neural Core'
        };
    }

    if (/^(good morning|morning|wake up|rise and shine)/i.test(raw)) {
        return {
            answer: "Good morning, sir. All core diagnostics are nominal and atmospheric sensors are calibrated.",
            needs_news: false,
            news_query: '',
            topic: 'Morning Greeting',
            source: 'Local Neural Core'
        };
    }

    if (/^(good afternoon|good evening|hello|hi jarvis|hey jarvis)/i.test(raw)) {
        return {
            answer: "Good day, sir. Systems are online and ready for your command. How may I assist you today?",
            needs_news: false,
            news_query: '',
            topic: 'System Uplink Ready',
            source: 'Local Neural Core'
        };
    }

    // Check for explicit news requests ONLY
    const isExplicitNews = /\b(news|headline|headlines|latest news|top news|daily news)\b/i.test(raw);
    if (isExplicitNews) {
        let clean = raw
            .replace(/^(jarvis|hey jarvis|ok jarvis|please|can you|could you)\s+/gi, '')
            .replace(/\b(tell me the news about|tell me news about|tell me about|tell me|show me the news about|show me news about|show me|search for|find me|give me|what is happening with|what are the updates on|what's the news about|what is the news about|news about|news on|latest news on|latest news about|latest on|news regarding|updates on|info on|information about)\b/gi, ' ')
            .replace(/\b(today|now|please|sir|latest|current|recent|updates|update|news)\b/gi, ' ')
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (!clean || clean.length < 2) clean = 'world news';

        return {
            answer: `Accessing global intelligence dispatches regarding ${clean}, sir.`,
            needs_news: true,
            news_query: clean,
            topic: `News: ${clean.toUpperCase()}`,
            source: 'Local Neural Core'
        };
    }

    return {
        answer: `I have analyzed your query regarding "${transcript}", sir. Please configure your Groq or HuggingFace API key in the backend for deeper answers.`,
        needs_news: false,
        news_query: '',
        topic: 'General Inquiry',
        source: 'Local Neural Core'
    };
}

/**
 * Executes a question through Groq with auto-rotation through all available Groq keys
 */
async function tryGroq(groqKeys, transcript) {
    const models = [
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "groq/compound-mini"
    ];

    for (let i = 0; i < groqKeys.length; i++) {
        const apiKey = groqKeys[i];
        console.log(`[AI ENGINE]: Attempting Groq API Key [${i + 1}/${groqKeys.length}]...`);

        for (const model of models) {
            try {
                const groq = new Groq({ apiKey });
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: transcript }
                    ],
                    model: model,
                    response_format: { type: "json_object" }
                });

                const content = completion.choices[0]?.message?.content || '';
                // Clean any thinking or reasoning tokens if present
                const cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                const parsed = JSON.parse(cleanedContent);

                console.log(`[AI ENGINE]: Groq success using key #${i + 1} with model ${model}`);
                return {
                    answer: parsed.answer || parsed.jarvis_phrase || parsed.speech,
                    needs_news: Boolean(parsed.needs_news),
                    news_query: parsed.news_query || parsed.query || '',
                    topic: parsed.topic || 'Analysis',
                    source: `Groq (${model})`
                };
            } catch (err) {
                console.warn(`[AI ENGINE]: Groq Key #${i + 1} with ${model} failed: ${err.message}`);
                if (err.status === 401 || err.message.includes('401') || err.message.includes('invalid_api_key')) {
                    break;
                }
            }
        }
    }
    return null;
}

/**
 * Executes a question through Hugging Face Inference with auto-rotation through HF keys
 */
async function tryHuggingFace(hfKeys, transcript) {
    const models = [
        "Qwen/Qwen2.5-72B-Instruct",
        "mistralai/Mistral-7B-Instruct-v0.3",
        "meta-llama/Llama-3.2-3B-Instruct"
    ];

    for (let i = 0; i < hfKeys.length; i++) {
        const apiKey = hfKeys[i];
        console.log(`[AI ENGINE]: Attempting HuggingFace API Key [${i + 1}/${hfKeys.length}]...`);

        const hf = new HfInference(apiKey);

        for (const model of models) {
            try {
                const response = await hf.chatCompletion({
                    model: model,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: transcript }
                    ],
                    max_tokens: 400,
                    temperature: 0.7
                });

                const content = response.choices?.[0]?.message?.content || '';
                console.log(`[AI ENGINE]: HuggingFace raw output received from ${model}`);

                let parsed = null;
                try {
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        parsed = JSON.parse(jsonMatch[0]);
                    } else {
                        parsed = JSON.parse(content);
                    }
                } catch {
                    parsed = {
                        answer: content.replace(/```json|```/g, '').trim(),
                        needs_news: /\b(news|headline|headlines|latest news)\b/i.test(transcript),
                        news_query: '',
                        topic: 'Neural Intelligence'
                    };
                }

                return {
                    answer: parsed.answer || parsed.jarvis_phrase || content,
                    needs_news: Boolean(parsed.needs_news),
                    news_query: parsed.news_query || '',
                    topic: parsed.topic || 'HuggingFace Intelligence',
                    source: `HuggingFace (${model})`
                };
            } catch (err) {
                console.warn(`[AI ENGINE]: HuggingFace Key #${i + 1} with ${model} failed: ${err.message}`);
                if (err.message.includes('401') || err.message.includes('Invalid token') || err.message.includes('unauthorized')) {
                    break;
                }
            }
        }
    }
    return null;
}

/**
 * Main AI Engine dispatcher:
 * 1. Checks all Groq Keys (with auto-failover)
 * 2. Checks all HuggingFace Keys (with auto-failover)
 * 3. Falls back to Local Neural Core if all remote keys fail
 */
export async function generateJarvisResponse(transcript) {
    const groqKeys = getApiKeys('groq');
    const hfKeys = getApiKeys('huggingface');

    console.log(`[AI ENGINE]: Active keys -> Groq: ${groqKeys.length}, HuggingFace: ${hfKeys.length}`);

    // 1. Try Groq Keys
    if (groqKeys.length > 0) {
        const groqResult = await tryGroq(groqKeys, transcript);
        if (groqResult && groqResult.answer) {
            return groqResult;
        }
    }

    // 2. Try Hugging Face Keys
    if (hfKeys.length > 0) {
        const hfResult = await tryHuggingFace(hfKeys, transcript);
        if (hfResult && hfResult.answer) {
            return hfResult;
        }
    }

    // 3. Fallback to Local Intelligence Core
    console.log(`[AI ENGINE]: Engaging Local Neural Intelligence Engine.`);
    return localIntelligenceFallback(transcript);
}
