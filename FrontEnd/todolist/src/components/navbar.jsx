import { useState } from "react";
import { Plus } from "lucide-react";

function Navbar({onOpenAddModal}) {
  // 1. Estado para controlar qual filtro está selecionado
  const [filtroAtivo, setFiltroAtivo] = useState("Todas as Tarefas");

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Lista de filtros para o .map()
  const filtros = ["Todas as Tarefas", "Ativas", "Concluídas", "Prioridades"];

  return (
    <nav className="text-slate-100  backdrop-blur-md border-b border-slate-800">
      <div className="flex justify-between p-6">
        <h1 className="font-bold text-2xl">Olá Estudante</h1>
        <p className="capitalize text-slate-400">{dataFormatada}</p>
      </div>

      <div className="flex justify-between p-4 items-center">
        {/* BOTÃO ADICIONAR */}
        <button onClick={onOpenAddModal} className="h-14 bg-gradient-to-r from-green-600 to-green-900 px-6 rounded-xl cursor-pointer hover:opacity-90 shadow-lg shadow-green-900/20 flex items-center gap-2 transition-all active:scale-95 font-semibold text-white">
          <Plus size={24} strokeWidth={2.5} />
          <span>Add Tarefa</span>
        </button>

        {/* CONTAINER DE FILTROS */}
        <div className="flex items-center text-sm gap-3 justify-center p-2 bg-slate-800/50 rounded-2xl border border-slate-700">
          {filtros.map((nome) => (
            <button
              key={nome}
              onClick={() => setFiltroAtivo(nome)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all h-11 cursor-pointer shadow-sm ${
                filtroAtivo === nome
                  ? "bg-blue-600 text-white shadow-blue-500/20 shadow-md" // Estilo Ativo
                  : "bg-transparent text-slate-400 hover:bg-slate-700 hover:text-white" // Estilo Inativo
              }`}
            >
              {nome}
            </button>
          ))}

          {/* INPUT DE PESQUISA CORRIGIDO */}
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-slate-700 h-11 rounded-xl px-4 text-white outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;