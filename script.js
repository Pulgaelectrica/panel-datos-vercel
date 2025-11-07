// script.js — versión robusta y optimizada

const symbols = [
  { id: "btc", name: "BINANCE:BTCUSDT" },
  { id: "gold", name: "OANDA:XAU_EUR" },
  { id: "sp500", name: "INDEX:SPX" },
  { id: "nvda", name: "NASDAQ:NVDA" },
  { id: "tsla", name: "NASDAQ:TSLA" },
  { id: "aapl", name: "NASDAQ:AAPL" },
  { id: "amzn", name: "NASDAQ:AMZN" },
  { id: "googl", name: "NASDAQ:GOOGL" }
];

// URL base de tu proyecto Vercel
const BASE_URL = "https://panel-datos-vercel-git-main-alfonso-orbans-projects.vercel.app";

async function fetchData(symbol) {
  try {
    const response = await fetch(`${BASE_URL}/api/finnhub-proxy?symbol=${symbol}`);
    if (!response.ok) throw new Error(`Error ${response.status} al obtener ${symbol}`);
    const data = await response.json();

    // Validar campos esperados
    if (!data || typeof data.c !== "number") {
      console.warn(`Datos inválidos para ${symbol}`, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetchData", error);
    return null;
  }
}

async function updateCard(id, symbol) {
  const card = document.getElementById(id);
  if (!card) return;

  const data = await fetchData(symbol);

  const priceElem = card.querySelector(".price");
  const diffElem = card.querySelector(".diff");

  if (!data) {
    priceElem.textContent = "—";
    diffElem.textContent = "Error";
    card.style.background = "#777";
    return;
  }

  const price = data.c.toFixed(2);
  const diff = data.d.toFixed(2);
  const diffPercent = data.dp.toFixed(2);

  priceElem.textContent = `${price}`;
  diffElem.textContent = `${diff} (${diffPercent}%)`;

  card.style.background = diff >= 0 ? "#005f2f" : "#5f0000";
}

async function updateAll() {
  for (const { id, name } of symbols) {
    await updateCard(id, name);
  }
}

// Actualiza al cargar y cada 60 segundos
updateAll();
setInterval(updateAll, 60000);

