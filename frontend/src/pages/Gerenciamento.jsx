import { useState, useEffect } from 'react';
import api from '../api';

export default function Gerenciamento() {
  const [medicos, setMedicos] = useState([]);
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('M');
  const [crmv, setCrmv] = useState('');
  const [especialidade, setEspecialidade] = useState('Clínico Geral');

  const [nomeClinica, setNomeClinica] = useState(() => localStorage.getItem('clinica_name') || 'PetHealth');
  const [emailClinica, setEmailClinica] = useState(() => localStorage.getItem('clinica_email') || 'pethealth@gmail.com');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  const carregarMedicos = async () => {
    try {
      const res = await api.get('medicos/');
      if (res.data && Array.isArray(res.data)) setMedicos(res.data);
    } catch (e) {
      setMedicos(JSON.parse(localStorage.getItem('corpo_clinico') || '[]'));
    }
  };

  useEffect(() => { carregarMedicos(); }, []);

  const atualizarInstituicao = (e) => {
    e.preventDefault();
    if (senhaConfirmacao !== 'admin123') {
      alert('Senha administrativa de segurança incorreta! Modificação negada.');
      return;
    }
    localStorage.setItem('clinica_name', nomeClinica.trim());
    localStorage.setItem('clinica_email', emailClinica.trim());
    alert('Dados institucionais atualizados com sucesso!');
    setSenhaConfirmacao('');
  };

  const credenciarMedico = async (e) => {
    e.preventDefault();
    if (!nome || !crmv) return;

    const novo = { nome: nome.trim(), sexo, crmv: crmv.trim(), especialidade };

    try {
      await api.post('medicos/', novo);
      carregarMedicos();
    } catch (err) {
      const locais = [...medicos, { ...novo, id: Date.now() }];
      setMedicos(locais);
      localStorage.setItem('corpo_clinico', JSON.stringify(locais));
    }
    setNome(''); setCrmv(''); setSexo('M');
  };

  return (
    <div className="space-y-6 text-zinc-100 animate-fade-in bg-transparent">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INFORMAÇÕES DA INSTITUIÇÃO */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Informações da Instituição</h2>
          <form onSubmit={atualizarInstituicao} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Nome de Exibição da Clínica</label>
              <input type="text" className="w-full mt-1 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-teal-500" value={nomeClinica} onChange={e => setNomeClinica(e.target.value)} required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase">E-mail de Contato Público</label>
              <input type="email" className="w-full mt-1 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-teal-500" value={emailClinica} onChange={e => setEmailClinica(e.target.value)} required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-red-400 uppercase">Confirmar Senha Administrativa</label>
              <input type="password" placeholder="••••••••" className="w-full mt-1 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={senhaConfirmacao} onChange={e => setSenhaConfirmacao(e.target.value)} required />
            </div>
            <button type="submit" className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs uppercase rounded-lg tracking-wider transition-colors shadow-md">Atualizar Dados da Unidade</button>
          </form>
        </div>

        {/* CREDENCIAR MÉDICO VETERINÁRIO */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Credenciar Médico Veterinário</h2>
          <form onSubmit={credenciarMedico} className="space-y-4">
            <div>
              <input type="text" placeholder="Nome Completo..." className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="CRMV..." className="px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={crmv} onChange={e => setCrmv(e.target.value)} required />
              <select className="px-2 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none cursor-pointer" value={sexo} onChange={e => setSexo(e.target.value)}>
                <option value="M">Masculino (Dr.)</option>
                <option value="F">Feminino (Dra.)</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none cursor-pointer" value={especialidade} onChange={e => setEspecialidade(e.target.value)}>
                <option value="Clínico Geral">Clínico Geral</option>
                <option value="Cirurgia Geral">Cirurgia Geral</option>
                <option value="Medicina Felina">Medicina Felina</option>
                <option value="Anestesiologia">Anestesiologia</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase rounded-lg tracking-widest transition-colors">Adicionar ao Quadro</button>
          </form>
        </div>
      </div>

      {/* HISTÓRICO INFERIOR UNIFICADO */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/20"><h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Corpo Clínico Credenciado</h3></div>
        <div className="overflow-y-auto max-h-60 divide-y divide-zinc-800">
          {medicos.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">Nenhum profissional listado.</p>
          ) : (
            medicos.map((m, idx) => (
              <div key={m.id || idx} className="p-4 grid grid-cols-3 gap-2 text-xs font-medium text-zinc-300">
                <div className="font-bold text-zinc-200">{m.sexo === 'F' ? 'Dra.' : 'Dr.'} {m.nome}</div>
                <div className="font-mono">{m.crmv}</div>
                <div className="text-right font-semibold text-teal-400 uppercase tracking-wider">{m.especialidade}</div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}