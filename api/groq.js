// Serverless API Function Proxy (Vercel / Netlify compatible - 18 lines)
export default async function handler(req, res) {
  const { messages, model = 'llama-3.3-70b-versatile', temperature = 0.3 } = req.body || {};
  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens: 600 }),
    });

    const data = await groqRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Groq proxy error' });
  }
}
