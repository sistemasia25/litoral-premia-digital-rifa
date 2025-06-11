import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { PartnerOverview } from '@/components/partner/PartnerOverview';
import { PerformanceMetrics } from '@/components/partner/PerformanceMetrics';
import { ClicksHistory } from '@/components/partner/ClicksHistory';
import { Withdrawals } from '@/components/partner/Withdrawals';
import { SalesHistory } from '@/components/partner/SalesHistory';

export default function PartnerDashboard() {
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
        <PerformanceMetrics />

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar?callbackUrl=/parceiro',
        permanent: false,
      },
    };
  }

  // Verifica se o usuário tem permissão de parceiro
  if (session.user.role !== 'partner') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
