import { useEffect, useState } from 'react';
import api from '../api';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca os dados do back-end assim que a tela carrega
  useEffect(() => {
    api.get('pacientes/')
      .then((response) => {
        setPacientes(response.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar pacientes:", err);
        setErro("Não foi possível carregar a lista de pets.");
        setCarregando(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pets Cadastrados 🐾</h1>
          <p className="text-slate-500 mt-1">Lista de pacientes da clínica veterinária VetCare</p>
        </div>
      </div>

      {/* Tela de Carregamento */}
      {carregando && (
        <div className="text-center py-12 text-slate-500 font-medium">
          Carregando pacientes do banco de dados...
        </div>
      )}

      {/* Tela de Erro (Caso o Django esteja desligado ou dê erro de CORS) */}
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
          {erro} — Certifique-se de que o back-end Django está rodando na porta 8000.
        </div>
      )}

      {/* Tabela de Dados */}
      {!carregando && !erro && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nome do Pet</th>
                <th className="px-6 py-4">Espécie / Raça</th>
                <th className="px-6 py-4">Peso</th>
                <th className="px-6 py-4">Tutor (Dono)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    Nenhum pet cadastrado no momento.
                  </td>
                </tr>
              ) : (
                pacientes.map((pet) => (
                  <tr key={pet.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{pet.nome}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 mr-2 uppercase">
                        {pet.especie}
                      </span>
                      <span className="text-slate-500">{pet.raca || 'Não informada'}</span>
                    </td>
                    <td className="px-6 py-4 font-mono">{pet.peso_kg ? `${pet.peso_kg} kg` : '--'}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{pet.tutor_nome}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}