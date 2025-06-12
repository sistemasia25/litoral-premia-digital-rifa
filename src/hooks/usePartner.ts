
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/services/supabaseService';

interface PartnerStats {
  partnerId: string;
  totalSales: number;
  todaySales: number;
  totalClicks: number;
  todayClicks: number;
  totalEarnings: number;
  todayEarnings: number;
  availableBalance: number;
  withdrawnAmount: number;
  conversionRate: number;
  lastUpdated: string;
}

export function usePartner() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    if (!user?.id) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const partnerStats = await supabaseService.getPartnerStats(user.id);
      setStats(partnerStats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas do parceiro:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [user?.id]);

  return {
    stats,
    isLoading,
    error,
    loadStats
  };
}
