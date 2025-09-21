'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PainChart from '@/components/PainChart';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Histórico de Dor</h1>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Novo Registro
            </Link>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Nenhum registro encontrado</p>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Criar Primeiro Registro
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pain Evolution Charts */}
              <div className="mb-8">
                <PainChart entries={entries} />
              </div>

              {/* Pain Entries List */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registros Detalhados</h2>
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {bodyPartNames[entry.bodyPart] || entry.bodyPart}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getPainColor(
                                entry.painLevel
                              )}`}
                            >
                              Nível {entry.painLevel}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Ver detalhes →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes do Registro</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {bodyPartNames[selectedEntry.bodyPart] || selectedEntry.bodyPart}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPainColor(
                    selectedEntry.painLevel
                  )}`}
                >
                  Nível {selectedEntry.painLevel}
                </span>
              </div>

              <p className="text-gray-600">
                <strong>Data:</strong> {formatDate(selectedEntry.createdAt)}
              </p>

              {selectedEntry.treatmentForm && (
                <div className="space-y-4 mt-6">
                  <h4 className="text-lg font-semibold text-gray-800">Informações Adicionais</h4>
                  
                  {selectedEntry.treatmentForm.formData.symptoms && (
                    <div>
                      <strong className="text-gray-700">Sintomas:</strong>
                      <p className="text-gray-600 mt-1">{selectedEntry.treatmentForm.formData.symptoms}</p>
                    </div>
                  )}

                  {selectedEntry.treatmentForm.formData.duration && (
                    <div>
                      <strong className="text-gray-700">Duração:</strong>
                      <p className="text-gray-600 mt-1">{selectedEntry.treatmentForm.formData.duration}</p>
                    </div>
                  )}

                  {selectedEntry.treatmentForm.formData.triggers && (
                    <div>
                      <strong className="text-gray-700">Possíveis causas:</strong>
                      <p className="text-gray-600 mt-1">{selectedEntry.treatmentForm.formData.triggers}</p>
                    </div>
                  )}

                  {selectedEntry.treatmentForm.formData.previousTreatments && (
                    <div>
                      <strong className="text-gray-700">Tratamentos realizados:</strong>
                      <p className="text-gray-600 mt-1">{selectedEntry.treatmentForm.formData.previousTreatments}</p>
                    </div>
                  )}

                  {selectedEntry.treatmentForm.formData.medications && (
                    <div>
                      <strong className="text-gray-700">Medicamentos:</strong>
                      <p className="text-gray-600 mt-1">{selectedEntry.treatmentForm.formData.medications}</p>
                    </div>
                  )}

                  {selectedEntry.treatmentForm.formData.notes && (
                    <div>
                      <strong className="text-gray-700">Observações:</strong>
                      <p className="text-gray-600 mt-1">{selectedEntry.treatmentForm.formData.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
