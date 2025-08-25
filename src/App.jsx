// src/App.jsx — orchestrator with navbar + page switching
// ---------------------------------------------------------------------------
import { useEffect, useState } from "react";
import PositionsPage from "./pages/Positions";
import LogsPage from "./pages/Logs";

// ── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ current, setCurrent }) {
  const [utcTime, setUtcTime] = useState("");

  // update every minute
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().slice(11, 16) // "HH:MM"
      );
    };
    updateClock(); // initial call
    const interval = setInterval(updateClock, 60000); // once per min
    return () => clearInterval(interval);
  }, []);

  const items = [
    { key: "positions", label: "Positions" },
    { key: "logs", label: "Logs" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 text-white px-4 py-2 shadow-md"
      style={{ backgroundColor: "#001F3F" }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side: title + nav buttons */}
        <div>
          <div className="text-base font-semibold">BQS Fund Dashboard</div>
          <div className="mt-1 flex flex-wrap gap-4">
            {items.map((it) => {
              const active = current === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => setCurrent(it.key)}
                  className={`text-sm font-medium transition-opacity ${
                    active
                      ? "opacity-100 underline underline-offset-4"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: UTC clock */}
        <div className="text-sm font-mono opacity-90">
          UTC {utcTime}
        </div>
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState("main"); // "main" | "positions" | "logs" | "research"

  // 2.5-s splash timer
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) return <LoadingScreen />;

  return (
    <>
      <Navbar current={page} setCurrent={setPage} />
      <div className="min-h-screen px-6 pb-6 pt-28 space-y-6 bg-[#F5F7FA] text-[#1A1A1A]">
        {page === "positions" && <PositionsPage />}
        {page === "logs" && <LogsPage />}
      </div>
    </>
  );
}
