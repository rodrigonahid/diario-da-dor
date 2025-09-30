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

interface PainEntry {
  id: number;
  bodyPart: string;
  painLevel: number;
  createdAt: string;
  treatmentForm?: {
    formData: {
      symptoms: string;
      duration: string;
      triggers: string;
      previousTreatments: string;
      medications: string;
      notes: string;
    };
  };
}

const bodyPartNames: { [key: string]: string } = {
  cabeca: 'Cabeça',
  pescoco: 'Pescoço',
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
        <div className="flex flex-col items-center"> {/* Use flex-col e items-center */}
          <Spinner size={32} className="text-green-600 mb-4" /> {/* Adiciona margem inferior */}
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
          <div className="space-y-6">
            
            <div className="mb-6">
              <PainChart entries={entries} />
            </div>

            <div>
              <h2 className="text-subheading mb-4">Registros Detalhados</h2>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="card hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEntry(entry)}
                  >
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
                  
                  {Object.entries(selectedEntry.treatmentForm.formData).map(([key, value]) => {
                    if (!value) return null;

                    const fieldNameMap: { [key: string]: string } = {
                        symptoms: 'Sintomas',
                        duration: 'Duração da dor',
                        triggers: 'Possíveis causas',
                        previousTreatments: 'Tratamentos realizados',
                        medications: 'Medicamentos',
                        notes: 'Observações',
                    };

                    return (
                      <div key={key}>
                        <strong className="text-caption block text-gray-600">{fieldNameMap[key] || key}:</strong>
                        <p className="text-body mt-1 bg-gray-50 p-2 rounded">{value}</p>
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