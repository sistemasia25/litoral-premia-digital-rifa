
import { useCallback } from 'react';
import { PartnerClick } from '@/types/partner';
import { partnerService } from '@/services/partnerService';
import { useAuth } from '@/contexts/AuthContext';

export const usePartnerClicks = () => {
  const { user } = useAuth();

  // Rastrear clique de afiliado
  const trackAffiliateClick = useCallback(async (slug: string, referrer: string) => {
    try {
      await partnerService.trackClick({
        slug,
        referrer,
        userAgent: navigator.userAgent,
        ipAddress: '', // Será preenchido pelo servidor
      });
      return true;
    } catch (error) {
      console.error('Erro ao rastrear clique de afiliado:', error);
      return false;
    }
  }, []);

  // Obter histórico de cliques
  const getClicksHistory = useCallback(async (limit?: number) => {
    if (!user?.id) return [];
    
    try {
      return await partnerService.getClicksHistory(user.id, limit);
    } catch (error) {
      console.error('Erro ao obter histórico de cliques:', error);
      throw error;
    }
  }, [user?.id]);

  return {
    trackAffiliateClick,
    getClicksHistory,
  };
};
