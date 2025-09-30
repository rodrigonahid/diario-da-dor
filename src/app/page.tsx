import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-green-50">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
              <Image
                src="/favicon.png"
                width={40}
                height={40}
                alt="Ícone do Diário da Dor"
              />
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Diário da Dor
            </h1>
            <p className="text-lg text-green-700 font-medium">
              Monitorar sua dor é parte do tratamento.
            </p>
          </div>

          <div className="space-y-5">
            <Link
              href="/auth/login"
              className="btn-primary w-full block text-center py-5 text-xl font-bold shadow-xl transition-shadow"
            >
              Entrar na Minha Conta
            </Link>

            <Link
              href="/auth/register"
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
