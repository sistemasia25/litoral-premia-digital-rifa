
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { ClicksHistory } from '@/components/partner/ClicksHistory';
import { Navigate } from 'react-router-dom';

export default function PartnerClicksPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  return (
    <PartnerLayout 
      title="Meus Cliques"
      description="Acompanhe o histórico de cliques nos seus links de afiliado"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Histórico de Cliques</h1>
          <p className="text-muted-foreground">
            Acompanhe quem está clicando nos seus links de afiliado
          </p>
        </div>
        <ClicksHistory />
      </div>
    </PartnerLayout>
  );
}
