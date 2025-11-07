const symbols = {
  btc: "BINANCE:BTCUSDT",
  oro: "OANDA:XAU_EUR",
  sp500: "INDEX:SPX",
  nvda: "NASDAQ:NVDA",
  tsla: "NASDAQ:TSLA",
  aapl: "NASDAQ:AAPL",
  amzn: "NASDAQ:AMZN",
  googl: "NASDAQ:GOOGL",
};

async function fetchData(symbol) {
  try {
    const res = await fetch(`/api/finnhub-proxy?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) {
      console.warn('Fetch error', res.status, symbol);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch exception', err);
    return null;
  }
}

function updateCard(id, data) {
  const card = document.getElementById(id);
  if (!card) return;
  if (!data || data.c === undefined || data.c === null) {
    card.style.backgroundColor = '#444';
    card.innerHTML = id.toUpperCase() + '<br><small>Error</small>';
    return;
  }
  const price = Number(data.c);
  const change = Number(data.d) || 0;
  const changePct = Number(data.dp) || 0;
  card.style.backgroundColor = change >= 0 ? '#006600' : '#8b0000';
  card.innerHTML = id.toUpperCase() + '<br>' + price.toFixed(2) + '<br>' + change.toFixed(2) + ' (' + changePct.toFixed(2) + '%)';
}

async function updateAll() {
  for (const [id, sym] of Object.entries(symbols)) {
    const data = await fetchData(sym);
    updateCard(id, data);
  }
}

updateAll();
setInterval(updateAll, 60000);
