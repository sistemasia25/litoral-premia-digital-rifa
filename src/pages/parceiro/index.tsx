
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { PartnerOverview } from '@/components/partner/PartnerOverview';
import { PerformanceMetrics } from '@/components/partner/PerformanceMetrics';
import { ClicksHistory } from '@/components/partner/ClicksHistory';
import { Withdrawals } from '@/components/partner/Withdrawals';
import { SalesHistory } from '@/components/partner/SalesHistory';
import { Navigate } from 'react-router-dom';

const mockStats = {
  totalClicks: 150,
  totalSales: 23,
  totalEarnings: 1250.75,
  conversionRate: 15.3,
  averageTicket: 54.38,
};

export default function PartnerDashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  return (
    <PartnerLayout 
      title="Visão Geral"
      description="Acompanhe seu desempenho e estatísticas como parceiro"
    >
      <div className="space-y-6">
        {/* Visão Geral */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h1>
          <p className="text-muted-foreground">
            Acompanhe seu desempenho e estatísticas de vendas
          </p>
        </div>

        {/* Métricas Principais */}
        <PartnerOverview />

        {/* Gráficos de Desempenho */}
        <PerformanceMetrics stats={mockStats} />

        {/* Histórico de Cliques */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Atividade Recente</h2>
          <ClicksHistory limit={5} />
        </div>

        {/* Histórico de Vendas */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Últimas Vendas</h2>
          <SalesHistory limit={5} />
        </div>

        {/* Área de Saques */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Meus Saques</h2>
          <Withdrawals />
        </div>
      </div>
    </PartnerLayout>
  );
}
