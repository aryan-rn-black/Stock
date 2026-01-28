/* ------------------ STOCK DATA ------------------ */
const STOCKS = {
  TCS: { price: 3500, pros: "Strong fundamentals", cons: "Slow growth" },
  RELIANCE: { price: 2500, pros: "Diversified business", cons: "High debt" },
  INFY: { price: 1600, pros: "Global clients", cons: "Currency risk" },
};

let currentStock = "TCS";

/* ------------------ WALLET ------------------ */
let wallet = {
  balance: 100000,
  shares: 0,
  avg: 0,
};

let orders = [];
let lastPrice = STOCKS[currentStock].price;
let intervalMs = 1000;
let timer;

/* ------------------ CHART ------------------ */
const chart = LightweightCharts.createChart(
  document.getElementById("chart"),
  {
    layout: { background: { color: "#0f172a" }, textColor: "#e5e7eb" },
    grid: { vertLines: { visible: false }, horzLines: { visible: false } },
  }
);

const lineSeries = chart.addLineSeries({ color: "#22c55e", lineWidth: 2 });


// Create a candlestick chart
const candleChart = LightweightCharts.createChart(document.getElementById("candle-chart"), {
    layout: { background: { color: "#0f172a" }, textColor: "#e5e7eb" },
    grid: { vertLines: { visible: false }, horzLines: { visible: false } },
});

const candleSeries = candleChart.addCandlestickSeries({
    upColor: "#22c55e",
    downColor: "#ef4444",
    borderVisible: false,
    wickUpColor: "#22c55e",
    wickDownColor: "#ef4444",
});



let time = 0;
let data = [];



/*
function tick() {
  lastPrice += (Math.random() - 0.5) * 20;
  lastPrice = Math.max(100, lastPrice);

  data.push({ time: time++, value: Number(lastPrice.toFixed(2)) });
  lineSeries.setData(data);

  updateUI();
}*/
let candleData = [];

function tick() {
    // Simulate price movement
    const change = (Math.random() - 0.5) * 20;
    lastPrice = Math.max(100, lastPrice + change);

    // Update line chart
    data.push({ time: time, value: Number(lastPrice.toFixed(2)) });
    lineSeries.setData(data);

    // Update candlestick chart
    const ohlc = {
        time: time,
        open: candleData.length ? candleData[candleData.length - 1].close : lastPrice,
        high: lastPrice + Math.random() * 10,
        low: lastPrice - Math.random() * 10,
        close: lastPrice,
    };

    candleData.push(ohlc);
    candleSeries.setData(candleData);

    time++;
    updateUI();
}

/* ------------------ ACTIONS ------------------ */
function buy() {
  if (wallet.balance < lastPrice) return;

  wallet.balance -= lastPrice;
  wallet.avg = (wallet.avg * wallet.shares + lastPrice) / (wallet.shares + 1);
  wallet.shares++;

  orders.unshift(`<p style="color:green;">BUY @ ₹${lastPrice.toFixed(2)}</p>`);
  updateUI();
}

function sell() {
  if (wallet.shares === 0) return;

  wallet.balance += lastPrice;
  wallet.shares--;
  if (wallet.shares === 0) wallet.avg = 0;

  orders.unshift(`<p style="color:red;"> SELL @ ₹${lastPrice.toFixed(2)}</p>`);
  updateUI();
}
function toggleGraph(){
    var panel1 = document.getElementById("chart");
    var panel2 = document.getElementById("candle-chart");
    const text =document.getElementById("textBtn");
    if (panel1.style.display === "none") {
        // If panel 1 is hidden, show it and hide panel 2
        panel1.style.display = "block";
        panel2.style.display = "none";
        text.innerHTML = "line-chart";
    } else {
        // If panel 1 is visible, hide it and show panel 2
        panel1.style.display = "none";
        panel2.style.display = "block";
        text.innerHTML = "candle-chart";
    }
}
function switchStock(stock) {
  currentStock = stock;
  lastPrice = STOCKS[stock].price;
  data = [];
  time = 0;
  showInfo("pros");
}

function changeSpeed() {
  intervalMs = Number(document.getElementById("speed").value);
  clearInterval(timer);
  timer = setInterval(tick, intervalMs);
}

function showInfo(type) {
  document.getElementById("info").innerText = STOCKS[currentStock][type];
}

/* ------------------ UI ------------------ */
function updateUI() {
  document.getElementById("balance").innerText = wallet.balance.toFixed(2);
  document.getElementById("shares").innerText = wallet.shares;
  document.getElementById("avg").innerText = wallet.avg.toFixed(2);

  const pl = wallet.shares * (lastPrice - wallet.avg);
  document.getElementById("pl").innerText = pl.toFixed(2);

  document.getElementById("orders").innerHTML =
    orders.map(o => `<div>${o}</div>`).join("");
}

/* ------------------ START ------------------ */
showInfo("pros");
updateUI();
timer = setInterval(tick, intervalMs);
