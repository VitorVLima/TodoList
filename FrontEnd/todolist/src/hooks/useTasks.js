import { useState } from "react";
import api from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Guardar as informações de paginação calculadas pelo Spring Boot
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // ADICIONADO: Estado para guardar o DTO de métricas agregadas do PostgreSQL
  const [metrics, setMetrics] = useState({ 
    total: 0, 
    pendentes: 0, 
    concluidas: 0, 
    atrasadas: 0, 
    porcentagem: 0 
  });

  // Busca tarefas genérica (usada na montagem do app ou recargas brutas)
  const fetchTasks = async (endpoint = "/tasks", page = 0) => {
    setLoading(true);
    try {
      const response = await api.get(endpoint, {
        params: { 
          page: page, 
          size: 10 // Alinhado com o @PageableDefault(size = 10) do seu Controller
        } 
      });
      
      setTasks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error("Erro ao buscar tarefas paginadas:", error);
      setTasks([]); 
    } finally {
      setLoading(false);
    }
  };

  // ATUALIZADO: Agora aceita 'dataFiltro' para mapear as buscas dinâmicas do calendário no banco
  const searchTasks = async (name = "", statusFiltro = "Todas as Tarefas", page = 0, isToday = false, dataFiltro = "") => {
    setLoading(true);
    try {
      const response = await api.get("/tasks/search", {
        params: { 
          name: name,
          statusFiltro: statusFiltro,
          page: page,
          size: 10,
          hoje: isToday,
          dataFiltro: dataFiltro // <-- Repassa a data YYYY-MM-DD para o Spring Boot
        }
      });
      
      setTasks(response.data.content || []); 
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error("Erro ao pesquisar tarefas com filtros paginados:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // CORRIGIDO: Agora aceita os mesmos parâmetros de filtro para buscar as métricas contextuais de forma reativa
  const fetchMetrics = async (name = "", statusFiltro = "Todas as Tarefas", isToday = false, dataFiltro = "") => {
    try {
      const response = await api.get("/tasks/metrics", {
        params: {
          name: name,
          statusFiltro: statusFiltro,
          hoje: isToday,
          dataFiltro: dataFiltro
        }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error("Erro ao buscar métricas reativas do servidor:", error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      await api.post("/tasks", newTask);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await api.put(`/tasks/${updatedTask.id}`, updatedTask);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const handleDeleteTasksConcluidas = async () => {
    try {
      await api.delete("/tasks/clear-concluidas");
      return { success: true };
    } catch (error) {
      console.error("Erro ao apagar tarefas concluídas:", error);
      return { success: false, error: error.response?.data };
    }
  };

  return {
    tasks,
    loading,
    totalPages,     
    totalElements,  
    metrics,        // Exportado para o Layout conseguir ler
    fetchMetrics,   // Exportado para atualizar reativamente no CRUD e no monitor de filtros
    fetchTasks,
    searchTasks,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleDeleteTasksConcluidas
  };
}