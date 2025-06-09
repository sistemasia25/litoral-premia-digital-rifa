
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

export function PartnerLayout({ children }: PartnerLayoutProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout('/parceiro');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Painel do Parceiro</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-white border-slate-600 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
