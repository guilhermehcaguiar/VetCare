import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [nomeClinica, setNomeClinica] = useState('Clínica PetHealth');
  const [metricas, setMetricas] = useState({ pets: 0, tutores: 0, medicos: 0, proximas: 0, concluidas: 0, caes: 0, gatos: 0, aves: 0, outros: 0 });
  const [abaAtiva, setAbaAtiva] = useState('proximas');
  const [consultasFiltradas, setConsultasFiltradas] = useState([]);
  const [alertasEstoque, setAlertasEstoque] = useState([]);
  const [capacidadeMaxima, setCapacidadeMaxima] = useState(0);

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('clinica_name');
    if (nomeSalvo) setNomeClinica("Clínica " + nomeSalvo.charAt(0).toUpperCase() + nomeSalvo.slice(1));

    const tutoresSalvos = localStorage.getItem('vetcare_tutores');
    let totalPets = 0, totalTutores = 0, cães = 0, gatos = 0, avesCount = 0, outrosCount = 0;
    
    if (tutoresSalvos) {
      const lista = JSON.parse(tutoresSalvos);
      totalTutores = lista.length;
      lista.forEach(t => {
        if (t.pets) {
          totalPets += t.pets.length;
          t.pets.forEach(p => {
            if (p.especie === 'CACHORRO') cães++;
            else if (p.especie === 'GATO') gatos++;
            else if (p.especie === 'AVE') avesCount++;
            else outrosCount++;
          });
        }
      });
    }

    const medicosSalvos = localStorage.getItem('corpo_clinico');
    const totalMedicos = medicosSalvos ? JSON.parse(medicosSalvos).length : 0;
    setCapacidadeMaxima(totalMedicos * 16);

    const carregarConsultas = async () => {
      let listaConsultas = [];
      try {
        const res = await api.get('consultas/');
        if (res.data && Array.isArray(res.data)) {
          listaConsultas = res.data;
        }
      } catch (err) {
        const salvas = localStorage.getItem('vetcare_consultas');
        if (salvas) listaConsultas = JSON.parse(salvas);
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
        aves: avesCount, 
        outros: outrosCount 
      });
      setConsultasFiltradas(abaAtiva === 'proximas' ? proximas : concluidas);
    };

    carregarConsultas();

    const estoqueSalvo = localStorage.getItem('vetcare_estoque');
    if (estoqueSalvo) {
      const baixos = JSON.parse(estoqueSalvo).filter(item => Number(item.quantidade) <= Number(item.limiteMinimo));
      setAlertasEstoque(baixos);
    }
  }, [abaAtiva]);

  // CORREÇÃO DEFINITIVA DO BUG NaN%: Verifica se existe capacidade antes do cálculo
  const taxaOcupacao = capacidadeMaxima > 0 ? Math.min(Math.round((metricas.proximas / capacidadeMaxima) * 100), 100) : 0;

  return (
    <div className="space-y-6 text-zinc-100 animate-fade-in bg-transparent">
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          {nomeClinica} <span className="text-teal-500"></span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Painel de gerenciamento analítico e monitoramento operacional de clínica veterinária.</p>
      </div>

      {/* QUADRADO DE METRICAS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl flex justify-between items-center hover:border-zinc-700 transition-colors shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pacientes</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{metricas.pets}</h3>
            <div className="text-[10px] text-zinc-500 flex gap-2 font-medium mt-1">
              <span>🐶 {metricas.caes}</span><span>🐱 {metricas.gatos}</span><span>🦜 {metricas.aves}</span>
            </div>
          </div>
          <div className="text-xl p-2 bg-zinc-950 border border-zinc-800 rounded-lg">🐶</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl flex justify-between items-center hover:border-zinc-700 transition-colors shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Clientes / Tutores</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{metricas.tutores}</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Responsáveis ativos</p>
          </div>
          <div className="text-xl p-2 bg-zinc-950 border border-zinc-800 rounded-lg">👥</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl flex justify-between items-center hover:border-zinc-700 transition-colors shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ocupação do Dia</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{taxaOcupacao}%</h3>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">MAX: {capacidadeMaxima} VAGAS</p>
          </div>
          <div className="text-xl p-2 bg-zinc-950 border border-zinc-800 rounded-lg">📅</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl flex justify-between items-center hover:border-zinc-700 transition-colors shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Equipe Médica</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{metricas.medicos}</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Veterinários em escala</p>
          </div>
          <div className="text-xl p-2 bg-zinc-950 border border-zinc-800 rounded-lg">🏥</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LISTAGENS OPERACIONAIS */}
        <div className="md:col-span-2 bg-zinc-900/60 border border-zinc-200 border-zinc-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
              <button onClick={() => setAbaAtiva('proximas')} className={`pb-2 border-b-2 transition-all ${abaAtiva === 'proximas' ? 'border-teal-500 text-teal-400' : 'border-transparent text-zinc-500'}`}>⏳ Fila de Espera ({metricas.proximas})</button>
              <button onClick={() => setAbaAtiva('concluidas')} className={`pb-2 border-b-2 transition-all ${abaAtiva === 'concluidas' ? 'border-teal-500 text-teal-400' : 'border-transparent text-zinc-500'}`}>✓ Histórico Clínico ({metricas.concluidas})</button>
            </div>
            <button onClick={() => navigate('/consultas')} className="text-[11px] text-teal-400 font-bold hover:underline">Ir para Agenda</button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {consultasFiltradas.length === 0 ? (
              <p className="text-xs text-zinc-500 py-10 text-center font-medium">Nenhum atendimento localizado nesta seção.</p>
            ) : (
              consultasFiltradas.map((c, i) => (
                <div key={c.id || i} className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200">{c.petNome}</h4>
                    <p className="text-xs text-zinc-500">{c.medicoNome} • <span className="text-zinc-400 font-medium">{c.motivo}</span></p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="px-2 py-0.5 bg-teal-950/40 text-teal-400 border border-teal-900/50 rounded text-[10px] font-bold">{c.hora}</span>
                    <span className="block text-[10px] text-zinc-500 mt-1">📅 {c.data}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ALERTAS DE ESTOQUE EXATOS DA SUA TELA */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 shadow-xl space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">⚠️ Alertas de Ruptura de Estoque</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {alertasEstoque.length === 0 ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/30 rounded-xl text-emerald-400 text-xs font-semibold text-center">✓ Insumos e materiais seguros.</div>
            ) : (
              alertasEstoque.map((item, idx) => (
                <div key={idx} className="p-3 bg-red-950/40 border border-red-900/30 rounded-xl text-red-400 text-xs font-medium">
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