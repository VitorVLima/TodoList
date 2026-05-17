import React from "react";
import { useLocation } from "react-router-dom"; 
import { Plus, Search, X } from "lucide-react";

function Navbar({ onOpenAddModal, termoBusca, setTermoBusca, filtroAtivo, setFiltroAtivo }) {
  const location = useLocation();
  const isConfigPage = location.pathname === "/config";

  const dataAtual = new Date();
  
  // Formato completo original mantido estritamente para o Desktop
  const dataDesktop = dataAtual.toLocaleString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const filtros = ["Todas as Tarefas", "Ativas", "Concluídas", "Prioridades"];

  const nomesCompactos = {
    "Todas as Tarefas": "Todas",
    "Ativas": "Ativas",
    "Concluídas": "Feitas",
    "Prioridades": "Prioridade"
  };

  return (
    <nav className="text-slate-100 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 bg-slate-900/50 w-full p-3 lg:p-6 lg:pb-4">
      
      {/* HEADER DESKTOP: Invisível no mobile (hidden lg:flex) para economizar espaço de tela */}
      <div className="hidden lg:flex justify-between items-center lg:mb-4">
        <h1 className="font-bold text-2xl tracking-tight">Bem vindo</h1>
        <p className="capitalize text-sm text-slate-400 font-medium">
          {dataDesktop}
        </p>
      </div>

      {/* BLOCO DE AÇÕES PRINCIPAIS */}
      <div className="flex flex-col lg:flex-row justify-between gap-2.5 lg:gap-4 items-stretch lg:items-center">
        
        {/* ------------------------------------------------------------- */}
        {/* ESTRUTURA EXCLUSIVA COMPACTA PARA MOBILE                      */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center gap-2 w-full lg:hidden">
          {/* BARRA DE PESQUISA MOBILE */}
          <div className={`relative flex-1 transition-all duration-300 ${isConfigPage ? "opacity-30 pointer-events-none" : ""}`}>
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              disabled={isConfigPage}
              /* AJUSTADO: Placeholder limpo e direto apenas com "Buscar..." */
              placeholder={isConfigPage ? "Desabilitada" : "Buscar..."}
              value={termoBusca || ""}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full bg-slate-800/60 h-10 rounded-xl pl-8 pr-8 text-xs text-white 
                         outline-none focus:ring-1.5 focus:ring-blue-500 border border-slate-700/80 
                         transition-all placeholder:text-slate-500 shadow-inner"
            />
            {termoBusca && !isConfigPage && (
              <button 
                onClick={() => setTermoBusca("")} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* BOTÃO ADICIONAR TAREFA MOBILE */}
          <button 
            onClick={onOpenAddModal} 
            className="h-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-3 rounded-xl cursor-pointer 
                       flex items-center justify-center gap-1.5 transition-all active:scale-95 
                       font-bold text-xs shadow-md border border-blue-400/20 shrink-0"
          >
            <Plus size={16} strokeWidth={3} />
            <span className="xs:inline hidden">Nova Tarefa</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ESTRUTURA ORIGINAL E ALINHADA PARA DESKTOP (PC)               */}
        {/* ------------------------------------------------------------- */}
        
        {/* BOTÃO NOVA TAREFA DESKTOP */}
        <button 
          onClick={onOpenAddModal} 
          className="hidden lg:flex h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 hover:from-blue-500 hover:to-indigo-800 text-white px-6 rounded-xl cursor-pointer 
                     items-center justify-center gap-2 transition-all active:scale-95 
                     font-semibold shadow-lg shadow-blue-900/20 border border-blue-400/20 text-sm"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="whitespace-nowrap">Nova Tarefa</span>
        </button>

        {/* CONTAINER FILTROS + BUSCA DESKTOP */}
        <div className={`hidden lg:flex flex-row items-center gap-4 p-2 bg-slate-800/40 rounded-2xl border border-slate-700/50 transition-all duration-300
          ${isConfigPage ? "opacity-40 grayscale pointer-events-none select-none cursor-not-allowed" : ""}`}
        >
          {/* FILTROS DESKTOP */}
          <div className="flex flex-row gap-1.5">
            {filtros.map((nome) => (
              <button
                key={nome}
                disabled={isConfigPage}
                onClick={() => setFiltroAtivo(nome)}
                className={`px-3 py-2 text-xs font-medium rounded-xl transition-all text-center whitespace-nowrap cursor-pointer ${
                  filtroAtivo === nome
                    ? "bg-slate-700 text-blue-400 shadow-sm border border-slate-600" 
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {nome}
              </button>
            ))}
          </div>

          {/* BARRA DE PESQUISA DESKTOP */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              disabled={isConfigPage}
              placeholder={isConfigPage ? "Pesquisa desabilitada..." : "Buscar..."}
              value={termoBusca || ""}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full bg-slate-900/50 h-10 rounded-xl pl-10 pr-10 text-sm text-white 
                         outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 
                         transition-all placeholder:text-slate-500 shadow-inner"
            />
            {termoBusca && (
              <button 
                onClick={() => setTermoBusca("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* CONTAINER FILTROS MOBILE */}
        <div className={`w-full transition-all duration-300 lg:hidden mt-0.5
          ${isConfigPage ? "opacity-30 pointer-events-none select-none" : ""}`}
        >
          <div className="grid grid-cols-4 gap-1 bg-slate-800/30 p-1 rounded-xl border border-slate-800 w-full">
            {filtros.map((nome) => (
              <button
                key={nome}
                disabled={isConfigPage}
                onClick={() => setFiltroAtivo(nome)}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all text-center cursor-pointer truncate px-0.5 ${
                  filtroAtivo === nome
                    ? "bg-slate-700 text-blue-400 shadow-sm border border-slate-600" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                {nomesCompactos[nome]}
              </button>
            ))}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;