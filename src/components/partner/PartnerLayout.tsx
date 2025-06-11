import { ReactNode, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PartnerNav } from './PartnerNav';
import { Button } from '@/components/ui/button';

type PartnerLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function PartnerLayout({ children, title, description }: PartnerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const pageTitle = title ? `${title} | Área do Parceiro` : 'Área do Parceiro';
  const pageDescription = description || 'Gerencie suas vendas, comissões e desempenho como parceiro';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-900 text-white">
        {/* Mobile sidebar backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50 lg:hidden',
            sidebarOpen ? 'block' : 'hidden'
          )}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile sidebar */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-slate-900 transition-transform duration-300 ease-in-out lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 lg:hidden">
              <div className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="Litoral Premia"
                />
                <span className="ml-2 text-lg font-bold">Parceiro</span>
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-gray-400 hover:bg-slate-800 hover:text-white focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Fechar menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <PartnerNav />
          </div>
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <div className="flex h-full flex-col">
            <div className="flex h-16 flex-shrink-0 items-center px-4">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Litoral Premia"
              />
              <span className="ml-2 text-lg font-bold">Parceiro</span>
            </div>
            <PartnerNav />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between bg-slate-900 px-4 shadow-sm lg:px-6">
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-slate-800 hover:text-white focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Abrir menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <div className="flex-1 flex justify-between lg:justify-end">
              <h1 className="text-xl font-semibold text-white lg:hidden">
                {title || 'Área do Parceiro'}
              </h1>
              
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="rounded-full bg-slate-800 p-1 text-gray-400 hover:text-white focus:outline-none"
                >
                  <span className="sr-only">Ver notificações</span>
                  <span className="relative inline-block">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange-500 ring-2 ring-slate-900" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <main className="min-h-[calc(100vh-4rem)] bg-slate-900/50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
