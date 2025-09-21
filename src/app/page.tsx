import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Diário de Dor</h1>
          <p className="text-gray-600">Acompanhe seu tratamento fisioterápico</p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/auth/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
          >
            Entrar
          </Link>
          
          <Link 
            href="/auth/register"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
          >
            Primeiro Acesso
          </Link>
        </div>
      </div>
    </div>
  );
}
