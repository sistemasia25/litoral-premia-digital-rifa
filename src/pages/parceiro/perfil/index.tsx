
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { PartnerProfile } from '@/components/partner/PartnerProfile';
import { Navigate } from 'react-router-dom';

export default function PartnerProfilePage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  return (
    <PartnerLayout 
      title="Meu Perfil"
      description="Gerencie suas informações pessoais e preferências"
    >
      <PartnerProfile />
    </PartnerLayout>
  );
}
