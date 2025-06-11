
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, Award, Users } from 'lucide-react';

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

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 flex flex-col bg-slate-800 p-4 border-r border-slate-700">
      <div className="flex-1">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-white">Admin</h1>
          {adminUser && <p className="text-xs text-gray-400">{adminUser.email}</p>}
        </div>
        <nav className="space-y-2">
          <NavLink to="/admin" end className={navLinkClasses}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/sorteios" className={navLinkClasses}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Sorteios
          </NavLink>
          <NavLink to="/admin/parceiros" className={navLinkClasses}>
            <Users className="mr-3 h-5 w-5" />
            Parceiros
          </NavLink>
          <NavLink to="/admin/premiacoes" className={navLinkClasses}>
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
  );
}
