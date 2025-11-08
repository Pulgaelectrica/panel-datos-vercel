// /api/finnhub-proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { symbol } = req.query;
  const token = process.env.FINNHUB_API_KEY;

  if (!symbol || !token) {
    return res.status(400).json({ error: "Missing symbol or API key" });
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`;
    console.log("➡️ Fetching:", url);

    const response = await fetch(url);
    const text = await response.text();

    console.log("📦 Finnhub raw response for", symbol, ":", text);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Finnhub error: ${response.status}`, body: text });
    }

    const data = JSON.parse(text);

    if (!data || !data.c) {
      return res.status(404).json({ error: "No valid data from Finnhub", data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
}
