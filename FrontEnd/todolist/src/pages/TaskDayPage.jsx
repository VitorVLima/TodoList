import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // Hook para sincronizar com o Layout
import Tabela from "../components/tabela";
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";

// Hook de lógica compartilhada
import { useTasks } from "../hooks/useTasks";

function TasksDayPage() {
  const {
    tasks,
    fetchTasks,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useTasks();

  // Pegamos o estado do modal controlado pelo Layout.jsx
  const { isAddModalOpen, setIsAddModalOpen } = useOutletContext();

  // 1. ESTADOS DE INTERFACE
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [tarefaParaDeletar, setTarefaParaDeletar] = useState(null);
  const [tarefaParaConcluir, setTarefaParaConcluir] = useState(null);

  const endpointToday = "/tasks/today";


  // --- LÓGICA DE ESTATÍSTICAS ---
  const hoje = new Date().toISOString().split("T")[0];
  const total = tasks.length;
  const concluidas = tasks.filter((t) => t.concluida).length;
  const pendentes = total - concluidas;
  const atrasadas = tasks.filter((t) => !t.concluida && t.dataLimite < hoje).length;
  const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  // 3. FUNÇÕES DE MANIPULAÇÃO
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchTasks(endpointToday);
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      fetchTasks(endpointToday);
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      fetchTasks(endpointToday);
    } else {
      alert("Não foi possível excluir a tarefa.");
    }
  };

  const onConfirmDone = async () => {
    const tarefaConcluida = { ...tarefaParaConcluir, concluida: true };
    const res = await handleUpdateTask(tarefaConcluida);
    if (res.success) {
      setTarefaParaConcluir(null);
      fetchTasks(endpointToday);
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

  const handleToggleStatus = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.concluida) setTarefaParaConcluir(task);
  };

  useEffect(() => {
  fetchTasks(); 
}, []);

  return (
    <>
      

      <div className="animate-in fade-in duration-500 space-y-6">
        {/* CABEÇALHO E VISÃO GERAL */}
        <section className="space-y-4">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-tight">
                📅 Jornada de Hoje
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Foco nas entregas programadas para este dia.
              </p>
            </div>
            {/* O botão foi removido daqui pois já existe na Navbar */}
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Tarefas do Dia
              </p>
              <p className="text-2xl font-bold text-white">{total}</p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700 border-l-4 border-l-blue-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Restantes
              </p>
              <p className="text-2xl font-bold text-blue-400">{pendentes}</p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700 border-l-4 border-l-emerald-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Finalizadas
              </p>
              <p className="text-2xl font-bold text-emerald-400">{concluidas}</p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700 border-l-4 border-l-red-500 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Atrasadas
              </p>
              <p className="text-2xl font-bold text-red-500">{atrasadas}</p>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Conclusão de Hoje
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {porcentagem}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${porcentagem}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* LISTAGEM */}
        <section className="pb-6">
          <h2 className="text-lg font-bold text-white mb-3">
            Afazeres para {hoje === new Date().toISOString().split("T")[0] ? "Hoje" : hoje}
          </h2>
          <div className="bg-slate-800/30 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <Tabela
              tasks={tasks}
              onToggle={handleToggleStatus}
              onDelete={(id) => setTarefaParaDeletar(tasks.find((t) => t.id === id))}
              onEdit={(task) => !task.concluida && setTarefaParaEditar(task)}
              onShowDetail={(task) => setTarefaSelecionada(task)}
            />
          </div>
        </section>
      </div>

      <TaskDetailModal task={tarefaSelecionada} onClose={() => setTarefaSelecionada(null)} />
      
      {/* O modal agora é disparado pelo estado vindo do Layout (Navbar) */}
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
    </>
  );
}

export default TasksDayPage;