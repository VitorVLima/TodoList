import React from "react";
import { useLocation } from "react-router-dom"; // Hook para identificar a página atual
import { Plus, Search, X } from "lucide-react";

// ATUALIZADO: Recebendo filtroAtivo e setFiltroAtivo via Props do Layout
function Navbar({ onOpenAddModal, termoBusca, setTermoBusca, filtroAtivo, setFiltroAtivo }) {
  const location = useLocation();

  // ❌ REMOVIDO o useState local para não duplicar o estado com o Layout
  // const [filtroAtivo, setFiltroAtivo] = useState("Todas as Tarefas");

  // Verifica se a rota atual é a de configurações
  const isConfigPage = location.pathname === "/config";

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
        <h1 className="font-bold text-2xl tracking-tight">Bem vindo</h1>
        <p className="capitalize text-sm text-slate-400 font-medium">{dataFormatada}</p>
      </div>

      {/* Ações: Add e Filtros */}
      <div className="flex flex-col lg:flex-row justify-between p-4 gap-4 items-stretch lg:items-center">
        
        {/* BOTÃO ADICIONAR (Sempre ativo e funcional) */}
        <button 
          onClick={onOpenAddModal} 
          className="h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 hover:from-blue-500 hover:to-indigo-800 text-white px-6 rounded-xl cursor-pointer 
                     flex items-center justify-center gap-2 transition-all active:scale-95 
                     font-semibold shadow-lg shadow-blue-900/20 border border-blue-400/20"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="whitespace-nowrap">Nova Tarefa</span>
        </button>

        {/* CONTAINER DE FILTROS E PESQUISA 
            Se estiver na página de config, aplicamos efeitos visuais de desabilitado (blur, opacidade e cursor)
        */}
        <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 p-2 bg-slate-800/40 rounded-2xl border border-slate-700/50 w-full lg:w-auto transition-all duration-300
          ${isConfigPage ? "opacity-40 grayscale pointer-events-none select-none cursor-not-allowed" : ""}`}
        >
          
          {/* BOTÕES DE FILTRO */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-1.5">
            {filtros.map((nome) => (
              <button
                key={nome}
                disabled={isConfigPage} // Trava o clique nativo do botão
                onClick={() => setFiltroAtivo(nome)} // Altera diretamente o estado centralizado no Layout
                className={`px-3 py-2.5 md:py-2 text-xs font-medium rounded-xl transition-all text-center cursor-pointer ${
                  filtroAtivo === nome
                    ? "bg-slate-700 text-blue-400 shadow-sm border border-slate-600" 
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {nome}
              </button>
            ))}
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              disabled={isConfigPage} // Impede o usuário de digitar se estiver na config
              placeholder={isConfigPage ? "Pesquisa desabilitada..." : "Buscar..."}
              value={termoBusca || ""}
              onChange={(e) => setTermoBusca(e.target.value)} // Altera dinamicamente o termo no Layout
              className="w-full bg-slate-900/50 h-11 md:h-10 rounded-xl pl-10 pr-10 text-sm text-white 
                         outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 
                         transition-all placeholder:text-slate-500 shadow-inner"
            />
            {termoBusca && !isConfigPage && (
              <button 
                onClick={() => setTermoBusca("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;