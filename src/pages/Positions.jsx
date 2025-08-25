// src/pages/Positions.jsx
import React from "react";
import StockCard from "../components/StockCard";

const Positions = () => {
  // Hardcode your list of stocks here
  const symbols = ["APP", "CELH", "CRWD", "HIMS", "CCJ", "ASML", "MU", "AMD"];

  return (
    <div className="p-6 flex flex-col space-y-6 max-w-7xl mx-auto">
      {symbols.map((symbol) => (
        <StockCard key={symbol} symbol={symbol} />
      ))}
    </div>
  );
};

export default Positions;
