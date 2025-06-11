
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
  todayClicks: 25,
  totalSales: 23,
  todaySales: 3,
  totalEarnings: 1250.75,
  todayEarnings: 180.50,
  conversionRate: 15.3,
  averageOrderValue: 54.38,
  topPerformingDays: [
    { date: '2024-01-15', sales: 5, earnings: 250.00 },
    { date: '2024-01-14', sales: 3, earnings: 150.00 },
    { date: '2024-01-13', sales: 7, earnings: 350.00 },
    { date: '2024-01-12', sales: 2, earnings: 100.00 },
    { date: '2024-01-11', sales: 4, earnings: 200.00 },
  ],
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
