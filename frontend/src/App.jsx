import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Consultas from './pages/Consultas'; 
import Estoque from './pages/Estoque';
import Gerenciamento from './pages/Gerenciamento';
import Pacientes from './pages/Pacientes';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const salvo = localStorage.getItem('vetcare_theme');
    return salvo ? salvo === 'dark' : true;
  });
  const [menuAberto, setMenuAberto] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vetcare_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vetcare_theme', 'light');
    }
  }, [darkMode]);

  const isAuthenticated = () => {
    return localStorage.getItem('vetcare_access') !== null;
  };

  const handleLogout = () => {
    localStorage.removeItem('vetcare_access');
    localStorage.removeItem('vetcare_refresh');
    window.location.href = '/login';
  };

  if (!isAuthenticated() && location.pathname !== '/login' && location.pathname !== '/cadastro') {
    return <Navigate to="/login" replace />;
  }

  const linkClass = (path) => {
    const base = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all font-bold border whitespace-nowrap ";
    if (location.pathname === path) {
      return base + "bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30";
    }
    return base + "text-zinc-500 dark:text-zinc-400 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100";
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/cadastro" element={<Cadastro darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-100 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* MENU LATERAL - OCULTA 100% PARA A ESQUERDA (w-0) CONFORME SEU PROJETO */}
      <aside className={`border-r border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col justify-between sticky top-0 h-screen shrink-0 transition-all duration-300 overflow-hidden ${menuAberto ? 'w-64 p-5 opacity-100' : 'w-0 p-0 opacity-0 border-none'}`}>
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2 py-1">
            <span className="text-xl">🐾</span>
            <span className="font-black tracking-wider text-xs uppercase text-zinc-400">MENU PRINCIPAL</span>
          </div>
          <nav className="space-y-1">
            <Link to="/" className={linkClass('/')}>📊 Dashboard</Link>
            <Link to="/pacientes" className={linkClass('/pacientes')}>🐾 Pacientes / Pets</Link>
            <Link to="/consultas" className={linkClass('/consultas')}>📅 Agenda & Prontuários</Link>
            <Link to="/estoque" className={linkClass('/estoque')}>📦 Estoque & Insumos</Link>
            <Link to="/gerenciamento" className={linkClass('/gerenciamento')}>⚙️ Configurações / Clínica</Link>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2">
          🚪 Sair da Sessão
        </button>
      </aside>

      {/* ÁREA DO CONTEÚDO PRINCIPAL (DIREITA) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-16 border-b border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuAberto(!menuAberto)} className="flex flex-col gap-1 justify-center items-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer">
              <span className="h-0.5 w-5 bg-zinc-600 dark:bg-zinc-300 rounded-full"></span>
              <span className="h-0.5 w-5 bg-zinc-600 dark:bg-zinc-300 rounded-full"></span>
              <span className="h-0.5 w-5 bg-zinc-600 dark:bg-zinc-300 rounded-full"></span>
            </button>
            <span className="text-base font-black text-teal-600 dark:text-teal-400 tracking-wide flex items-center gap-2 select-none">VetCare <span className="text-xs opacity-60">🐾</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-bold rounded-xl transition-all cursor-pointer">
              {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </button>
          </div>
        </header>

        <main className="flex-1 w-full mx-auto p-4 md:p-8 overflow-y-auto max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/gerenciamento" element={<Gerenciamento />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}