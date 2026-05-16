import React from "react";
import { CheckCircle2 } from "lucide-react";

function SuccessModal({ isOpen, onClose, mensagem }) {
  if (!isOpen) return null;

  // Função para fechar se o clique acontecer estritamente no fundo escuro
  const handleFundoClique = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleFundoClique} // Monitora o clique no fundo
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      {/* O 'cursor-default' aqui garante que o mouse volte ao normal dentro da caixinha */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center space-y-4 animate-in zoom-in-95 duration-200 cursor-default">
        
        {/* Ícone Animado */}
        <div className="flex justify-center text-emerald-500 animate-bounce">
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>

        {/* Mensagem Dinâmica */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Sucesso!</h3>
          <p className="text-sm text-slate-400">{mensagem}</p>
        </div>

        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;