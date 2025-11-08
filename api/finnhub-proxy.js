// api/finnhub-proxy.js

export default async function handler(req, res) {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: "Missing 'symbol' parameter" });
    }

    const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
    if (!FINNHUB_KEY) {
      return res.status(500).json({ error: "Missing FINNHUB_API_KEY environment variable" });
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Finnhub API error ${response.status}: ${text}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Finnhub proxy error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}
