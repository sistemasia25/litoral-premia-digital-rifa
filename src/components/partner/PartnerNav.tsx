
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, User, BarChart2, MousePointer, Wallet, Settings, LogOut, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
};

export function PartnerNav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const navigation: NavItem[] = [
    { 
      name: 'Visão Geral', 
      href: '/parceiro', 
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    { 
      name: 'Meu Perfil', 
      href: '/parceiro/perfil', 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      name: 'Desempenho', 
      href: '/parceiro/desempenho', 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      name: 'Cliques', 
      href: '/parceiro/cliques', 
      icon: <MousePointer className="h-5 w-5" /> 
    },
    { 
      name: 'Vendas', 
      href: '/parceiro/vendas', 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      name: 'Saques', 
      href: '/parceiro/saques', 
      icon: <Wallet className="h-5 w-5" /> 
    },
    { 
      name: 'Configurações', 
      href: '/parceiro/configuracoes', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/entrar');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho com informações do parceiro */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.name} alt={user?.name} />
            <AvatarFallback className="bg-slate-700 text-white">
              {user?.name?.charAt(0).toUpperCase() || 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Parceiro'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.name || 'carregando...'}
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive(item.href, item.exact)
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className={`mr-3 ${isActive(item.href, item.exact) ? 'text-orange-400' : 'text-slate-400'}`}>
              {item.icon}
            </span>
            {item.name}
            {item.name === 'Cliques' && (
              <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                12
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Rodapé com botão de sair */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-300 hover:bg-slate-800/50 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400" />
          Sair
        </Button>
      </div>
    </div>
  );
}
