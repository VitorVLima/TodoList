import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import './index.css'
import Layout from './components/layout.jsx' // Importe o Layout
import Home from './pages/Home.jsx'
import CalendarioPage from './pages/CalendarioPage.jsx' 
import ConfigPage from './pages/ConfigPage.jsx'
import TasksDayPage from './pages/TaskDayPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* O Layout envolve todas as rotas que devem ter Sidebar/Navbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tarefas-do-dia" element={<TasksDayPage />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="config" element={<ConfigPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
)
