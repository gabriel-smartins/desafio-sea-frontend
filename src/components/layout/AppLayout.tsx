import { FileText, LogOut } from "lucide-react";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  role?: string | null;
  onLogout?: () => void;
}

export function AppLayout({ children, role, onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">
                Painel de Clientes
              </span>
              {role && (
                <span className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border">
                  Perfil: {role}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
