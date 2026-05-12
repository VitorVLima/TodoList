import React, { useState, useEffect } from 'react';
import { X, Calendar, Edit3, AlignLeft, Flag } from 'lucide-react';

const UpdateTaskModal = ({ isOpen, onClose, onUpdate, task }) => {
  const [taskData, setTaskData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'MEDIA',
    dataLimite: '',
  });

  // Carrega os dados da tarefa quando o modal abre ou a task muda
  useEffect(() => {
    if (task) {
      setTaskData({
        titulo: task.titulo || '',
        descricao: task.descricao || '',
        prioridade: task.prioridade || 'MEDIA',
        dataLimite: task.dataLimite || '',
      });
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...task, ...taskData });
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
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Edit3 size={20} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Update Task</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* TÍTULO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Title</label>
            <input 
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
              rows="3"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
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
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40' 
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold hover:opacity-90 shadow-lg shadow-indigo-900/20 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;