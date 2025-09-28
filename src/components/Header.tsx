"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Menu, X, ArrowLeft, LogOut, Plus, History } from "lucide-react";

interface HeaderProps {
  title: string;
  isAuth?: boolean;
  canGoBack?: boolean;
}

export default function Header({
  title,
  isAuth = false,
  canGoBack = false,
}: HeaderProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLinkClick = (href: string) => {
    setDrawerOpen(false);
    router.push(href);
  };

  const renderLeftContent = () => {
    if (canGoBack) {
      return (
        <button onClick={handleGoBack} className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
      );
    }

    if (!isAuth) {
      return (
        <DrawerTrigger asChild>
          <button className="btn-ghost p-2">
            <Menu className="w-5 h-5" />
          </button>
        </DrawerTrigger>
      );
    }

    return <div className="w-9" />;
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 safe-area-top sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <Drawer
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              direction="left"
            >
              {renderLeftContent()}

              <DrawerContent className="w-64 h-full fixed top-0 left-0">
                <div className="safe-area-top flex flex-col h-full">
                  <DrawerHeader className="flex items-center justify-between p-4 border-b flex-row border-gray-100">
                    <DrawerTitle className="text-subheading text-green-800">
                      Diário da Dor
                    </DrawerTitle>
                    <DrawerClose asChild>
                      <button className="btn-ghost p-2">
                        <X className="w-5 h-5" />
                      </button>
                    </DrawerClose>
                  </DrawerHeader>

                  <nav className="p-4 flex-grow">
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/dashboard"
                          onClick={() => handleLinkClick("/dashboard")}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Plus className="w-5 h-5 text-green-600" />
                          <span className="text-body">Novo Registro</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/history"
                          onClick={() => handleLinkClick("/history")}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <History className="w-5 h-5 text-green-600" />
                          <span className="text-body">Histórico</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>

                  <div className="p-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Sair</span>
                    </button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <h1 className="text-heading truncate">{title}</h1>

          <div className="w-9" />
        </div>
      </header>
    </>
  );
}
