import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Plus, AlignLeft, Flag } from "lucide-react";

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [taskData, setTaskData] = useState({
    titulo: "",
    descricao: "",
    prioridade: "MEDIA",
    dataLimite: "",
  });

  // Estados para controlar se o campo foi tocado (blur)
  const [tituloTocado, setTituloTocado] = useState(false);
  const [descricaoTocada, setDescricaoTocada] = useState(false);
  const [dataTocada, setDataTocada] = useState(false);

  // Estado para capturar o clique em "Criar Tarefa"
  const [tentouSubmeter, setTentouSubmeter] = useState(false);

  if (!isOpen) return null;

  // Validações em tempo real
  const tituloInvalido = taskData.titulo.trim() === "";
  const descricaoInvalida = taskData.descricao.trim() === "";
  const dataInvalida = taskData.dataLimite === "" || isNaN(Date.parse(taskData.dataLimite));

  // Condicionais para renderizar o estado visual de erro
  const mostrarErroTitulo = tituloInvalido && (tituloTocado || tentouSubmeter);
  const mostrarErroDescricao = descricaoInvalida && (descricaoTocada || tentouSubmeter);
  const mostrarErroData = dataInvalida && (dataTocada || tentouSubmeter);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTentouSubmeter(true); // Força a validação visual de todos os campos

    // Bloqueia o envio se houver campos inválidos (sem disparar alert)
    if (tituloInvalido || dataInvalida || descricaoInvalida) return;

    onAdd({
      ...taskData,
      concluida: false
    });

    // Limpa o formulário, estados de validação e fecha o modal
    setTaskData({
      titulo: "",
      descricao: "",
      prioridade: "MEDIA",
      dataLimite: "",
    });
    setTituloTocado(false);
    setDataTocada(false);
    setDescricaoTocada(false);
    setTentouSubmeter(false);
    onClose();
  };

  // Reseta os estados de erro caso o usuário decida fechar o modal sem salvar
  const handleClose = () => {
    setTituloTocado(false);
    setDescricaoTocada(false);
    setDataTocada(false);
    setTentouSubmeter(false);
    onClose();
  };

  const hoje = new Date().toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-backdrop"
      onClick={handleClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Plus size={20} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* TÍTULO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
              Título da Tarefa
            </label>
            <input
              type="text"
              placeholder="Ex: Finalizar CRUD de Produtos"
              onBlur={() => setTituloTocado(true)}
              className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 shadow-inner ${
                mostrarErroTitulo
                  ? "border-red-500 focus:ring-2 focus:ring-red-500"
                  : "border-slate-700 focus:ring-2 focus:ring-indigo-500"
              }`}
              value={taskData.titulo}
              onChange={(e) =>
                setTaskData({ ...taskData, titulo: e.target.value })
              }
            />
            {mostrarErroTitulo && (
              <p className="text-red-500 text-xs font-medium mt-1">Por favor, não deixe o campo vazio.</p>
            )}
          </div>

          {/* DESCRIÇÃO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
              <AlignLeft size={14} /> Descrição
            </label>
            <textarea
              placeholder="Detalhes sobre o que precisa ser feito..."
              onBlur={() => setDescricaoTocada(true)}
              rows="3"
              className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 resize-none shadow-inner ${
                mostrarErroDescricao
                  ? "border-red-500 focus:ring-2 focus:ring-red-500"
                  : "border-slate-700 focus:ring-2 focus:ring-indigo-500"
              }`}
              value={taskData.descricao}
              onChange={(e) =>
                setTaskData({ ...taskData, descricao: e.target.value })
              }
            />
            {mostrarErroDescricao && (
              <p className="text-red-500 text-xs font-medium mt-1">Por favor, preencha a descrição da tarefa.</p>
            )}
          </div>

          {/* PRIORIDADE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
              <Flag size={14} /> Prioridade
            </label>
            <div className="flex gap-2">
              {["ALTA", "MEDIA", "BAIXA"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTaskData({ ...taskData, prioridade: p })}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all border ${
                    taskData.prioridade === p
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40"
                      : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 cursor-pointer"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* DATA LIMITE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
              <CalendarIcon size={14} /> Prazo Final
            </label>
            <div className="relative group">
              <input
                type="date"
                min={hoje}
                onBlur={() => setDataTocada(true)}
                value={taskData.dataLimite}
                onChange={(e) =>
                  setTaskData({ ...taskData, dataLimite: e.target.value })
                }
                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-slate-200 
                  outline-none transition-all appearance-none cursor-pointer [color-scheme:dark] shadow-inner ${
                    mostrarErroData
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
              />
            </div>
            {mostrarErroData && (
              <p className="text-red-500 text-xs font-medium mt-1">Insira uma data válida e não deixe o campo vazio.</p>
            )}
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold hover:opacity-90 shadow-lg shadow-indigo-900/20 transition-all cursor-pointer"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
