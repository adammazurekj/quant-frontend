import React from "react";
import Plot from "react-plotly.js";

const StockChart = ({ points, trades = [] }) => {
  // Prepare the data series
  const timestamps = points.map((p) => new Date(p.ts));
  const price = points.map((p) => p.price);
  const fast = points.map((p) => p.fast);
  const slow = points.map((p) => p.slow);

  const traces = [
    {
      x: timestamps,
      y: price,
      type: "scatter",
      mode: "lines",
      name: "Price",
      line: { color: "#4a90e2", width: 2 },
    },
  ];

  if (fast.some((v) => v != null)) {
    traces.push({
      x: timestamps,
      y: fast,
      type: "scatter",
      mode: "lines",
      name: "Fast MA",
      line: { color: "#28a745", width: 2 },
    });
  }

  if (slow.some((v) => v != null)) {
    traces.push({
      x: timestamps,
      y: slow,
      type: "scatter",
      mode: "lines",
      name: "Slow MA",
      line: { color: "#e67e22", width: 2 },
    });
  }

  // --- Trade markers ---
  trades.forEach((trade) => {
    const ts = new Date(trade.ts);

    // Find closest price point to this timestamp
    let closestIdx = 0;
    let minDiff = Infinity;
    timestamps.forEach((t, i) => {
      const diff = Math.abs(t - ts);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });

    const tradePrice = price[closestIdx];

    let marker = {};
    if (trade.direction === "LONG") {
      marker = { symbol: "triangle-up", size: 12, color: "green" };
    } else if (trade.direction === "SHORT") {
      marker = { symbol: "triangle-down", size: 12, color: "red" };
    } else if (trade.direction === "CLOSE") {
      marker = { symbol: "circle", size: 10, color: "#ff5733" }; // reddish-orange
    }

    traces.push({
      x: [ts],
      y: [tradePrice],
      type: "scatter",
      mode: "markers",
      marker,
      name: `${trade.direction} @ ${ts.toLocaleTimeString()}`,
      hoverinfo: "name",
      showlegend: false,
    });
  });

  return (
    <Plot
      data={traces}
      layout={{
        autosize: true,
        height: 300,
        margin: { l: 40, r: 20, t: 20, b: 40 },
        xaxis: {
          title: "Time",
          type: "date",
          tickformat: "%H:%M",
        },
        yaxis: {
          title: "Price",
          fixedrange: false,
        },
        legend: { orientation: "h", x: 0, y: 1.1 },
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      config={{
        displayModeBar: false,
        responsive: true,
      }}
    />
  );
};

export default StockChart;
