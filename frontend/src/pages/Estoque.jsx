import { useState, useEffect, useRef } from 'react';
import api from '../api';

const INSUMOS_PRE_FIXADOS = {
  Medicamentos: ['Antibiótico Cefalexina 250mg', 'Antibiótico Enrofloxacina 50mg', 'Anti-inflamatório Meloxicam 1mg', 'Analgetico Tramal 50mg', 'Dipirona Gotas 20ml'],
  Vacinas: ['Vacina V10 Importada (Cães)', 'Vacina V8 Importada (Cães)', 'Vacina Antirrábica', 'Vacina Quádrupla Felina V4'],
  Descartáveis: ['Seringa Descartável 1ml', 'Seringa Descartável 3ml', 'Luva de Procedimento M', 'Equipo de Soro Simples'],
  Cirúrgico: ['Fio de Sutura Nylon 3-0', 'Lâmina de Bisturi Nº 15', 'Gaze Estéril 7,5x7,5', 'Álcool Iodado 1L']
};

export default function Estoque() {
  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Medicamentos');
  const [quantidade, setQuantidade] = useState('');
  const [minimo, setMinimo] = useState('');

  // Estados para gerenciar as sugestões flutuantes
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [sugestoesFiltradas, setSugestoesFiltradas] = useState([]);
  const containerInsumoRef = useRef(null);

  const carregarEstoque = async () => {
    try {
      const res = await api.get('estoque/');
      if (res.data && Array.isArray(res.data)) {
        setItens(res.data);
        localStorage.setItem('vetcare_estoque', JSON.stringify(res.data));
      }
    } catch (e) {
      setItens(JSON.parse(localStorage.getItem('vetcare_estoque') || '[]'));
    }
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  // Fecha o painel de sugestões ao clicar fora do formulário
  useEffect(() => {
    function cliqueFora(e) {
      if (containerInsumoRef.current && !containerInsumoRef.current.contains(e.target)) {
        setMostrarSugestoes(false);
      }
    }
    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  // Filtra os insumos conforme digitação na categoria correta
  const lidarMudancaNome = (texto) => {
    setNome(texto);
    const listaDaCategoria = INSUMOS_PRE_FIXADOS[categoria] || [];
    
    if (!texto.trim()) {
      setSugestoesFiltradas(listaDaCategoria);
    } else {
      setSugestoesFiltradas(
        listaDaCategoria.filter(item => item.toLowerCase().includes(texto.toLowerCase()))
      );
    }
    setMostrarSugestoes(true);
  };

  const ativarFocoInsumo = () => {
    const listaDaCategoria = INSUMOS_PRE_FIXADOS[categoria] || [];
    setSugestoesFiltradas(!nome.trim() ? listaDaCategoria : listaDaCategoria.filter(item => item.toLowerCase().includes(nome.toLowerCase())));
    setMostrarSugestoes(true);
  };

  useEffect(() => {
    if (mostrarSugestoes) {
      const listaDaCategoria = INSUMOS_PRE_FIXADOS[categoria] || [];
      setSugestoesFiltradas(!nome.trim() ? listaDaCategoria : listaDaCategoria.filter(item => item.toLowerCase().includes(nome.toLowerCase())));
    }
  }, [categoria]);

  const cadastrar = async (e) => {
    e.preventDefault();
    if (!nome || !quantidade) return;

    const novo = {
      nome: nome.trim(),
      categoria,
      quantidade: Number(quantidade),
      limiteMinimo: Number(minimo) || 5
    };

    try {
      await api.post('estoque/', novo);
      carregarEstoque();
    } catch (err) {
      const locais = [...itens, { ...novo, id: Date.now() }];
      setItens(locais);
      localStorage.setItem('vetcare_estoque', JSON.stringify(locais));
    }

    setNome(''); setQuantidade(''); setMinimo(''); setMostrarSugestoes(false);
  };

  const deletarItem = async (id) => {
    try {
      await api.delete(`estoque/${id}/`);
      carregarEstoque();
    } catch (err) {
      const filtrados = itens.filter(i => i.id !== id);
      setItens(filtrados);
      localStorage.setItem('vetcare_estoque', JSON.stringify(filtrados));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-zinc-100 animate-fade-in bg-transparent">
      
      {/* FORMULÁRIO DE CADASTRO INSTITUCIONAL */}
      <div className="md:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Entrada de Insumo</h2>
        <form onSubmit={cadastrar} className="space-y-3">
          
          <select 
            className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none cursor-pointer focus:border-teal-500 transition-colors" 
            value={categoria} 
            onChange={e => setCategoria(e.target.value)}
          >
            <option value="Medicamentos">Medicamentos</option>
            <option value="Vacinas">Vacinas</option>
            <option value="Descartáveis">Descartáveis</option>
            <option value="Cirúrgico">Cirúrgico</option>
          </select>

          {/* INPUT CORRIGIDO SEM ERRO DE RENDERING */}
          <div className="relative w-full" ref={containerInsumoRef}>
            <input 
              type="text" 
              placeholder="Nome do Insumo..." 
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-500/30 transition-all text-zinc-200" 
              value={nome} 
              onChange={e => lidarMudancaNome(e.target.value)} 
              onFocus={ativarFocoInsumo}
              required 
            />
            
            {/* DROPDOWN REATIVO COM ACENDIMENTO VERDE E BRILHO SUTIL */}
            {mostrarSugestoes && sugestoesFiltradas.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl z-50 divide-y divide-zinc-900">
                {sugestoesFiltradas.map((sug, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setNome(sug); setMostrarSugestoes(false); }} 
                    className="px-3 py-2 text-xs text-zinc-400 hover:text-teal-400 hover:bg-teal-950/20 border-l-2 border-transparent hover:border-teal-500 hover:shadow-[0_0_10px_rgba(0,168,150,0.3)] transition-all duration-150 cursor-pointer"
                  >
                    {sug}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Qtd" className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
            <input type="number" placeholder="Mínimo" className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 text-zinc-200" value={minimo} onChange={e => setMinimo(e.target.value)} />
          </div>

          <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-md">
            Cadastrar no Almoxarifado
          </button>
        </form>
      </div>

      {/* PAINEL INVENTÁRIO COMPLETO */}
      <div className="md:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/20 grid grid-cols-12 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <div className="col-span-4">Insumo</div>
          <div className="col-span-3">Categoria</div>
          <div className="col-span-3 text-center">Qtd</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>
        <div className="overflow-y-auto max-h-80 divide-y divide-zinc-800">
          {itens.map((item, i) => {
            const critico = Number(item.quantidade) <= Number(item.limiteMinimo || 5);
            return (
              <div key={item.id || i} className="p-4 grid grid-cols-12 items-center text-xs font-medium text-zinc-300 hover:bg-zinc-950/20 transition-colors">
                <div className="col-span-4 font-bold text-zinc-200">{item.nome}</div>
                <div className="col-span-3 text-zinc-500">{item.categoria}</div>
                <div className="col-span-3 text-center">
                  <span className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] ${critico ? 'bg-red-500/10 text-red-500 border border-red-900/30' : 'bg-zinc-950 border border-zinc-900 text-zinc-400'}`}>
                    {item.quantidade} u
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <button onClick={() => deletarItem(item.id || i)} className="text-red-400 hover:text-red-500 bg-transparent border-none cursor-pointer font-bold transition-colors">Deletar</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}