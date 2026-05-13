import React, { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Edit3,
  AlignLeft,
  Flag,
} from "lucide-react";

const UpdateTaskModal = ({ isOpen, onClose, onUpdate, task }) => {
  const [taskData, setTaskData] = useState({
    titulo: "",
    descricao: "",
    prioridade: "MEDIA",
    dataLimite: "",
  });

  // Carrega os dados da tarefa quando o modal abre ou a task muda
  useEffect(() => {
    if (task) {
      setTaskData({
        titulo: task.titulo || "",
        descricao: task.descricao || "",
        prioridade: task.prioridade || "MEDIA",
        dataLimite: task.dataLimite || "",
      });
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.titulo) return alert("O título é obrigatório!");

    // Mantém o ID e outros campos originais (como dataCriacao) e mescla com os novos dados
    onUpdate({ ...task, ...taskData });
    onClose();
  };

  
  const isAtrasada = task?.statusCustomizado === "ATRASADA";
  const hoje = new Date().toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Edit3 size={20} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Editar Tarefa</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* TÍTULO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Título da Tarefa
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              value={taskData.titulo}
              onChange={(e) =>
                setTaskData({ ...taskData, titulo: e.target.value })
              }
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
              <AlignLeft size={14} /> Descrição
            </label>
            <textarea
              rows="3"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner"
              value={taskData.descricao}
              onChange={(e) =>
                setTaskData({ ...taskData, descricao: e.target.value })
              }
            />
          </div>

          {/* PRIORIDADE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Flag size={14} /> Prioridade
              {isAtrasada && (
                <span className="text-red-500 text-[9px] animate-bounce">
                  (BLOQUEADA POR ATRASO)
                </span>
              )}
            </label>

            <div className="flex gap-2">
              {["ALTA", "MEDIA", "BAIXA"].map((p) => (
                <button
                  key={p}
                  type="button"
                  // Se estiver atrasada, desabilita os botões
                  disabled={isAtrasada}
                  onClick={() => setTaskData({ ...taskData, prioridade: p })}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all border ${
                    // Se atrasada, forçamos o destaque visual apenas na ALTA
                    (isAtrasada ? p === "ALTA" : taskData.prioridade === p)
                      ? "bg-indigo-600 border-indigo-400 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  } ${isAtrasada ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* DATA LIMITE (CALENDÁRIO ESTILIZADO) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
              <CalendarIcon size={14} /> Prazo Final
            </label>
            <input
              type="date"
              min={hoje}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 
                         outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 
                         transition-all appearance-none cursor-pointer [color-scheme:dark] shadow-inner"
              value={taskData.dataLimite}
              onChange={(e) =>
                setTaskData({ ...taskData, dataLimite: e.target.value })
              }
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold hover:opacity-90 shadow-lg shadow-indigo-900/20 transition-all cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
