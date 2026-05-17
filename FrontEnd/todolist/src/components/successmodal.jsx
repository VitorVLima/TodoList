import React from "react";
import { CheckCircle2 } from "lucide-react";

function SuccessModal({ isOpen, onClose, mensagem }) {
  if (!isOpen) return null;

  const handleFundoClique = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleFundoClique}
      /* CORRIGIDO: Centralização estável com flex e pb-20 no mobile para flutuar acima da barra fixa inferior */
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-20 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        /* CORRIGIDO: rounded-3xl completo e max-h-[80vh] garantindo que mensagens longas rolem internamente sem quebrar */
        className="bg-slate-800 border border-slate-700 p-5 sm:p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4 max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
      >
        <div className="overflow-y-auto no-scrollbar space-y-4 py-1 flex-1">
          {/* Ícone Animado */}
          <div className="flex justify-center text-emerald-500 animate-bounce shrink-0">
            <CheckCircle2 size={48} sm:size={56} strokeWidth={2.5} />
          </div>

          {/* Mensagem Dinâmica */}
          <div className="space-y-1.5 break-words">
            <h3 className="text-base sm:text-lg font-bold text-white">Sucesso!</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-1">{mensagem}</p>
          </div>
        </div>

        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="w-full h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/20 cursor-pointer shrink-0"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;