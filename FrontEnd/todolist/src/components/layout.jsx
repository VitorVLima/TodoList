import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"; 
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import LoadingScreen from "../components/LoadingScreen";
import { useTasks } from "../hooks/useTasks";

const Layout = () => {
  const { tasks, fetchTasks, searchTasks, totalPages, metrics, fetchMetrics } = useTasks();
  const location = useLocation(); 
  
  // 1. Estados de Interface e Filtros Globais
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarStatus");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("Todas as Tarefas");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // CORRIGIDO: Busca de dados inicial inteligente que respeita a URL atual no F5
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const isDiariaPage = window.location.pathname.includes("tarefas-do-dia");

        if (isDiariaPage) {
          // Se der F5 na página de hoje, inicializa focado no dia atual
          await Promise.all([
            searchTasks("", "Todas as Tarefas", 0, true),
            fetchMetrics("", "Todas as Tarefas", true, "")
          ]);
        } else {
          // Se for na Home ou outra rota, carrega o painel geral
          await Promise.all([
            fetchTasks(), 
            fetchMetrics()
          ]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas uma vez ao montar/recarregar a página

  // Resetar página quando mudar busca, aba de filtro ou a rota da página
  useEffect(() => {
    setPaginaAtual(0);
  }, [termoBusca, filtroAtivo, location.pathname]);

  // 4. MONITOR UNIFICADO: Decide o que pedir ao Spring Boot baseado na URL
  useEffect(() => {
    if (isLoading) return;

    // TRAVA DO CALENDÁRIO: Se estiver na rota do calendário, interrompe aqui.
    if (location.pathname.includes("calendario")) return;

    // Identifica se o usuário está na rota "tarefas-do-dia"
    const isDiariaPage = location.pathname.includes("tarefas-do-dia");

    if (isDiariaPage) {
      searchTasks(termoBusca, filtroAtivo, paginaAtual, true); 
      fetchMetrics(termoBusca, filtroAtivo, true, ""); 
    } else {
      searchTasks(termoBusca, filtroAtivo, paginaAtual, false);
      fetchMetrics(termoBusca, filtroAtivo, false, ""); 
    }

  }, [termoBusca, filtroAtivo, paginaAtual, location.pathname, isLoading]); 

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
          filtroAtivo={filtroAtivo}     
          setFiltroAtivo={setFiltroAtivo} 
        />

        <main className="px-2 md:px-4 py-6 w-full max-w-[98%] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
               <LoadingScreen />
            </div>
          ) : (
            <Outlet context={{ 
              tasks, 
              isAddModalOpen, 
              setIsAddModalOpen, 
              fetchTasks, 
              searchTasks,
              filtroAtivo,
              paginaAtual,
              setPaginaAtual,
              totalPages,
              metrics,
              fetchMetrics
            }} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;