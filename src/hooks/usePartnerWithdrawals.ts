
import { useCallback } from 'react';
import { PartnerWithdrawal } from '@/types/partner';
import { partnerService } from '@/services/partnerService';
import { useAuth } from '@/contexts/AuthContext';

export const usePartnerWithdrawals = () => {
  const { user } = useAuth();

  // Solicitar saque
  const requestWithdrawal = useCallback(async (amount: number, paymentMethod: 'pix' | 'bank_transfer', paymentDetails: any) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }
    
    try {
      const withdrawal = await partnerService.requestWithdrawal(
        user.id,
        amount,
        paymentMethod,
        paymentDetails
      );
      
      return withdrawal;
    } catch (err) {
      console.error('Erro ao solicitar saque:', err);
      throw err;
    }
  }, [user?.id]);

  // Obter histórico de saques
  const getWithdrawalHistory = useCallback(async (limit?: number): Promise<{ withdrawals: PartnerWithdrawal[]; total: number }> => {
    if (!user?.id) return { withdrawals: [], total: 0 };
    
    try {
      const result = await partnerService.getWithdrawalHistory(user.id, limit);
      if (Array.isArray(result)) {
        return { withdrawals: result, total: result.length };
      }
      return result;
    } catch (error) {
      console.error('Erro ao obter histórico de saques:', error);
      return { withdrawals: [], total: 0 };
    }
  }, [user?.id]);

  return {
    requestWithdrawal,
    getWithdrawalHistory,
  };
};
