import React, { useState } from "react"; // Removido useEffect pois o Layout já gerencia o ciclo de dados
import { useOutletContext } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/custom-calendar.css";
import Tabela from "../components/tabela";
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import SuccessModal from "../components/SuccessModal"; // Importado o Modal de Sucesso
import { useTasks } from "../hooks/useTasks";

function CalendarioPage() {
  // 1. CONSUMO DO CONTEXTO COMPARTILHADO DO LAYOUT
  const { tasks: tasksGlobais, fetchTasks, isAddModalOpen, setIsAddModalOpen } = useOutletContext();

  // O hook local gerencia estritamente as operações de mutação (POST, PUT, DELETE)
  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();

  // 2. ESTADOS DE INTERFACE
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const [tarefaParaDeletar, setTarefaParaDeletar] = useState(null);
  const [tarefaParaConcluir, setTarefaParaConcluir] = useState(null);

  // ESTADOS DO MODAL DE SUCESSO
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // FUNÇÃO AUXILIAR PARA DISPARAR O SUCESSO
  const dispararSucesso = (mensagem) => {
    setSuccessMessage(mensagem);
    setIsSuccessOpen(true);
  };

  // 3. FUNÇÕES DE AUXÍLIO
  const formatarData = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  // Filtramos as tarefas baseado na data selecionada no calendário
  const tarefasDoDia = tasksGlobais.filter(
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

  // 4. FUNÇÕES CRUD COM INTERCEPTAÇÃO DE SUCESSO
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchTasks(); // Atualiza o estado centralizado no Layout
      dispararSucesso("Sua tarefa foi agendada e salva com sucesso no calendário!");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      fetchTasks(); // Atualiza o estado centralizado no Layout
      dispararSucesso("Os dados da tarefa foram atualizados com sucesso.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      fetchTasks(); // Atualiza o estado centralizado no Layout
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
      fetchTasks(); // Atualiza o estado centralizado no Layout
      dispararSucesso("Ótimo! Tarefa concluída e atualizada no painel visual.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  return (
    <>
      <div className="animate-in fade-in duration-500 flex flex-col gap-4 w-full">
        <header>
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">
            📅 Planejamento Visual
          </h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 w-full items-start">
          {/* COLUNA DO CALENDÁRIO */}
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm">
              <Calendar
                onChange={setDataSelecionada}
                value={dataSelecionada}
                className="dark-theme-calendar w-full"
                tileContent={({ date, view }) => {
                  if (
                    view === "month" &&
                    tasksGlobais.some((t) => t.dataLimite === formatarData(date))
                  ) {
                    return (
                      <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full mx-auto mt-1 shadow-[0_0_5px_rgba(99,102,241,0.8)]"></div>
                    );
                  }
                }}
              />
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">
                  Data Selecionada
                </p>
                <p className="text-sm font-bold text-white">
                  {dataSelecionada.toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/30">
                <span className="text-indigo-400 font-bold text-lg">
                  {tarefasDoDia.length}
                </span>
              </div>
            </div>
          </div>

          {/* COLUNA DA TABELA */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-bold text-white">Tarefas do Dia</h2>
              <span className="bg-slate-800 text-slate-500 text-[10px] px-2 py-1 rounded-md font-mono uppercase">
                {tarefasDoDia.length} Itens
              </span>
            </div>

            <div className="bg-slate-800/30 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl w-full h-fit">
              {tarefasDoDia.length > 0 ? (
                <Tabela
                  tasks={tarefasDoDia}
                  onToggle={(id) =>
                    setTarefaParaConcluir(tasksGlobais.find((t) => t.id === id))
                  }
                  onDelete={(id) =>
                    setTarefaParaDeletar(tasksGlobais.find((t) => t.id === id))
                  }
                  onEdit={(task) =>
                    !task.concluida && setTarefaParaEditar(task)
                  }
                  onShowDetail={(task) => setTarefaSelecionada(task)}
                />
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 space-y-2 bg-slate-800/10">
                  <p className="text-sm italic font-medium">
                    Nenhuma tarefa encontrada para este dia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODAIS COMPORTAMENTAIS */}
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

      {/* MODAL DE ALERTAS DE SUCESSO (FECHA AO CLICAR FORA) */}
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
        mensagem={successMessage} 
      />
    </>
  );
}

export default CalendarioPage;