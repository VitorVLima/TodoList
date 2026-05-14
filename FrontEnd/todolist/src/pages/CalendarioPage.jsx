import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/custom-calendar.css";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Tabela from "../components/tabela";
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import { useTasks } from "../hooks/useTasks";

function CalendarioPage() {
  const { 
    tasks, 
    fetchTasks, 
    handleAddTask, 
    handleUpdateTask, 
    handleDeleteTask 
  } = useTasks();

  // 1. ESTADOS DE INTERFACE (Modais e UI)
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [tarefaParaDeletar, setTarefaParaDeletar] = useState(null);
  const [tarefaParaConcluir, setTarefaParaConcluir] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Busca inicial das tarefas
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. FUNÇÕES DE AUXÍLIO
  const formatarData = (date) => date.toISOString().split("T")[0];

  const tarefasDoDia = tasks.filter(
    (task) => task.dataLimite === formatarData(dataSelecionada)
  );

  const tratarErrosBackend = (backendError) => {
    if (backendError && backendError.errors) {
      const mensagens = Object.values(backendError.errors).join("\n");
      alert(`Erro de Validação:\n${mensagens}`);
    } else {
      alert(backendError?.message || "Erro inesperado no servidor.");
    }
  };

  // 3. FUNÇÕES DE MANIPULAÇÃO (CRUD)
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchTasks();
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      fetchTasks();
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      fetchTasks();
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
    } else {
      tratarErrosBackend(res.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-850">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 min-h-screen bg-slate-900 text-slate-200 font-sans`}>
        <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

        <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h1 className="text-2xl font-bold text-white">Meu Calendário</h1>
            <div className="bg-slate-800 p-4 rounded-3xl border border-slate-700 shadow-xl">
              <Calendar
                onChange={setDataSelecionada}
                value={dataSelecionada}
                className="dark-theme-calendar"
                tileContent={({ date, view }) => {
                  if (view === 'month' && tasks.some(t => t.dataLimite === formatarData(date))) {
                    return <div className="h-1 w-1 bg-indigo-500 rounded-full mx-auto mt-1"></div>;
                  }
                }}
              />
            </div>
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl">
              <p className="text-sm text-indigo-400 font-medium">
                Dia: {dataSelecionada.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Tarefas do Dia</h2>
            {tarefasDoDia.length > 0 ? (
              <Tabela 
                tasks={tarefasDoDia}
                onToggle={(id) => setTarefaParaConcluir(tasks.find(t => t.id === id))}
                onDelete={(id) => setTarefaParaDeletar(tasks.find(t => t.id === id))}
                onEdit={(task) => !task.concluida && setTarefaParaEditar(task)}
                onShowDetail={(task) => setTarefaSelecionada(task)}
              />
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center text-slate-500">
                Nenhuma tarefa para este dia.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAIS */}
      <TaskDetailModal task={tarefaSelecionada} onClose={() => setTarefaSelecionada(null)} />
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={onAdd} />
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
    </div>
  );
}

export default CalendarioPage;