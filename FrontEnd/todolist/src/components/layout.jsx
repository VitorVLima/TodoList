import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import LoadingScreen from "../components/LoadingScreen"; // Importe seu Loading aqui
import { useTasks } from "../hooks/useTasks"; // Importe seu hook de tarefas

const Layout = () => {
  const { fetchTasks } = useTasks();
  
  // 1. Estados de Interface
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarStatus");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 2. Estado de Carregamento Global
  // Começamos como true para garantir que os dados existam antes de renderizar as páginas
  const [isLoading, setIsLoading] = useState(true);

  // 3. Busca de dados centralizada
  useEffect(() => {
    const loadAppData = async () => {
      try {
        // Busca as tarefas uma única vez ao carregar o sistema
        await fetchTasks();
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        // Desativa o loading após a resposta do Spring Boot
        setIsLoading(false);
      }
    };
    loadAppData();
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarStatus", JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* A Sidebar e a Navbar ficam estáticas (não piscam) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-y-auto bg-slate-900 text-slate-200`}>
        
        <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

        <main className="px-2 md:px-4 py-6 w-full max-w-[98%] mx-auto">
          {/* Se estiver carregando, mostra o LoadingScreen apenas dentro do main */}
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
               <LoadingScreen />
            </div>
          ) : (
            /* O Outlet só renderiza quando os dados já foram buscados pelo fetchTasks */
            <Outlet context={{ isAddModalOpen, setIsAddModalOpen }} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;