async function fetchData(symbol) {
  try {
    const res = await fetch(`/api/finnhub-proxy?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error(`Fetch error ${res.status} ${symbol}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function updateAll() {
  const symbols = [
    "BINANCE:BTCUSDT",
    "OANDA:XAU_EUR",
    "INDEX:SPX",
    "NASDAQ:NVDA",
    "NASDAQ:TSLA",
    "NASDAQ:AAPL",
    "NASDAQ:AMZN",
    "NASDAQ:GOOGL",
  ];

  for (const s of symbols) {
    const data = await fetchData(s);
    const el = document.getElementById(s.replace(/[:]/g, "_"));
    if (data && el && typeof data.c === "number") {
      el.querySelector(".value").textContent = `${data.c.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
      })}`;
      el.style.backgroundColor = data.d >= 0 ? "#2ecc71" : "#e74c3c";
      renderChart(el.querySelector(".chart"), data);
    } else if (el) {
      el.querySelector(".value").textContent = "Error";
      el.style.backgroundColor = "#555";
    }
  }
}

function renderChart(canvas, data) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  const values = [data.o, data.h, data.l, data.c];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const scaleY = canvas.height / (max - min || 1);
  values.forEach((v, i) => {
    const x = (i / (values.length - 1)) * canvas.width;
    const y = canvas.height - (v - min) * scaleY;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

setInterval(updateAll, 15000);
updateAll();


