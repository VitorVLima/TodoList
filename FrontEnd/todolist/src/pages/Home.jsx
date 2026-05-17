import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Eye, Edit2, Trash2, Calendar } from "lucide-react"; // Importados ícones para os cards mobile
import Tabela from "../components/tabela";
import Paginacao from "../components/paginacao";
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import SuccessModal from "../components/successmodal";
import { useTasks } from "../hooks/useTasks";
import { Helmet } from "react-helmet-async";

function Home() {
  const {
    tasks,
    fetchTasks,
    searchTasks,
    isAddModalOpen,
    setIsAddModalOpen,
    filtroAtivo,
    paginaAtual,
    setPaginaAtual,
    totalPages,
    metrics,
    fetchMetrics,
  } = useOutletContext();

  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();

  // ESTADOS DOS MODAIS DE INTERAÇÃO
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [tarefaParaDeletar, setTarefaParaDeletar] = useState(null);
  const [tarefaParaConcluir, setTarefaParaConcluir] = useState(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const dispararSucesso = (mensagem) => {
    setSuccessMessage(mensagem);
    setIsSuccessOpen(true);
  };

  // FUNÇÕES CRUD REATIVAS
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      searchTasks("", filtroAtivo, paginaAtual, false, "");
      fetchMetrics("", filtroAtivo, false, "");
      dispararSucesso("Sua nova tarefa foi criada e salva com sucesso!");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      searchTasks("", filtroAtivo, paginaAtual, false, "");
      fetchMetrics("", filtroAtivo, false, "");
      dispararSucesso("A tarefa foi atualizada e sincronizada com o servidor.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      const paginaDestino =
        tasks.length === 1 && paginaAtual > 0 ? paginaAtual - 1 : paginaAtual;

      if (paginaDestino !== paginaAtual) {
        setPaginaAtual(paginaDestino);
      } else {
        searchTasks("", filtroAtivo, paginaAtual, false, "");
      }

      fetchMetrics("", filtroAtivo, false, "");
      dispararSucesso("A tarefa foi excluída permanentemente do sistema.");
    } else {
      alert("Não foi possível excluir a tarefa.");
    }
  };

  const onConfirmDone = async () => {
    const tarefaConcluida = { ...tarefaParaConcluir, concluida: true };
    const res = await handleUpdateTask(tarefaConcluida);
    if (res.success) {
      setTarefaParaConcluir(null);
      searchTasks("", filtroAtivo, paginaAtual, false, "");
      fetchMetrics("", filtroAtivo, false, "");
      dispararSucesso("Parabéns! A tarefa foi marcada como concluída.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const tratarErrosBackend = (backendError) => {
    if (backendError && backendError.errors) {
      const mensagens = Object.values(backendError.errors).join("\n");
      alert(`Erro de Validação:\n${mensagens}`);
    } else {
      alert(backendError?.message || "Erro inesperado no servidor.");
    }
  };

  const getPrioridadeBadge = (prioridade) => {
    switch (prioridade?.toUpperCase()) {
      case "ALTA":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "MEDIA":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-slate-700/50 text-slate-400 border border-slate-600/30";
    }
  };

  // Formata visualmente a string da data vinda do banco (YYYY-MM-DD) para exibição correta nos cards mobile
  const formatarDataCard = (dataString) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <>
      <div className="animate-in fade-in duration-500 space-y-4 md:space-y-6">
        <Helmet>
          <title>Home | Task Manager</title>
        </Helmet>

        {/* SEÇÃO CARD INDICADORES */}
        <section className="space-y-3 md:space-y-4">
          <header className="flex justify-between items-center px-0.5">
            <h1 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">
              Visão Geral — {filtroAtivo || "Todas as Tarefas"}
            </h1>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
            <div className="bg-slate-800/50 p-3.5 md:p-4 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <p className="text-slate-400 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                Total Registradas
              </p>
              <p className="text-xl md:text-2xl font-bold text-white mt-0.5">
                {metrics?.total || 0}
              </p>
            </div>
            <div className="bg-slate-800/50 p-3.5 md:p-4 rounded-2xl border border-slate-700 border-l-4 border-l-blue-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                Pendentes
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-400 mt-0.5">
                {metrics?.pendentes || 0}
              </p>
            </div>
            <div className="bg-slate-800/50 p-3.5 md:p-4 rounded-2xl border border-slate-700 border-l-4 border-l-emerald-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                Concluídas
              </p>
              <p className="text-xl md:text-2xl font-bold text-emerald-400 mt-0.5">
                {metrics?.concluidas || 0}
              </p>
            </div>
            <div className="bg-slate-800/50 p-3.5 md:p-4 rounded-2xl border border-slate-700 border-l-4 border-l-red-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                Atrasadas
              </p>
              <p className="text-xl md:text-2xl font-bold text-red-500 mt-0.5">
                {metrics?.atrasadas || 0}
              </p>
            </div>
          </div>

          {/* BARRA DE PROGRESSO */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 md:p-4 rounded-2xl space-y-2 shadow-inner">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Progresso Observado
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {metrics?.porcentagem || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${metrics?.porcentagem || 0}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* SEÇÃO LISTAGEM DE TAREFAS (HÍBRIDA) */}
        <section className="pb-4 md:pb-6">
          <h2 className="text-[11px] md:text-sm font-bold text-slate-400 uppercase tracking-widest p-4">
            {filtroAtivo === "Todas as Tarefas"
              ? "BLOCO DE TAREFAS"
              : `Filtrado por: ${filtroAtivo}`}
          </h2>

          {tasks.length > 0 ? (
            <>
              {/* 🖥️ VERSÃO PC: Mantém intacta a exibição clássica e robusta por Tabela */}
              <div className="hidden lg:block bg-slate-800/30 rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl w-full">
                <Tabela
                  tasks={tasks}
                  onToggle={(id) =>
                    setTarefaParaConcluir(tasks.find((t) => t.id === id))
                  }
                  onDelete={(id) =>
                    setTarefaParaDeletar(tasks.find((t) => t.id === id))
                  }
                  onEdit={(task) =>
                    !task.concluida && setTarefaParaEditar(task)
                  }
                  onShowDetail={(task) => setTarefaSelecionada(task)}
                />
              </div>

              {/* 📱 VERSÃO MOBILE: Substitui a tabela pela grade anatômica de cartões fluídos */}
              <div className="grid grid-cols-1 gap-3 lg:hidden">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group relative bg-slate-800/40 border transition-all duration-300 p-4 rounded-2xl flex flex-col justify-between gap-3.5 h-fit
                      ${
                        task.concluida
                          ? "border-slate-800/80 bg-slate-900/20 opacity-50"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-4">
                        <h3
                          className={`text-sm font-bold text-white tracking-tight break-words flex-1 ${task.concluida ? "line-through text-slate-500 font-medium" : ""}`}
                        >
                          {task.titulo}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${getPrioridadeBadge(task.prioridade)}`}
                        >
                          {task.prioridade}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed break-words line-clamp-2 ${task.concluida ? "text-slate-600" : "text-slate-400"}`}
                      >
                        {task.descricao || (
                          <span className="italic opacity-40">
                            Sem descrição para esta atividade.
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Calendar size={13} />
                        <span>Prazo: {formatarDataCard(task.dataLimite)}</span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {!task.concluida && (
                          <button
                            onClick={() => setTarefaParaConcluir(task)}
                            className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Concluir tarefa"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => setTarefaSelecionada(task)}
                          className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Ver detalhes"
                        >
                          <Eye size={15} />
                        </button>
                        {!task.concluida && (
                          <button
                            onClick={() => setTarefaParaEditar(task)}
                            className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Editar tarefa"
                          >
                            <Edit2 size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => setTarefaParaDeletar(task)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Excluir tarefa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-36 md:h-40 flex flex-col items-center justify-center text-slate-500 space-y-1.5 bg-slate-800/10 min-w-full rounded-2xl border border-slate-800/50">
              <p className="text-xs md:text-sm italic font-medium">
                Nenhuma tarefa correspondente encontrada.
              </p>
            </div>
          )}

          <Paginacao
            paginaAtual={paginaAtual}
            totalPages={totalPages}
            onPageChange={(novaPagina) => setPaginaAtual(novaPagina)}
          />
        </section>
      </div>

      {/* MODAIS DA PÁGINA */}
      <TaskDetailModal
        task={tarefaSelecionada}
        onClose={() => setTarefaSelecionada(null)}
      />
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAdd}
      />
      <UpdateTaskModal
        isOpen={!!tarefaParaEditar}
        task={tarefaParaEditar}
        onClose={() => setTarefaParaEditar(null)}
        onUpdate={onUpdate}
      />
      <ConfirmDeleteModal
        isOpen={!!tarefaParaDeletar}
        taskTitle={tarefaParaDeletar?.titulo}
        onClose={() => setTarefaParaDeletar(null)}
        onConfirm={onDelete}
      />
      <ConfirmDoneModal
        isOpen={!!tarefaParaConcluir}
        taskTitle={tarefaParaConcluir?.titulo}
        onClose={() => setTarefaParaConcluir(null)}
        onConfirm={onConfirmDone}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        mensagem={successMessage}
      />
    </>
  );
}

export default Home;
