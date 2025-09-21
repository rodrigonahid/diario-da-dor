import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Diário de Dor</h1>
            <p className="text-body">Acompanhe seu tratamento fisioterápico</p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link 
              href="/auth/login"
              className="btn-primary w-full block text-center"
            >
              Entrar
            </Link>
            
            <Link 
              href="/auth/register"
              className="btn-secondary w-full block text-center"
            >
              Primeiro Acesso
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-6 safe-area-bottom">
        <p className="text-caption text-center">
          Versão 1.0 • Desenvolvido para acompanhamento médico
        </p>
      </div>
    </div>
  );
}
