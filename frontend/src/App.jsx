import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Consultas from './pages/Consultas';
import Gerenciamento from './pages/Gerenciamento';
import Estoque from './pages/Estoque';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

function RotaProtegida({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function LayoutPrivado({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) setMenuAberto(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clinica_name');
    navigate('/login');
  };

  const linkClasse = (path) => {
    const base = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-150 whitespace-nowrap ";
    const ativo = "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-bold border-teal-100/70 dark:border-teal-900/40 shadow-xs";
    const inativo = "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent";
    return base + (location.pathname === path ? ativo : inativo);
  };

  const exibirBotaoVoltar = location.pathname !== "/";

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 flex flex-col font-sans antialiased">
      
      {/* NAVBAR */}
      <nav className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-3.5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2 rounded-xl border border-zinc-300/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer shadow-xs"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {exibirBotaoVoltar && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-300/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              ← Voltar
            </button>
          )}
          
          <span className="text-xl font-black tracking-tight text-teal-600 dark:text-teal-500 flex items-center gap-1.5 select-none ml-1">
            VetCare 🐾
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-zinc-300/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-xs"
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>

          <button onClick={handleLogout} className="text-xs font-semibold text-zinc-400 hover:text-red-500 dark:hover:text-red-400 px-2 py-1.5 cursor-pointer">
            Sair
          </button>
        </div>
      </nav>

      {/* CONTAINER */}
      <div className="flex flex-1 w-full relative items-start">
        <aside 
          className={`
            bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80 p-5 flex flex-col justify-between 
            h-[calc(100vh-65px)] sticky top-[65px] z-40 transition-all duration-300 ease-in-out shrink-0
            ${menuAberto ? 'w-64 border-r opacity-100' : 'w-0 p-0 border-r-0 opacity-0 pointer-events-none overflow-hidden'}
          `}
        >
          <div className="space-y-4">
            <span className="px-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Menu Principal
            </span>
            <nav className="flex flex-col gap-1">
              <Link to="/" onClick={() => window.innerWidth < 768 && setMenuAberto(false)} className={linkClasse('/')}>
                📊 Dashboard
              </Link>
              <Link to="/pacientes" onClick={() => window.innerWidth < 768 && setMenuAberto(false)} className={linkClasse('/pacientes')}>
                🐾 Tutores & Pets
              </Link>
              <Link to="/consultas" onClick={() => window.innerWidth < 768 && setMenuAberto(false)} className={linkClasse('/consultas')}>
                📅 Agenda & Prontuários
              </Link>
              <Link to="/estoque" onClick={() => window.innerWidth < 768 && setMenuAberto(false)} className={linkClasse('/estoque')}>
                📦 Estoque & Insumos
              </Link>
              <Link to="/gerenciamento" onClick={() => window.innerWidth < 768 && setMenuAberto(false)} className={linkClasse('/gerenciamento')}>
                ⚙️ Configurações / Clínica
              </Link>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full transition-all duration-300">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/gerenciamento" element={<Gerenciamento />} />
          </Routes>
        </main>
      </div>

    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/*" element={
          <RotaProtegida>
            <LayoutPrivado darkMode={darkMode} setDarkMode={setDarkMode} />
          </RotaProtegida>
        } />
      </Routes>
    </Router>
  );
}