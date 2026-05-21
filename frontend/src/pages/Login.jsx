import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Mudado de axios para api

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      // Consome usando a baseURL correta (api/token/)
      const res = await api.post('token/', { username, password });
      
      const accessToken = res.data.access;
      const refreshToken = res.data.refresh;

      if (accessToken) {
        localStorage.setItem('vetcare_access', accessToken);
        localStorage.setItem('vetcare_refresh', refreshToken);
        localStorage.setItem('clinica_name', username);

        // Empurra para a raiz e força a atualização do estado das rotas
        window.location.href = '/';
      } else {
        setErro('O servidor não retornou as chaves de acesso.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 400)) {
        setErro('Credenciais inválidas. Verifique o identificador e a chave de acesso.');
      } else {
        setErro('Não foi possível conectar ao servidor backend.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 p-4 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#121214] border border-zinc-800/60 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            VetCare <span className="text-teal-500 text-xl">🐾</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-2 font-medium">Acesse o painel clínico restrito</p>
        </div>

        {erro && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold rounded-lg uppercase tracking-wide">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Identificador / Clínica</label>
            <input 
              type="text" 
              id="login-username"
              name="login-username"
              placeholder="Ex: clinica_centro"
              className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-500"
              style={{ WebkitBoxShadow: '0 0 0 30px #09090b inset', WebkitTextFillColor: '#e4e4e7' }}
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Chave de Acesso</label>
            <input 
              type="password" 
              id="login-password"
              name="login-password"
              placeholder="Sua senha de acesso..."
              className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-500"
              style={{ WebkitBoxShadow: '0 0 0 30px #09090b inset', WebkitTextFillColor: '#e4e4e7' }}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 mt-2 bg-[#00c2a8] hover:bg-[#00a891] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(0,194,168,0.3)] hover:shadow-[0_0_25px_rgba(0,194,168,0.5)] active:scale-[0.98]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <Link to="/cadastro" className="text-xs text-[#00c2a8] hover:text-white transition-colors font-medium">
            Cadastrar nova unidade institucional →
          </Link>
        </div>
      </div>
    </div>
  );
}