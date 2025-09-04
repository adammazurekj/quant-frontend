import React, { useEffect, useState, useMemo } from "react";
import StockChart from "./StockChart";
import StockLogs from "./StockLogs";
import { getStockChart, getTrades, getTradeLogs } from "../api";

function formatLaLabel(offsetDays) {
  const tz = "America/Los_Angeles";
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const y = Number(parts.find(p => p.type === "year").value);
  const m = Number(parts.find(p => p.type === "month").value);
  const d = Number(parts.find(p => p.type === "day").value);

  const baseAtUtcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const target = new Date(baseAtUtcNoon.getTime() + offsetDays * 86400000);

  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(target).toLowerCase();

  const month = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "numeric",
  }).format(target);

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    day: "numeric",
  }).format(target);

  return `${weekday} ${month}/${day}`;
}

const StockCard = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [trades, setTrades] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scrollOffset, setScrollOffset] = useState(0);
  const dayLabel = useMemo(() => formatLaLabel(scrollOffset), [scrollOffset]);

  const goPrevDay = () => setScrollOffset((x) => x - 1);
  const goNextDay = () => setScrollOffset((x) => Math.min(0, x + 1));

  useEffect(() => {
    let alive = true;

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

        <div className="flex items-center gap-3">
          <button
            onClick={goPrevDay}
            className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            aria-label="Previous day"
          >
            ←
          </button>
          <div className="text-sm font-mono tabular-nums">
            {dayLabel}
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
        <div className="flex flex-col">
          {/* Chart full width */}
          <StockChart
            key={`${symbol}-${scrollOffset}`}
            points={data.points}
            trades={trades}
          />

          {/* Logs bottom right, half width */}
          <div className="flex justify-end mt-4">
            <div className="w-full md:w-1/2">
              <StockLogs logs={logs} />
            </div>
          </div>
        </div>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
};

export default StockCard;
