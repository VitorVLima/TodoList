import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Settings,
  CalendarDays,
  Calendar, // Novo ícone importado
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Para saber em qual página estamos e brilhar o botão certo

  const [activeIndex, setActiveIndex] = useState(0);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      id: 0,
      icon: <LayoutDashboard size={24} />,
      label: "Todas as Tarefas",
      path: "/",
    },
    {
      id: 1,
      icon: <CalendarDays size={24} />,
      label: "Tarefas do Dia",
      path: "/tarefas-do-dia",
      
    },
    {
      id: 2,
      icon: <Calendar size={24} />,
      label: "Calendário",
      path: "/calendario",
    },
    {
      id: 3,
      icon: <Settings size={24} />,
      label: "Configurações",
      path: "/config",
    },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-slate-950 h-screen text-white p-4 flex flex-col justify-between fixed transition-all duration-300 ease-in-out border-r border-slate-800 z-100`}
    >
      <div>
        {/* Header com Botão Sanduíche */}
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors min-w-[40px] flex-shrink-0"
          >
            <Menu size={24} />
          </button>

          {/* Título com desaparecimento instantâneo ao fechar */}
          <div
            className={`
            transition-all 
            ${
              isOpen
                ? "opacity-100 w-full duration-500 delay-200 visible"
                : "opacity-0 w-0 duration-0 delay-0 invisible absolute"
            }
          `}
          >
            <h1 className="text-lg font-bold italic whitespace-nowrap">
              Gerenciador <br />
              de Tarefas
            </h1>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)} // MUDANÇA AQUI: Navega para o path
              className={`flex items-center gap-4 p-3 w-full rounded-xl transition-all group relative ${
                // MUDANÇA AQUI: Verifica se a rota atual é a do item
                location.pathname === item.path
                  ? "bg-slate-800 text-blue-400"
                  : "hover:bg-slate-900/50 text-slate-400 hover:text-white"
              }`}
            >
              <div className="min-w-[24px] flex-shrink-0">{item.icon}</div>

              {/* Texto dos Itens */}
              <span
                className={`
                  whitespace-nowrap font-medium transition-all
                  ${
                    isOpen
                      ? "opacity-100 translate-x-0 duration-500 delay-200 visible"
                      : "opacity-0 duration-0 delay-0 invisible absolute"
                  }
                `}
              >
                {item.label}
              </span>

              {/* TOOLTIP: Aparece apenas quando fechado */}
              {!isOpen && (
                <div
                  className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-md 
                                opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0
                                transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700"
                >
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer da Sidebar */}
      <div className="border-t border-slate-800 pt-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          <span
            className={`
            text-sm transition-all
            ${isOpen ? "opacity-100 duration-500 delay-200 visible" : "opacity-0 duration-0 delay-0 invisible absolute"}
          `}
          >
            Recolher menu
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
