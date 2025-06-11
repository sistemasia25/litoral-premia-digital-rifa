import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DoorToDoorSaleData } from '@/types/partner';
import { partnerService } from '@/services/partnerService';

export const useDoorToDoorSales = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSales, setPendingSales] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Carregar vendas pendentes
  const loadPendingSales = useCallback(async (partnerId: string) => {
    try {
      setIsLoading(true);
      const sales = await partnerService.getPendingDoorToDoorSales(partnerId);
      setPendingSales(sales);
      return sales;
    } catch (error) {
      console.error('Erro ao carregar vendas pendentes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as vendas pendentes.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Registrar nova venda
  const registerSale = useCallback(async (partnerId: string, data: Omit<DoorToDoorSaleData, 'agentName' | 'status'>) => {
    try {
      setIsLoading(true);
      const sale = await partnerService.registerDoorToDoorSale(partnerId, {
        ...data,
        agentName: 'Vendedor', // Será substituído pelo nome do usuário no backend
      });
      
      toast({
        title: 'Venda registrada!',
        description: 'A venda foi registrada com sucesso.',
      });
      
      return sale;
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast({
        title: 'Erro ao registrar venda',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao registrar a venda.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Acertar venda
  const settleSale = useCallback(async (partnerId: string, saleId: string, amountPaid: number) => {
    try {
      setIsProcessing(saleId);
      const sale = await partnerService.settleDoorToDoorSale(partnerId, saleId, amountPaid);
      
      toast({
        title: 'Venda acertada!',
        description: 'O valor foi adicionado ao seu saldo disponível.',
      });
      
      // Atualiza a lista de vendas pendentes
      setPendingSales(prev => prev.filter(sale => sale.id !== saleId));
      
      return sale;
    } catch (error) {
      console.error('Erro ao acertar venda:', error);
      toast({
        title: 'Erro ao acertar venda',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao acertar a venda.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessing(null);
    }
  }, [toast]);

  // Cancelar venda
  const cancelSale = useCallback(async (partnerId: string, saleId: string, reason: string) => {
    try {
      if (!confirm('Tem certeza que deseja cancelar esta venda? Os números voltarão a ficar disponíveis para compra.')) {
        return null;
      }

      setIsProcessing(saleId);
      const sale = await partnerService.cancelDoorToDoorSale(partnerId, saleId, reason);
      
      toast({
        title: 'Venda cancelada',
        description: 'A venda foi cancelada e os números estão disponíveis novamente.',
      });
      
      // Atualiza a lista de vendas pendentes
      setPendingSales(prev => prev.filter(sale => sale.id !== saleId));
      
      return sale;
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      toast({
        title: 'Erro ao cancelar venda',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao cancelar a venda.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessing(null);
    }
  }, [toast]);

  return {
    isLoading,
    isProcessing,
    pendingSales,
    loadPendingSales,
    registerSale,
    settleSale,
    cancelSale,
  };
};
