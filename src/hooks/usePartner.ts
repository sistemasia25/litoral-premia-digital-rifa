import { useState, useEffect, useCallback } from 'react';
import { PartnerStats, PartnerSale, PartnerClick, PartnerWithdrawal, DoorToDoorSaleData } from '@/types/partner';
import { partnerService } from '@/services/partnerService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const usePartner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar estatísticas do parceiro
  const loadStats = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const statsData = await partnerService.getPartnerStats(user.id);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Falha ao carregar estatísticas. Tente novamente mais tarde.');
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

  // Obter vendas porta a porta pendentes
  const getPendingDoorToDoorSales = useCallback(async () => {
    if (!user?.id) return [];
    
    try {
      return await partnerService.getPendingDoorToDoorSales(user.id);
    } catch (error) {
      console.error('Erro ao obter vendas porta a porta:', error);
      toast({
        title: "Erro ao carregar vendas",
        description: "Não foi possível carregar as vendas porta a porta. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [user?.id, toast]);

  // Acertar venda porta a porta
  const settleDoorToDoorSale = useCallback(async (saleId: string, amountPaid: number) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    
    try {
      const sale = await partnerService.settleDoorToDoorSale(user.id, saleId, amountPaid);
      
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
  }, [user?.id, stats, toast]);

  // Cancelar venda porta a porta
  const cancelDoorToDoorSale = useCallback(async (saleId: string, reason: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    
    try {
      return await partnerService.cancelDoorToDoorSale(user.id, saleId, reason);
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      toast({
        title: "Erro ao cancelar venda",
        description: error instanceof Error ? error.message : "Não foi possível cancelar a venda. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  }, [user?.id, toast]);

  return {
    stats,
    isLoading,
    error,
    trackAffiliateClick,
    registerSale,
    registerDoorToDoorSale,
    getPendingDoorToDoorSales,
    settleDoorToDoorSale,
    cancelDoorToDoorSale,
    requestWithdrawal,
    refreshStats: loadStats,
  };
};
