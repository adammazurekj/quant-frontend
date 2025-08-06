// src/api.js --------------------------------------------------
// Thin helpers around the FastAPI backend

const BASE = "https://dashboard-api-422591363136.us-central1.run.app";
//const BASE = "http://127.0.0.1:8000"
// ── Portfolio & positions ─────────────────────────────────────
export const getPortfolio = () => fetch(`${BASE}/portfolio`).then(r => r.json());
export const getPositions = () => fetch(`${BASE}/positions`).then(r => r.json());

// ── Price-and-SMA chart data ──────────────────────────────────
/**
 * @param {string}  symbol    – ticker
 * @param {number}  days      – # calendar days to display (default 1)
 * @param {boolean} intraday  – true ⇒ 5-min bars, false ⇒ daily bars
 */
export const getStockChart = (symbol, days = 1, intraday = false) =>
  fetch(
    `${BASE}/stock/${symbol}?days=${days}${intraday ? "&intraday=true" : ""}`
  ).then(r => r.json());

// ── NEW: filled-order markers for chart triangles ─────────────
/**
 * @param {string} symbol – ticker
 * @param {number} days   – look-back window (default 1)
 */
export const getTrades = (symbol, days = 1) =>
  fetch(`${BASE}/trades/${symbol}?days=${days}`).then(r => r.json());

export const getBotHealth = () =>
  fetch(`${BASE}/bot-health`).then(r => r.json());

