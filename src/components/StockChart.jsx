// src/components/StockChart.jsx  (v2.2 – bug‑free intraday axis)
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { getStockChart } from "../api";

/**
 * Displays price plus 5‑ and 20‑period SMAs.
 *
 * props
 * ─────
 * symbol     string   – ticker
 * days       number   – # calendar days to show (default 1)
 * intraday   boolean  – true ⇒ 5‑min bars, false ⇒ daily bars
 * title      string   – optional caption above the chart
 */
export default function StockChart({
  symbol,
  days = 1,
  intraday = false,
  title,
}) {
  const [series, setSeries] = useState(null);

  // ── Fetch loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    const pull = () =>
      getStockChart(symbol, days, intraday).then((d) => alive && setSeries(d));

    pull();
    const id = setInterval(pull, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [symbol, days, intraday]);

  // ── Loading / empty guard ──────────────────────────────────────────────
  if (!series?.points?.length)
    return (
      <div className="card bg-white p-6 text-sm text-gray-500">
        No data for {symbol}.
      </div>
    );

  const { points } = series;

  // ── Build traces & inject nulls on big gaps ────────────────────────────
  const TS = [],
    PRICE = [],
    FAST = [],
    SLOW = [];
  const GAP_MIN = intraday ? 90 : 1500; // minutes

  points.forEach((p, i) => {
    if (i) {
      const prev = new Date(points[i - 1].ts);
      const curr = new Date(p.ts);
      if ((curr - prev) / 60000 > GAP_MIN) {
        TS.push(null, null);
        PRICE.push(null, null);
        FAST.push(null, null);
        SLOW.push(null, null);
      }
    }
    TS.push(p.ts);
    PRICE.push(p.price);
    FAST.push(p.fast);
    SLOW.push(p.slow);
  });

  // ── x‑axis breaks: weekends + overnight hours (robust) ─────────────────
  const rangebreaks = [{ bounds: ["sat", "mon"] }];
  if (intraday) {
    // keep 09 h hour visible (covers 09:30 open) – so skip 00‑08 and 17‑24
    rangebreaks.push(
      { pattern: "hour", bounds: [17, 24] },
      { pattern: "hour", bounds: [0, 8] }
    );
  }

  // If breaking wipes out the session (<3 points) fall back to no hour breaks
  const effectiveBreaks =
    intraday && TS.filter(Boolean).length < 3 ? rangebreaks.slice(0, 1) : rangebreaks;

  // ── Colours & hover templates ──────────────────────────────────────────
  const C = { price: "#1f77b4", fast: "#ff7f0e", slow: "#2ca02c" };

  return (
    <div className="space-y-1 w-full">
      {title && <h4 className="text-sm font-medium text-gray-600">{title}</h4>}

      <Plot
        data={[
          {
            x: TS,
            y: PRICE,
            type: "scatter",
            mode: "lines",
            name: "Price",
            line: { width: 2, color: C.price },
            connectgaps: true,
            hovertemplate: "%{x}<br>Price  %{y:$,.2f}<extra></extra>",
          },
          {
            x: TS,
            y: FAST,
            type: "scatter",
            mode: "lines",
            name: "Fast MA (5d)",
            line: { width: 1, color: C.fast },
            connectgaps: true,
            hovertemplate: "%{x}<br>Fast MA %{y:$,.2f}<extra></extra>",
          },
          {
            x: TS,
            y: SLOW,
            type: "scatter",
            mode: "lines",
            name: "Slow MA (20d)",
            line: { width: 1, color: C.slow },
            connectgaps: true,
            hovertemplate: "%{x}<br>Slow MA %{y:$,.2f}<extra></extra>",
          },
        ]}
        layout={{
          autosize: true,
          height: 220,
          margin: { l: 30, r: 10, t: 10, b: 30 },
          showlegend: false,
          xaxis: { type: "date", rangebreaks: effectiveBreaks },
          yaxis: { automargin: true },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
      />
    </div>
  );
}

