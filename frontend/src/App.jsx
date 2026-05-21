import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        {/* Menu de Navegação Superior Provisório */}
        <nav className="bg-white border-b border-slate-200 px-8 py-4 flex gap-6 shadow-xs">
          <Link to="/" className="font-semibold text-teal-600 hover:text-teal-700">Dashboard</Link>
          <Link to="/pacientes" className="font-semibold text-teal-600 hover:text-teal-700">Pets (Pacientes)</Link>
        </nav>

        {/* Conteúdo da Página Atual */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
