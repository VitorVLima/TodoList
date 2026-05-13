import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Tabela from "../components/tabela";
import TaskDetailModal from "../components/taskdetailmodal";
import AddTaskModal from "../components/addtaskmodal";
import UpdateTaskModal from "../components/updatetaskmodal";
import ConfirmDeleteModal from "../components/confirmdeletemodel";
import ConfirmDoneModal from "../components/confirmdonemodal";
import api from "../services/api";

function Home() {
  // 1. ESTADO DAS TAREFAS
  const [tasks, setTasks] = useState([]);

  async function getTasks() {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  // 2. ESTADOS DOS MODAIS
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null); // Para o card de detalhes
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Para o card de criação
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null); // Para o card de atualizar
  const [tarefaParaDeletar, setTarefaParaDeletar] = useState(null); //Para o card de confirmacao de exclusao
  const [tarefaParaConcluir, setTarefaParaConcluir] = useState(null); //Para o card de finalizar tarefa

  // 3. FUNÇÕES DE MANIPULAÇÃO

  // Adicionar Nova Tarefa
  async function handleAddTask(newTask) {
    try {
      await api.post("/tasks", newTask);
      getTasks();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Não foi possível salvar a tarefa no banco de dados.");
    }
  }

  //Atualizar Tarefa
  async function handleUpdateTask(updatedTask) {
    try {
      await api.put(`/tasks/${updatedTask.id}`, updatedTask);
      setTarefaParaEditar(null);
      getTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Não foi possível atualizar a tarefa no banco de dados.");
    }
  }

  //Deletar Tarefa
  const confirmDelete = async () => {
    if (tarefaParaDeletar) {
      try {
        await api.delete(`/tasks/${tarefaParaDeletar.id}`);

        getTasks();
        setTarefaParaDeletar(null);
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        alert("Erro ao excluir a tarefa do servidor.");
      }
    }
  };

  // 2. Função para disparar a confirmação ou bloquear
  const handleToggleStatus = (id) => {
    const task = tasks.find((t) => t.id === id);

    // Se já estiver concluída, não faz nada (trava o retorno)
    if (task.concluida) return;

    // Se for para concluir, abre o modal de confirmação
    setTarefaParaConcluir(task);
  };

  // 3. Função que efetiva a conclusão
  const confirmDone = async () => {
    if (tarefaParaConcluir) {
      try {
        // 1. Criamos o objeto atualizado
        const tarefaAtualizada = { ...tarefaParaConcluir, concluida: true };

        await handleUpdateTask(tarefaAtualizada);

        setTarefaParaConcluir(null);
      } catch (error) {
        console.error("Erro ao concluir tarefa:", error);
        alert("Não foi possível marcar a tarefa como concluída no servidor.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-850">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <div className="flex-1 ml-64 min-h-screen bg-slate-900 text-slate-200 font-sans">
        {/* Passamos a função de abrir o modal para o botão na Navbar */}
        <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

        <main className="p-8">
          {/* Tabela de Tarefas */}
          <Tabela
            tasks={tasks}
            onToggle={handleToggleStatus}
            onDelete={(id) =>
              setTarefaParaDeletar(tasks.find((t) => t.id === id))
            }
            onEdit={(task) => {
              if (!task.concluida) {
                setTarefaParaEditar(task);
              }
            }}
            onShowDetail={(task) => setTarefaSelecionada(task)}
          />
        </main>
      </div>

      {/* MODAL DE DETALHES (Aparece apenas quando uma tarefa é clicada) */}
      <TaskDetailModal
        task={tarefaSelecionada}
        onClose={() => setTarefaSelecionada(null)}
      />

      {/* MODAL DE ADIÇÃO (Aparece ao clicar em 'Add Task' na Navbar) */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />

      <UpdateTaskModal
        isOpen={!!tarefaParaEditar} // Abre se houver algo para editar
        task={tarefaParaEditar}
        onClose={() => setTarefaParaEditar(null)}
        onUpdate={handleUpdateTask}
      />

      <ConfirmDeleteModal
        isOpen={!!tarefaParaDeletar}
        taskTitle={tarefaParaDeletar?.titulo}
        onClose={() => setTarefaParaDeletar(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmDoneModal
        isOpen={!!tarefaParaConcluir}
        taskTitle={tarefaParaConcluir?.titulo}
        onClose={() => setTarefaParaConcluir(null)}
        onConfirm={confirmDone}
      />
    </div>
  );
}

export default Home;
