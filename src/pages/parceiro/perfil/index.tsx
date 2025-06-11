import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { PartnerProfile } from '@/components/partner/PartnerProfile';

export default function PartnerProfilePage() {
  return (
    <PartnerLayout 
      title="Meu Perfil"
      description="Gerencie suas informações pessoais e preferências"
    >
      <PartnerProfile />
    </PartnerLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar?callbackUrl=/parceiro/perfil',
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
