import { X, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    // Backdrop: transição de opacidade suave
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden 
                   animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header do Card com Gradiente */}
        <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-900 p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all cursor-pointer hover:rotate-90"
          >
            <X size={20} />
          </button>
          
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 shadow-lg ${
            task.prioridade === 'ALTA' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            Prioridade {task.prioridade}
          </span>
          <h2 className="text-2xl font-bold text-white truncate drop-shadow-md">{task.titulo}</h2>
        </div>

        {/* Conteúdo */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} className="text-blue-500" /> Descrição
            </label>
            <div className="text-slate-300 leading-relaxed bg-slate-800/40 p-5 rounded-2xl border border-slate-700/30">
              {task.descricao || "Nenhuma descrição detalhada fornecida para esta tarefa."}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-colors">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mb-1">
                <Calendar size={12} /> Criado em
              </label>
              <p className="text-sm text-slate-200 font-medium">
                {new Date(task.dataCriacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-colors">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mb-1">
                <Clock size={12} /> Prazo Final
              </label>
              <p className="text-sm text-slate-200 font-medium">
                {task.dataLimite ? new Date(task.dataLimite).toLocaleDateString('pt-BR') : "Sem prazo"}
              </p>
            </div>
          </div>

          {/* Footer Minimalista */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-800/50">
            <div className={`p-2 rounded-lg ${task.concluida ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              <CheckCircle2 size={20} className={task.concluida ? "text-emerald-500" : "text-amber-500"} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Status atual</span>
              <span className={`text-sm font-bold ${task.concluida ? 'text-emerald-400' : 'text-amber-400'}`}>
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