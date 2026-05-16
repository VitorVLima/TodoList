import React, { useState } from "react";
import { useOutletContext } from "react-router-dom"; // Hook para sincronizar com o Layout
import Tabela from "../components/tabela";
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import SuccessModal from "../components/successModal"; // Certifique-se de manter a importação correta
import { useTasks } from "../hooks/useTasks";

function TasksDayPage() {
  // ATUALIZADO: Capturamos também o 'filtroAtivo' que o Layout.jsx injeta no Outlet
  const { tasks: tasksGlobais, fetchTasks, isAddModalOpen, setIsAddModalOpen, filtroAtivo } = useOutletContext();
  
  // O hook local gerencia apenas as operações de escrita (POST, PUT, DELETE)
  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();

  // 2. ESTADOS DE INTERFACE
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

  // 3. LÓGICA DE FILTRAGEM POR DATA (APENAS HOJE)
  const hoje = new Date().toISOString().split("T")[0];

  // Filtramos as tarefas vindas do backend para garantir que apareçam APENAS as de hoje
  const tasksFiltradasDoDia = tasksGlobais.filter(
    (t) => t.dataLimite === hoje
  );

  // 4. MÉTRICAS E ESTATÍSTICAS BASEADAS APENAS NO DIA DE HOJE
  const total = tasksFiltradasDoDia.length;
  const concluidas = tasksFiltradasDoDia.filter((t) => t.concluida).length;
  const pendentes = total - concluidas;
  const atrasadas = tasksFiltradasDoDia.filter((t) => !t.concluida && t.dataLimite < hoje).length;
  const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  // 5. FUNÇÕES DE MANIPULAÇÃO (CRUD) COM RETORNO DE SUCESSO
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchTasks(); // Atualiza o estado global no Layout
      dispararSucesso("Sua tarefa do dia foi criada e agendada com sucesso!");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      fetchTasks(); // Atualiza o estado global no Layout
      dispararSucesso("A tarefa da jornada de hoje foi atualizada com sucesso.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      fetchTasks(); // Atualiza o estado global no Layout
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
      fetchTasks(); // Atualiza o estado global no Layout
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

  const handleToggleStatus = (id) => {
    const task = tasksFiltradasDoDia.find((t) => t.id === id);
    if (task && !task.concluida) setTarefaParaConcluir(task);
  };

  return (
    <>
      <div className="animate-in fade-in duration-500 space-y-6">
        {/* CABEÇALHO E VISÃO GERAL */}
        <section className="space-y-4">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-tight">
                📅 Jornada de Hoje — {filtroAtivo || "Todas as Tarefas"}
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Foco nas entregas programadas para este dia combinadas com seus filtros de busca.
              </p>
            </div>
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
            {filtroAtivo === "Todas as Tarefas" ? "Afazeres para Hoje" : `Hoje filtrado por: ${filtroAtivo}`}
          </h2>
          <div className="bg-slate-800/30 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <Tabela
              tasks={tasksFiltradasDoDia}
              onToggle={handleToggleStatus}
              onDelete={(id) => setTarefaParaDeletar(tasksFiltradasDoDia.find((t) => t.id === id))}
              onEdit={(task) => !task.concluida && setTarefaParaEditar(task)}
              onShowDetail={(task) => setTarefaSelecionada(task)}
            />
          </div>
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

      {/* MODAL DE CONFIRMAÇÃO DE SUCESSO (FECHA AO CLICAR FORA) */}
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
        mensagem={successMessage} 
      />
    </>
  );
}

export default TasksDayPage;