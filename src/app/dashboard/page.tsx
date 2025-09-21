'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BodyDiagram from '@/components/BodyDiagram';
import PainLevelSlider from '@/components/PainLevelSlider';
import TreatmentForm from '@/components/TreatmentForm';

interface User {
  id: number;
  name: string;
  phone: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [painLevel, setPainLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/');
      }
    };

    fetchUser();
  }, [router]);

  const handleBodyPartSelect = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart);
    setCurrentStep(2);
  };

  const handlePainLevelNext = () => {
    if (painLevel > 0) {
      setCurrentStep(3);
    }
  };

  const handleTreatmentFormSubmit = async (formData: {
    symptoms: string;
    duration: string;
    triggers: string;
    previousTreatments: string;
    medications: string;
    notes: string;
  }) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/pain-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          bodyPart: selectedBodyPart,
          painLevel,
          formData,
        }),
      });

      if (response.ok) {
        alert('Registro salvo com sucesso!');
        setCurrentStep(1);
        setSelectedBodyPart('');
        setPainLevel(0);
      } else {
        alert('Erro ao salvar registro');
      }
    } catch (error) {
      console.error('Error saving pain entry:', error);
      alert('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Diário de Dor</h1>
              <p className="text-gray-600">Olá, {user.name}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/history')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Histórico
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentStep === 1 && 'Passo 1: Localização da Dor'}
                {currentStep === 2 && 'Passo 2: Intensidade da Dor'}
                {currentStep === 3 && 'Passo 3: Informações Adicionais'}
              </h2>
            </div>
          </div>

          {currentStep === 1 && (
            <BodyDiagram
              onBodyPartSelect={handleBodyPartSelect}
              selectedBodyPart={selectedBodyPart}
            />
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <PainLevelSlider value={painLevel} onChange={setPainLevel} />
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  Voltar
                </button>
                <button
                  onClick={handlePainLevelNext}
                  disabled={painLevel === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <TreatmentForm onSubmit={handleTreatmentFormSubmit} loading={loading} />
              <div className="flex justify-center">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
