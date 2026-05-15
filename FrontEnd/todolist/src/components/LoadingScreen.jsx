import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      {/* Círculo animado */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
      <p className="mt-4 text-slate-300 font-medium animate-pulse">Carregando dados...</p>
    </div>
  );
};

export default LoadingScreen;