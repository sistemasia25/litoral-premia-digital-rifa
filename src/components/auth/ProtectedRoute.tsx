
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para a página de login, mantendo a rota atual no state para redirecionar de volta após o login
    return <Navigate to="/login-parceiro" state={{ from: location }} replace />;
  }

  // Verifica se o usuário tem permissão de parceiro
  if (user?.role !== 'partner') {
    return <Navigate to="/login-parceiro" replace />;
  }

  return <Outlet />;
}
