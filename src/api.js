// src/api.js --------------------------------------------------
// Thin helpers around the FastAPI backend
const BASE = "https://dashboard-api-422591363136.us-central1.run.app";

export const getPortfolio = () =>
  fetch(`${BASE}/portfolio`).then(r => r.json());

export const getPositions = () =>
  fetch(`${BASE}/positions`).then(r => r.json());

/**
 * Fetch price‑and‑SMA chart data.
 *
 * @param {string}  symbol    – ticker
 * @param {number}  days      – # calendar days to display (default 1)
 * @param {boolean} intraday  – true ⇒ 5‑min bars, false ⇒ daily bars
 */
export const getStockChart = (symbol, days = 1, intraday = false) =>
  fetch(
    `${BASE}/stock/${symbol}?days=${days}` +
      (intraday ? '&intraday=true' : '')
  ).then(r => r.json());
