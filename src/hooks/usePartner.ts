
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/services/supabaseService';
import { partnerService } from '@/services/partnerService';
import { PartnerSale, PartnerClick, PartnerWithdrawal, DoorToDoorSaleData } from '@/types/partner';

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
  pendingWithdrawal?: number;
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

  // Track affiliate click
  const trackAffiliateClick = async (slug: string, referrer: string) => {
    try {
      await partnerService.trackClick({
        slug,
        referrer,
        userAgent: navigator.userAgent,
        ipAddress: '', // Will be filled by backend
      });
    } catch (error) {
      console.error('Erro ao rastrear clique:', error);
      throw error;
    }
  };

  // Get sales history
  const getSalesHistory = async (limit: number = 10, offset: number = 0): Promise<PartnerSale[]> => {
    if (!user?.id) return [];
    return await partnerService.getSalesHistory(user.id, limit, offset);
  };

  // Get clicks history
  const getClicksHistory = async (limit: number = 10, offset: number = 0): Promise<PartnerClick[]> => {
    if (!user?.id) return [];
    return await partnerService.getClicksHistory(user.id, limit, offset);
  };

  // Door-to-door sales methods
  const registerDoorToDoorSale = async (saleData: Omit<DoorToDoorSaleData, 'agentName' | 'status'>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    return await partnerService.registerDoorToDoorSale(user.id, {
      ...saleData,
      agentName: user.name || 'Vendedor',
    });
  };

  const getDoorToDoorSales = async (partnerId: string, limit: number = 10): Promise<any[]> => {
    return await partnerService.getDoorToDoorSales(partnerId, limit);
  };

  const getDoorToDoorSalesSummary = async (partnerId: string, period: string) => {
    return await partnerService.getDoorToDoorSalesSummary(partnerId, period);
  };

  // Withdrawal methods
  const getWithdrawalHistory = async (limit: number = 10, offset: number = 0) => {
    if (!user?.id) return { withdrawals: [], total: 0 };
    return await partnerService.getWithdrawalHistory(user.id, limit, offset);
  };

  const requestWithdrawal = async (
    amount: number,
    paymentMethod: 'pix' | 'bank_transfer',
    paymentDetails: any
  ): Promise<PartnerWithdrawal> => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    return await partnerService.requestWithdrawal(user.id, amount, paymentMethod, paymentDetails);
  };

  useEffect(() => {
    loadStats();
  }, [user?.id]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
    trackAffiliateClick,
    getSalesHistory,
    getClicksHistory,
    registerDoorToDoorSale,
    getDoorToDoorSales,
    getDoorToDoorSalesSummary,
    getWithdrawalHistory,
    requestWithdrawal,
  };
}
