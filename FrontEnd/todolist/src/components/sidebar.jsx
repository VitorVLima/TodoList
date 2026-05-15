import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Settings,
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { id: 0, icon: <LayoutDashboard size={24} />, label: "Todas as Tarefas", path: "/" },
    { id: 1, icon: <CalendarDays size={24} />, label: "Tarefas do Dia", path: "/tarefas-do-dia" },
    { id: 2, icon: <Calendar size={24} />, label: "Calendário", path: "/calendario" },
    { id: 3, icon: <Settings size={24} />, label: "Configurações", path: "/config" },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-slate-950 h-screen text-white p-4 flex flex-col justify-between fixed transition-all duration-300 ease-in-out border-r border-slate-800 z-[100]`}
    >
      <div className="overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-10 h-12"> 
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors w-12 h-12 flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            <Menu size={24} />
          </button>

          {/* EFEITO DE TRANSPOSIÇÃO NO TÍTULO */}
          <div
            className={`
              flex items-center h-full transition-all duration-300 ease-in-out overflow-hidden
              ${isOpen ? "opacity-100 max-w-xs ml-2" : "opacity-0 max-w-0 ml-0"}
            `}
          >
            <h1 className="text-xm font-bold italic leading-[1.1] uppercase tracking-tighter whitespace-nowrap">
              Gerenciador <br />
              de Tarefas
            </h1>
          </div>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center p-3 h-12 w-full rounded-xl transition-all group relative overflow-hidden ${
                location.pathname === item.path
                  ? "bg-slate-800 text-blue-400"
                  : "hover:bg-slate-900/50 text-slate-400 hover:text-white"
              } cursor-pointer`}
            >
              <div className="min-w-[24px] flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>

              {/* EFEITO DE TRANSPOSIÇÃO NOS ITENS */}
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

      {/* FOOTER */}
      <div className="border-t border-slate-800 pt-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center h-12 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 w-full overflow-hidden"
        >
          <div className="min-w-[40px] flex-shrink-0 flex items-center justify-center">
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </div>
          
          <div
            className={`
              transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
              ${isOpen ? "opacity-100 max-w-xs ml-1" : "opacity-0 max-w-0 ml-0"}
            `}
          >
            <span className="text-sm">Recolher menu</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;