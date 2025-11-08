const symbols = [
  { id: "btc", name: "BINANCE:BTCUSDT", currency: "€" },
  { id: "eth", name: "BINANCE:ETHUSDT", currency: "€" },
  { id: "aapl", name: "AAPL", currency: "$" },
  { id: "tsla", name: "TSLA", currency: "$" },
  { id: "nvda", name: "NVDA", currency: "$" },
  { id: "amzn", name: "AMZN", currency: "$" },
  { id: "googl", name: "GOOGL", currency: "$" },
  { id: "sp500", name: "SPY", currency: "$" }
];

const BASE_URL = "";

async function fetchData(symbol) {
  try {
    const response = await fetch(`${BASE_URL}/api/finnhub-proxy?symbol=${symbol}`);
    if (!response.ok) throw new Error(`Error ${response.status} al obtener ${symbol}`);
    const data = await response.json();
    if (!data || typeof data.c !== "number") return null;
    return data;
  } catch (error) {
    console.error("Error fetchData", error);
    return null;
  }
}

async function updateCard(id, symbol, currency) {
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

  priceElem.textContent = `${currency}${data.c.toFixed(2)}`;
  diffElem.textContent = `${data.d.toFixed(2)} (${data.dp.toFixed(2)}%)`;
  card.style.background = data.d >= 0 ? "#005f2f" : "#5f0000";

  // Mini gráfico simple
  const canvas = card.querySelector("canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = data.d >= 0 ? "#0f0" : "#f00";
    const height = canvas.height * Math.min(Math.abs(data.dp)/10, 1);
    ctx.fillRect(0, canvas.height - height, canvas.width, height);
  }
}

async function updateAll() {
  for (const { id, name, currency } of symbols) {
    await updateCard(id, name, currency);
  }
}

updateAll();
setInterval(updateAll, 60000);

