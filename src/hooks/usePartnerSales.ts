
import { useCallback } from 'react';
import { PartnerSale, DoorToDoorSaleData } from '@/types/partner';
import { partnerService } from '@/services/partnerService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const usePartnerSales = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Registrar uma venda do parceiro
  const registerSale = useCallback(async (saleData: Omit<PartnerSale, 'id' | 'date' | 'status' | 'affiliateId'>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    
    try {
      const affiliateId = localStorage.getItem('affiliateRef');
      
      const sale = await partnerService.registerSale(user.id, {
        ...saleData,
        date: new Date().toISOString(),
        status: 'pending' as const,
        affiliateId: affiliateId || undefined,
      });
      
      if (affiliateId) {
        localStorage.removeItem('affiliateRef');
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
  }, [user?.id, toast]);

  // Registrar venda porta a porta
  const registerDoorToDoorSale = useCallback(async (saleData: Omit<DoorToDoorSaleData, 'agentName'>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    
    try {
      const sale = await partnerService.registerDoorToDoorSale(user.id, {
        ...saleData,
        agentName: user.name || 'Vendedor',
      });
      
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
  }, [user?.id, user?.name, toast]);

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

  return {
    registerSale,
    registerDoorToDoorSale,
    getSalesHistory,
  };
};
