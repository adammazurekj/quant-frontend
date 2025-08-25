import React, { useEffect, useState, useMemo } from "react";
import StockChart from "./StockChart";
import StockLogs from "./StockLogs";
import { getStockChart, getTrades, getTradeLogs } from "../api";

function formatUtcLabel(offsetDays) {
  const now = new Date();
  const d = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + offsetDays,
    0, 0, 0, 0
  ));
  const weekday = d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).toLowerCase();
  const month = d.toLocaleDateString("en-US", { month: "numeric", timeZone: "UTC" });
  const day = d.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" });
  return `${weekday} ${month}/${day}`;
}

const StockCard = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [trades, setTrades] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 0 = today, -1 = yesterday, ...
  const [scrollOffset, setScrollOffset] = useState(0);
  const dayLabel = useMemo(() => formatUtcLabel(scrollOffset), [scrollOffset]);

  const goPrevDay = () => setScrollOffset((x) => x - 1);
  const goNextDay = () => setScrollOffset((x) => Math.min(0, x + 1));

  useEffect(() => {
    let alive = true;

    // Clear previous day’s data immediately so stale UI doesn’t linger
    setLoading(true);
    setData(null);
    setTrades([]);
    setLogs([]);

    (async function fetchData() {
      const [c, t, l] = await Promise.allSettled([
        getStockChart(symbol, { scroll_offset: scrollOffset }),
        getTrades(symbol, { scroll_offset: scrollOffset }),
        getTradeLogs(symbol, { scroll_offset: scrollOffset }),
      ]);
      if (!alive) return;

      const chartResult  = c.status === "fulfilled" ? c.value : null;
      const tradesResult = t.status === "fulfilled" ? t.value : null;
      const logsResult   = l.status === "fulfilled" ? l.value : null;

      const points   = Array.isArray(chartResult?.points) ? chartResult.points : [];
      const tradeArr = Array.isArray(tradesResult?.trades) ? tradesResult.trades : [];
      const logArr   = Array.isArray(logsResult?.logs) ? logsResult.logs : [];

      const hasAny = points.length || tradeArr.length || logArr.length;

      if (hasAny) {
        setData({ points });
        setTrades(tradeArr);
        setLogs(logArr);
      } else {
        // Explicit empty state → will render "No data"
        setData({ points: [] });
        setTrades([]);
        setLogs([]);
      }

      setLoading(false);
    })();

    return () => { alive = false; };
  }, [symbol, scrollOffset]);

  return (
    <div className="w-full bg-white rounded-2xl shadow p-6">
      {/* Header row: symbol + date scroller */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{symbol}</h2>

        {/* Date scroller */}
        <div className="flex items-center gap-3">
          <button
            onClick={goPrevDay}
            className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            aria-label="Previous day"
          >
            ←
          </button>
          <div className="text-sm font-mono tabular-nums">
            {dayLabel} <span className="opacity-60">(UTC)</span>
          </div>
          <button
            onClick={goNextDay}
            disabled={scrollOffset === 0}
            className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            aria-label="Next day"
          >
            →
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data?.points?.length > 0 ? (
        <>
          <StockChart
            key={`${symbol}-${scrollOffset}`}   // force clean remount per day
            points={data.points}
            trades={trades}
          />
          <StockLogs logs={logs} />
        </>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
};

export default StockCard;
