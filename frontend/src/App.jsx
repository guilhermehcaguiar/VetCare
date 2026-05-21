import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

function RotaProtegida({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function LayoutPrivado() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-xs">
        <div className="flex gap-6 items-center">
          <span className="text-xl font-bold text-slate-800">VetCare 🐾</span>
          <Link to="/" className="font-semibold text-slate-600 hover:text-teal-600 text-sm transition-colors">Dashboard</Link>
          <Link to="/pacientes" className="font-semibold text-slate-600 hover:text-teal-600 text-sm transition-colors">Pets (Pacientes)</Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-red-500 hover:text-red-700 uppercase tracking-wider cursor-pointer"
        >
          Sair
        </button>
      </nav>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Privadas e Protegidas */}
        <Route
          path="/*"
          element={
            <RotaProtegida>
              <LayoutPrivado />
            </RotaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}