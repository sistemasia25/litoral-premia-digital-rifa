
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PartnerAuth } from '@/components/auth/PartnerAuth';
import { Navigate } from 'react-router-dom';

export default function Parceiro() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/parceiro/dashboard" replace />;
  }

  return <PartnerAuth />;
}
