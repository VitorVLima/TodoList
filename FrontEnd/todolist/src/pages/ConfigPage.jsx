import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

const ConfigPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = [
    { icon: <User size={20} />, title: "Perfil", desc: "Altere suas informações pessoais e foto." },
    { icon: <Bell size={20} />, title: "Notificações", desc: "Configure como e quando quer ser avisado." },
    { icon: <Palette size={20} />, title: "Aparência", desc: "Personalize as cores e o tema do sistema." },
    { icon: <Shield size={20} />, title: "Segurança", desc: "Gerencie sua senha e autenticação." },
  ];

  return (
    <div className="flex min-h-screen bg-slate-850">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 min-h-screen bg-slate-900 text-slate-200 font-sans`}>
        <Navbar />
        
        <main className="p-8 max-w-4xl text-center ">
          <h1 className="text-center">Pagina em desenvolvimento</h1>
        </main>
      </div>
    </div>
  );
};

export default ConfigPage;