import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Tabela from "../components/tabela";
import Paginacao from "../components/paginacao"; 
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import SuccessModal from "../components/successmodal"; 
import { useTasks } from "../hooks/useTasks";

function Home() {
  // ATUALIZADO: Capturamos 'metrics' e 'fetchMetrics' que o Layout.jsx buscou no Spring Boot
  const { 
    tasks, 
    fetchTasks, 
    isAddModalOpen, 
    setIsAddModalOpen, 
    filtroAtivo,
    paginaAtual,     
    setPaginaAtual,  
    totalPages,      
    metrics,         // <-- ADICIONADO
    fetchMetrics     // <-- ADICIONADO
  } = useOutletContext();
  
  // O hook local gerencia apenas as operações de escrita (POST, PUT, DELETE)
  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();

  // ESTADOS DOS MODAIS DE INTERAÇÃO
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [tarefaParaDeletar, setTarefaParaDeletar] = useState(null);
  const [tarefaParaConcluir, setTarefaParaConcluir] = useState(null);

  // ESTADOS DO MODAL DE SUCESSO
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // FUNÇÃO AUXILIAR PARA DISPARAR O MODAL DE SUCESSO
  const dispararSucesso = (mensagem) => {
    setSuccessMessage(mensagem);
    setIsSuccessOpen(true);
  };

  // FUNÇÕES CRUD REATIVAS (Disparam fetchTasks E fetchMetrics para sincronizar a tela por completo)
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchTasks(); 
      fetchMetrics(); // <-- Atualiza os cards superiores reativamente
      dispararSucesso("Sua nova tarefa foi criada e salva com sucesso!");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      fetchTasks();
      fetchMetrics(); // <-- Atualiza os cards superiores reativamente
      dispararSucesso("A tarefa foi atualizada e sincronizada com o servidor.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      fetchTasks();
      fetchMetrics(); // <-- Atualiza os cards superiores reativamente
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
      fetchTasks();
      fetchMetrics(); // <-- Atualiza os cards superiores reativamente
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

  return (
    <>
      <div className="animate-in fade-in duration-500 space-y-6">
        {/* SEÇÃO CARD INDICADORES (MÉTRICAS REAIS DO ENDPOINT DO SPRING BOOT) */}
        <section className="space-y-4">
          <header className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">
              Visão Geral — {filtroAtivo || "Todas as Tarefas"}
            </h1>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Total no Banco</p>
              <p className="text-2xl font-bold text-white">{metrics?.total || 0}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 border-l-4 border-l-blue-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Pendentes</p>
              <p className="text-2xl font-bold text-blue-400">{metrics?.pendentes || 0}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 border-l-4 border-l-emerald-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Concluídas</p>
              <p className="text-2xl font-bold text-emerald-400">{metrics?.concluidas || 0}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 border-l-4 border-l-red-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Atrasadas</p>
              <p className="text-2xl font-bold text-red-500">{metrics?.atrasadas || 0}</p>
            </div>
          </div>

          {/* BARRA DE PROGRESSO CALCULADA EM TEMPO REAL PELO JAVASCRIPT/POSTGRESQL */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl space-y-2 shadow-inner">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progresso Observado</span>
              <span className="text-xs font-bold text-emerald-400">{metrics?.porcentagem || 0}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${metrics?.porcentagem || 0}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DA TABELA PRINCIPAL */}
        <section className="pb-6">
          <h2 className="text-lg font-bold text-white mb-3">
            {filtroAtivo === "Todas as Tarefas" ? "Minhas Tarefas" : `Filtrado por: ${filtroAtivo}`}
          </h2>
          <div className="bg-slate-800/30 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <Tabela
              tasks={tasks}
              onToggle={(id) => setTarefaParaConcluir(tasks.find(t => t.id === id))}
              onDelete={(id) => setTarefaParaDeletar(tasks.find(t => t.id === id))}
              onEdit={(task) => !task.concluida && setTarefaParaEditar(task)}
              onShowDetail={(task) => setTarefaSelecionada(task)}
            />
          </div>

          <Paginacao 
            paginaAtual={paginaAtual} 
            totalPages={totalPages} 
            onPageChange={(novaPagina) => setPaginaAtual(novaPagina)} 
          />
        </section>
      </div>

      {/* MODAIS DA PÁGINA */}
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

export default Home;