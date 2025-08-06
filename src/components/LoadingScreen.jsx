// src/components/LoadingScreen.jsx
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black">
      <img src="/bqs_logo.png" alt="Loading" className="w-32 h-32 mb-4 animate-pulse" />
      <p className="text-xl">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
