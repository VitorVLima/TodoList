import React, { useState } from 'react';
import { X, Calendar, Plus, AlignLeft, Flag } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [taskData, setTaskData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'MEDIA',
    dataLimite: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.titulo) return alert("O título é obrigatório!");
    
    // Gera um ID temporário e a data de criação
    onAdd({
      ...taskData,
      id: Date.now(),
      concluida: false,
      dataCriacao: new Date().toISOString(),
    });
    
    // Limpa o formulário e fecha
    setTaskData({ titulo: '', descricao: '', prioridade: 'MEDIA', dataLimite: '' });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Plus size={20} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Task</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* TÍTULO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              Task Title
            </label>
            <input 
              type="text"
              placeholder="e.g., Finalizar CRUD de Produtos"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
              value={taskData.titulo}
              onChange={(e) => setTaskData({...taskData, titulo: e.target.value})}
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <AlignLeft size={14} /> Description
            </label>
            <textarea 
              placeholder="Implementar..."
              rows="3"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none"
              value={taskData.descricao}
              onChange={(e) => setTaskData({...taskData, descricao: e.target.value})}
            />
          </div>

          {/* PRIORIDADE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Flag size={14} /> Priority
            </label>
            <div className="flex gap-2">
              {['ALTA', 'MEDIA', 'BAIXA'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTaskData({...taskData, prioridade: p})}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all border ${
                    taskData.prioridade === p 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* DATA LIMITE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Calendar size={14} /> Due Date
            </label>
            <input 
              type="date"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={taskData.dataLimite}
              onChange={(e) => setTaskData({...taskData, dataLimite: e.target.value})}
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:opacity-90 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
            >
              Create Task +
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;