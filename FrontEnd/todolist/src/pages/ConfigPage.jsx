import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  User,
  Bell,
  Shield,
  Palette,
  Construction,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import AddTaskModal from "../components/addtaskmodal";
import SuccessModal from "../components/successmodal";
import { useTasks } from "../hooks/useTasks";
import { Helmet } from "react-helmet-async";

const ConfigPage = () => {
  // 1. CONSUMO DO CONTEXTO (Vindo do Layout.jsx)
  const { isAddModalOpen, setIsAddModalOpen, fetchTasks } = useOutletContext();

  // 2. LOGICA DE TAREFAS
  const { handleAddTask, handleDeleteTasksConcluidas } = useTasks();

  // ESTADOS DOS MODAIS DE FEEDBACK E CONFIRMAÇÃO
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const onAdd = async (newTask) => {
    const res = await handleAddTask(newTask);
    if (res.success) {
      setIsAddModalOpen(false);
      if (fetchTasks) fetchTasks();

      setSuccessMessage("Sua nova tarefa foi criada e salva com sucesso!");
      setIsSuccessOpen(true);
    } else {
      alert(res.error?.message || "Erro ao adicionar tarefa via Configurações");
    }
  };

  // FUNÇÃO QUE EXECUTA A LIMPEZA DE CONCLUÍDAS NO SPRING BOOT
  const handleClearConcluidas = async () => {
    setIsConfirmDeleteOpen(false);

    const res = await handleDeleteTasksConcluidas();
    if (res.success) {
      if (fetchTasks) fetchTasks();
      setSuccessMessage(
        "Todas as tarefas concluídas foram deletadas permanentemente do banco de dados!",
      );
      setIsSuccessOpen(true);
    } else {
      alert(
        res.error?.message ||
          "Não foi possível limpar o histórico de tarefas concluídas.",
      );
    }
  };

  const sections = [
    {
      icon: <User size={20} />,
      title: "Perfil",
      desc: "Altere suas informações pessoais e foto.",
    },
    {
      icon: <Bell size={20} />,
      title: "Notificações",
      desc: "Configure como e quando quer ser avisado.",
    },
    {
      icon: <Palette size={20} />,
      title: "Aparência",
      desc: "Personalize as cores e o tema do sistema.",
    },
    {
      icon: <Shield size={20} />,
      title: "Segurança",
      desc: "Gerencie sua senha e autenticação.",
    },
  ];

  return (
    /* AJUSTADO: Espaçamento reduzido no mobile (space-y-5) e completo no PC (md:space-y-8) */
    <div className="animate-in fade-in duration-500 space-y-5 md:space-y-8 w-full">
      <Helmet>
        <title>Configurações | Task Manager</title>
      </Helmet>
      {/* CABEÇALHO */}
      <header className="px-0.5">
        <h1 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">
          Configurações
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Gerencie as preferências da sua conta e do sistema.
        </p>
      </header>

      {/* GRID DE OPÇÕES */}
      {/* AJUSTADO: Grid usa gap menor no mobile para manter a coesão visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-slate-800/40 border border-slate-800 p-3.5 md:p-4 rounded-2xl flex items-start gap-3.5 md:gap-4 opacity-60 grayscale cursor-not-allowed select-none"
          >
            <div className="bg-slate-700 p-2.5 md:p-3 rounded-xl text-slate-400 shrink-0">
              {section.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs md:text-sm font-bold text-white truncate">
                {section.title}
              </h3>
              <p className="text-[11px] md:text-xs text-slate-500 mt-0.5 leading-tight">
                {section.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AVISO DE DESENVOLVIMENTO */}
      {/* AJUSTADO: Py reduzido no mobile para não empurrar a Zona de Perigo para fora da tela de celulares pequenos */}
      <main className="flex flex-col items-center justify-center py-10 md:py-14 bg-slate-800/20 border-2 border-dashed border-slate-800 rounded-3xl space-y-3 md:space-y-4 px-4 text-center">
        <div className="bg-amber-500/10 p-3.5 md:p-4 rounded-full text-amber-500 animate-bounce">
          <Construction size={36} className="md:w-10 md:h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg md:text-xl font-bold text-white">
            Página em Desenvolvimento
          </h2>
          <p className="text-slate-500 text-xs md:text-sm max-w-xs mx-auto">
            As configurações estão travadas, mas você ainda pode gerenciar suas
            tarefas pela barra superior.
          </p>
        </div>
      </main>

      {/* SEÇÃO: ZONA DE PERIGO (GERENCIAMENTO DE DADOS) */}
      <section className="bg-red-950/10 border border-red-900/30 p-4 md:p-6 rounded-3xl space-y-3 md:space-y-4">
        <div>
          <h2 className="text-xs md:text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={16} /> Zona de Perigo
          </h2>
          <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
            Ações irreversíveis de gerenciamento de dados do sistema.
          </p>
        </div>

        {/* CORRIGIDO: Modificado para flex-col no mobile e flex-row no desktop. */}
        {/* Isso impede que o botão 'Limpar Concluídas' esmague o texto descritivo na tela do celular */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="space-y-0.5">
            <h3 className="text-xs md:text-sm font-bold text-white">
              Limpar Histórico de Concluídas
            </h3>
            <p className="text-[11px] md:text-xs text-slate-400 leading-normal">
              Apaga permanentemente do banco todas as tarefas com status
              finalizado.
            </p>
          </div>
          <button
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="h-10 md:h-11 px-4 md:px-5 bg-red-900/40 hover:bg-red-600 border border-red-700/50 hover:border-red-500 text-red-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Trash2 size={14} />
            <span>Limpar Concluídas</span>
          </button>
        </div>
      </section>

      {/* MODAL DE CONFIRMAÇÃO DE DELEÇÃO */}
      {isConfirmDeleteOpen && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget && setIsConfirmDeleteOpen(false)
          }
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer p-4"
        >
          {/* AJUSTADO: Max-w e padding adaptados para telas menores */}
          <div className="bg-slate-800 border border-slate-700 p-5 md:p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4 md:space-y-5 animate-in zoom-in-95 duration-200 cursor-default">
            <div className="mx-auto bg-red-500/10 p-3.5 md:p-4 rounded-full text-red-500 w-fit">
              <Trash2 size={28} className="md:w-8 md:h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base md:text-lg font-bold text-white">
                Você tem certeza?
              </h3>
              <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed">
                Essa ação irá deletar **todas** as tarefas marcadas como
                concluídas de forma definitiva. Você não poderá desfazer isso
                depois.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="h-10 md:h-11 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearConcluidas}
                className="h-10 md:h-11 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-red-900/20 cursor-pointer"
              >
                Sim, Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAdd}
      />

      {/* MODAL DE CONFIRMAÇÃO DE SUCESSO */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        mensagem={successMessage}
      />
    </div>
  );
};

export default ConfigPage;
