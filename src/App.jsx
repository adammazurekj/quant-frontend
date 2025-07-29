// src/App.jsx  ── top‑level orchestrator (vertical cards)
// --------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import PortfolioStats from './components/PortfolioStats';
import StockCard from './components/StockCard';
import { getPositions } from './api';

export default function App() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const pull = () => getPositions().then(setPositions);
    pull();
    const id = setInterval(pull, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* ── top portfolio summary card ──────────────────────────────────── */}
      <PortfolioStats />

      {/* ── stack StockCards vertically, full width ─────────────────────── */}
      <div className="space-y-6">
        {positions.map(pos => (
          <StockCard key={pos.symbol} position={pos} />
        ))}
      </div>
    </div>
  );
}
