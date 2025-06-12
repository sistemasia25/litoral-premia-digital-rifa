
import { useAuth } from '@/contexts/AuthContext';
import { SimplePartnerLayout } from '@/components/partner/SimplePartnerLayout';
import { Navigate } from 'react-router-dom';

export default function PartnerDashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  return (
    <SimplePartnerLayout title="Visão Geral">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta!</h1>
          <p className="text-slate-400">Acompanhe seu desempenho e estatísticas de vendas</p>
        </div>

        <div className="text-center py-12 text-gray-400 bg-slate-800 rounded-lg">
          <p className="text-lg">Dashboard em desenvolvimento</p>
          <p className="text-sm">As métricas serão exibidas aqui quando conectadas ao banco de dados</p>
        </div>
      </div>
    </SimplePartnerLayout>
  );
}
