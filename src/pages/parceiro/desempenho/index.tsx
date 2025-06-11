
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { PerformanceMetrics } from '@/components/partner/PerformanceMetrics';
import { Navigate } from 'react-router-dom';

const mockStats = {
  totalClicks: 150,
  totalSales: 23,
  totalEarnings: 1250.75,
  conversionRate: 15.3,
  averageTicket: 54.38,
};

export default function PartnerPerformancePage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  return (
    <PartnerLayout 
      title="Meu Desempenho"
      description="Acompanhe suas métricas e estatísticas detalhadas"
    >
      <PerformanceMetrics stats={mockStats} />
    </PartnerLayout>
  );
}
