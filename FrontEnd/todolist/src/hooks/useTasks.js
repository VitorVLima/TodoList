import { useState } from "react";
import api from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Busca tarefas (pode receber um endpoint como '/tasks' ou '/tasks/today')
  const fetchTasks = async (endpoint = "/tasks") => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
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

  const searchTasks = async (name) => {
    setLoading(true);
    try {
      const response = await api.get("/tasks/search", {
        params: { name: name }
      });
      setTasks(response.data); 
    } catch (error) {
      console.error("Erro ao pesquisar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    fetchTasks,
    searchTasks,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
  };
}