import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div 
      /* CORRIGIDO: Centralização vertical com flex-col e pb-20 no mobile para flutuar acima da barra inferior fixa */
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 pb-20 sm:p-4 bg-black/80 backdrop-blur-md animate-backdrop cursor-pointer"
      onClick={onClose}
    >
      <div 
        /* CORRIGIDO: rounded-3xl completo e max-h-[80vh] para total segurança responsiva */
        className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] sm:max-h-none flex flex-col animate-modal cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CORRIGIDO: Padded sutil p-6 no mobile e p-8 no PC para economizar espaço de tela útil */}
        <div className="p-6 sm:p-8 text-center overflow-y-auto no-scrollbar">
          {/* Ícone de Alerta Animado */}
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-red-500/20 shrink-0">
            <AlertTriangle size={28} className="text-red-500 animate-pulse sm:w-8 sm:h-8" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Excluir Tarefa?</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 break-words">
            Você está prestes a excluir: <br />
            <span className="text-slate-200 font-semibold italic">"{taskTitle}"</span>. <br />
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 cursor-pointer"
            >
              Sim, excluir agora
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
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