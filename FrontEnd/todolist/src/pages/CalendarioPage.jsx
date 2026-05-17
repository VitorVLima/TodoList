import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/custom-calendar.css";
import Tabela from "../components/tabela";
import Paginacao from "../components/paginacao"; 
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import SuccessModal from "../components/successmodal"; 
import { useTasks } from "../hooks/useTasks";
import api from "../services/api"; // Importação direta da API para busca de pontos

function CalendarioPage() {
  // 1. CONSUMO DO CONTEXTO CENTRALIZADO (Paginado do Backend)
  const { 
    tasks: tasksPaginadas, 
    fetchTasks,
    searchTasks,           
    isAddModalOpen, 
    setIsAddModalOpen, 
    filtroAtivo,
    paginaAtual,     
    setPaginaAtual,
    totalPages             
  } = useOutletContext();

  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();

  // Estado local exclusivo para armazenar os dias que possuem tarefas cadastradas
  const [datasComTarefas, setDatasComTarefas] = useState([]);

  // 2. ESTADOS DE INTERFACE
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

  // 3. AUXILIAR DE DATA ESTÁVEL (Sem quebra de fuso)
  const extrairAnoMesDia = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (typeof dateInput === 'string' && !dateInput.includes('T')) {
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Função para carregar o mapa de pontos uma única vez ao entrar na tela ou após mutações (CRUD)
  const carregarPontosCalendario = async () => {
    try {
      // Faz uma requisição para a rota de busca sem paginação limitante (size grande)
      const response = await api.get("/tasks/search", {
        params: { name: "", statusFiltro: "Todas as Tarefas", page: 0, size: 1000 }
      });
      const conteudo = response.data.content || [];
      // Filtra e guarda apenas as Strings únicas de datas limpas
      const mapeamentoDatas = conteudo.map(t => extrairAnoMesDia(t.dataLimite));
      setDatasComTarefas(mapeamentoDatas);
    } catch (error) {
      console.error("Erro ao carregar marcadores do calendário:", error);
    }
  };

  // Carrega os pontos na montagem inicial da página
  useEffect(() => {
    carregarPontosCalendario();
  }, []);

  // 4. MONITOR DINÂMICO DO CALENDÁRIO
  // Dispara a busca paginada no Spring Boot sempre que alterar o dia, o filtro ou a página
  useEffect(() => {
    const dataFormatada = extrairAnoMesDia(dataSelecionada);
    searchTasks("", filtroAtivo, paginaAtual, false, dataFormatada);
  }, [dataSelecionada, filtroAtivo, paginaAtual]);

  // Reseta para a primeira página (0) se mudar o dia escolhido ou o filtro do cabeçalho
  useEffect(() => {
    setPaginaAtual(0);
  }, [dataSelecionada, filtroAtivo]);

  const tratarErrosBackend = (backendError) => {
    if (backendError && backendError.errors) {
      const mensagens = Object.values(backendError.errors).join("\n");
      alert(`Erro de Validação:\n${mensagens}`);
    } else {
      alert(backendError?.message || "Erro inesperado no servidor.");
    }
  };

  // 5. OPERAÇÕES CRUD (Atualizadas para recarregar os pontos reativamente)
  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      fetchTasks(); 
      carregarPontosCalendario(); // Recarrega os pontos se uma nova data ganhar uma tarefa
      dispararSucesso("Sua tarefa foi agendada e salva com sucesso no calendário!");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onUpdate = async (updatedTask) => {
    const res = await handleUpdateTask(updatedTask);
    if (res.success) {
      setTarefaParaEditar(null);
      fetchTasks(); 
      carregarPontosCalendario(); // Recarrega se o usuário alterou a data limite da tarefa
      dispararSucesso("Os dados da tarefa foram atualizados com sucesso.");
    } else {
      tratarErrosBackend(res.error);
    }
  };

  const onDelete = async () => {
    const res = await handleDeleteTask(tarefaParaDeletar.id);
    if (res.success) {
      setTarefaParaDeletar(null);
      fetchTasks(); 
      carregarPontosCalendario(); // Recarrega se a última tarefa daquele dia foi apagada
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
      fetchTasks(); 
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
            📅 Planejamento Visual — {filtroAtivo || "Todas as Tarefas"}
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
                // Aplica uma classe CSS para dias passados
                tileClassName={({ date, view }) => {
                  if (view === "month" && date < new Date().setHours(0, 0, 0, 0)) {
                    return "react-calendar__tile--past";
                  }
                }}
                tileContent={({ date, view }) => {
                  // Verifica contra a lista estática global de pontos cadastrados
                  if (
                    view === "month" &&
                    datasComTarefas.includes(extrairAnoMesDia(date))
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
                <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">Data Selecionada</p>
                <p className="text-sm font-bold text-white">{dataSelecionada.toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/30">
                <span className="text-indigo-400 font-bold text-lg">{tasksPaginadas.length}</span>
              </div>
            </div>
          </div>

          {/* COLUNA DA TABELA */}
          <div className="flex flex-col gap-3 w-full pb-6">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-bold text-white">
                {filtroAtivo === "Todas as Tarefas" ? "Tarefas do Dia" : `Filtrado por: ${filtroAtivo}`}
              </h2>
              <span className="bg-slate-800 text-slate-500 text-[10px] px-2 py-1 rounded-md font-mono uppercase">
                {tasksPaginadas.length} Itens
              </span>
            </div>

            <div className="bg-slate-800/30 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl w-full h-fit">
              {tasksPaginadas.length > 0 ? (
                <Tabela
                  tasks={tasksPaginadas} 
                  onToggle={(id) => setTarefaParaConcluir(tasksPaginadas.find((t) => t.id === id))}
                  onDelete={(id) => setTarefaParaDeletar(tasksPaginadas.find((t) => t.id === id))}
                  onEdit={(task) => !task.concluida && setTarefaParaEditar(task)}
                  onShowDetail={(task) => setTarefaSelecionada(task)}
                />
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 space-y-2 bg-slate-800/10">
                  <p className="text-sm italic font-medium">Nenhuma tarefa correspondente encontrada para este dia.</p>
                </div>
              )}
            </div>

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
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} mensagem={successMessage} />
    </>
  );
}

export default CalendarioPage;