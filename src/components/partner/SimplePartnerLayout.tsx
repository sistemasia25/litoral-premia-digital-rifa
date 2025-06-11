import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

type SimplePartnerLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function SimplePartnerLayout({ children, title, description }: SimplePartnerLayoutProps) {
  const pageTitle = title ? `${title} | Área do Parceiro` : 'Área do Parceiro';
  const pageDescription = description || 'Gerencie suas vendas, comissões e desempenho como parceiro';

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      {/* Cabeçalho simplificado */}
      <header className="bg-slate-900 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-white hover:text-gray-300">
                <Home className="h-5 w-5 mr-2" />
                <span className="font-semibold">Início</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/parceiro" 
                className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Painel
              </Link>
              <Link 
                to="/parceiro/conta" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white"
              >
                Minha Conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="min-h-[calc(100vh-4rem)] bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
