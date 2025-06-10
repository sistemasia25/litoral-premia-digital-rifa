import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export function AdminProtectedRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
