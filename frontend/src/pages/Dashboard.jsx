import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [nomeClinica, setNomeClinica] = useState('Clínica PetHealth');
  const [metricas, setMetricas] = useState({ pets: 0, tutores: 0, medicos: 0, proximas: 0, concluidas: 0, caes: 0, gatos: 0, outros: 0 });
  
  const [abaAtiva, setAbaAtiva] = useState('proximas');
  const [consultasFiltradas, setConsultasFiltradas] = useState([]);
  const [alertasEstoque, setAlertasEstoque] = useState([]);
  const [capacidadeMaxima, setCapacidadeMaxima] = useState(16);

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('clinica_name');
    if (nomeSalvo) setNomeClinica("Clínica " + nomeSalvo.charAt(0).toUpperCase() + nomeSalvo.slice(1));

    // Processamento de contadores locais estáveis
    const tutoresSalvos = localStorage.getItem('vetcare_tutores');
    let totalPets = 0, totalTutores = 0, cães = 0, gatos = 0, outros = 0;
    if (tutoresSalvos) {
      const lista = JSON.parse(tutoresSalvos);
      totalTutores = lista.length;
      lista.forEach(t => {
        if (t.pets) {
          totalPets += t.pets.length;
          t.pets.forEach(p => {
            if (p.especie === 'CACHORRO') cães++;
            else if (p.especie === 'GATO') gatos++;
            else outros++;
          });
        }
      });
    }

    const medicosSalvos = localStorage.getItem('corpo_clinico');
    const totalMedicos = medicosSalvos ? JSON.parse(medicosSalvos).length : 1;
    setCapacidadeMaxima(totalMedicos * 16);

    const sincronizarDashboard = async () => {
      let listaConsultas = [];
      try {
        const res = await api.get('consultas/');
        if (res.data && Array.isArray(res.data)) {
          listaConsultas = res.data;
          localStorage.setItem('vetcare_consultas', JSON.stringify(res.data));
        }
      } catch (err) {
        const salvasLocal = localStorage.getItem('vetcare_consultas');
        if (salvasLocal) listaConsultas = JSON.parse(salvasLocal);
      }

      const proximas = listaConsultas.filter(c => c && c.status !== 'concluida');
      const concluidas = listaConsultas.filter(c => c && c.status === 'concluida');

      setMetricas({
        pets: totalPets,
        tutores: totalTutores,
        medicos: totalMedicos,
        proximas: proximas.length,
        concluidas: concluidas.length,
        caes: cães,
        gatos: gatos,
        outros: outros
      });

      setConsultasFiltradas(abaAtiva === 'proximas' ? proximas.slice(0, 5) : concluidas.slice(0, 5));
    };

    sincronizarDashboard();

    const estoqueSalvo = localStorage.getItem('vetcare_estoque');
    if (estoqueSalvo) {
      const baixos = JSON.parse(estoqueSalvo).filter(item => Number(item.quantidade) <= Number(item.limiteMinimo));
      setAlertasEstoque(baixos);
    }
  }, [abaAtiva]);

  const taxaOcupacao = Math.min(Math.round((metricas.proximas / capacidadeMaxima) * 100), 100);

  return (
    <div className="space-y-8 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          {nomeClinica} <span className="text-teal-600 dark:text-teal-500 font-normal">✨</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Painel de gerenciamento analítico e monitoramento operacional.</p>
      </div>

      {/* CARDS INDICADORES TOTALMENTE SIMÉTRICOS (SEM BARRA INTERNA) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        
        {/* CARD PACIENTES */}
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex justify-between items-center h-[115px] hover:border-teal-500/50 transition-colors shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Pacientes</p>
            <h3 className="text-3xl font-black tracking-tight">{metricas.pets}</h3>
            <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 flex gap-2 pt-0.5 select-none">
              <span>🐶 {metricas.caes}</span><span>🐱 {metricas.gatos}</span><span>🦜 {metricas.outros}</span>
            </div>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl group-hover:border-teal-500/20 group-hover:bg-teal-50/10 transition-all select-none text-xl shrink-0">🐶</div>
        </div>

        {/* CARD CLIENTES */}
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex justify-between items-center h-[115px] hover:border-teal-500/50 transition-colors shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Clientes / Tutores</p>
            <h3 className="text-3xl font-black tracking-tight">{metricas.tutores}</h3>
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Responsáveis ativos</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl group-hover:border-teal-500/20 group-hover:bg-teal-50/10 transition-all select-none text-xl shrink-0">👥</div>
        </div>

        {/* CARD OCUPAÇÃO DO DIA (EMOJI CENTRALIZADO COM SUCESSO) */}
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex justify-between items-center h-[115px] hover:border-teal-500/50 transition-colors shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Ocupação do Dia</p>
            <h3 className="text-3xl font-black tracking-tight">{taxaOcupacao}%</h3>
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 font-mono">MAX: {capacidadeMaxima} VAGAS</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl group-hover:border-teal-500/20 group-hover:bg-teal-50/10 transition-all select-none text-xl shrink-0">📅</div>
        </div>

        {/* CARD EQUIPE MÉDICA */}
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex justify-between items-center h-[115px] hover:border-teal-500/50 transition-colors shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Equipe Médica</p>
            <h3 className="text-3xl font-black tracking-tight">{metricas.medicos}</h3>
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Veterinários em escala</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl group-hover:border-teal-500/20 group-hover:bg-teal-50/10 transition-all select-none text-xl shrink-0">🏥</div>
        </div>

      </div>

      {/* PAINEL OPERACIONAL INFERIOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-5 shadow-xs">
          
          {/* BARRA DE PROGRESSO VERDE TRANSFERIDA LOGO ACIMA DA AGENDA */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <span>📊 Volume Operacional Programado</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">{metricas.proximas} de {capacidadeMaxima} Atendimentos ({taxaOcupacao}%)</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${taxaOcupacao}%` }} />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
              <button onClick={() => setAbaAtiva('proximas')} className={`pb-2 border-b-2 transition-colors cursor-pointer ${abaAtiva === 'proximas' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}>⏳ Fila de Espera ({metricas.proximas})</button>
              <button onClick={() => setAbaAtiva('concluidas')} className={`pb-2 border-b-2 transition-colors cursor-pointer ${abaAtiva === 'concluidas' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}>✓ Histórico Concluído ({metricas.concluidas})</button>
            </div>
            <button onClick={() => navigate('/consultas')} className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline">Ir para Agenda</button>
          </div>

          <div className="space-y-2.5">
            {consultasFiltradas.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">Nenhum registro localizado no banco.</p>
            ) : (
              consultasFiltradas.map((c, i) => (
                <div key={c.id || i} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl hover:border-teal-500/20 transition-all">
                  <div>
                    <h4 className="font-bold text-sm">{c.petNome}</h4>
                    <p className="text-xs text-zinc-400">{c.medicoNome} • <span className="font-medium text-zinc-500 dark:text-zinc-400">{c.motivo}</span></p>
                  </div>
                  <div className="text-right flex flex-col items-end justify-center">
                    <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${abaAtiva === 'concluidas' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400'}`}>{abaAtiva === 'concluidas' ? 'CONCLUÍDO' : c.hora}</span>
                    <span className="text-[10px] text-zinc-400 mt-1 font-medium font-mono">📅 {c.data}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">⚠️ Alertas de Ruptura de Estoque</h2>
          <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {alertasEstoque.length === 0 ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-medium text-center">✓ Insumos seguros.</div>
            ) : (
              alertasEstoque.map((item, idx) => (
                <div key={idx} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs">
                  <strong>Crítico:</strong> {item.nome} ({item.quantidade} unidades restantes).
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}