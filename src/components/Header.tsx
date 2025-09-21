'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function Header({ title, showBackButton = false, backHref = '/' }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 safe-area-top sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {showBackButton ? (
            <Link href={backHref} className="btn-ghost p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <button onClick={toggleDrawer} className="btn-ghost p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          <h1 className="text-heading truncate">{title}</h1>
          
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="safe-area-top">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-subheading text-green-800">Diário de Dor</h2>
            <button onClick={closeDrawer} className="btn-ghost p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  onClick={closeDrawer}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-body">Novo Registro</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/history" 
                  onClick={closeDrawer}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-body">Histórico</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 safe-area-bottom">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
