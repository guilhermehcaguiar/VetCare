import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

const BANCO_RACAS = {
  CACHORRO: [
    'Sem Raça Definida (SRD)', 'Akita Inu', 'American Bully', 'Beagle', 'Bernese Mountain Dog',
    'Bichon Frisé', 'Border Collie', 'Boston Terrier', 'Boxer', 'Bulldog Francês',
    'Bulldog Inglês', 'Bull Terrier', 'Cane Corso', 'Cavalier King Charles Spaniel', 'Chihuahua',
    'Chow Chow', 'Cocker Spaniel Inglês', 'Dachshund (Teckel)', 'Dálmata', 'Doberman',
    'Dogue Alemão', 'Fila Brasileiro', 'Fox Paulistinha', 'Golden Retriever', 'Husky Siberiano',
    'Jack Russell Terrier', 'Labrador Retriever', 'Lhasa Apso', 'Maltês', 'Mastiff',
    'Papillon', 'Pastor Alemão', 'Pastor Australiano', 'Pastor Belga Malinois', 'Pastor de Shetland',
    'Pequinês', 'Pinscher Miniatura', 'Pit Bull (APBT)', 'Pointer Inglês', 'Poodle',
    'Pug', 'Rottweiler', 'Samoieda', 'São Bernardo', 'Schnauzer Miniatura',
    'Shar Pei', 'Shiba Inu', 'Shih Tzu', 'Weimaraner', 'Yorkshire Terrier'
  ],
  GATO: ['Sem Raça Definida (SRD)', 'Persa', 'Siamês', 'Maine Coon', 'Angorá', 'Sphynx', 'Ragdoll', 'British Shorthair'],
  AVE: ['Calopsita', 'Papagaio Verdadeiro', 'Canário Belga', 'Periquito Australiano', 'Agapornis', 'Caturrita'],
  OUTROS: ['Coelho Netherland', 'Porquinho da Índia', 'Hedgehog (Ouriço)', 'Hamster Sírio', 'Chinchila', 'Jabuti-Piranga', 'Tigre d’Água']
};

export default function Pacientes() {
  const [tutores, setTutores] = useState([]);
  const [nomeTutor, setNomeTutor] = useState('');
  const [cpf, setCpf] = useState('');
  
  const [tutorSelecionado, setTutorSelecionado] = useState(null);
  const [nomePet, setNomePet] = useState('');
  const [especie, setEspecie] = useState('CACHORRO');
  
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');

  const [mostrarRacas, setMostrarRacas] = useState(false);
  const [racasFiltradas, setRacasFiltradas] = useState([]);
  const containerRacaRef = useRef(null);

  const [petEmEdicao, setPetEmEdicao] = useState(null);
  const [petTimeline, setPetTimeline] = useState(null);
  const [historicoClinico, setHistoricoClinico] = useState([]);

  const carregarTutores = async () => {
    try {
      const res = await api.get('tutores/');
      if (res.data && Array.isArray(res.data)) {
        setTutores(res.data);
        localStorage.setItem('vetcare_tutores', JSON.stringify(res.data));
      }
    } catch (e) {
      setTutores(JSON.parse(localStorage.getItem('vetcare_tutores') || '[]'));
    }
  };

  useEffect(() => { 
    carregarTutores(); 
  }, []);

  useEffect(() => {
    function cliqueFora(e) {
      if (containerRacaRef.current && !containerRacaRef.current.contains(e.target)) setMostrarRacas(false);
    }
    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  useEffect(() => {
    setRacasFiltradas(BANCO_RACAS[especie] || []);
    setRaca(''); 
  }, [especie]);

  const lidarComCpf = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    setCpf(valor);
  };

  const cadastrarTutor = async (e) => {
    e.preventDefault();
    if (!nomeTutor) return;
    const novo = { nome: nomeTutor.trim(), cpf: cpf.trim() || '---', pets: [] };

    try {
      await api.post('tutores/', novo);
      carregarTutores();
    } catch (err) {
      const locais = [...tutores, { ...novo, id: Date.now() }];
      setTutores(locais);
      localStorage.setItem('vetcare_tutores', JSON.stringify(locais));
    }
    setNomeTutor(''); setCpf('');
  };

  const deletarTutor = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Deseja remover permanentemente o registro deste tutor e todos os seus pets vinculados?")) return;
    try {
      await api.delete(`tutores/${id}/`);
      carregarTutores();
      if (tutorSelecionado?.id === id) setTutorSelecionado(null);
    } catch (err) {
      const filtrados = tutores.filter(t => t.id !== id);
      setTutores(filtrados);
      localStorage.setItem('vetcare_tutores', JSON.stringify(filtrados));
      if (tutorSelecionado?.id === id) setTutorSelecionado(null);
    }
  };

  const vincularOuEditarPet = async (e) => {
    e.preventDefault();
    if (!tutorSelecionado || !nomePet) return;

    const dadosPet = {
      tutor: tutorSelecionado.id,
      nome: nomePet.trim(),
      especie,
      raca: raca.trim() || 'Sem Raça Definida (SRD)',
      peso: peso.trim() ? `${peso.trim().replace(' kg', '')} kg` : '--'
    };

    try {
      if (petEmEdicao) {
        await api.put(`pets/${petEmEdicao.id}/`, dadosPet);
      } else {
        await api.post('pets/', dadosPet);
      }
      carregarTutores();
      resetarFormularioPet();
    } catch (err) {
      const tutoresAtualizados = tutores.map(t => {
        if (t.id === tutorSelecionado.id) {
          let novosPets = t.pets || [];
          if (petEmEdicao) {
            novosPets = novosPets.map(p => p.id === petEmEdicao.id ? { ...p, ...dadosPet } : p);
          } else {
            novosPets = [...novosPets, { ...dadosPet, id: Date.now() }];
          }
          return { ...t, pets: novosPets };
        }
        return t;
      });
      setTutores(tutoresAtualizados);
      localStorage.setItem('vetcare_tutores', JSON.stringify(tutoresAtualizados));
      resetarFormularioPet();
    }
  };

  const iniciarEdicaoPet = (pet, e) => {
    e.stopPropagation();
    setPetEmEdicao(pet);
    setNomePet(pet.nome);
    setEspecie(pet.especie);
    setRaca(pet.raca);
    setPeso(pet.peso ? pet.peso.replace(' kg', '') : '');
  };

  const deletarPet = async (petId, e) => {
    e.stopPropagation();
    if (!window.confirm("Deseja remover permanentemente este animal do prontuário do tutor?")) return;
    try {
      await api.delete(`pets/${petId}/`);
      carregarTutores();
      resetarFormularioPet();
    } catch (err) {
      const tutoresAtualizados = tutores.map(t => {
        if (t.id === tutorSelecionado.id) {
          return { ...t, pets: (t.pets || []).filter(p => p.id !== petId) };
        }
        return t;
      });
      setTutores(tutoresAtualizados);
      localStorage.setItem('vetcare_tutores', JSON.stringify(tutoresAtualizados));
      resetarFormularioPet();
    }
  };

  const abrirTimelinePet = async (petNome, e) => {
    e.stopPropagation();
    setPetTimeline(petNome);
    atualizarListaConsultas(petNome);
  };

  // Centraliza o carregamento e sincronização local/remota de consultas filtradas
  const atualizarListaConsultas = async (petNome) => {
    let todasConsultas = [];
    try {
      const res = await api.get('consultas/');
      todasConsultas = res.data;
    } catch (err) {
      todasConsultas = JSON.parse(localStorage.getItem('vetcare_consultas') || '[]');
    }

    const filtradas = todasConsultas
      .filter(c => c && c.petNome.toLowerCase() === petNome.toLowerCase())
      .sort((a, b) => b.id - a.id);

    setHistoricoClinico(filtradas);
  };

  // EXCLUSÃO DE CONSULTAS INTEGRADA NA TIMELINE
  const deletarConsulta = async (consultaId) => {
    if (!window.confirm("Deseja deletar permanentemente o registro desta consulta da linha do tempo?")) return;
    try {
      await api.delete(`consultas/${consultaId}/`);
      atualizarListaConsultas(petTimeline);
    } catch (err) {
      let todas = JSON.parse(localStorage.getItem('vetcare_consultas') || '[]');
      todas = todas.filter(c => c.id !== consultaId);
      localStorage.setItem('vetcare_consultas', JSON.stringify(todas));
      atualizarListaConsultas(petTimeline);
    }
  };

  const resetarFormularioPet = () => {
    setNomePet('');
    setRaca('');
    setPeso('');
    setPetEmEdicao(null);
    const atual = tutores.find(t => t.id === tutorSelecionado?.id);
    if (atual) setTutorSelecionado(atual);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-zinc-100 animate-fade-in bg-transparent relative">
      
      {/* CADASTRO E HISTÓRICO DE TUTORES */}
      <div className="md:col-span-7 space-y-4">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Cadastrar Proprietário</h2>
          <form onSubmit={cadastrarTutor} className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder="Nome Completo..." className="flex-1 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-500/30 transition-all" value={nomeTutor} onChange={e => setNomeTutor(e.target.value)} required />
            <input type="text" placeholder="CPF..." maxLength="14" className="w-full sm:w-44 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-500/30 transition-all font-mono" value={cpf} onChange={lidarComCpf} />
            <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase rounded-lg transition-colors shrink-0 shadow-md">Registrar Tutor</button>
          </form>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/20 grid grid-cols-12 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <div className="col-span-4">Responsável</div>
            <div className="col-span-3">CPF</div>
            <div className="col-span-3 text-center">Animais</div>
            <div className="col-span-2 text-right">Ação</div>
          </div>
          <div className="overflow-y-auto max-h-80 divide-y divide-zinc-800/60">
            {tutores.map(t => (
              <div key={t.id} onClick={() => setTutorSelecionado(t)} className={`p-4 grid grid-cols-12 items-center text-xs font-medium cursor-pointer transition-all duration-200 ${tutorSelecionado?.id === t.id ? 'bg-teal-950/20 border-l-4 border-teal-500 text-teal-400' : 'hover:bg-zinc-950/30'}`}>
                <div className="col-span-4 font-bold">{t.nome}</div>
                <div className="col-span-3 font-mono text-zinc-400">{t.cpf}</div>
                <div className="col-span-3 text-center"><span className="bg-zinc-950 border border-zinc-800/80 px-2.5 py-0.5 rounded-full font-bold text-zinc-400">{t.pets?.length || 0}</span></div>
                <div className="col-span-2 text-right">
                  <button onClick={(e) => deletarTutor(t.id, e)} className="text-zinc-500 hover:text-red-400 font-bold transition-colors bg-transparent border-none">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENTRAL COMPLETA DO TUTOR E SEUS PETS */}
      <div className="md:col-span-5">
        {tutorSelecionado ? (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">🐾 Animais Vinculados a {tutorSelecionado.nome.split(' ')[0]}</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(!tutorSelecionado.pets || tutorSelecionado.pets.length === 0) ? (
                  <p className="text-xs text-zinc-500 text-center py-4">Nenhum animal vinculado a essa ficha.</p>
                ) : (
                  tutorSelecionado.pets.map((pet, idx) => (
                    <div key={pet.id || idx} className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex justify-between items-center hover:border-zinc-800 transition-colors group">
                      <div>
                        <div className="font-bold text-sm text-zinc-200">
                          {pet.especie === 'CACHORRO' ? '🐶' : pet.especie === 'GATO' ? '🐱' : pet.especie === 'AVE' ? '🦜' : '🦎'} {pet.nome}
                          <span className="text-[10px] font-mono text-zinc-500 ml-2">({pet.peso || '--'})</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">{pet.raca}</div>
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={(e) => abrirTimelinePet(pet.nome, e)} className="text-[10px] font-bold bg-teal-950/40 text-teal-400 hover:bg-teal-600 hover:text-white px-2 py-1 rounded transition-all">Histórico</button>
                        <button type="button" onClick={(e) => iniciarEdicaoPet(pet, e)} className="text-[10px] font-bold bg-zinc-900 text-zinc-300 hover:text-white px-2 py-1 rounded border border-zinc-800">Editar</button>
                        <button type="button" onClick={(e) => deletarPet(pet.id || idx, e)} className="text-[10px] font-bold bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded transition-all">Remover</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">{petEmEdicao ? '✏️ Modificar Registro do Pet' : '➕ Vincular Novo Paciente'}</h3>
              <form onSubmit={vincularOuEditarPet} className="space-y-3">
                <div><input type="text" placeholder="Nome do Animal..." className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={nomePet} onChange={e => setNomePet(e.target.value)} required /></div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select className="px-2 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none cursor-pointer focus:border-teal-500" value={especie} onChange={e => setEspecie(e.target.value)}>
                    <option value="CACHORRO">Cachorro</option>
                    <option value="GATO">Gato</option>
                    <option value="AVE">Ave</option>
                    <option value="OUTROS">Outros / Exótico</option>
                  </select>

                  <div className="relative w-full" ref={containerRacaRef}>
                    <input type="text" placeholder="Raça..." className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={raca} onChange={e => { setRaca(e.target.value); setRacasFiltradas((BANCO_RACAS[especie] || []).filter(r => r.toLowerCase().includes(e.target.value.toLowerCase()))); setMostrarRacas(true); }} onFocus={() => { setRacasFiltradas(BANCO_RACAS[especie] || []); setMostrarRacas(true); }} required />
                    {mostrarRacas && racasFiltradas.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 max-h-36 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl z-50 divide-y divide-zinc-900">
                        {racasFiltradas.map((sug, i) => (
                          <div key={i} onClick={() => { setRaca(sug); setMostrarRacas(false); }} className="px-3 py-1.5 text-xs text-zinc-400 hover:text-teal-400 hover:bg-teal-950/20 border-l-2 border-transparent hover:border-teal-500 hover:shadow-[0_0_10px_rgba(0,168,150,0.3)] transition-all duration-150 cursor-pointer">{sug}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input type="text" placeholder="Peso (Ex: 8.5)" className="flex-1 px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={peso} onChange={e => setPeso(e.target.value)} />
                  {petEmEdicao && <button type="button" onClick={resetarFormularioPet} className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white">Cancelar</button>}
                </div>

                <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all">{petEmEdicao ? 'Salvar Alterações' : 'Vincular Paciente'}</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/40 border border-zinc-800 border-dashed rounded-xl p-8 text-center h-full flex items-center justify-center"><p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Selecione um tutor na lista para abrir o gerenciador de prontuários</p></div>
        )}
      </div>

      {/* MODAL DA LINHA DO TEMPO COM BOTÃO DE EXCLUIR CONSULTA DE VOLTA */}
      {petTimeline && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 shrink-0">
              <div>
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">📋 Histórico Clínico Unificado</span>
                <h3 className="text-lg font-black text-zinc-100 mt-0.5">Linha do Tempo de {petTimeline}</h3>
              </div>
              <button onClick={() => setPetTimeline(null)} className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 text-zinc-400 hover:text-white font-bold text-xs">Fechar</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2 relative">
              {historicoClinico.length === 0 ? (
                <p className="text-xs text-zinc-500 py-12 text-center uppercase font-bold tracking-wide">Nenhuma consulta consolidada foi localizada no histórico desse animal.</p>
              ) : (
                <div className="relative pl-6 border-l border-zinc-800 space-y-6 ml-2 py-1">
                  {historicoClinico.map((c, i) => (
                    <div key={c.id || i} className="relative space-y-1 bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl hover:border-teal-500/20 transition-colors group">
                      <div className="absolute -left-[31px] top-4 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-zinc-900 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                      
                      <div className="flex justify-between items-start text-xs">
                        <span className="font-mono text-zinc-400 font-bold">📅 {c.data} às {c.hora}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900/30 rounded text-[9px] font-black uppercase">Concluída</span>
                          {/* BOTÃO DE EXCLUIR CONSULTA RESTAURADO COM RENDERIZAÇÃO ESTÁVEL */}
                          <button 
                            type="button" 
                            onClick={() => deletarConsulta(c.id)} 
                            className="text-red-400 hover:text-red-500 font-bold text-[10px] transition-colors ml-1 bg-transparent border-none cursor-pointer"
                          >
                            Excluir Registro
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-black text-zinc-200 mt-1">{c.motivo}</h4>
                      <p className="text-xs text-zinc-500 font-semibold">Médico Veterinário: {c.medicoNome}</p>
                      
                      {c.prontuario && (
                        <div className="mt-3 p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1.5 text-[11px] text-zinc-400 border-l-2 border-teal-500/50">
                          <div><strong>Anamnese:</strong> {c.prontuario.anamnese || 'Não descrita'}</div>
                          <div><strong>Diagnóstico:</strong> {c.prontuario.diagnostico || 'Não concluído'}</div>
                          <div><strong>Prescrição:</strong> {c.prontuario.prescricao || 'Nenhuma medicação listada'}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}