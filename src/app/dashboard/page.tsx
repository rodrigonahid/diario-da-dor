"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Spinner } from "@/components/Spinner";

interface User {
  id: number;
  name: string;
  phone: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
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
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loadingUser || !user) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Spinner size={32} className="text-green-600 mb-4" />
          <p className="text-body text-gray-700">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Header title="Menu Principal" />

      <div className="px-6 py-10 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Bem-vindo(a), {user.name}!
        </h1>

        <p className="text-subheading text-gray-600 mb-8 max-w-md">
          Como você está se sentindo hoje? Vamos registrar seus dados para um
          acompanhamento mais eficaz.
        </p>

        <div className="mb-10 w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => router.push("/formulario")}
            className="w-full py-3 px-6 rounded-lg text-lg font-semibold transition-colors bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            Registrar Nova Dor
          </button>

          <button
            onClick={() => router.push("/history")}
            className="w-full py-3 px-6 rounded-lg text-lg font-semibold transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-md"
          >
            Ver Histórico
          </button>
        </div>
      </div>
    </div>
  );
}
