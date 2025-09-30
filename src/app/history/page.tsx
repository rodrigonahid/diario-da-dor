'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PainChart from '@/components/PainChart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/Spinner';

// 🚨 1. ATUALIZANDO A INTERFACE para incluir os campos de monitoramento
interface TreatmentFormData {
  // Campos originais (Se ainda existirem no Passo 3)
  symptoms?: string;
  duration?: string;
  triggers?: string;
  previousTreatments?: string;
  medications?: string;
  notes?: string;
  
  // Campos de Monitoramento (Assumindo que estão aqui ou foram mesclados)
  painComparison?: string; // Ex: 'melhorou', 'igual', 'piorou'
  painRelief?: string;     // O que aliviou a dor hoje
  painPattern?: string;    
  painType?: string;       
  painWorse?: string;      
  interference?: string;   
  sleepQuality?: string;   
  exercisesDone?: string;  
  exercisesEffect?: string;
}

interface PainEntry {
  id: number;
  bodyPart: string;
  painLevel: number;
  createdAt: string;
  treatmentForm?: {
    formData: TreatmentFormData;
  };
}

// Mapeamento de Labels de Opções (para exibição amigável)
const painReliefLabels: { [key: string]: string } = {
  'repouso': 'Repouso',
  'movimento': 'Movimento Suave',
  'medicacao': 'Medicação',
  'gelo-calor': 'Gelo/Calor',
  'fisioterapia': 'Sessão de Fisioterapia',
  'nada': 'Nada Aliviou', 
  'outro': 'Outra Ação',
};

const bodyPartNames: { [key: string]: string } = {
  cabeca: 'Cabeça',
  pescoço: 'Pescoço',
  ombro: 'Ombro',
  costas: 'Costas',
  quadril: 'Quadril',
  perna: 'Perna',
  pes: 'Pés',
};

export default function History() {
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<PainEntry | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/');
      return;
    }

    const fetchEntries = async () => {
      try {
        const response = await fetch(`/api/pain-entries/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setEntries(data.entries);
        } else {
          console.error('Failed to fetch entries');
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [router]);

  // 🚨 2. LÓGICA PARA FILTRAR E AGRUPAR ESTRATÉGIAS DE SUCESSO (COM EXCLUSÃO)
  const successfulStrategies = entries
    .filter(entry => 
        // Filtra os registros onde o paciente disse que a dor MELHOROU
        entry.treatmentForm?.formData?.painComparison === 'melhorou' && 
        entry.treatmentForm?.formData?.painRelief && // Garante que a ação de alívio foi registrada
        entry.treatmentForm?.formData?.painRelief !== 'nada' // 🚨 NOVO FILTRO: EXCLUI "NADA ALIVIOU"
    )
    .reduce((acc, entry) => {
        const reliefKey = entry.treatmentForm?.formData?.painRelief as keyof typeof painReliefLabels;
        const reliefAction = painReliefLabels[reliefKey] || reliefKey; // Usa a label amigável
        
        // Agrupa pelo tipo de alívio e adiciona a contagem
        if (acc[reliefAction]) {
            acc[reliefAction].count += 1;
            acc[reliefAction].lastUsed = new Date(entry.createdAt);
        } else {
            acc[reliefAction] = {
                count: 1,
                lastUsed: new Date(entry.createdAt),
                bodyParts: [],
            };
        }
        return acc;
    }, {} as { [key: string]: { count: number, lastUsed: Date, bodyParts: string[] } });
    
  // Converte para um array e ordena por frequência (mais usado primeiro)
  const sortedStrategies = Object.entries(successfulStrategies)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([action, data]) => ({ action, ...data }));


  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-green-600 bg-green-100';
    if (level <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const closeDetailsModal = () => setSelectedEntry(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Spinner size={32} className="text-green-600 mb-4" />
          <p className="text-body text-gray-700">Carregando histórico...</p>
        </div>
      </div>
    );    
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Header title="Histórico" />

      <div className="px-4 py-6">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-body mb-4">Nenhum registro encontrado</p>
            <p className="text-caption mb-6">Comece registrando sua primeira dor</p>
            <button
              onClick={() => router.push('/formulario')}
              className="btn-primary"
            >
              Criar Primeiro Registro
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* 3. NOVA SEÇÃO DE ESTRATÉGIAS DE SUCESSO */}
            <div className="card p-6 bg-yellow-50 border border-yellow-200 shadow-lg">
                <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-8a1 1 0 000 2h2a1 1 0 000-2h-2zm-1-7h4v4h-4V7z"/></svg>
                    Estratégias que Funcionaram! 🚀
                </h2>
                
                {sortedStrategies.length === 0 ? (
                    <p className="text-caption text-yellow-700">
                        Nenhum registro de dor melhorada com ação específica encontrado. Continue acompanhando!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {sortedStrategies.map(({ action, count, lastUsed }) => (
                            <div 
                                key={action} 
                                className="flex items-center justify-between p-3 rounded-lg bg-white border border-yellow-300 shadow-md transition-shadow hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 flex items-center justify-center bg-green-200 text-green-800 rounded-full font-bold text-sm">
                                        {count}x
                                    </span>
                                    <div>
                                        <p className="font-semibold text-body text-gray-800">{action}</p>
                                        <p className="text-caption text-gray-500">Último uso: {lastUsed.toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <span className="text-green-600 font-bold text-sm">
                                    Sucesso!
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Gráfico de Evolução (Mantido) */}
            <div className="mb-6">
              <PainChart entries={entries} />
            </div>

            {/* Registros Detalhados (Mantido) */}
            <div>
              <h2 className="text-subheading mb-4">Registros Detalhados</h2>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="card hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    {/* Conteúdo do registro na lista */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-body font-medium">
                            {bodyPartNames[entry.bodyPart] || entry.bodyPart}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPainColor(
                              entry.painLevel
                            )}`}
                          >
                            {entry.painLevel}
                          </span>
                        </div>
                        <p className="text-caption">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes (Mantido) */}
      <Dialog open={!!selectedEntry} onOpenChange={closeDetailsModal}>
        <DialogContent className="sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-subheading">Detalhes do Registro</DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="p-2 space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <h3 className="text-lg font-bold">
                  {bodyPartNames[selectedEntry.bodyPart] || selectedEntry.bodyPart}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getPainColor(
                    selectedEntry.painLevel
                  )}`}
                >
                  Nível {selectedEntry.painLevel}
                </span>
                <p className="text-sm text-gray-500 ml-auto">
                  {formatDate(selectedEntry.createdAt)}
                </p>
              </div>

              {selectedEntry.treatmentForm && (
                <div className="space-y-4 mt-4">
                  <h4 className="text-body font-semibold text-gray-700">Informações Adicionais</h4>
                  
                  {/* Mapeamento de todos os campos para exibição no modal */}
                  {Object.entries(selectedEntry.treatmentForm.formData).map(([key, value]) => {
                    if (!value) return null;

                    const fieldNameMap: { [key: string]: string } = {
                        // Campos Originais
                        symptoms: 'Sintomas',
                        duration: 'Duração da dor',
                        triggers: 'Possíveis causas',
                        previousTreatments: 'Tratamentos realizados',
                        medications: 'Medicamentos',
                        notes: 'Observações',
                        // Novos Campos de Monitoramento
                        painComparison: 'Comparação com ontem',
                        painPattern: 'Padrão da dor',
                        painType: 'Tipo da dor',
                        painRelief: 'Ação de alívio',
                        painWorse: 'Fator de piora',
                        interference: 'Interferência nas atividades',
                        sleepQuality: 'Qualidade do sono',
                        exercisesDone: 'Exercícios realizados',
                        exercisesEffect: 'Efeito dos exercícios',
                    };

                    // Usa o label amigável, ou a chave se não houver mapeamento
                    const displayValue = painReliefLabels[value as keyof typeof painReliefLabels] || value; 
                    const displayKey = fieldNameMap[key] || key;

                    return (
                      <div key={key}>
                        <strong className="text-caption block text-gray-600">{displayKey}:</strong>
                        <p className="text-body mt-1 bg-gray-50 p-2 rounded">{displayValue}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}