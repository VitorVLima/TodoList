import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Paginacao = ({ paginaAtual, totalPages, onPageChange }) => {
  // Se só tiver uma página ou nenhuma, não precisa renderizar a barra de paginação
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 py-4 border-t border-slate-800/60 animate-in fade-in duration-300">
      {/* BOTÃO ANTERIOR */}
      <button
        type="button"
        disabled={paginaAtual === 0}
        onClick={() => onPageChange(paginaAtual - 1)}
        className="p-2 rounded-xl border border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white hover:border-slate-700 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>

      {/* NÚMEROS DAS PÁGINAS */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onPageChange(index)}
            className={`w-9 h-9 text-xs font-bold rounded-xl transition-all border ${
              paginaAtual === index
                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-950/50"
                : "bg-slate-800/20 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-white cursor-pointer"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* BOTÃO PRÓXIMO */}
      <button
        type="button"
        disabled={paginaAtual === totalPages - 1}
        onClick={() => onPageChange(paginaAtual + 1)}
        className="p-2 rounded-xl border border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white hover:border-slate-700 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Paginacao;