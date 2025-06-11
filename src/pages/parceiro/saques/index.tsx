import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { Withdrawals } from '@/components/partner/Withdrawals';

export default function PartnerWithdrawalsPage() {
  return (
    <PartnerLayout 
      title="Meus Saques"
      description="Solicite saques dos seus ganhos e acompanhe seu histórico"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Solicitar Saque</h1>
          <p className="text-muted-foreground">
            Solicite o saque dos seus ganhos e acompanhe o status
          </p>
        </div>
        <Withdrawals />
      </div>
    </PartnerLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar?callbackUrl=/parceiro/saques',
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
