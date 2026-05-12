import { AlertTriangle, X } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          {/* Ícone de Alerta Animado */}
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <AlertTriangle size={32} className="text-red-500 animate-pulse" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Excluir Tarefa?</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Você está prestes a excluir: <br />
            <span className="text-slate-200 font-semibold italic">"{taskTitle}"</span>. <br />
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 cursor-pointer"
            >
              Sim, excluir agora
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;