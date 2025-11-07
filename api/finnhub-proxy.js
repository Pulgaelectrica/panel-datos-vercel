// api/finnhub-proxy.js
// WARNING: This file contains a placeholder for the API key.
// Replace the value of FINNHUB_API_KEY below with your real key before deploying,
// or configure FINNHUB_API_KEY as an environment variable in Vercel.

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ error: 'symbol required' });
  }

  // <-- PASTE YOUR FINNHUB API KEY HERE if you prefer it in-file:
  const FINNHUB_API_KEY = 'REPLACE_WITH_YOUR_FINNHUB_API_KEY';

  if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'REPLACE_WITH_YOUR_FINNHUB_API_KEY') {
    return res.status(500).json({ error: 'API key not configured. Set FINNHUB_API_KEY in this file or as an environment variable.' });
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: 'Finnhub error' });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('finnhub proxy error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
