import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { ClicksHistory } from '@/components/partner/ClicksHistory';

export default function PartnerClicksPage() {
  return (
    <PartnerLayout 
      title="Meus Cliques"
      description="Acompanhe o histórico de cliques nos seus links de afiliado"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Histórico de Cliques</h1>
          <p className="text-muted-foreground">
            Acompanhe quem está clicando nos seus links de afiliado
          </p>
        </div>
        <ClicksHistory />
      </div>
    </PartnerLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar?callbackUrl=/parceiro/cliques',
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
