import React from "react";
import { Pencil, Trash2, Calendar, CheckCircle2, Clock } from "lucide-react";

const Tabela = ({ tasks, onToggle, onDelete, onEdit, onShowDetail }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl">
      <table className="w-full text-left border-collapse">
        {/* CABEÇALHO */}
        <thead className="bg-slate-800/60 text-slate-400 uppercase text-xs font-bold tracking-widest">
          <tr>
            <th className="px-6 py-5">Prioridade</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Data Limite</th>
            <th className="px-6 py-5">Tarefa</th>
            <th className="px-6 py-5">Descrição</th>
            <th className="px-6 py-5 text-center">Ações</th>
          </tr>
        </thead>

        {/* CORPO DA TABELA */}
        <tbody className="divide-y divide-slate-800/50">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onShowDetail(task)} // Abre o Card de detalhes
                className="hover:bg-slate-800/40 transition-all group cursor-pointer"
              >
                {/* PRIORIDADE */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm border ${
                      task.prioridade === "ALTA"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : task.prioridade === "MEDIA"
                          ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}
                  >
                    {task.prioridade}
                  </span>
                </td>

                {/* STATUS (BADGE) */}
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggle(task.id)}
                    disabled={task.concluida} // Desativa o clique se já estiver feito
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                      task.concluida
                        ? "bg-emerald-500/10 text-emerald-500/50 border-emerald-500/10 cursor-not-allowed opacity-70"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30 cursor-pointer"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${task.concluida ? "bg-emerald-500/40" : "bg-amber-400"}`}
                    />
                    {task.concluida ? "FINALIZADA" : "ATIVA"}
                  </button>
                </td>

                {/* DATA TÉRMINO */}
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-600" />
                    {task.dataLimite
                      ? new Date(task.dataLimite).toLocaleDateString("pt-BR")
                      : "--/--/--"}
                  </div>
                </td>

                {/* TÍTULO DA TAREFA */}
                <td
                  className={`px-6 py-4 text-sm font-semibold transition-all ${
                    task.concluida
                      ? "text-slate-600 line-through"
                      : "text-slate-100"
                  }`}
                >
                  {task.titulo}
                </td>

                {/* DESCRIÇÃO (TRUNCADA) */}
                <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate italic">
                  {task.descricao || "..."}
                </td>

                {/* COLUNA DE AÇÕES */}
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    {/* BOTÃO EDITAR */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Só dispara a edição se a tarefa NÃO estiver concluída
                        if (!task.concluida) {
                          onEdit(task);
                        }
                      }}
                      disabled={task.concluida} // Desativa o botão nativamente
                      className={`p-2 rounded-lg transition-all shadow-sm border border-transparent ${
                        task.concluida
                          ? "text-slate-700 cursor-not-allowed opacity-30" // Estilo desativado
                          : "text-slate-500 hover:bg-indigo-600 hover:text-white cursor-pointer hover:border-indigo-400"
                      }`}
                      title={
                        task.concluida
                          ? "Tarefas concluídas não podem ser editadas"
                          : "Editar Tarefa"
                      }
                    >
                      <Pencil size={16} />
                    </button>

                    {/* BOTÃO DELETAR */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-sm border border-transparent hover:border-red-400"
                      title="Excluir Tarefa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-20 text-center text-slate-600 italic"
              >
                Nenhuma tarefa encontrada...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabela;
