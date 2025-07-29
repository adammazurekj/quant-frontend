// src/components/StockCard.jsx ---------------------------------------------
import StockChart from './StockChart';

export default function StockCard({ position }) {
  const {
    symbol, side, qty, value,
    entry, last_price,
    last_trade_ts, last_trade_reason,
  } = position;

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <div className="flex flex-col lg:flex-row">
        {/* ── Left: Position info (1/4 width) ───────────────────────── */}
        <div className="lg:w-1/4 w-full pr-6 mb-6 lg:mb-0">
          <h3 className="text-2xl font-bold mb-2">
            {symbol}
            <span className={`ml-3 px-2 py-1 text-sm font-medium rounded 
              ${side === 'Long' ? 'bg-green-200 text-green-800'
                                : 'bg-red-200 text-red-800'}`}>
              {side}
            </span>
          </h3>

          <Info label="Qty" value={qty} />
          <Info label="Value" value={`$${value.toLocaleString()}`} />
          <Info label="Entry" value={`$${entry.toFixed(2)}`} />
          <Info label="Last Price" value={`$${last_price.toFixed(2)}`} />

          {last_trade_ts && (
            <div className="text-xs text-gray-500 mt-4">
              Last trade:<br />
              {new Date(last_trade_ts).toLocaleString()}<br />
              {last_trade_reason}
            </div>
          )}
        </div>

        {/* ── Right: Charts (3/4 width) ────────────────────────────── */}
        <div className="lg:w-3/4 w-full space-y-6">
          <StockChart symbol={symbol} days={1} intraday={true} title="Today (5‑min)" />
          <StockChart symbol={symbol} days={30} title="Last 30 days" />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  );
}
