import React from "react";
import { Pencil, Trash2, Clock, AlertTriangle } from "lucide-react";

const Tabela = ({ tasks, onToggle, onDelete, onEdit, onShowDetail }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          {/* CABEÇALHO */}
          <thead className="bg-slate-800/60 text-slate-400 uppercase text-xs font-bold tracking-widest">
            <tr>
              <th className="px-6 py-5">Prioridade</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Prazo Final</th>
              <th className="px-6 py-5">Tarefa</th>
              <th className="px-6 py-5">Descrição</th>
              <th className="px-6 py-5 text-center">Ações</th>
            </tr>
          </thead>

          {/* CORPO DA TABELA */}
          <tbody className="divide-y divide-slate-800/50">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const isAtrasada = task.statusCustomizado === "ATRASADA";
                const isConcluida = task.concluida;

                return (
                  <tr
                    key={task.id}
                    onClick={() => onShowDetail(task)}
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

                    {/* STATUS */}
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggle(task.id)}
                        disabled={isConcluida}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter transition-all border ${
                          isConcluida
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10 cursor-not-allowed opacity-60"
                            : isAtrasada
                            ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse cursor-pointer"
                            : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30 cursor-pointer"
                        }`}
                      >
                        {isAtrasada && !isConcluida ? (
                          <AlertTriangle size={12} className="text-red-500" />
                        ) : (
                          <div className={`w-1.5 h-1.5 rounded-full ${isConcluida ? "bg-emerald-500" : "bg-indigo-400"}`} />
                        )}
                        {task.statusCustomizado?.replace("_", " ")}
                      </button>
                    </td>

                    {/* DATA LIMITE (CORREÇÃO DE 1 DIA ANTES) */}
                    <td className={`px-6 py-4 text-sm font-mono ${isAtrasada && !isConcluida ? "text-red-400" : "text-slate-400"}`}>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className={isAtrasada && !isConcluida ? "text-red-500/50" : "text-slate-600"} />
                        {task.dataLimite
                          ? (() => {
                              // Split para evitar que o fuso horário mude a data
                              const [ano, mes, dia] = task.dataLimite.split("-");
                              return `${dia}/${mes}/${ano}`;
                            })()
                          : "--/--/--"}
                      </div>
                    </td>

                    {/* TÍTULO */}
                    <td className={`px-6 py-4 text-sm font-semibold transition-all ${isConcluida ? "text-slate-600 line-through" : "text-slate-100"}`}>
                      {task.titulo}
                    </td>

                    {/* DESCRIÇÃO */}
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate italic">
                      {task.descricao || "..."}
                    </td>

                    {/* AÇÕES */}
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); if (!isConcluida) onEdit(task); }}
                          disabled={isConcluida}
                          className={`p-2 rounded-lg transition-all border border-transparent ${
                            isConcluida ? "text-slate-700 opacity-30" : "text-slate-500 hover:bg-indigo-600 hover:text-white cursor-pointer hover:border-indigo-400"
                          }`}
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-600 hover:text-white transition-all cursor-pointer border border-transparent hover:border-red-400"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-slate-600 italic">Nenhuma tarefa encontrada...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tabela;
