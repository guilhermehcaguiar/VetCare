import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login({ darkMode, setDarkMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('clinica_name', username);
      navigate('/');
    } catch (err) {
      setErro('Credenciais inválidas para esta unidade.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4 relative">
      
      {/* Alternador Superior Direito */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-zinc-300/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-xs"
        >
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            VetCare <span className="text-teal-600 dark:text-teal-500 text-base">🐾</span>
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Acesse o painel clínico restrito</p>
        </div>

        {/* ALERTA DE ERRO MÉDICO APERFEIÇOADO */}
        {erro && (
          <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-3 rounded-lg text-xs font-semibold text-center shadow-xs">
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Identificador / Clínica</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white transition-all"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Chave de Acesso</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none text-sm text-zinc-900 dark:text-zinc-100 focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BOTÃO COR CLÍNICA TEAL */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors disabled:bg-zinc-400 cursor-pointer text-center uppercase tracking-wider shadow-xs"
          >
            {carregando ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <Link to="/cadastro" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
            Cadastrar nova unidade institucional →
          </Link>
        </div>
      </div>
    </div>
  );
}