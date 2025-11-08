// api/finnhub-proxy.js
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
      return res.status(response.status).json({ error: `Finnhub error: ${text}` });
    }

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: "No data returned for symbol" });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
}
