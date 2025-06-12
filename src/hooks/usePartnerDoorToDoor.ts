
import { useCallback } from 'react';
import { PartnerSale } from '@/types/partner';
import { partnerService } from '@/services/partnerService';
import { useToast } from '@/components/ui/use-toast';

export const usePartnerDoorToDoor = () => {
  const { toast } = useToast();

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

  // Acertar venda porta a porta
  const settleDoorToDoorSale = useCallback(async (partnerId: string, saleId: string, amountPaid: number) => {
    try {
      const sale = await partnerService.settleDoorToDoorSale(partnerId, saleId, amountPaid);
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
  }, [toast]);

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
    getDoorToDoorSales,
    getDoorToDoorSalesSummary,
    getPendingDoorToDoorSales,
    settleDoorToDoorSale,
    cancelDoorToDoorSale,
  };
};
