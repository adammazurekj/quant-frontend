// src/components/PortfolioStats.jsx
import { useEffect, useState } from 'react';
import { getPortfolio } from '../api';

export default function PortfolioStats() {
  const [pf, setPf] = useState(null);   // portfolio data
  const [err, setErr] = useState(false); // fetch‑error flag

  useEffect(() => {
    async function pull() {
      try {
        const data = await getPortfolio();
        setPf(data);
        setErr(false);            // clear any previous error
      } catch (e) {
        console.error('Failed to load portfolio', e);
        setErr(true);
      }
    }
    pull();                        // initial fetch
    const id = setInterval(pull, 60_000);   // refresh every minute
    return () => clearInterval(id);
  }, []);

  // ── guards ────────────────────────────────────────────────────────────
  if (err)
    return (
      <div className="card bg-white p-6">
        Error loading portfolio.
      </div>
    );

  if (!pf)
    return <div className="card">Loading portfolio…</div>;

  // ── happy path ────────────────────────────────────────────────────────
  return (
    <div className="card bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Equity"          value={`$${pf.equity.toLocaleString()}`} />
        <Stat label="Cash"            value={`$${pf.cash.toLocaleString()}`} />
        <Stat label="Positions Value" value={`$${pf.positions_value.toLocaleString()}`} />
        <Stat label="% Long"          value={`${pf.pct_long}%`} />
        <Stat label="% Short"         value={`${pf.pct_short}%`} />
        {/* TODO: add allocation pie / distribution here */}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-lg font-medium">{value}</span>
    </div>
  );
}
