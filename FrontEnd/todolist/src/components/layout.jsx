import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom"; 
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import LoadingScreen from "../components/LoadingScreen";
import { useTasks } from "../hooks/useTasks";

const Layout = () => {
  const { tasks, fetchTasks, searchTasks, totalPages, metrics, fetchMetrics } = useTasks();
  const location = useLocation(); 
  
  // Referência para o container com scroll vertical
  const scrollContainerRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarStatus");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("Todas as Tarefas");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // AJUSTADO: Monitor de scroll com delay de 100ms para esperar o React renderizar os dados novos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: "auto" 
        });
      }
    }, 100);

    return () => clearTimeout(timer); // Evita concorrência se o usuário clicar muito rápido
  }, [paginaAtual]);

  // Busca de dados inicial inteligente
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const isDiariaPage = window.location.pathname.includes("tarefas-do-dia");

        if (isDiariaPage) {
          await Promise.all([
            searchTasks("", "Todas as Tarefas", 0, true),
            fetchMetrics("", "Todas as Tarefas", true, "")
          ]);
        } else {
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
  }, []); 

  // Resetar página quando mudar busca, aba de filtro ou a rota da página
  useEffect(() => {
    setPaginaAtual(0);
  }, [termoBusca, filtroAtivo, location.pathname]);

  // MONITOR UNIFICADO: Sincroniza dados com o Spring Boot baseado na URL
  useEffect(() => {
    if (isLoading) return;
    if (location.pathname.includes("calendario")) return;

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

      {/* CONTÊINER DE SCROLL PRINCIPAL */}
      <div 
        ref={scrollContainerRef}
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 h-screen overflow-y-auto bg-slate-900 text-slate-200 pb-24 md:pb-0
          ${isSidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20"}`}
      >
        
        <Navbar 
          onOpenAddModal={() => setIsAddModalOpen(true)} 
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
          filtroAtivo={filtroAtivo}     
          setFiltroAtivo={setFiltroAtivo} 
        />

        {/* ÁREA DE CONTEÚDO DINÂMICO */}
        <main className="px-4 md:px-6 py-4 md:py-6 w-full max-w-full md:max-w-[98%] mx-auto">
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