import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await api.post('users/', { username, email, password });
      navigate('/login');
    } catch (err) {
      setErro('Erro ao registrar clínica. Verifique os dados fornecidos.');
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
          <p className="text-sm text-zinc-500 mt-2 font-medium">Cadastre sua clínica veterinária</p>
        </div>

        {erro && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold rounded-lg uppercase tracking-wide">
            {erro}
          </div>
        )}

        {/* Adicionado autoComplete="off" para blindar o formulário */}
        <form onSubmit={handleRegister} className="space-y-5" autoComplete="off">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Nome de Usuário</label>
            <input 
              type="text" 
              id="cadastro-username"
              name="cadastro-username"
              autoComplete="off"
              placeholder="Ex: Clinica 1"
              className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-500"
              style={{ WebkitBoxShadow: '0 0 0 30px #09090b inset', WebkitTextFillColor: '#e4e4e7' }}
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">E-mail da Empresa</label>
            <input 
              type="email" 
              id="cadastro-email"
              name="cadastro-email"
              autoComplete="off"
              placeholder="Ex: clinica1@email.com"
              className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-500"
              style={{ WebkitBoxShadow: '0 0 0 30px #09090b inset', WebkitTextFillColor: '#e4e4e7' }}
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Senha</label>
            <input 
              type="password" 
              id="cadastro-password"
              name="cadastro-password"
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres alfanuméricos..."
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
            Criar Conta VetCare
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <Link to="/login" className="text-xs text-[#00c2a8] hover:text-white transition-colors font-medium">
            ← Voltar para o painel de acesso
          </Link>
        </div>

      </div>
    </div>
  );
}