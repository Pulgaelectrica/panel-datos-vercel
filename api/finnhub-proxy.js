// /api/finnhub-proxy.js

import fetch from "node-fetch";

export default async function handler(req, res) {
  const { symbol } = req.query;
  const token = process.env.FINNHUB_API_KEY;

  if (!symbol || !token) {
    return res.status(400).json({ error: "Missing symbol or API key" });
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Finnhub error:", text);
      return res.status(response.status).json({ error: `Finnhub error: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
