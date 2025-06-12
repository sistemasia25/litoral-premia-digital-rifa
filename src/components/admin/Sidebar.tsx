
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, Award, Users, DollarSign, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinkClasses = (
  { isActive }: { isActive: boolean; isPending: boolean; }
) => `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
  isActive
    ? 'bg-orange-500 text-white'
    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
}`;

export function Sidebar() {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-slate-800 p-4 border-r border-slate-700 z-45 transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSidebar}
            className="text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold text-white">Admin</h1>
            {adminUser && <p className="text-xs text-gray-400">{adminUser.email}</p>}
          </div>
          <nav className="space-y-2">
            <NavLink to="/admin" end className={navLinkClasses} onClick={closeSidebar}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink to="/admin/sorteios" className={navLinkClasses} onClick={closeSidebar}>
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Sorteios
            </NavLink>
            <NavLink to="/admin/parceiros" className={navLinkClasses} onClick={closeSidebar}>
              <Users className="mr-3 h-5 w-5" />
              Parceiros
            </NavLink>
            <NavLink to="/admin/financeiro" className={navLinkClasses} onClick={closeSidebar}>
              <DollarSign className="mr-3 h-5 w-5" />
              Financeiro
            </NavLink>
            <NavLink to="/admin/premiacoes" className={navLinkClasses} onClick={closeSidebar}>
              <Award className="mr-3 h-5 w-5" />
              Premiações
            </NavLink>
          </nav>
        </div>
        <div>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-300 hover:bg-slate-700 hover:text-white">
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
