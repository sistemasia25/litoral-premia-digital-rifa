import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePartner } from '@/hooks/usePartner';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PartnerRedirect = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { trackAffiliateClick } = usePartner();
  const { toast } = useToast();

  useEffect(() => {
    const trackAndRedirect = async () => {
      if (!slug) return;

      try {
        // Rastrear o clique do afiliado
        await trackAffiliateClick(slug as string, document.referrer);
        
        // Redirecionar para a página principal com o código do afiliado
        localStorage.setItem('affiliateRef', slug as string);
        router.push('/');
      } catch (error) {
        console.error('Erro ao rastrear clique de afiliado:', error);
        // Em caso de erro, redireciona de qualquer forma
        router.push('/');
      }
    };

    trackAndRedirect();
  }, [slug, router, trackAffiliateClick]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white">Redirecionando...</h1>
        <p className="text-gray-400 mt-2">Aguarde enquanto te levamos para o site</p>
      </div>
    </div>
  );
};

export default PartnerRedirect;
