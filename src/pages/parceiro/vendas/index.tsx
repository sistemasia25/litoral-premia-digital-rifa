
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { SalesHistory } from '@/components/partner/SalesHistory';
import { Navigate } from 'react-router-dom';

export default function PartnerSalesPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  return (
    <PartnerLayout 
      title="Minhas Vendas"
      description="Acompanhe seu histórico de vendas e comissões"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Histórico de Vendas</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as suas vendas e comissões
          </p>
        </div>
        <SalesHistory />
      </div>
    </PartnerLayout>
  );
}
