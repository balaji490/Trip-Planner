// Local Express Backend Proxy Server (19 lines)
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/groq', async (req, res) => {
  const { messages, model = 'llama-3.3-70b-versatile', temperature = 0.3 } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens: 600 }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Way Finder API proxy running on http://localhost:${PORT}`));
