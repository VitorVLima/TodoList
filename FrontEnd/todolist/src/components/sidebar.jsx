import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Settings,
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { id: 0, icon: <LayoutDashboard size={24} />, label: "Todas as Tarefas", path: "/" },
    { id: 1, icon: <CalendarDays size={24} />, label: "Tarefas do Dia", path: "/tarefas-do-dia" },
    { id: 2, icon: <Calendar size={24} />, label: "Calendário", path: "/calendario" },
  ];

  // FUNÇÃO AUXILIAR: Gerencia a rolagem estável sincronizada com a mudança de rota
  const executarNavegacaoComScroll = (path) => {
    navigate(path);
    
    // Aguarda 100ms para o ciclo de renderização do React/Spring Boot se estabilizar antes de mover o scroll
    setTimeout(() => {
      // Procura pelo container de scroll principal do Layout
      const containerScroll = document.querySelector(".overflow-y-auto");
      if (containerScroll) {
        containerScroll.scrollTo({
          top: 0,
          behavior: "auto" // Reset imediato e limpo na troca de contextos grandes
        });
      }
    }, 100);
  };

  const handleMobileNav = (path) => {
    executarNavegacaoComScroll(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 🖥️ DESKTOP/TABLET SIDEBAR (Escondida no Mobile)              */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`hidden md:flex ${
          isOpen ? "w-64" : "w-20"
        } bg-slate-950 h-screen text-white p-4 flex flex-col justify-between fixed transition-all duration-300 ease-in-out border-r border-slate-800 z-[100]`}
      >
        <div className="flex flex-col flex-1">
          {/* HEADER */}
          <div className="flex items-center gap-2 mb-10 h-12 overflow-hidden"> 
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors w-12 h-12 flex items-center justify-center flex-shrink-0 cursor-pointer"
            >
              <Menu size={24} />
            </button>

            <div
              className={`
                flex items-center h-full transition-all duration-300 ease-in-out overflow-hidden
                ${isOpen ? "opacity-100 max-w-xs ml-2" : "opacity-0 max-w-0 ml-0"}
              `}
            >
              <h1 className="text-sm font-bold italic leading-[1.1] uppercase tracking-tighter whitespace-nowrap">
                Gerenciador <br />
                de Tarefas
              </h1>
            </div>
          </div>

          {/* NAVEGAÇÃO PRINCIPAL DESKTOP */}
          <nav className="space-y-2">
            {[...menuItems, { id: 3, icon: <Settings size={24} />, label: "Configurações", path: "/config" }].map((item) => (
              <button
                key={item.id}
                /* AJUSTADO: Usa a nova função com controle de scroll */
                onClick={() => executarNavegacaoComScroll(item.path)}
                className={`flex items-center p-3 h-12 w-full rounded-xl transition-all group relative ${
                  location.pathname === item.path
                    ? "bg-slate-800 text-blue-400"
                    : "hover:bg-slate-900/50 text-slate-400 hover:text-white"
                } cursor-pointer`}
              >
                <div className="min-w-[24px] flex-shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>

                <div
                  className={`
                    transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
                    ${isOpen ? "opacity-100 max-w-xs ml-4" : "opacity-0 max-w-0 ml-0"}
                  `}
                >
                  <span className="font-medium text-sm">{item.label}</span>
                </div>

                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-md 
                                  opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0
                                  transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* FOOTER DESKTOP */}
        <div className="border-t border-slate-800 pt-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center h-12 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 w-full group relative cursor-pointer"
          >
            <div className="min-w-[40px] flex-shrink-0 flex items-center justify-center">
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isOpen ? "opacity-100 max-w-xs ml-1" : "opacity-0 max-w-0 ml-0"}`}>
              <span className="text-sm">Recolher menu</span>
            </div>

            {!isOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-md 
                              opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0
                              transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                Expandir menu
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 📱 MOBILE BOTTOM NAVIGATION BAR                              */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 h-16 flex items-center justify-around px-2 z-[90] pb-safe">
        
        {/* Item 1: Todas as Tarefas -> "Tarefas" */}
        <button
          /* AJUSTADO: Navegação com scroll integrado */
          onClick={() => executarNavegacaoComScroll("/")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
            location.pathname === "/" ? "text-blue-400" : "text-slate-500"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Tarefas</span>
        </button>

        {/* Item 2: Erro corrigido e scroll adicionado */}
        <button
          onClick={() => executarNavegacaoComScroll("/tarefas-do-dia")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
            location.pathname === "/tarefas-do-dia" ? "text-blue-400" : "text-slate-500"
          }`}
        >
          <CalendarDays size={20} />
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Hoje</span>
        </button>

        {/* Item 3: Calendário */}
        <button
          onClick={() => executarNavegacaoComScroll("/calendario")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
            location.pathname === "/calendario" ? "text-blue-400" : "text-slate-500"
          }`}
        >
          <Calendar size={20} />
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Calendario</span>
        </button>

        {/* Item 4: Menu de Expansão -> "Mais" */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
            isMobileMenuOpen || location.pathname === "/config" ? "text-blue-400" : "text-slate-500"
          }`}
        >
          <Menu size={20} />
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Mais</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 📱 MOBILE FULL SCREEN OVERLAY MENU                           */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`md:hidden fixed inset-0 bg-slate-950 z-[200] transition-transform duration-300 ease-in-out p-6 flex flex-col justify-between ${
          isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="space-y-8">
          {/* Cabeçalho do Menu de Expansão */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">Navegação Expandida</p>
              <h2 className="text-xl font-black text-white tracking-tight">Menu Principal</h2>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links em lista grande */}
          <nav className="flex flex-col gap-3">
            {[
              ...menuItems,
              { id: 3, icon: <Settings size={24} />, label: "Configurações", path: "/config" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleMobileNav(item.path)}
                className={`flex items-center gap-4 p-4 w-full rounded-2xl border transition-all text-left ${
                  location.pathname === item.path
                    ? "bg-blue-600/10 border-blue-500/30 text-blue-400 font-bold"
                    : "bg-slate-900/40 border-slate-900 text-slate-300"
                }`}
              >
                <div className={location.pathname === item.path ? "text-blue-400" : "text-slate-500"}>
                  {item.icon}
                </div>
                <span className="text-base">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Rodapé institutional do menu mobile */}
        <div className="text-center border-t border-slate-900 pt-4 text-xs text-slate-600 font-medium font-mono">
          Task Manager v1.0.0
        </div>
      </div>
    </>
  );
};

export default Sidebar;