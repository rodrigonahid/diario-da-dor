"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BodyDiagram from "@/components/BodyDiagram";
import PainLevelSlider from "@/components/PainLevelSlider";
import TreatmentForm from "@/components/TreatmentForm";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";
interface User {
  id: number;
  name: string;
  phone: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [painLevel, setPainLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/");
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
      const response = await fetch("/api/pain-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          bodyPart: selectedBodyPart,
          painLevel,
          formData,
        }),
      });

      if (response.ok) {
        // 🚨 Substituindo alert por Toast de sucesso
        toast("Sucesso! 🎉", {
          description: "O registro de dor foi salvo com sucesso.",
        });

        setCurrentStep(1);
        setSelectedBodyPart("");
        setPainLevel(0);
        router.push("/history");
      } else {
        toast("Não foi possível completar o registro. Tente novamente.");
      }
    } catch (error) {
      console.error("Error saving pain entry:", error);
      // 🚨 Substituindo alert por Toast de erro de conexão
      toast("Verifique sua conexão e tente salvar novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={24} />
          <p className="text-body">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Header title="Novo Registro" />

      <div className="px-4 py-6">
        <div className="mb-6">
          <p className="text-body">Olá, {user.name}</p>
          <p className="text-caption">
            Registre sua dor para acompanhar o tratamento
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step
                        ? "bg-green-500 text-white"
                        : "bg-background text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step ? "bg-green-500" : "bg-background"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-subheading">
              {currentStep === 1 && "Localização da Dor"}
              {currentStep === 2 && "Intensidade da Dor"}
              {currentStep === 3 && "Informações Adicionais"}
            </h2>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <BodyDiagram
            onBodyPartSelect={handleBodyPartSelect}
            selectedBodyPart={selectedBodyPart}
          />
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <PainLevelSlider value={painLevel} onChange={setPainLevel} />
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                Voltar
              </button>
              <button
                onClick={handlePainLevelNext}
                disabled={painLevel === 0}
                className="btn-primary disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <TreatmentForm
              onSubmit={handleTreatmentFormSubmit}
              loading={loading}
            />
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-secondary"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
