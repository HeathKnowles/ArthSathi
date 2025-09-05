import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import path from 'path';


const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// In-memory portfolio for demo
let portfolio: Record<string, number> = {};
let cash = 100000;
const STATIC_PRICES: Record<string, number> = {
  RELIANCE: 2500,
  TCS: 3700,
  INFY: 1450,
  HDFCBANK: 1600,
  SBIN: 600,
};

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Missing question' });
  // Get embedding for question using Mistral API
  const mistralApiKey = process.env.MISTRAL_API_KEY;
  if (!mistralApiKey) return res.status(500).json({ error: 'Missing Mistral API key' });
  const embedRes = await axios.post(
    'https://api.mistral.ai/v1/embeddings',
    {
      model: 'mistral-embed',
      input: question,
    },
    {
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const queryEmbedding = embedRes.data.data[0].embedding;
  // Load all chunks and embeddings from local file (ESM)
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const embeddingsPath = path.join(__dirname, 'embeddings.json');
  const allChunks = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8'));
  // Cosine similarity function
  function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  // Find top 5 most similar chunks
const scored = allChunks.map((obj: any) => ({
  ...obj,
  score: cosineSimilarity(queryEmbedding, obj.embedding)
}));
scored.sort((a: any, b: any) => b.score - a.score);
const topChunks = scored.slice(0, 5).map((obj: any) => obj.chunk);
  const contexts = topChunks.join('\n');
    console.log('Mistral context:', contexts);
  // Send to Ollama for answer
  const prompt = `Answer the question using only the following context from PDFs:\n${contexts}\nQuestion: ${question}`;
  const answerRes = await axios.post(
    'https://api.mistral.ai/v1/chat/completions',
    {
      model: 'mistral-large',
      messages: [
        { role: 'system', content: 'You are a helpful financial assistant.' },
        { role: 'user', content: prompt },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
    console.log('Mistral response:', answerRes.data);
  res.json({ answer: answerRes.data.choices[0].message.content });
});

app.post('/buy', (req, res) => {
  const { symbol, quantity } = req.body;
  const price = STATIC_PRICES[symbol?.toUpperCase()];
  if (!symbol || !quantity || !price) return res.status(400).json({ error: 'Invalid input' });
  const cost = price * quantity;
  if (cost > cash) return res.status(400).json({ error: 'Insufficient funds' });
  cash -= cost;
  portfolio[symbol.toUpperCase()] = (portfolio[symbol.toUpperCase()] || 0) + quantity;
  res.json({ cash, portfolio });
});

app.post('/sell', (req, res) => {
  const { symbol, quantity } = req.body;
  const price = STATIC_PRICES[symbol?.toUpperCase()];
  if (!symbol || !quantity || !price) return res.status(400).json({ error: 'Invalid input' });
  if ((portfolio[symbol.toUpperCase()] || 0) < quantity) return res.status(400).json({ error: 'Not enough shares' });
  cash += price * quantity;
  portfolio[symbol.toUpperCase()] -= quantity;
  res.json({ cash, portfolio });
});

app.get('/portfolio', (req, res) => {
  res.json({ cash, portfolio });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
