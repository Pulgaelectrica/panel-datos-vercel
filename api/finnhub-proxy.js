export default async function handler(req, res) {
  const symbol = req.query.symbol || 'AAPL';
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'No API key found' });
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Finnhub error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
