import { useState, useEffect, useCallback } from 'react';
import { PartnerStats, PartnerSale, PartnerClick, PartnerWithdrawal, DoorToDoorSaleData } from '@/types/partner';
import { partnerService } from '@/services/partnerService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const usePartner = (): {
  stats: PartnerStats | null;
  isLoading: boolean;
  error: string | null;
  loadStats: () => Promise<void>;
  trackAffiliateClick: (slug: string, referrer: string) => Promise<boolean>;
  registerSale: (saleData: Omit<PartnerSale, 'id' | 'date' | 'status' | 'affiliateId'>) => Promise<PartnerSale>;
  registerDoorToDoorSale: (saleData: Omit<DoorToDoorSaleData, 'agentName'>) => Promise<PartnerSale>;
  getSalesHistory: (limit?: number) => Promise<PartnerSale[]>;
  getClicksHistory: (limit?: number) => Promise<PartnerClick[]>;
  requestWithdrawal: (amount: number, paymentMethod: 'pix' | 'bank_transfer', paymentDetails: any) => Promise<PartnerWithdrawal>;
  getWithdrawalHistory: (limit?: number) => Promise<{ withdrawals: PartnerWithdrawal[]; total: number }>;
  getDoorToDoorSales: (partnerId: string, limit?: number) => Promise<PartnerSale[]>;
  getDoorToDoorSalesSummary: (partnerId: string, period: string) => Promise<{ total: number; totalAmount: number; totalCommission: number }>;
  getPendingDoorToDoorSales: (partnerId: string) => Promise<PartnerSale[]>;
  settleDoorToDoorSale: (partnerId: string, saleId: string, amountPaid: number) => Promise<PartnerSale>;
  cancelDoorToDoorSale: (partnerId: string, saleId: string, reason: string) => Promise<PartnerSale>;
  refreshStats: () => Promise<void>;
} => {
  const { user } = useAuth();
  const { toast } = useToast();
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
      // Usa dados mock para evitar quebra da UI até que o backend esteja pronto
      setStats(defaultStats);
      // Não define erro para que a UI continue funcionando
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    loadStats();
  }, [loadStats]);

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

  // Registrar uma venda do parceiro
  const registerSale = useCallback(async (saleData: Omit<PartnerSale, 'id' | 'date' | 'status' | 'affiliateId'>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    
    try {
      // Verifica se há uma referência de afiliado no localStorage
      const affiliateId = localStorage.getItem('affiliateRef');
      
      const sale = await partnerService.registerSale(user.id, {
        ...saleData,
        date: new Date().toISOString(),
        status: 'pending' as const,
        affiliateId: affiliateId || undefined,
      });
      
      // Limpa a referência após o uso
      if (affiliateId) {
        localStorage.removeItem('affiliateRef');
      }
      
      // Atualiza as estatísticas locais
      if (stats) {
        setStats({
          ...stats,
          todaySales: stats.todaySales + 1,
          totalSales: stats.totalSales + 1,
          todayEarnings: stats.todayEarnings + sale.commission,
          totalEarnings: stats.totalEarnings + sale.commission,
          availableBalance: stats.availableBalance + sale.commission,
        });
      }
      
      return sale;
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast({
        title: "Erro ao registrar venda",
        description: error instanceof Error ? error.message : "Não foi possível registrar a venda. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [user?.id, stats, toast]);

  // Obter histórico de vendas
  const getSalesHistory = useCallback(async (limit?: number) => {
    if (!user?.id) return [];
    
    try {
      return await partnerService.getSalesHistory(user.id, limit);
    } catch (error) {
      console.error('Erro ao obter histórico de vendas:', error);
      throw error;
    }
  }, [user?.id]);

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

  // Obter histórico de saques
  const getWithdrawalHistory = useCallback(async (limit?: number): Promise<{ withdrawals: PartnerWithdrawal[]; total: number }> => {
    if (!user?.id) return { withdrawals: [], total: 0 };
    
    try {
      const result = await partnerService.getWithdrawalHistory(user.id, limit);
      // Se o resultado for um array simples, convertemos para o formato esperado
      if (Array.isArray(result)) {
        return { withdrawals: result, total: result.length };
      }
      return result;
    } catch (error) {
      console.error('Erro ao obter histórico de saques:', error);
      return { withdrawals: [], total: 0 };
    }
  }, [user?.id]);

  // Obter resumo de vendas porta a porta
  const getDoorToDoorSalesSummary = useCallback(async (partnerId: string, period: string) => {
    try {
      return await partnerService.getDoorToDoorSalesSummary(partnerId, period);
    } catch (error) {
      console.error('Erro ao obter resumo de vendas porta a porta:', error);
      throw error;
    }
  }, []);

  // Obter vendas porta a porta
  const getDoorToDoorSales = useCallback(async (partnerId: string, limit?: number) => {
    try {
      return await partnerService.getDoorToDoorSales(partnerId, limit);
    } catch (error) {
      console.error('Erro ao obter vendas porta a porta:', error);
      throw error;
    }
  }, []);

  // Solicitar saque
  const requestWithdrawal = useCallback(async (amount: number, paymentMethod: 'pix' | 'bank_transfer', paymentDetails: any) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }
    
    if (!stats || amount > stats.availableBalance) {
      throw new Error('Saldo insuficiente para saque');
    }
    
    try {
      const withdrawal = await partnerService.requestWithdrawal(
        user.id,
        amount,
        paymentMethod,
        paymentDetails
      );
      
      // Atualizar estatísticas após solicitar saque
      await loadStats();
      
      return withdrawal;
    } catch (err) {
      console.error('Erro ao solicitar saque:', err);
      throw err;
    }
  }, [user?.id, stats, loadStats]);

  // Obter vendas porta a porta pendentes
  const getPendingDoorToDoorSales = useCallback(async (partnerId: string) => {
    try {
      return await partnerService.getPendingDoorToDoorSales(partnerId);
    } catch (error) {
      console.error('Erro ao obter vendas porta a porta:', error);
      toast({
        title: "Erro ao carregar vendas",
        description: "Não foi possível carregar as vendas porta a porta. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Registrar venda porta a porta
  const registerDoorToDoorSale = useCallback(async (saleData: Omit<DoorToDoorSaleData, 'agentName'>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    
    try {
      const sale = await partnerService.registerDoorToDoorSale(user.id, {
        ...saleData,
        agentName: user.name || 'Vendedor',
      });
      
      // Atualiza as estatísticas locais
      if (stats) {
        setStats({
          ...stats,
          todaySales: stats.todaySales + 1,
          totalSales: stats.totalSales + 1,
          // Não adiciona ao saldo disponível até ser acertado
        });
      }
      
      return sale;
    } catch (error) {
      console.error('Erro ao registrar venda porta a porta:', error);
      toast({
        title: "Erro ao registrar venda",
        description: error instanceof Error ? error.message : "Não foi possível registrar a venda porta a porta. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [user?.id, user?.name, stats, toast]);

  // Acertar venda porta a porta
  const settleDoorToDoorSale = useCallback(async (partnerId: string, saleId: string, amountPaid: number) => {
    try {
      const sale = await partnerService.settleDoorToDoorSale(partnerId, saleId, amountPaid);
      
      // Atualiza as estatísticas locais
      if (stats) {
        setStats({
          ...stats,
          todayEarnings: stats.todayEarnings + sale.commission,
          totalEarnings: stats.totalEarnings + sale.commission,
          availableBalance: stats.availableBalance + sale.commission,
        });
      }
      
      return sale;
    } catch (error) {
      console.error('Erro ao acertar venda:', error);
      toast({
        title: "Erro ao acertar venda",
        description: error instanceof Error ? error.message : "Não foi possível acertar a venda. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [stats, toast]);

  // Cancelar venda porta a porta
  const cancelDoorToDoorSale = useCallback(async (partnerId: string, saleId: string, reason: string) => {
    try {
      return await partnerService.cancelDoorToDoorSale(partnerId, saleId, reason);
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      toast({
        title: "Erro ao cancelar venda",
        description: error instanceof Error ? error.message : "Não foi possível cancelar a venda. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
    trackAffiliateClick,
    registerSale,
    registerDoorToDoorSale,
    getSalesHistory,
    getClicksHistory,
    requestWithdrawal,
    getWithdrawalHistory,
    getDoorToDoorSales,
    getDoorToDoorSalesSummary,
    getPendingDoorToDoorSales,
    settleDoorToDoorSale,
    cancelDoorToDoorSale,
    refreshStats: loadStats,
  };
};
