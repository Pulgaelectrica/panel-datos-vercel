import fetch from 'node-fetch';

export default async function handler(req, res) {
    const symbol = req.query.symbol;
    const API_KEY = process.env.FINNHUB_API_KEY;

    if (!symbol) return res.status(400).json({ error: "No se proporcionó símbolo" });
    if (!API_KEY) return res.status(500).json({ error: "API key no configurada" });

    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        if (!response.ok) return res.status(response.status).json({ error: `Finnhub error: ${response.status}` });
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del proxy" });
    }
}
