// ---------------------------------------------------------------------------
// src/components/BotHealthCard.jsx – aggregated view (two‑line layout)
// ---------------------------------------------------------------------------
import React from "react";

/**
 * @param {{
 *   data: Array<{
 *     symbol: string;
 *     target: number;
 *     current: number;
 *     delta: number;
 *     last_trade?: {
 *       ts: string;
 *       side: string;
 *       qty: number;
 *       price: number;
 *     } | null;
 *   }>;
 * }} props
 */
export default function BotHealthCard({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Bot Health</h2>

      <div className="space-y-6">
        {data.map(({ symbol, target, current, delta, last_trade }) => (
          <div key={symbol} className="space-y-1">
            {/* Line 1 – summary */}
            <p className="font-semibold">
              {symbol} — Target = {target} &nbsp; Current = {current} &nbsp; Delta = {" "}
              <span
                className={
                  delta === 0
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {delta}
              </span>
            </p>

            {/* Line 2 – last trade info */}
            {last_trade ? (
              <p className="text-sm">
                Last trade: {new Date(last_trade.ts).toLocaleString()} — {" "}
                {last_trade.side.toUpperCase()} {last_trade.qty} @ ${last_trade.price}
              </p>
            ) : (
              <p className="text-sm italic text-gray-500">No recent trades</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
