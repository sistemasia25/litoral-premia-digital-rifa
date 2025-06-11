
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { PerformanceMetrics } from '@/components/partner/PerformanceMetrics';
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
