import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Cadastro() {
  const navigate = useNavigate();
  const [clinicaNome, setClinicaNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const lidarComCadastro = async (e) => {
    e.preventDefault();
    if (!clinicaNome || !senha) return;

    setCarregando(true);
    setErro('');

    const payload = {
      username: clinicaNome.trim(),
      email: email.trim(),
      password: senha
    };

    try {
      const res = await api.post('register/', payload);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('clinica_name', res.data.username);
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErro(err.response.data.error);
      } else {
        setErro('Erro na conexão com a API. Garanta que o servidor Django está ativo.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-2xl space-y-6 focus-within:border-teal-500 transition-all">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            VetCare <span className="text-teal-600 dark:text-teal-500 text-base">🐾</span>
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold tracking-wider">
            Cadastre sua clínica veterinária
          </p>
        </div>

        {erro && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl text-center">
            {erro}
          </div>
        )}

        <form onSubmit={lidarComCadastro} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">Nome de Usuário</label>
            <input type="text" placeholder="Ex: Clínica 1" className="w-full px-4 py-3.5 text-sm bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 transition-colors" value={clinicaNome} onChange={e => setClinicaNome(e.target.value)} required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">E-mail da Empresa</label>
            <input type="email" placeholder="Ex: clinica1@email.com" className="w-full px-4 py-3.5 text-sm bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 transition-colors" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1">Senha</label>
            <input type="password" placeholder="Mínimo de 8 caracteres alfanuméricos..." className="w-full px-4 py-3.5 text-sm bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-teal-500 transition-colors" value={senha} onChange={e => setSenha(e.target.value)} required />
          </div>

          <button type="submit" disabled={carregando} className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-md border-2 border-transparent hover:border-teal-500 transition-all cursor-pointer">
            {carregando ? 'Registrando Clínica...' : 'Criar Conta VetCare'}
          </button>
        </form>

        <div className="text-center">
          <button type="button" onClick={() => navigate('/login')} className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline bg-transparent border-none cursor-pointer">Já possui conta cadastrada? Realizar Login</button>
        </div>
      </div>
    </div>
  );
}