// Backend proxy server to keep API keys secure
// Run this separately: node server.js
// Uses Google Gemini API

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint that proxies requests to Gemini
app.post('/api/ai-recommendations', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    // Try gemini-1.5-flash-latest (most commonly available free model)
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
    // Use v1beta API (more stable for most models)
    const apiVersion = 'v1beta';
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || 'Gemini API request failed';
      
      // If model not found, provide helpful hint
      if (errorMsg.includes('not found') || errorMsg.includes('not supported')) {
        console.error(`⚠️  Model "${model}" not available. Available models might be: gemini-pro, gemini-1.5-pro, or gemini-1.5-flash-latest`);
        return res.status(response.status).json({ 
          error: errorMsg,
          hint: `Try setting GEMINI_MODEL in .env to one of: gemini-pro, gemini-1.5-pro, gemini-1.5-flash-latest`
        });
      }
      
      return res.status(response.status).json({ 
        error: errorMsg
      });
    }

    const data = await response.json();
    
    // Transform Gemini response to match expected format
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Return in a format compatible with the frontend
    res.json({
      content: [{
        text: text
      }]
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔒 Secure API proxy server running on http://localhost:${PORT}`);
  console.log(`✅ API keys are safely stored on the server`);
});

