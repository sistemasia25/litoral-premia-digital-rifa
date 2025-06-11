
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { Withdrawals } from '@/components/partner/Withdrawals';
import { Navigate } from 'react-router-dom';

export default function PartnerWithdrawalsPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  return (
    <PartnerLayout 
      title="Meus Saques"
      description="Solicite saques dos seus ganhos e acompanhe seu histórico"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Solicitar Saque</h1>
          <p className="text-muted-foreground">
            Solicite o saque dos seus ganhos e acompanhe o status
          </p>
        </div>
        <Withdrawals />
      </div>
    </PartnerLayout>
  );
}
