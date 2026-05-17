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

  // Estados para controlar se o campo foi tocado (blur)
  const [tituloTocado, setTituloTocado] = useState(false);
  const [descricaoTocada, setDescricaoTocada] = useState(false);
  const [dataTocada, setDataTocada] = useState(false);

  // Estado para capturar o clique em "Salvar Alterações"
  const [tentouSubmeter, setTentouSubmeter] = useState(false);

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

  // CORRIGIDO: Extração estável da data atual respeitando o fuso horário local brasileiro
  const obterDataLocalString = () => {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const hojeLocal = obterDataLocalString();

  // Validações em tempo real (Apenas via JavaScript)
  const tituloInvalido = taskData.titulo.trim() === "";
  const descricaoInvalida = taskData.descricao.trim() === "";
  
  // Validação de data via JS: se vazia, incompleta, formato inválido ou dia anterior a hoje
  const dataInvalida = 
    taskData.dataLimite === "" || 
    taskData.dataLimite.length < 10 || 
    isNaN(Date.parse(taskData.dataLimite)) ||
    taskData.dataLimite < hojeLocal; // <-- Atualizado para a variável local estável

  // Condicionais para renderizar o estado visual de erro
  const mostrarErroTitulo = tituloInvalido && (tituloTocado || tentouSubmeter);
  const mostrarErroDescricao = descricaoInvalida && (descricaoTocada || tentouSubmeter);
  const mostrarErroData = dataInvalida && (dataTocada || tentouSubmeter);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTentouSubmeter(true);

    if (tituloInvalido || dataInvalida || descricaoInvalida) return;

    // Mantém o ID e outros campos originais e mescla com os novos dados
    onUpdate({ ...task, ...taskData });

    // Reseta flags de erro e fecha
    setTituloTocado(false);
    setDescricaoTocada(false);
    setDataTocada(false);
    setTentouSubmeter(false);
    onClose();
  };

  const handleClose = () => {
    setTituloTocado(false);
    setDescricaoTocada(false);
    setDataTocada(false);
    setTentouSubmeter(false);
    onClose();
  };

  const isAtrasada = task?.statusCustomizado === "ATRASADA";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-backdrop cursor-pointer"
      onClick={handleClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-modal cursor-default"
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
            type="button"
            onClick={handleClose}
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
              onBlur={() => setTituloTocado(true)}
              className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white outline-none transition-all shadow-inner ${
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
              rows="3"
              onBlur={() => setDescricaoTocada(true)}
              className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white outline-none transition-all resize-none shadow-inner ${
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
                  disabled={isAtrasada}
                  onClick={() => setTaskData({ ...taskData, prioridade: p })}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all border ${
                    (isAtrasada ? p === "ALTA" : taskData.prioridade === p)
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40"
                      : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500"
                  } ${isAtrasada ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
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
            <input
              type="date"
              min={hojeLocal} // <-- ATUALIZADO: Bloqueia apenas dias anteriores ao de hoje real
              onBlur={() => setDataTocada(true)}
              className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-slate-200 
                outline-none transition-all appearance-none cursor-pointer [color-scheme:dark] shadow-inner ${
                  mostrarErroData
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                }`}
              value={taskData.dataLimite}
              onChange={(e) =>
                setTaskData({ ...taskData, dataLimite: e.target.value })
              }
            />
            {mostrarErroData && (
              <p className="text-red-500 text-xs font-medium mt-1">
                {taskData.dataLimite < hojeLocal && taskData.dataLimite !== "" 
                  ? "A data limite não pode ser anterior ao dia de hoje." 
                  : "Insira uma data válida e não deixe o campo vazio."}
              </p>
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;