import React, { useState } from "react";
import { useOutletContext } from "react-router-dom"; 
import { CheckCircle2, Clock, Calendar, AlertCircle, Eye, Edit2, Trash2 } from "lucide-react";
import Paginacao from "../components/paginacao"; 
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import SuccessModal from "../components/successmodal"; 
import { useTasks } from "../hooks/useTasks";

function TasksDayPage() {
  // ATUALIZADO: Consumindo 'metrics' e 'fetchMetrics' injetados centralizadamente pelo Layout.jsx
  const { 
    tasks, 
    fetchTasks, 
    isAddModalOpen, 
    setIsAddModalOpen, 
    filtroAtivo,
    paginaAtual,     
    setPaginaAtual,  
    totalPages,
    metrics,         
    fetchMetrics     
  } = useOutletContext();
  
  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();

  // ESTADOS DE INTERFACE
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

  // OPERAÇÕES CRUD REATIVAS (Sincronizam a tabela e chamam as métricas dinâmicas passando true em 'isToday')
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchTasks();
      fetchMetrics("", filtroAtivo, true, ""); // <-- Recarrega as métricas filtrando por HOJE
      dispararSucesso("Sua tarefa do dia foi criada e agendada com sucesso!");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      fetchTasks();
      fetchMetrics("", filtroAtivo, true, ""); // <-- Recarrega as métricas filtrando por HOJE
      dispararSucesso("A tarefa da jornada de hoje foi atualizada com sucesso.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      fetchTasks();
      fetchMetrics("", filtroAtivo, true, ""); // <-- Recarrega as métricas filtrando por HOJE
      dispararSucesso("A tarefa foi removida da sua lista de hoje.");
    } else {
      alert("Não foi possível excluir a tarefa.");
    }
  };

  const onConfirmDone = async () => {
    const tarefaConcluida = { ...tarefaParaConcluir, concluida: true };
    const res = await handleUpdateTask(tarefaConcluida);
    if (res.success) {
      setTarefaParaConcluir(null);
      fetchTasks();
      fetchMetrics("", filtroAtivo, true, ""); // <-- Recarrega as métricas filtrando por HOJE
      dispararSucesso("Boa! Mais uma tarefa finalizada no dia de hoje.");
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
      <div className="animate-in fade-in duration-500 space-y-8">
        
        {/* CABEÇALHO CUSTOMIZADO COM CARD INTEGRADO (MÉTRICAS DO SERVIDOR) */}
        <section className="bg-gradient-to-r from-slate-800/40 via-indigo-950/10 to-slate-800/40 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Focus Mode</span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              Jornada de Hoje <span className="text-xs text-slate-500 font-normal font-mono">/ {filtroAtivo}</span>
            </h1>
            <p className="text-slate-400 text-sm">Monitore e finalize seus blocos de foco programados para agora.</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60 w-full md:w-auto">
            <div className="space-y-0.5 min-w-[100px]">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Conclusão</p>
              <p className="text-lg font-black text-emerald-400">{metrics?.porcentagem || 0}%</p>
            </div>
            <div className="flex gap-1.5 border-l border-slate-800 pl-4">
              <div className="text-center px-2">
                <p className="text-xs font-bold text-white">{metrics?.total || 0}</p>
                <p className="text-[9px] text-slate-500 uppercase font-medium">Foco</p>
              </div>
              <div className="text-center px-2">
                <p className="text-xs font-bold text-emerald-400">{metrics?.concluidas || 0}</p>
                <p className="text-[9px] text-slate-500 uppercase font-medium">Feitas</p>
              </div>
            </div>
          </div>
        </section>

        {/* INDICADORES REAIS DO SERVIDOR PARA O DIA DE HOJE (CORRIGIDO) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Clock size={18} /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pendentes</p>
              <p className="text-xl font-bold text-white">{metrics?.pendentes || 0}</p>
            </div>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle2 size={18} /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Concluídas</p>
              <p className="text-xl font-bold text-white">{metrics?.concluidas || 0}</p>
            </div>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><AlertCircle size={18} /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Atrasos Ativos</p>
              <p className="text-xl font-bold text-white">{metrics?.atrasadas || 0}</p>
            </div>
          </div>
        </div>

        {/* LISTAGEM EM GRADE DE CARDS */}
        <section className="space-y-4 pb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">
            {filtroAtivo === "Todas as Tarefas" ? "Blocos de Trabalho" : `Hoje filtrado por: ${filtroAtivo}`}
          </h2>

          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group relative bg-slate-800/40 border transition-all duration-300 p-5 rounded-2xl flex flex-col justify-between gap-4 h-fit
                    ${task.concluida 
                      ? "border-slate-800/80 bg-slate-900/20 opacity-50" 
                      : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-slate-950/20"
                    }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`text-base font-bold text-white tracking-tight break-words flex-1
                        ${task.concluida ? "line-through text-slate-500 font-medium" : ""}`}
                      >
                        {task.titulo}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${getPrioridadeBadge(task.prioridade)}`}>
                        {task.prioridade}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed break-words line-clamp-2
                      ${task.concluida ? "text-slate-600" : "text-slate-400"}`}
                    >
                      {task.descricao || <span className="italic opacity-40">Sem descrição para esta atividade.</span>}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Calendar size={13} />
                      <span>Hoje</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
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
          ) : (
            <div className="bg-slate-800/10 border border-dashed border-slate-800 rounded-2xl py-16 flex flex-col items-center justify-center text-center px-4">
              <p className="text-sm italic font-medium text-slate-500">
                Nenhum bloco de foco ou tarefa ativa registrada para o dia de hoje.
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

      {/* MODAIS COMPORTAMENTAIS */}
      <TaskDetailModal task={tarefaSelecionada} onClose={() => setTarefaSelecionada(null)} />
      
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

export default TasksDayPage;