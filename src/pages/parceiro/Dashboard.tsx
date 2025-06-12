
import { useAuth } from '@/contexts/AuthContext';
import { SimplePartnerLayout } from '@/components/partner/SimplePartnerLayout';
import { Button } from '@/components/ui/button';
import { DoorToDoorDashboard } from '../DoorToDoorDashboard';
import { Withdrawals } from '@/components/partner/Withdrawals';
import { AlertTriangle } from 'lucide-react';
import { usePartner } from '@/hooks/usePartner';
import { Spinner } from '@/components/ui/spinner';
import { StatsCards } from '@/components/partner/StatsCards';
import { ReferralLinks } from '@/components/partner/ReferralLinks';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, isLoading, error, loadStats } = usePartner();

  const codigoReferencia = user?.id || 'CARREGANDO...';
  const linkAfiliado = `https://litoralpremia.com/r/${codigoReferencia}`;

  if (isLoading) {
    return (
      <SimplePartnerLayout title="Visão Geral">
        <div className="flex justify-center items-center h-64">
          <Spinner size="large" />
        </div>
      </SimplePartnerLayout>
    );
  }

  if (error) {
    return (
      <SimplePartnerLayout title="Visão Geral">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Ocorreu um erro</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={() => loadStats()}>Tentar Novamente</Button>
        </div>
      </SimplePartnerLayout>
    );
  }

  return (
    <SimplePartnerLayout title="Visão Geral">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bem-vindo(a) de volta, {user?.name?.split(' ')[0] || 'Parceiro'}!
          </h1>
          <p className="text-slate-400">Aqui está um resumo do seu desempenho.</p>
        </div>

        <StatsCards stats={stats} isLoading={isLoading} />

        <ReferralLinks 
          codigoReferencia={codigoReferencia}
          linkAfiliado={linkAfiliado}
        />

        <DoorToDoorDashboard />

        <Withdrawals />
      </div>
    </SimplePartnerLayout>
  );
}
