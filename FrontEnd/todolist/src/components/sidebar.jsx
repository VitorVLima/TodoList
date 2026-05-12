import configLogo from './../assets/settings.png';
import allTaskLogo from './../assets/task.png';
import minhaLogo from './../assets/planner.png';
import checkListLogo from './../assets/checklist.png';
import taskDayLogo from './../assets/forecast.png';

const Sidebar = () => (
  <aside className="w-64 bg-slate-950 h-screen text-white p-6 flex flex-col justify-between fixed">
    <div>
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-blue-950 p-2 rounded-lg border-2 border-black">
            <img src={minhaLogo} alt=""/>
        </div>
        <h1 className="text-xl font-bold italic">Organizador de Tarefas</h1>
      </div>
      
      <nav className="space-y-4">
        <a href="#" className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg text-blue-400">
          <span><img src={taskDayLogo} alt="" className='w-10'/></span> Tarefas do Dia
        </a>

        <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition">
          <span><img src={allTaskLogo} alt="" className='w-10'/></span> Todas as Tarefas
        </a>
        <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition">
          <span><img src={checkListLogo} alt="" className='w-10'/></span> Tarefas Concluídas
        </a>
        <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition">
          <span><img src={configLogo} alt="" className='w-10' /></span> Configurações
        </a>
        {/* Adicione os outros links aqui */}
      </nav>
    </div>
    
  </aside>
);

export default Sidebar;