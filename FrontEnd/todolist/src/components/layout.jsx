import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import LoadingScreen from "../components/LoadingScreen";
import { useTasks } from "../hooks/useTasks";

const Layout = () => {
  const { tasks, fetchTasks, searchTasks } = useTasks();
  
  // 1. Estados de Interface e Filtros Globais
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarStatus");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("Todas as Tarefas"); // <-- ADICIONADO
  
  // 2. Estado de Carregamento Global
  const [isLoading, setIsLoading] = useState(true);

  // 3. Busca de dados inicial (Apenas na montagem do app)
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

  // 4. ATUALIZADO: Monitor unificado do campo de pesquisa e botões de filtro
  useEffect(() => {
    if (isLoading) return; // Não faz requisições se estiver no carregamento inicial

    // O Spring Boot agora gerencia a combinação de nome + filtro ativo na mesma rota.
    // Se o termoBusca for "", a query JPA traz todos os registros daquele filtro específico.
    searchTasks(termoBusca, filtroAtivo);

  }, [termoBusca, filtroAtivo]); // Dispara a busca quando o texto muda OU quando um filtro é clicado

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarStatus", JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-y-auto bg-slate-900 text-slate-200`}>
        
        {/* Passamos o estado e o alterador do filtro para a Navbar */}
        <Navbar 
          onOpenAddModal={() => setIsAddModalOpen(true)} 
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
          filtroAtivo={filtroAtivo}     // <-- PASSEI VIA PROP
          setFiltroAtivo={setFiltroAtivo} // <-- PASSEI VIA PROP
        />

        <main className="px-2 md:px-4 py-6 w-full max-w-[98%] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
               <LoadingScreen />
            </div>
          ) : (
            /* Adicionado o filtroAtivo no context para as páginas filhas usarem se necessário */
            <Outlet context={{ tasks, isAddModalOpen, setIsAddModalOpen, fetchTasks, filtroAtivo }} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;