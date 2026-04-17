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
    if (!transcript) {
        return res.status(400).json({ speech: "I didn't catch that, sir." });
    }

    console.log("Processing command:", transcript);

    // Phase 1: AI Extract Filters (Using Llama 3 via Groq)
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are the JARVIS AI from Iron Man. 
          1. Extract news keywords from the user's request.
          2. Return ONLY JSON: { "query": "string", "jarvis_phrase": "string" }.
          3. If the user asks for news about a specific city (like Surat) or country (India), set the "query" to that location.
          4. Keep 'jarvis_phrase' professional, witty, and concise.` 
        },
        { role: "user", content: transcript }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    
    // Clean the query: Ensure it's a simple string to avoid 422 errors
    const sanitizedQuery = aiResponse.query ? aiResponse.query.replace(/[^\w\s]/gi, '') : 'world news';

    console.log(`Uplink Request: ${sanitizedQuery}`);

    // Phase 2: Fetch News (Using NewsData.io)
    const newsResponse = await axios.get(`https://newsdata.io/api/1/news`, {
      params: {
        apikey: process.env.NEWSDATA_API_KEY,
        q: sanitizedQuery, 
        language: 'en',
        // Optional: Adding a category filter can stabilize results
        // category: 'top,technology,politics' 
      }
    });

    // Check if we actually got results
    const articles = newsResponse.data.results || [];
    
    // Phase 3: Send Response to Frontend
    res.json({
      speech: aiResponse.jarvis_phrase || `Sir, I have retrieved the latest data packets regarding ${sanitizedQuery}.`,
      articles: articles
    });

  } catch (error) {
    // Detailed error logging to catch the 422 source
    console.error("Jarvis Backend Error:", error.response?.data || error.message);
    
    res.status(500).json({ 
      speech: "My apologies sir, the news uplink is encountering a synchronization error.",
      articles: [],
      error_detail: error.response?.data?.message || "Internal server error"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`----------------------------------------`);
  console.log(`   Jarvis Backend Online: Port ${PORT}  `);
  console.log(`   Satellite Link: Established          `);
  console.log(`----------------------------------------`);
});