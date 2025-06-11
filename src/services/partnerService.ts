
import { 
  PartnerStats, 
  PartnerSale, 
  PartnerClick, 
  PartnerWithdrawal, 
  DoorToDoorSaleData, 
  PartnerRegistrationData 
} from "@/types/partner";

const API_URL = '/api/partner';

// Interface para a resposta de cadastro de parceiro
interface PartnerRegistrationResponse {
  id: string;
  name: string;
  email: string;
  slug: string;
  message: string;
}

// Interface para os dados de rastreamento de clique
export interface TrackClickParams {
  slug: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
}

export const partnerService = {
  // Cadastrar um novo parceiro
  async registerPartner(partnerData: Omit<PartnerRegistrationData, 'confirmPassword' | 'accept'>): Promise<PartnerRegistrationResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao cadastrar parceiro');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao cadastrar parceiro:', error);
      throw error;
    }
  },
  
  // Rastrear clique no link do parceiro
  async trackClick(params: TrackClickParams): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/clicks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao rastrear clique');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao rastrear clique:', error);
      throw error;
    }
  },
  
  // Obter estatísticas do parceiro
  async getPartnerStats(partnerId: string): Promise<PartnerStats> {
    const response = await fetch(`${API_URL}/${partnerId}/stats`);
    
    if (!response.ok) {
      throw new Error('Falha ao obter estatísticas do parceiro');
    }
    
    return response.json();
  },

  // Registrar uma venda do parceiro
  async registerSale(
    partnerId: string, 
    saleData: Omit<PartnerSale, 'id' | 'saleDate'> & { affiliateId?: string }
  ): Promise<PartnerSale> {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...saleData,
        partnerId,
        saleDate: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao registrar venda');
    }
    
    return response.json();
  },

  // Solicitar saque
  async requestWithdrawal(
    partnerId: string, 
    amount: number, 
    paymentMethod: 'pix' | 'bank_transfer',
    paymentDetails: any
  ): Promise<PartnerWithdrawal> {
    const response = await fetch(`${API_URL}/${partnerId}/withdrawals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        paymentMethod,
        paymentDetails,
        requestDate: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao solicitar saque');
    }
    
    return response.json();
  },

  // Obter histórico de vendas
  async getSalesHistory(partnerId: string, limit: number = 10, offset: number = 0): Promise<PartnerSale[]> {
    const response = await fetch(`${API_URL}/${partnerId}/sales?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('Falha ao obter histórico de vendas');
    }
    
    return response.json();
  },

  // Obter histórico de cliques
  async getClicksHistory(partnerId: string, limit: number = 10, offset: number = 0): Promise<PartnerClick[]> {
    const response = await fetch(`${API_URL}/${partnerId}/clicks?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('Falha ao obter histórico de cliques');
    }
    
    return response.json();
  },

  // Obter resumo de vendas porta a porta
  async getDoorToDoorSalesSummary(partnerId: string, period: string) {
    const response = await fetch(`${API_URL}/${partnerId}/door-to-door-sales/summary?period=${period}`);
    
    if (!response.ok) {
      throw new Error('Falha ao obter resumo de vendas porta a porta');
    }
    
    return response.json();
  },

  // Obter vendas porta a porta
  async getDoorToDoorSales(partnerId: string, limit: number = 10, offset: number = 0): Promise<PartnerSale[]> {
    const response = await fetch(`${API_URL}/${partnerId}/door-to-door-sales?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('Falha ao obter vendas porta a porta');
    }
    
    return response.json();
  },

  // Registrar venda porta a porta
  async registerDoorToDoorSale(
    partnerId: string,
    saleData: DoorToDoorSaleData
  ): Promise<PartnerSale> {
    const response = await fetch(`${API_URL}/${partnerId}/door-to-door-sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...saleData,
        saleDate: new Date().toISOString(),
        status: 'door_to_door',
        isDoorToDoor: true
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao registrar venda porta a porta');
    }
    
    return response.json();
  },

  // Obter vendas porta a porta pendentes de acerto
  async getPendingDoorToDoorSales(partnerId: string): Promise<PartnerSale[]> {
    const response = await fetch(`${API_URL}/${partnerId}/door-to-door-sales?status=pending`);
    
    if (!response.ok) {
      throw new Error('Falha ao obter vendas porta a porta pendentes');
    }
    
    return response.json();
  },

  // Acertar venda porta a porta
  async settleDoorToDoorSale(
    partnerId: string, 
    saleId: string, 
    amountPaid: number
  ): Promise<PartnerSale> {
    const response = await fetch(`${API_URL}/${partnerId}/door-to-door-sales/${saleId}/settle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountPaid, settledAt: new Date().toISOString() }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao acertar venda porta a porta');
    }
    
    return response.json();
  },

  // Cancelar venda porta a porta
  async cancelDoorToDoorSale(partnerId: string, saleId: string, reason: string): Promise<PartnerSale> {
    const response = await fetch(`${API_URL}/${partnerId}/door-to-door-sales/${saleId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString() 
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao cancelar venda porta a porta');
    }
    
    return response.json();
  },

  // Obter histórico de saques
  async getWithdrawalHistory(
    partnerId: string, 
    limit: number = 10, 
    offset: number = 0
  ): Promise<{ withdrawals: PartnerWithdrawal[], total: number }> {
    try {
      const response = await fetch(`${API_URL}/${partnerId}/withdrawals?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar histórico de saques');
      }
      
      // Obter o total de itens do header
      const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);
      const withdrawals = await response.json();
      
      return { withdrawals, total };
    } catch (error) {
      console.error('Erro ao buscar histórico de saques:', error);
      throw error;
    }
  },
};
