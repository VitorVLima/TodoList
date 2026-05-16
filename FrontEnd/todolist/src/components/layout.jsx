import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import LoadingScreen from "../components/LoadingScreen";
import { useTasks } from "../hooks/useTasks";

const Layout = () => {
  const { tasks, fetchTasks, searchTasks } = useTasks();
  
  // 1. Estados de Interface
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarStatus");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  
  // 2. Estado de Carregamento Global
  const [isLoading, setIsLoading] = useState(true);

  // 3. Busca de dados inicial
  useEffect(() => {
    const loadAppData = async () => {
      try {
        await fetchTasks();
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppData();
  }, []);

  // 4. Monitor do campo de pesquisa (Efeito Debounce Simplificado)
  useEffect(() => {
    if (isLoading) return; // Não busca se estiver no loading inicial

    if (termoBusca.trim() === "") {
      fetchTasks(); // Se apagar o texto, traz tudo de volta
    } else {
      searchTasks(termoBusca); // Chama o endpoint do Spring Boot @GetMapping("/search")
    }
  }, [termoBusca]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarStatus", JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-y-auto bg-slate-900 text-slate-200`}>
        
        <Navbar 
          onOpenAddModal={() => setIsAddModalOpen(true)} 
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
        />

        <main className="px-2 md:px-4 py-6 w-full max-w-[98%] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
               <LoadingScreen />
            </div>
          ) : (
            /* Passamos os dados atualizados da busca via context do Outlet */
            <Outlet context={{ tasks, isAddModalOpen, setIsAddModalOpen, fetchTasks }} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;