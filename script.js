// script.js — versión completa, en euros y con mini gráficas

const symbols = [
  { id: "btc", name: "BINANCE:BTCUSDT", label: "Bitcoin" },
  { id: "gold", name: "OANDA:XAU_USD", label: "Oro" },
  { id: "sp500", name: "INDEX:SPX", label: "S&P 500" },
  { id: "nvda", name: "NASDAQ:NVDA", label: "NVIDIA" },
  { id: "tsla", name: "NASDAQ:TSLA", label: "Tesla" },
  { id: "aapl", name: "NASDAQ:AAPL", label: "Apple" },
  { id: "amzn", name: "NASDAQ:AMZN", label: "Amazon" },
  { id: "googl", name: "NASDAQ:GOOGL", label: "Google" }
];

// URL base del proyecto
const BASE_URL = "https://panel-datos-vercel-git-main-alfonso-orbans-projects.vercel.app";

// --- Obtener tipo de cambio EUR/USD ---
async function getEurUsd() {
  try {
    const res = await fetch(`${BASE_URL}/api/finnhub-proxy?symbol=OANDA:EUR_USD`);
    const data = await res.json();
    if (data && data.c) return 1 / data.c; // convierte de USD a EUR
  } catch (e) {
    console.warn("Fallo EUR/USD:", e);
  }
  return 0.92; // valor de respaldo
}

async function fetchData(symbol) {
  try {
    const response = await fetch(`${BASE_URL}/api/finnhub-proxy?symbol=${symbol}`);
    if (!response.ok) throw new Error(`Error ${response.status} al obtener ${symbol}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetchData", error);
    return null;
  }
}

async function updateCard(id, symbol, label, eurRate) {
  const card = document.getElementById(id);
  if (!card) return;

  const priceElem = card.querySelector(".price");
  const diffElem = card.querySelector(".diff");
  const canvas = card.querySelector("canvas");

  const data = await fetchData(symbol);
  if (!data || typeof data.c !== "number") {
    priceElem.textContent = "—";
    diffElem.textContent = "Error";
    card.style.background = "#555";
    return;
  }

  const priceEur = data.c * eurRate;
  const diffEur = data.d * eurRate;
  const diffPercent = data.dp;

  priceElem.textContent = `${priceEur.toFixed(2)} €`;
  diffElem.textContent = `${diffEur.toFixed(2)} € (${diffPercent.toFixed(2)}%)`;
  card.style.background = diffEur >= 0 ? "#004d1a" : "#660000";

  // Mini gráfica simulada
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = diffEur >= 0 ? "#00ff66" : "#ff5555";
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const y = 25 - Math.sin(i / 2) * (diffEur >= 0 ? 8 : -8);
    const x = (canvas.width / 10) * i;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
}

async function updateAll() {
  const eurRate = await getEurUsd();
  for (const { id, name, label } of symbols) {
    await updateCard(id, name, label, eurRate);
  }
}

updateAll();
setInterval(updateAll, 60000);
