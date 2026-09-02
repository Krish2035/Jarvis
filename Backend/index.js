import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { generateJarvisResponse, getApiKeys } from './aiEngine.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mock telemetry / fallback packets for HUD
const getContextualTelemetry = (topic, answer) => [
    {
        title: `NEURAL INSIGHT: ${(topic || 'ANALYSIS').toUpperCase()}`,
        description: answer || "Tactical and analytical subsystems nominal. Biometric and neural telemetry streams synchronized.",
        link: "https://groq.com",
        pubDate: new Date().toISOString()
    },
    {
        title: "MARK-VII QUANTUM CORE COMPUTATION",
        description: "Adaptive neural pipelines operating with sub-millisecond latency across encrypted cryptographic nodes.",
        link: "https://huggingface.co",
        pubDate: new Date().toISOString()
    },
    {
        title: "ATMOSPHERIC & SENSOR DATA SYNCED",
        description: "Orbital telemetry and local environmental sensors reporting optimal baseline conditions.",
        link: "https://open-meteo.com",
        pubDate: new Date().toISOString()
    }
];

app.post('/api/process-command', async (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript) {
            return res.status(400).json({ 
                speech: "I didn't catch that, sir. Please repeat your instruction.",
                articles: [] 
            });
        }

        console.log(`\n======================================================`);
        console.log(`[JARVIS COMMAND]: "${transcript}"`);

        // Step 1: Generate comprehensive answer using multi-provider AI Engine (Groq -> HuggingFace -> Local)
        const aiResult = await generateJarvisResponse(transcript);
        console.log(`[AI RESPONSE]: Source: ${aiResult.source} | Topic: ${aiResult.topic}`);
        console.log(`[AI SPEECH]: "${aiResult.answer}"`);

        let articles = [];

        // Step 2: Fetch live news ONLY if explicitly requested by the user
        if (aiResult.needs_news && process.env.NEWSDATA_API_KEY) {
            const newsQuery = (aiResult.news_query || aiResult.topic || 'top news').replace(/[^\w\s]/gi, '').trim();
            const queryToUse = newsQuery || 'world news';

            try {
                const newsResponse = await axios.get('https://newsdata.io/api/1/news', {
                    params: {
                        apikey: process.env.NEWSDATA_API_KEY,
                        q: queryToUse,
                        language: 'en',
                    },
                    timeout: 8000
                });

                if (newsResponse.data && Array.isArray(newsResponse.data.results) && newsResponse.data.results.length > 0) {
                    articles = newsResponse.data.results;
                    console.log(`[NEWSDATA]: Retrieved ${articles.length} articles for query "${queryToUse}"`);
                } else {
                    const broadResponse = await axios.get('https://newsdata.io/api/1/news', {
                        params: {
                            apikey: process.env.NEWSDATA_API_KEY,
                            q: 'world',
                            language: 'en',
                        },
                        timeout: 8000
                    });
                    articles = broadResponse.data?.results || [];
                }
            } catch (newsErr) {
                console.warn(`[NEWSDATA WARNING]: ${newsErr.message}`);
            }
        }

        return res.json({
            speech: aiResult.answer,
            topic: aiResult.topic,
            source: aiResult.source,
            needs_news: Boolean(aiResult.needs_news),
            articles: articles.length > 0 ? articles : getContextualTelemetry(aiResult.topic, aiResult.answer)
        });

    } catch (error) {
        console.error("[BACKEND ERROR]:", error);
        return res.status(200).json({ 
            speech: "My apologies, sir. I encountered a minor telemetry disturbance, but all primary subsystems remain online.", 
            articles: getContextualTelemetry("System Diagnostic", "Neural uplink restored.") 
        });
    }
});

app.get('/api/status', (req, res) => {
    const groqKeys = getApiKeys('groq');
    const hfKeys = getApiKeys('huggingface');

    res.json({
        status: "ONLINE",
        groq_keys_count: groqKeys.length,
        huggingface_keys_count: hfKeys.length,
        newsdata_configured: Boolean(process.env.NEWSDATA_API_KEY),
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => res.send("Jarvis Neural Core Online."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Jarvis Neural Core Online on http://0.0.0.0:${PORT}`));

export default app;