const BASE = "https://dashboard-api-422591363136.us-central1.run.app";

async function safeFetch(url, { emptyOn404 = false } = {}) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    if (emptyOn404 && res.status === 404) return null; // interpret as "no data"
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function qs(params = {}) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) u.set(k, String(v));
  }
  const s = u.toString();
  return s ? `?${s}` : "";
}

export async function getStockChart(symbol, params = {}) {
  return safeFetch(
    `${BASE}/stock/${encodeURIComponent(symbol)}${qs(params)}`,
    { emptyOn404: true }
  );
}
export async function getTrades(symbol, params = {}) {
  return safeFetch(
    `${BASE}/trades/${encodeURIComponent(symbol)}${qs(params)}`,
    { emptyOn404: true }
  );
}
export async function getTradeLogs(symbol, params = {}) {
  return safeFetch(
    `${BASE}/logic/${encodeURIComponent(symbol)}${qs(params)}`,
    { emptyOn404: true }
  );
}
