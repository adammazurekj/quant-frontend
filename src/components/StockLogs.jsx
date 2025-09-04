import React from "react";

const StockLogs = ({ logs, className = "h-48 md:h-56" }) => {
  return (
    <div className={`mt-4 overflow-y-auto border-t border-gray-200 pt-2 text-sm ${className}`}>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs</p>
      ) : (
        logs.map((log, i) => {
          // Ensure backend timestamp is treated as UTC
          const d = new Date(log.ts + "Z"); // add Z = UTC indicator
          const utcTime = d.toISOString().slice(11, 19); // HH:MM:SS UTC
          return (
            <div key={i} className="py-1 border-b border-gray-100">
              <span className="text-gray-500 mr-2">{utcTime}</span>
              <span>{log.message}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StockLogs;


