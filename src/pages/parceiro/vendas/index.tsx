import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { SalesHistory } from '@/components/partner/SalesHistory';

export default function PartnerSalesPage() {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar?callbackUrl=/parceiro/vendas',
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
