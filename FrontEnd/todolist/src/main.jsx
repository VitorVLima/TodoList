import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import './index.css'
import Home from './pages/Home.jsx'
import CalendarioPage from './pages/CalendarioPage.jsx' 
import ConfigPage from './pages/ConfigPage.jsx'
import TasksDayPage from './pages/TaskDayPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Rota da Página Inicial */}
        <Route path="/" element={<Home />} />

        {/* Rota da Página de Tarefas do Dia */}
        <Route path="/tarefas-do-dia" element={<TasksDayPage />} />
        
        {/* Rota da Página de Calendário */}
        <Route path="/calendario" element={<CalendarioPage />} />

        {/* Rota da Página de Configurações */}
        <Route path="/config" element={<ConfigPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
