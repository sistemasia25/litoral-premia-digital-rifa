import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { PerformanceMetrics } from '@/components/partner/PerformanceMetrics';

export default function PartnerPerformancePage() {
  return (
    <PartnerLayout 
      title="Meu Desempenho"
      description="Acompanhe suas métricas e estatísticas detalhadas"
    >
      <PerformanceMetrics />
    </PartnerLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar?callbackUrl=/parceiro/desempenho',
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
