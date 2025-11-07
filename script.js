// script.js — versión funcional solo con símbolos que Finnhub permite en plan gratuito

const symbols = [
  { id: "btc", name: "BINANCE:BTCUSDT", label: "Bitcoin (BTC)" },
  { id: "nvda", name: "NASDAQ:NVDA", label: "NVIDIA" },
  { id: "tsla", name: "NASDAQ:TSLA", label: "Tesla" },
  { id: "aapl", name: "NASDAQ:AAPL", label: "Apple" },
  { id: "amzn", name: "NASDAQ:AMZN", label: "Amazon" },
  { id: "googl", name: "NASDAQ:GOOGL", label: "Google" },
  { id: "meta", name: "NASDAQ:META", label: "Meta" }
];

const BASE_URL = "https://panel-datos-vercel-git-main-alfonso-orbans-projects.vercel.app";

async function fetchData(symbol) {
  try {
    const res = await fetch(`${BASE_URL}/api/finnhub-proxy?symbol=${symbol}`);
    if (!res.ok) throw new Error(`Error ${res.status} en ${symbol}`);
    const data = await res.json();
    if (!data || typeof data.c !== "number") throw new Error("Datos inválidos");
    return data;
  } catch (err) {
    console.error("fetchData error:", err.message);
    return null;
  }
}

async function updateCard(id, symbol, label) {
  const card = document.getElementById(id);
  if (!card) return;

  const data = await fetchData(symbol);
  const priceElem = card.querySelector(".price");
  const diffElem = card.querySelector(".diff");
  const labelElem = card.querySelector(".label");

  labelElem.textContent = label;

  if (!data) {
    priceElem.textContent = "—";
    diffElem.textContent = "Sin datos";
    card.style.background = "#555";
    return;
  }

  const price = data.c.toFixed(2);
  const diff = data.d?.toFixed(2) ?? 0;
  const diffPercent = data.dp?.toFixed(2) ?? 0;

  priceElem.textContent = `${price} €`;
  diffElem.textContent = `${diff >= 0 ? "+" : ""}${diff} (${diffPercent}%)`;

  card.style.background = diff >= 0 ? "#005f2f" : "#5f0000";
}

async function updateAll() {
  for (const s of symbols) {
    await updateCard(s.id, s.name, s.label);
  }
}

updateAll();
setInterval(updateAll, 60000);
