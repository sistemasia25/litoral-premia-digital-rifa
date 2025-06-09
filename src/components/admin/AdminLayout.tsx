
import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  DollarSign, 
  LogOut, 
  Menu,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Sorteios', href: '/admin/sorteios', icon: Trophy },
  { name: 'Influenciadores', href: '/admin/influenciadores', icon: Users },
  { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign },
];

export function AdminLayout() {
  const { adminUser, logout, isLoading, isAuthenticated } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full bg-slate-800 ${className}`}>
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-sm text-slate-400">{adminUser?.nome}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-700 bg-slate-800 px-4 shadow-sm lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-300"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h1 className="text-lg font-semibold text-white">
                Litoral da Sorte - Admin
              </h1>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
