import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/process-command', async (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript) return res.status(400).json({ speech: "I didn't catch that, sir." });

        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are the JARVIS AI from Iron Man. 
                    1. Extract news keywords from user request.
                    2. Return ONLY JSON: { "query": "string", "jarvis_phrase": "string" }.` 
                },
                { role: "user", content: transcript }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);
        const sanitizedQuery = aiResponse.query ? aiResponse.query.replace(/[^\w\s]/gi, '') : 'world news';

        const newsResponse = await axios.get(`https://newsdata.io/api/1/news`, {
            params: {
                apikey: process.env.NEWSDATA_API_KEY,
                q: sanitizedQuery, 
                language: 'en',
            }
        });

        res.json({
            speech: aiResponse.jarvis_phrase || `Data retrieved for ${sanitizedQuery}, sir.`,
            articles: newsResponse.data.results || []
        });

    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({ speech: "Uplink synchronization failure.", articles: [] });
    }
});

app.get('/', (req, res) => res.send("Jarvis Online."));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Jarvis Online on port ${PORT}`));
}

export default app;