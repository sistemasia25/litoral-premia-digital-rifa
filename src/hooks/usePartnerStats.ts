
import { useState, useEffect, useCallback } from 'react';
import { PartnerStats } from '@/types/partner';
import { partnerService } from '@/services/partnerService';
import { useAuth } from '@/contexts/AuthContext';

export const usePartnerStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estatísticas padrão (mock) usadas caso o backend não esteja disponível
  const defaultStats: PartnerStats = {
    partnerId: user?.id || '',
    partnerName: user?.name || '',
    partnerSlug: user?.slug || '',
    totalClicks: 0,
    todayClicks: 0,
    totalSales: 0,
    todaySales: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    availableBalance: 0,
    withdrawnAmount: 0,
    pendingWithdrawal: 0,
    conversionRate: 0,
    lastUpdated: new Date().toISOString(),
    averageOrderValue: 0,
    topPerformingDays: [],
  } as PartnerStats;

  // Carregar estatísticas do parceiro
  const loadStats = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const statsData = await partnerService.getPartnerStats(user.id);
      setStats(statsData);
    } catch (err) {
      console.warn('Backend não disponível, usando estatísticas mock.', err);
      setStats(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, defaultStats]);

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
    refreshStats: loadStats,
  };
};
