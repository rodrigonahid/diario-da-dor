import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // 1. Correção: Adicionar 'overflow-x-hidden' para remover a barra de rolagem horizontal
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-green-50">
        <div className="max-w-sm mx-auto w-full">
          {/* 1. Ícone Minimalista e Marca */}
          <div className="text-center mb-10">
            {/* Ícone menor (w-20 h-20) e discreto (bg-green-100) */}
            <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
              <Image
                src="/favicon.png"
                width={40}
                height={40}
                alt="Ícone do Diário da Dor"
              />
            </div>

            {/* Título e Subtítulo */}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Diário da Dor
            </h1>
            <p className="text-lg text-green-700 font-medium">
              Seu guia para uma recuperação assistida.
            </p>
          </div>

          {/* Cartão de Destaque - Mantido para dar textura */}
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-12">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Acompanhamento Profissional
            </h3>
            <p className="text-caption text-gray-500">
              Registre a evolução da sua dor e ajude seu terapeuta a otimizar
              seu plano de tratamento.
            </p>
          </div>

          {/* 2. Action Buttons - Foco e Tamanho Aumentado */}
          <div className="space-y-5">
            <Link
              href="/auth/login"
              // Aumentamos o padding (py-5) e o texto (text-xl)
              className="btn-primary w-full block text-center py-5 text-xl font-bold shadow-xl transition-shadow"
            >
              Entrar na Minha Conta
            </Link>

            <Link
              href="/auth/register"
              // Aumentamos o padding (py-5) e o texto (text-xl)
              className="btn-secondary w-full block text-center py-5 text-xl font-bold"
            >
              Criar Minha Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}