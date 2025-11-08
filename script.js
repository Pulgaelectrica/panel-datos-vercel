const symbols = [
    { id: "btc", name: "BINANCE:BTCUSDT", currency: "€" },
    { id: "gold", name: "OANDA:XAU_EUR", currency: "€" },
    { id: "sp500", name: "INDEX:SPX", currency: "$" },
    { id: "nvda", name: "NASDAQ:NVDA", currency: "$" },
    { id: "tsla", name: "NASDAQ:TSLA", currency: "$" },
    { id: "aapl", name: "NASDAQ:AAPL", currency: "$" },
    { id: "amzn", name: "NASDAQ:AMZN", currency: "$" },
    { id: "googl", name: "NASDAQ:GOOGL", currency: "$" }
];

const BASE_URL = "https://panel-datos-vercel-4nuc1rvvm-alfonso-orbans-projects.vercel.app/"; // Reemplaza con tu URL Vercel

async function fetchData(symbol) {
    try {
        const res = await fetch(`${BASE_URL}/api/finnhub-proxy?symbol=${symbol}`);
        if (!res.ok) throw new Error(`Error ${res.status} al obtener ${symbol}`);
        const data = await res.json();
        if (!data || typeof data.c !== "number") return null;
        return data;
    } catch (err) {
        console.error("fetchData error", err);
        return null;
    }
}

async function updateCard(id, symbol, currency) {
    const card = document.getElementById(id);
    if (!card) return;

    const data = await fetchData(symbol);
    const priceElem = card.querySelector(".price");
    const diffElem = card.querySelector(".diff");
    const canvas = card.querySelector(".mini-chart");

    if (!data) {
        priceElem.textContent = "—";
        diffElem.textContent = "Error";
        card.style.background = "#777";
        return;
    }

    const price = data.c.toFixed(2);
    const diff = data.d.toFixed(2);
    const diffPercent = data.dp.toFixed(2);

    priceElem.textContent = `${currency}${price}`;
    diffElem.textContent = `${diff} (${diffPercent}%)`;
    card.style.background = diff >= 0 ? "#005f2f" : "#5f0000";

    // Mini-gráfica
    new Chart(canvas, {
        type: 'line',
        data: { labels:[0,1], datasets:[{label:'', data:[data.pc, data.c], borderColor:'#fff', borderWidth:2, fill:false, tension:0.3}] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{display:false}, y:{display:false}} }
    });
}

async function updateAll() {
    for (const {id, name, currency} of symbols) {
        await updateCard(id, name, currency);
    }
}

updateAll();
setInterval(updateAll, 60000);
