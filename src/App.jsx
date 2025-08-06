// src/App.jsx – top‑level orchestrator (vertical cards)
// ---------------------------------------------------------------------------
import { useEffect, useState } from "react";
import PortfolioStats from "./components/PortfolioStats";
import StockCard from "./components/StockCard";
import BotHealthCard from "./components/BotHealthCard";
import { getPositions, getBotHealth } from "./api";

// ── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav
      className="text-white px-6 py-4 shadow-md"
      style={{ backgroundColor: "#001F3F" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">BQS Fund Dashboard</div>
        <div className="flex space-x-4">{/* future dropdowns */}</div>
      </div>
    </nav>
  );
}

// ── Splash screen while loading ────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black">
      <img
        src="/bqs_logo.png"
        alt="Loading"
        className="w-24 h-24 mb-4 animate-pulse"
      />
      <p className="text-xl">Loading...</p>
    </div>
  );
}

// ── App main ───────────────────────────────────────────────────────────────
export default function App() {
  const [positions, setPositions] = useState([]);
  const [botHealth, setBotHealth] = useState([]); // ← default empty array
  const [initialLoading, setInitialLoading] = useState(true);

  // pull positions and bot health every minute
  useEffect(() => {
    const pull = async () => {
      try {
        const [pos, health] = await Promise.all([
          getPositions(),
          getBotHealth().catch(() => []), // swallow error – treat as empty
        ]);

        setPositions(pos);
        setBotHealth(Array.isArray(health) ? health : []);
      } catch (err) {
        console.error("Error pulling positions or bot health:", err);
      }
    };

    pull();
    const id = setInterval(pull, 60_000);
    return () => clearInterval(id);
  }, []);

  // 2.5‑s splash timer
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 pb-6 pt-20 space-y-6 bg-[#F5F7FA] text-[#1A1A1A]">
        <PortfolioStats />

        {/* ── Bot Health (single aggregated card) ─────────────────────────── */}
        {botHealth.length > 0 && <BotHealthCard data={botHealth} />}

        {/* ── Stock Cards ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {positions.map((pos) => (
            <StockCard key={pos.symbol} position={pos} />
          ))}
        </div>
      </div>
    </>
  );
}