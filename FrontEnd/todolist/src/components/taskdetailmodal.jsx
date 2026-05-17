import React from "react";
import { X, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  const formatarDataInput = (dataString) => {
    if (!dataString) return null;
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade?.toUpperCase()) {
      case "ALTA":
        return "bg-red-500 text-white shadow-red-900/20";
      case "MEDIA":
        return "bg-amber-500 text-white shadow-amber-900/20";
      default:
        return "bg-slate-600 text-white shadow-slate-900/20";
    }
  };

  return (
    <div 
      /* CORRIGIDO: Centralização vertical combinada com pb-20 no mobile para afastar o modal da barra fixa inferior */
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-20 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out cursor-pointer"
      onClick={onClose}
    >
      <div 
        /* CORRIGIDO: rounded-3xl completo, max-h-[80vh] e flex-col para controle total de scroll interno em telas touch */
        className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] sm:max-h-none flex flex-col animate-modal cursor-default"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header do Card com Gradiente: Ajustado padding e tamanho de fonte para mobile */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-br from-blue-600 to-indigo-900 p-5 sm:p-6 shrink-0 flex flex-col justify-end">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all cursor-pointer hover:rotate-90"
          >
            <X size={18} />
          </button>
          
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider mb-1.5 shadow-lg ${getPrioridadeColor(task.prioridade)}`}>
              Prioridade {task.prioridade}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate drop-shadow-md">{task.titulo}</h2>
          </div>
        </div>

        {/* Conteúdo com rolagem interna isolada */}
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1 min-h-0 no-scrollbar">
          
          {/* DESCRIÇÃO */}
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} className="text-blue-500" /> Descrição
            </label>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-700/30 break-words">
              {task.descricao || "Nenhuma descrição detalhada fornecida para esta tarefa."}
            </div>
          </div>

          {/* DATAS METADATA */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* DATA DE CRIAÇÃO */}
            <div className="bg-slate-800/30 p-3 sm:p-4 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-colors min-w-0">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1 truncate">
                <Calendar size={12} /> Criado em
              </label>
              <p className="text-xs sm:text-sm text-slate-200 font-medium truncate">
                {formatarDataInput(task.dataCriacao) || "--/--/--"}
              </p>
            </div>
            
            {/* DATA LIMITE */}
            <div className="bg-slate-800/30 p-3 sm:p-4 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-colors min-w-0">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1 truncate">
                <Clock size={12} /> Prazo Final
              </label>
              <p className="text-xs sm:text-sm text-slate-200 font-medium truncate">
                {formatarDataInput(task.dataLimite) || "Sem prazo"}
              </p>
            </div>
          </div>

          {/* Footer Minimalista (Status) */}
          <div className="flex items-center gap-3 pt-4 sm:pt-5 border-t border-slate-800/50 shrink-0 pb-1 sm:pb-0">
            <div className={`p-2 rounded-lg ${task.concluida ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              <CheckCircle2 size={18} className={task.concluida ? "text-emerald-500" : "text-amber-500"} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Status atual</span>
              <span className={`text-xs sm:text-sm font-bold ${task.concluida ? 'text-emerald-400' : 'text-amber-400'}`}>
                {task.concluida ? "Tarefa Finalizada" : "Em execução"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;