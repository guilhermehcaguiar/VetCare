import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

const HORARIOS_DISPONIVEIS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

const MESES = [
  { valor: 0, nome: 'Janeiro' }, { valor: 1, nome: 'Fevereiro' }, { valor: 2, nome: 'Março' },
  { valor: 3, nome: 'Abril' }, { valor: 4, nome: 'Maio' }, { valor: 5, nome: 'Junho' },
  { valor: 6, nome: 'Julho' }, { valor: 7, nome: 'Agosto' }, { valor: 8, nome: 'Setembro' },
  { valor: 9, nome: 'Outubro' }, { valor: 10, nome: 'Novembro' }, { valor: 11, nome: 'Dezembro' }
];

const MOTIVOS_PRE_DEFINIDOS = [
  'Vacinação Anual', 'Consulta de Rotina / Check-up', 'Castração Preventiva', 
  'Retorno de Cirurgia', 'Vômito / Diarreia Aguda', 'Coceira Dermatológica', 
  'Orelha Inflamada / Otite', 'Claudicação / Mancando', 'Tosse / Espirros Constantes'
];

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [listaPets, setListaPets] = useState([]);
  const [consultaAtiva, setConsultaAtiva] = useState(null);

  const [petEscolhido, setPetEscolhido] = useState('');
  const [medicoEscolhido, setMedicoEscolhido] = useState('');
  const [motivo, setMotivo] = useState('');
  const [dataObjeto, setDataObjeto] = useState(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState('');

  const [anamnese, setAnamnese] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [prescricao, setPrescricao] = useState('');

  const [mostrarMotivos, setMostrarMotivos] = useState(false);
  const [motivosFiltrados, setMotivosFiltrados] = useState(MOTIVOS_PRE_DEFINIDOS);
  const containerMotivoRef = useRef(null);

  const [mesNavegacao, setMesNavegacao] = useState(new Date().getMonth());
  const [anoNavegacao, setAnoNavegacao] = useState(new Date().getFullYear());

  // SISTEMA DE NOTIFICAÇÃO INTERNA NA TELA (BLINDADO CONTRA POP-UPS)
  const [notificacao, setNotificacao] = useState(null);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(null);

  const mostrarMensagem = (texto, tipo = 'sucesso') => {
    setNotificacao({ texto, tipo });
    setTimeout(() => setNotificacao(null), 4000);
  };

  const carregarDadosDoBanco = async () => {
    try {
      const res = await api.get('consultas/');
      if (res.data && Array.isArray(res.data)) {
        setConsultas(res.data);
      }
    } catch (err) {
      const salvas = localStorage.getItem('vetcare_consultas');
      if (salvas) setConsultas(JSON.parse(salvas));
    }
  };

  useEffect(() => {
    carregarDadosDoBanco();

    api.get('medicos/').then(res => {
      setMedicos(res.data);
    }).catch(() => {
      const salvos = localStorage.getItem('corpo_clinico');
      if (salvos) setMedicos(JSON.parse(salvos));
    });

    api.get('tutores/').then(res => {
      let aux = [];
      res.data.forEach(t => t.pets?.forEach(p => aux.push(p.nome)));
      setListaPets(aux);
    }).catch(() => {
      const tutoresSalvos = localStorage.getItem('vetcare_tutores');
      if (tutoresSalvos) {
        let aux = [];
        JSON.parse(tutoresSalvos).forEach(t => t.pets?.forEach(p => aux.push(p.nome)));
        setListaPets(aux);
      }
    });
  }, []);

  useEffect(() => {
    function cliqueFora(e) {
      if (containerMotivoRef.current && !containerMotivoRef.current.contains(e.target)) setMostrarMotivos(false);
    }
    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  const filaEsperaAtiva = consultas.filter(c => c && c.status !== 'concluida');
  const historicoConcluido = consultas.filter(c => c && c.status === 'concluida');

  const gerarDiasCalendario = () => {
    const primeiroDiaSemana = new Date(anoNavegacao, mesNavegacao, 1).getDay();
    const totalDiasMes = new Date(anoNavegacao, mesNavegacao + 1, 0).getDate();
    const dias = [];
    for (let i = 0; i < primeiroDiaSemana; i++) dias.push(null);
    for (let i = 1; i <= totalDiasMes; i++) dias.push(i);
    return dias;
  };

  const agendar = async (e) => {
    e.preventDefault();
    if (!petEscolhido || !medicoEscolhido || !horaSelecionada) return;

    const diaString = String(dataObjeto.getDate()).padStart(2, '0');
    const mesString = String(dataObjeto.getMonth() + 1).padStart(2, '0');
    const dataFormatada = `${diaString}/${mesString}/${dataObjeto.getFullYear()}`;

    const novaConsulta = {
      petNome: petEscolhido,
      medicoNome: medicoEscolhido,
      motivo: motivo || 'Consulta Geral',
      data: dataFormatada,
      hora: horaSelecionada,
      status: 'agendada',
      prontuario: {}
    };

    try {
      await api.post('consultas/', novaConsulta);
      carregarDadosDoBanco();
      mostrarMensagem('Agendamento médico efetuado com sucesso!');
    } catch (err) {
      const atualizadas = [...consultas, { ...novaConsulta, id: Date.now() }];
      setConsultas(atualizadas);
      localStorage.setItem('vetcare_consultas', JSON.stringify(atualizadas));
      mostrarMensagem('Consulta registrada!');
    }
    setPetEscolhido(''); setHoraSelecionada(''); setMotivo('');
  };

  const dispararExclusaoSegura = (id, e) => {
    e.stopPropagation();
    setConfirmacaoExclusao(id);
  };

  const confirmarExclusaoDinamica = async () => {
    if (!confirmacaoExclusao) return;
    const id = confirmacaoExclusao;
    try {
      await api.delete(`consultas/${id}/`);
      carregarDadosDoBanco();
      if (consultaAtiva?.id === id) setConsultaAtiva(null);
      mostrarMensagem('Agendamento excluído da grade.', 'aviso');
    } catch (err) {
      const filtradas = consultas.filter(c => c.id !== id);
      setConsultas(filtradas);
      localStorage.setItem('vetcare_consultas', JSON.stringify(filtradas));
      if (consultaAtiva?.id === id) setConsultaAtiva(null);
      mostrarMensagem('Registro removido da base local.', 'aviso');
    }
    setConfirmacaoExclusao(null);
  };

  const finalizarConsulta = async (e) => {
    e.preventDefault();
    if (!consultaAtiva) return;

    const objetoProntuario = { anamnese, diagnostico, prescricao };

    try {
      await api.put(`consultas/${consultaAtiva.id}/`, {
        ...consultaAtiva,
        status: 'concluida',
        prontuario: objetoProntuario
      });
      carregarDadosDoBanco();
      setConsultaAtiva(null);
      mostrarMensagem('Prontuário clínico consolidado com sucesso!');
    } catch (err) {
      const atualizadas = consultas.map(c => c.id === consultaAtiva.id ? { ...c, status: 'concluida', prontuario: objetoProntuario } : c);
      setConsultas(atualizadas);
      localStorage.setItem('vetcare_consultas', JSON.stringify(atualizadas));
      setConsultaAtiva(null);
      mostrarMensagem('Evolução salva localmente.');
    }
  };

  const carregarFicha = (c) => {
    setConsultaAtiva(c);
    setAnamnese(c.prontuario?.anamnese || '');
    setDiagnostico(c.prontuario?.diagnostico || '');
    setPrescricao(c.prontuario?.prescricao || '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-zinc-100 min-h-screen p-2 bg-transparent relative">
      
      {/* ALERTA INTEGRADO NA PARTE SUPERIOR DA INTERFACE */}
      {notificacao && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl border font-bold text-xs shadow-2xl transition-all duration-300 ${notificacao.tipo === 'aviso' ? 'bg-red-950/80 border-red-800 text-red-400' : 'bg-teal-950/80 border-teal-800 text-teal-400'}`}>
          {notificacao.tipo === 'aviso' ? '⚠️' : '✨'} {notificacao.texto}
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO */}
      <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Novo Agendamento</h2>
        <form onSubmit={agendar} className="space-y-4">
          
          <select className="w-full px-3 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-teal-500 transition-colors" value={petEscolhido} onChange={e => setPetEscolhido(e.target.value)} required>
            <option className="bg-zinc-900" value="">Selecione o Paciente</option>
            {listaPets.map((p, i) => <option className="bg-zinc-900" key={i} value={p}>{p}</option>)}
          </select>

          <select className="w-full px-3 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:border-teal-500 transition-colors" value={medicoEscolhido} onChange={e => setMedicoEscolhido(e.target.value)} required>
            <option className="bg-zinc-900" value="">Veterinário Responsável</option>
            {medicos.map(m => (
              <option className="bg-zinc-900" key={m.id} value={m.sexo === 'F' ? `Dra. ${m.nome}` : `Dr. ${m.nome}`}>
                {m.sexo === 'F' ? 'Dra.' : 'Dr.'} {m.nome}
              </option>
            ))}
          </select>

          <div className="relative w-full" ref={containerMotivoRef}>
            <input type="text" placeholder="Buscar ou Digitar Motivo..." className="w-full px-3 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-teal-500 hover:border-teal-500/30 transition-all" value={motivo} onChange={e => { setMotivo(e.target.value); setMotivosFiltrados(MOTIVOS_PRE_DEFINIDOS.filter(m => m.toLowerCase().includes(e.target.value.toLowerCase()))); setMostrarMotivos(true); }} onFocus={() => setMostrarMotivos(true)} required />
            {mostrarMotivos && (
              <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl z-50 divide-y divide-zinc-900">
                {motivosFiltrados.map((sug, i) => (
                  <div key={i} onClick={() => { setMotivo(sug); setMostrarMotivos(false); }} className="px-3 py-2 text-xs text-zinc-400 hover:text-teal-400 hover:bg-teal-950/20 border-l-2 border-transparent hover:border-teal-500 transition-all cursor-pointer">{sug}</div>
                ))}
              </div>
            )}
          </div>

          {/* CALENDÁRIO */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <select className="bg-transparent text-xs font-bold text-zinc-200 focus:outline-none cursor-pointer" value={mesNavegacao} onChange={e => setMesNavegacao(Number(e.target.value))}>
                  {MESES.map(m => <option className="bg-zinc-900 text-white" key={m.valor} value={m.valor}>{m.nome}</option>)}
                </select>
                <select className="bg-transparent text-xs font-bold text-zinc-200 focus:outline-none cursor-pointer" value={anoNavegacao} onChange={e => setAnoNavegacao(Number(e.target.value))}>
                  {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(a => <option className="bg-zinc-900 text-white" key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-zinc-400">
              {['D','S','T','Q','Q','S','S'].map(d => <span key={d}>{d}</span>)}
              {gerarDiasCalendario().map((dia, idx) => {
                if (!dia) return <div key={idx} />;
                const selecionado = dataObjeto.getDate() === dia && dataObjeto.getMonth() === mesNavegacao && dataObjeto.getFullYear() === anoNavegacao;
                return (
                  <button key={idx} type="button" onClick={() => setDataObjeto(new Date(anoNavegacao, mesNavegacao, dia))} className={`py-1 text-xs font-medium rounded transition-all ${selecionado ? 'bg-teal-600 text-white font-bold' : 'hover:bg-zinc-800 text-zinc-300'}`}>{dia}</button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Horário Disponível</label>
            <div className="grid grid-cols-4 gap-2">
              {HORARIOS_DISPONIVEIS.map(h => (
                <button key={h} type="button" onClick={() => setHoraSelecionada(h)} className={`py-2 rounded-lg border text-xs font-bold transition-all ${horaSelecionada === h ? 'bg-teal-600 border-teal-500 text-white shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-teal-500/40'}`}>{h}</button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">Agendar Atendimento</button>
        </form>
      </div>

      {/* FILAS DE ATENDIMENTO COM EXCLUSÃO DISCRETA RESTAURADA */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-xl">
          <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider mb-3">⏳ Fila de Chamada Ativa ({filaEsperaAtiva.length})</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filaEsperaAtiva.length === 0 ? <p className="text-xs text-zinc-500 py-4 text-center">Nenhum paciente aguardando.</p> : filaEsperaAtiva.map(c => (
              <div key={c.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex justify-between items-center group hover:border-teal-500/30 transition-all">
                <div onClick={() => carregarFicha(c)} className="cursor-pointer flex-1">
                  <div className="font-bold text-sm text-zinc-200 group-hover:text-teal-400 transition-colors">{c.petNome}</div>
                  <div className="text-[11px] text-zinc-500">{c.medicoNome} • {c.motivo}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">📅 {c.data} às {c.hora}</div>
                </div>
                {/* BOTÃO EXCLUIR RESTAURADO */}
                <button onClick={(e) => dispararExclusaoSegura(c.id, e)} className="opacity-0 group-hover:opacity-100 px-2 py-1 text-[10px] font-bold bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all">Deletar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-xl">
          <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider mb-3">✓ Histórico de Consultas Concluídas ({historicoConcluido.length})</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {historicoConcluido.length === 0 ? <p className="text-xs text-zinc-500 py-4 text-center">Nenhum atendimento finalizado hoje.</p> : historicoConcluido.map(c => (
              <div key={c.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex justify-between items-center group hover:border-teal-500/20 transition-all">
                <div onClick={() => carregarFicha(c)} className="cursor-pointer flex-1">
                  <div className="font-bold text-sm text-zinc-200">{c.petNome} <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded ml-1">Arquivado</span></div>
                  <div className="text-[11px] text-zinc-500">{c.medicoNome} • {c.motivo}</div>
                </div>
                <button onClick={(e) => dispararExclusaoSegura(c.id, e)} className="opacity-0 group-hover:opacity-100 px-2 py-1 text-[10px] font-bold bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all">Deletar</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REVISÃO DE PRONTUÁRIO */}
      <div className="lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        {consultaAtiva ? (
          <form onSubmit={finalizarConsulta} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">✏️ Emitir Prontuário</span>
              <h3 className="text-base font-black text-zinc-100 mt-1">{consultaAtiva.petNome}</h3>
              <p className="text-xs text-zinc-500">Atendimento por: {consultaAtiva.medicoNome}</p>
            </div>
            <div className="space-y-3 border-t border-zinc-800 pt-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Anamnese Geral</label>
                <textarea rows="3" className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-teal-500" value={anamnese} onChange={e => setAnamnese(e.target.value)} required disabled={consultaAtiva.status === 'concluida'} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Diagnóstico</label>
                <textarea rows="2" className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-teal-500" value={diagnostico} onChange={e => setDiagnostico(e.target.value)} required disabled={consultaAtiva.status === 'concluida'} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Prescrição</label>
                <textarea rows="2" className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-teal-500" value={prescricao} onChange={e => setPrescricao(e.target.value)} required disabled={consultaAtiva.status === 'concluida'} />
              </div>
            </div>
            {consultaAtiva.status !== 'concluida' ? (
              <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all">✓ Concluir Atendimento</button>
            ) : (
              <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center rounded-xl uppercase">✓ Ficha Clínica Auditada</div>
            )}
          </form>
        ) : (
          <p className="text-xs text-zinc-500 text-center py-24 font-medium uppercase tracking-wide">Selecione uma consulta ativa na lista para abrir a evolução clínica.</p>
        )}
      </div>

      {/* CONFIRMAÇÃO DE EXCLUSÃO CUSTOMIZADA NA INTERFACE (GLOW INTEGRADO) */}
      {confirmacaoExclusao && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 hover:border-teal-500/50 p-6 max-w-sm w-full rounded-xl shadow-2xl text-center space-y-4 transition-all">
            <div className="text-xl">⚠️</div>
            <h4 className="font-bold text-sm text-zinc-100">Excluir Permanente</h4>
            <p className="text-xs text-zinc-400">Deseja realmente remover e desindexar esse agendamento da base de dados?</p>
            <div className="flex gap-2 justify-center pt-2">
              <button onClick={confirmarExclusaoDinamica} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-lg transition-colors">Excluir</button>
              <button onClick={() => setConfirmacaoExclusao(null)} className="px-4 py-2 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold rounded-lg transition-colors">Voltar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}