import React, { useState } from "react";
import { useOutletContext } from "react-router-dom"; // Para sincronizar com o botão da Navbar
import { User, Bell, Shield, Palette, Construction } from "lucide-react";
import AddTaskModal from "../components/addtaskmodal"; // Componente de criação
import SuccessModal from "../components/SuccessModal"; // Importado o Modal de Sucesso
import { useTasks } from "../hooks/useTasks"; // Hook para salvar no banco

const ConfigPage = () => {
  // 1. CONSUMO DO CONTEXTO (Vindo do Layout.jsx)
  const { isAddModalOpen, setIsAddModalOpen, fetchTasks } = useOutletContext();

  // 2. LOGICA DE TAREFAS
  const { handleAddTask } = useTasks();

  // ESTADOS DO MODAL DE SUCESSO
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false); // Fecha o modal de cadastro
      if (fetchTasks) fetchTasks(); // Atualiza a lista global (Home/Calendário)
      
      // Dispara o modal de confirmação de sucesso
      setSuccessMessage("Sua nova tarefa foi criada e salva com sucesso!");
      setIsSuccessOpen(true);
    } else {
      // Tratamento de erro básico
      alert(res.error?.message || "Erro ao adicionar tarefa via Configurações");
    }
  };

  const sections = [
    { icon: <User size={20} />, title: "Perfil", desc: "Altere suas informações pessoais e foto." },
    { icon: <Bell size={20} />, title: "Notificações", desc: "Configure como e quando quer ser avisado." },
    { icon: <Palette size={20} />, title: "Aparência", desc: "Personalize as cores e o tema do sistema." },
    { icon: <Shield size={20} />, title: "Segurança", desc: "Gerencie sua senha e autenticação." },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* CABEÇALHO */}
      <header>
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Configurações</h1>
        <p className="text-slate-400 text-xs mt-1">Gerencie as preferências da sua conta e do sistema.</p>
      </header>

      {/* GRID DE OPÇÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl flex items-start gap-4 opacity-60 grayscale cursor-not-allowed"
          >
            <div className="bg-slate-700 p-3 rounded-xl text-slate-400">
              {section.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{section.title}</h3>
              <p className="text-xs text-slate-500">{section.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AVISO DE DESENVOLVIMENTO */}
      <main className="flex flex-col items-center justify-center py-20 bg-slate-800/20 border-2 border-dashed border-slate-800 rounded-3xl space-y-4">
        <div className="bg-amber-500/10 p-4 rounded-full text-amber-500 animate-bounce">
          <Construction size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Página em Desenvolvimento</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
            As configurações estão travadas, mas você ainda pode gerenciar suas tarefas pela barra superior.
          </p>
        </div>
      </main>

      {/* MODAL DE CADASTRO */}
      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={onAdd} 
      />

      {/* MODAL DE CONFIRMAÇÃO DE SUCESSO (FECHA AO CLICAR FORA) */}
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
        mensagem={successMessage} 
      />
    </div>
  );
};

export default ConfigPage;