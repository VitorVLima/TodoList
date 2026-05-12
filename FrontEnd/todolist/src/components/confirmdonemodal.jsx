import { CheckCircle2, X } from "lucide-react";

const ConfirmDoneModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Finalizar Tarefa?</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Deseja marcar <span className="text-emerald-400 font-semibold">"{taskTitle}"</span> como concluída? <br />
            Uma vez finalizada, ela não poderá ser reativada.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 cursor-pointer"
            >
              Sim, concluir
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
            >
              Ainda não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDoneModal;