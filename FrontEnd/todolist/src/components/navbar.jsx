import React, { useState } from "react";
import { Plus, Search } from "lucide-react";

function Navbar({ onOpenAddModal }) {
  const [filtroAtivo, setFiltroAtivo] = useState("Todas as Tarefas");

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const filtros = ["Todas as Tarefas", "Ativas", "Concluídas", "Prioridades"];

  return (
    <nav className="text-slate-100 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 bg-slate-900/50">
      {/* Header: Nome e Data */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-2">
        <h1 className="font-bold text-2xl tracking-tight">Olá, Estudante</h1>
        <p className="capitalize text-sm text-slate-400 font-medium">{dataFormatada}</p>
      </div>

      {/* Ações: Add e Filtros */}
      <div className="flex flex-col lg:flex-row justify-between p-4 gap-4 items-stretch lg:items-center">
        
        {/* BOTÃO ADICIONAR */}
        <button 
          onClick={onOpenAddModal} 
          className="h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 hover:from-blue-500 hover:to-indigo-800 text-white px-6 rounded-xl cursor-pointer 
                     flex items-center justify-center gap-2 transition-all active:scale-95 
                     font-semibold shadow-lg shadow-blue-900/20 border border-blue-400/20"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="whitespace-nowrap">Nova Tarefa</span>
        </button>

        {/* CONTAINER DE FILTROS E PESQUISA - Ajustado para Responsividade */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-2 bg-slate-800/40 rounded-2xl border border-slate-700/50 w-full lg:w-auto">
          
          {/* GRID DE BOTÕES: 2 por linha no mobile, 4 em linha no desktop */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-1.5">
            {filtros.map((nome) => (
              <button
                key={nome}
                onClick={() => setFiltroAtivo(nome)}
                className={`px-3 py-2.5 md:py-2 text-xs font-medium rounded-xl transition-all cursor-pointer text-center ${
                  filtroAtivo === nome
                    ? "bg-slate-700 text-blue-400 shadow-sm border border-slate-600" 
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {nome}
              </button>
            ))}
          </div>

          {/* BARRA DE PESQUISA: Sempre abaixo no mobile, ao lado no desktop */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-slate-900/50 h-11 md:h-10 rounded-xl pl-10 pr-4 text-sm text-white 
                         outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 
                         transition-all placeholder:text-slate-500 shadow-inner"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;