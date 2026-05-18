import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/custom-calendar.css";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import Tabela from "../components/tabela";
import Paginacao from "../components/paginacao";
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import SuccessModal from "../components/successmodal";
import { useTasks } from "../hooks/useTasks";
import api from "../services/api";
import { Helmet } from "react-helmet-async";

function CalendarioPage() {
  // CONSUMO DO CONTEXTO CENTRALIZADO
  const {
    tasks: tasksPaginadas,
    isAddModalOpen,
    setIsAddModalOpen,
    filtroAtivo,
    paginaAtual,
    setPaginaAtual,
    totalPages,
    metrics,
    fetchMetrics,
    searchTasks,
  } = useOutletContext();

  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();

  // Armazena os dias que possuem tarefas cadastradas [{ data: "YYYY-MM-DD", temAtrasada: true }]
  const [datasComTarefas, setDatasComTarefas] = useState([]);

  // ESTADOS DE INTERFACE
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
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

  // AUXILIAR DE DATA ESTÁVEL (Sem quebra de fuso)
  const extrairAnoMesDia = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (typeof dateInput === "string" && !dateInput.includes("T")) {
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Mapeia as tarefas identificando quais dias possuem pendências atrasadas
  const carregarPontosCalendario = async () => {
    try {
      const response = await api.get("/tasks/search", {
        params: {
          name: "",
          statusFiltro: "Todas as Tarefas",
          page: 0,
          size: 1000,
        },
      });
      const conteudo = response.data.content || [];
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const mapaDatas = conteudo.reduce((acc, task) => {
        const dataFormatada = extrairAnoMesDia(task.dataLimite);
        if (!dataFormatada) return acc;

        const [ano, mes, dia] = task.dataLimite.split("-");
        const dataLimiteTask = new Date(ano, mes - 1, dia);
        
        const estaAtrasada = !task.concluida && dataLimiteTask < hoje;

        if (!acc[dataFormatada]) {
          acc[dataFormatada] = { data: dataFormatada, temAtrasada: estaAtrasada };
        } else if (estaAtrasada) {
          acc[dataFormatada].temAtrasada = true;
        }

        return acc;
      }, {});

      setDatasComTarefas(Object.values(mapaDatas));
    } catch (error) {
      console.error("Erro ao carregar marcadores do calendário:", error);
    }
  };

  useEffect(() => {
    carregarPontosCalendario();
  }, []);

  // MODIFICADO: MONITOR DINÂMICO UNIFICADO E INTELIGENTE
  // Resolve de uma vez por todas conflitos de Race Condition ao carregar a tela do calendário
  useEffect(() => {
    const dataFormatada = extrairAnoMesDia(dataSelecionada);

    // 🛡️ TRAVA DE SEGURANÇA: Se o usuário mudou de tela (ou trocou a data/filtro) mas o estado 
    // global ainda preserva a paginaAtual da tela anterior, barramos o ciclo, limpamos para 0 e saímos.
    if (paginaAtual !== 0 && tasksPaginadas.length === 0) {
      setPaginaAtual(0);
      return; 
    }

    // Executa as chamadas com total segurança de alinhamento
    searchTasks("", filtroAtivo, paginaAtual, false, dataFormatada);
    fetchMetrics("", filtroAtivo, false, dataFormatada);

  }, [dataSelecionada, filtroAtivo, paginaAtual]); 

  // OPERAÇÕES CRUD REATIVAS
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      const dataFormatada = extrairAnoMesDia(dataSelecionada);
      searchTasks("", filtroAtivo, paginaAtual, false, dataFormatada);
      fetchMetrics("", filtroAtivo, false, dataFormatada);
      carregarPontosCalendario();
      dispararSucesso("Sua tarefa foi agendada e salva com sucesso no calendário!");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      const dataFormatada = extrairAnoMesDia(dataSelecionada);
      searchTasks("", filtroAtivo, paginaAtual, false, dataFormatada);
      fetchMetrics("", filtroAtivo, false, dataFormatada);
      carregarPontosCalendario();
      dispararSucesso("Os dados da tarefa foram atualizados com sucesso.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      const dataFormatada = extrairAnoMesDia(dataSelecionada);

      const paginaDestino = tasksPaginadas.length === 1 && paginaAtual > 0 ? paginaAtual - 1 : paginaAtual;
      if (paginaDestino !== paginaAtual) {
        setPaginaAtual(paginaDestino);
      } else {
        searchTasks("", filtroAtivo, paginaAtual, false, dataFormatada);
      }

      fetchMetrics("", filtroAtivo, false, dataFormatada);
      carregarPontosCalendario();
      dispararSucesso("A tarefa foi removida definitivamente do seu cronograma.");
    } else {
      alert("Não foi possível excluir a tarefa.");
    }
  };

  const onConfirmDone = async () => {
    const tarefaConcluida = { ...tarefaParaConcluir, concluida: true };
    const res = await handleUpdateTask(tarefaConcluida);
    if (res.success) {
      setTarefaParaConcluir(null);
      const dataFormatada = extrairAnoMesDia(dataSelecionada);
      searchTasks("", filtroAtivo, paginaAtual, false, dataFormatada);
      fetchMetrics("", filtroAtivo, false, dataFormatada);
      carregarPontosCalendario(); 
      dispararSucesso("Ótimo! Tarefa concluída e atualizada no painel visual.");
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

  return (
    <>
      <div className="animate-in fade-in duration-500 flex flex-col gap-3 md:gap-4 w-full">
        <Helmet>
          <title>Calendário | Task Manager</title>
        </Helmet>

        {/* HEADER */}
        <header className="px-0.5">
          <h1 className="text-[15px] sm:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <CalendarIcon size={20} className="text-indigo-500 shrink-0" />
            Calendário — {filtroAtivo || "Todas as Tarefas"}
          </h1>
        </header>

        {/* CONTAINER DO GRID PRINCIPAL */}
        <main className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 md:gap-6 w-full items-start min-w-0">
          {/* COLUNA DO CALENDÁRIO */}
          <div className="space-y-3 md:space-y-4 w-full">
            <div className="bg-slate-800/50 p-3.5 md:p-4 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm">
              <Calendar
                onChange={setDataSelecionada}
                value={dataSelecionada}
                className="dark-theme-calendar w-full"
                tileClassName={({ date, view }) => {
                  if (view === "month" && date < new Date().setHours(0, 0, 0, 0)) {
                    return "react-calendar__tile--past";
                  }
                }}
                tileContent={({ date, view }) => {
                  if (view === "month") {
                    const dataStr = extrairAnoMesDia(date);
                    const correspondencia = datasComTarefas.find((t) => t.data === dataStr);

                    if (correspondencia) {
                      return correspondencia.temAtrasada ? (
                        /* Bolinha Vermelha ULTRA NÍTIDA */
                        <div className="h-2 w-2 bg-red-500 rounded-full mx-auto mt-1 shadow-[0_0_10px_#ef4444,0_0_4px_#ef4444] animate-pulse"></div>
                      ) : (
                        /* Bolinha Azul Tradicional */
                        <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full mx-auto mt-1 shadow-[0_0_5px_rgba(99,102,241,0.8)]"></div>
                      );
                    }
                  }
                }}
              />
            </div>

            {/* CAIXA DATA SELECIONADA */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-3.5 md:p-4 rounded-2xl flex items-center justify-between h-[64px] md:h-[68px]">
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] uppercase font-bold text-indigo-400 tracking-widest">
                  Data Selecionada
                </p>
                <p className="text-xs md:text-sm font-bold text-white mt-0.5">
                  {dataSelecionada.toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/30 min-w-[40px] text-center flex items-center justify-center">
                <span className="text-indigo-400 font-black text-base md:text-lg">
                  {metrics?.total ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* COLUNA LISTAGEM DE TAREFAS */}
          <div className="flex flex-col gap-2.5 md:gap-3 w-full pb-4 md:pb-6 min-w-0 overflow-hidden">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[11px] md:text-sm font-bold text-slate-400 uppercase tracking-widest p-2">
                {filtroAtivo === "Todas as Tarefas" ? "BLOCO DE TAREFAS" : `Filtrado por: ${filtroAtivo}`}
              </h2>
              <span className="bg-slate-800 text-slate-500 text-[9px] md:text-[10px] px-2 py-1 rounded-md font-mono uppercase">
                {metrics?.total ?? 0} Itens
              </span>
            </div>

            {tasksPaginadas.length > 0 ? (
              <>
                <div className="hidden lg:block bg-slate-800/30 rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl w-full">
                  <Tabela
                    tasks={tasksPaginadas}
                    onToggle={(id) => setTarefaParaConcluir(tasksPaginadas.find((t) => t.id === id))}
                    onDelete={(id) => setTarefaParaDeletar(tasksPaginadas.find((t) => t.id === id))}
                    onEdit={(task) => !task.concluida && setTarefaParaEditar(task)}
                    onShowDetail={(task) => setTarefaSelecionada(task)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 lg:hidden">
                  {tasksPaginadas.map((task) => (
                    <div
                      key={task.id}
                      className={`group relative bg-slate-800/40 border transition-all duration-300 p-4 rounded-2xl flex flex-col justify-between gap-3.5 h-fit
                        ${task.concluida
                          ? "border-slate-800/80 bg-slate-900/20 opacity-50"
                          : "border-slate-800 hover:border-slate-700"
                        }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className={`text-sm font-bold text-white tracking-tight break-words flex-1 ${task.concluida ? "line-through text-slate-500 font-medium" : ""}`}>
                            {task.titulo}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${getPrioridadeBadge(task.prioridade)}`}>
                            {task.prioridade}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed break-words line-clamp-2 ${task.concluida ? "text-slate-600" : "text-slate-400"}`}>
                          {task.descricao || <span className="italic opacity-40">Sem descrição para esta atividade.</span>}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <CalendarIcon size={13} />
                          <span>Agendada</span>
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
                  Nenhuma tarefa correspondente encontrada para este dia.
                </p>
              </div>
            )}

            <Paginacao
              paginaAtual={paginaAtual}
              totalPages={totalPages}
              onPageChange={(novaPagina) => setPaginaAtual(novaPagina)}
            />
          </div>
        </main>
      </div>

      {/* MODAIS COMPORTAMENTAIS */}
      <TaskDetailModal task={tarefaSelecionada} onClose={() => setTarefaSelecionada(null)} />
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={onAdd} />
      <UpdateTaskModal isOpen={!!tarefaParaEditar} task={tarefaParaEditar} onClose={() => setTarefaParaEditar(null)} onUpdate={onUpdate} />
      <ConfirmDeleteModal isOpen={!!tarefaParaDeletar} taskTitle={tarefaParaDeletar?.titulo} onClose={() => setTarefaParaDeletar(null)} onConfirm={onDelete} />
      <ConfirmDoneModal isOpen={!!tarefaParaConcluir} taskTitle={tarefaParaConcluir?.titulo} onClose={() => setTarefaParaConcluir(null)} onConfirm={onConfirmDone} />
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} message={successMessage} />
    </>
  );
}

export default CalendarioPage;