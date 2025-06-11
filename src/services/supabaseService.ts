
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Sale = Database['public']['Tables']['sales']['Row'];
type PurchasedNumber = Database['public']['Tables']['purchased_numbers']['Row'];
type PartnerClick = Database['public']['Tables']['partner_clicks']['Row'];
type Withdrawal = Database['public']['Tables']['withdrawals']['Row'];

export class SupabaseService {
  // Serviços de Perfil
  async createProfile(profileData: Database['public']['Tables']['profiles']['Insert']) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProfileBySlug(slug: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('role', 'partner')
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(id: string, updates: Database['public']['Tables']['profiles']['Update']) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Serviços de Venda
  async createSale(saleData: Database['public']['Tables']['sales']['Insert']) {
    const { data, error } = await supabase
      .from('sales')
      .insert(saleData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSalesByPartner(partnerId: string, limit?: number) {
    let query = supabase
      .from('sales')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getSalesByCustomer(customerId: string, limit?: number) {
    let query = supabase
      .from('sales')
      .select('*')
      .eq('customer_profile_id', customerId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateSaleStatus(saleId: string, status: 'pending' | 'completed' | 'cancelled' | 'refunded') {
    const { data, error } = await supabase
      .from('sales')
      .update({ status })
      .eq('id', saleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Serviços de Números Comprados
  async createPurchasedNumbers(numbers: Database['public']['Tables']['purchased_numbers']['Insert'][]) {
    const { data, error } = await supabase
      .from('purchased_numbers')
      .insert(numbers)
      .select();

    if (error) throw error;
    return data;
  }

  async getPurchasedNumbersBySale(saleId: string) {
    const { data, error } = await supabase
      .from('purchased_numbers')
      .select('*')
      .eq('sale_id', saleId)
      .order('number');

    if (error) throw error;
    return data;
  }

  async getPurchasedNumbersByCustomer(customerId: string) {
    const { data, error } = await supabase
      .from('purchased_numbers')
      .select(`
        *,
        sales!inner(customer_profile_id)
      `)
      .eq('sales.customer_profile_id', customerId)
      .order('number');

    if (error) throw error;
    return data;
  }

  // Serviços de Cliques de Parceiros
  async trackPartnerClick(clickData: Database['public']['Tables']['partner_clicks']['Insert']) {
    const { data, error } = await supabase
      .from('partner_clicks')
      .insert(clickData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPartnerClicks(partnerId: string, limit?: number) {
    let query = supabase
      .from('partner_clicks')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateClickConversion(clickId: string, saleId: string) {
    const { data, error } = await supabase
      .from('partner_clicks')
      .update({ converted: true, sale_id: saleId })
      .eq('id', clickId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Serviços de Saques
  async createWithdrawal(withdrawalData: Database['public']['Tables']['withdrawals']['Insert']) {
    const { data, error } = await supabase
      .from('withdrawals')
      .insert(withdrawalData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getWithdrawalsByPartner(partnerId: string, limit?: number) {
    let query = supabase
      .from('withdrawals')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateWithdrawalStatus(
    withdrawalId: string, 
    status: 'pending' | 'approved' | 'rejected' | 'processed' | 'failed',
    processedBy?: string,
    rejectionReason?: string
  ) {
    const updates: Database['public']['Tables']['withdrawals']['Update'] = {
      status,
      processed_at: new Date().toISOString()
    };

    if (processedBy) {
      updates.processed_by = processedBy;
    }

    if (rejectionReason) {
      updates.rejection_reason = rejectionReason;
    }

    const { data, error } = await supabase
      .from('withdrawals')
      .update(updates)
      .eq('id', withdrawalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Estatísticas e Relatórios
  async getPartnerStats(partnerId: string) {
    // Total de vendas
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('id, total_amount, commission_amount, created_at')
      .eq('partner_id', partnerId);

    if (salesError) throw salesError;

    // Total de cliques
    const { data: clicksData, error: clicksError } = await supabase
      .from('partner_clicks')
      .select('id, created_at, converted')
      .eq('partner_id', partnerId);

    if (clicksError) throw clicksError;

    // Saldo disponível (comissões - saques processados)
    const { data: withdrawalsData, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('partner_id', partnerId)
      .eq('status', 'processed');

    if (withdrawalsError) throw withdrawalsError;

    const totalEarnings = salesData?.reduce((sum, sale) => sum + (sale.commission_amount || 0), 0) || 0;
    const totalWithdrawn = withdrawalsData?.reduce((sum, withdrawal) => sum + withdrawal.amount, 0) || 0;
    const availableBalance = totalEarnings - totalWithdrawn;

    const today = new Date().toDateString();
    const todaySales = salesData?.filter(sale => new Date(sale.created_at).toDateString() === today) || [];
    const todayClicks = clicksData?.filter(click => new Date(click.created_at).toDateString() === today) || [];

    return {
      partnerId,
      totalSales: salesData?.length || 0,
      todaySales: todaySales.length,
      totalClicks: clicksData?.length || 0,
      todayClicks: todayClicks.length,
      totalEarnings,
      todayEarnings: todaySales.reduce((sum, sale) => sum + (sale.commission_amount || 0), 0),
      availableBalance,
      withdrawnAmount: totalWithdrawn,
      conversionRate: clicksData?.length ? (salesData?.length || 0) / clicksData.length * 100 : 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Verificar disponibilidade de números
  async checkNumbersAvailability(raffleId: string, numbers: number[]): Promise<number[]> {
    const { data, error } = await supabase
      .from('purchased_numbers')
      .select('number')
      .eq('raffle_id', raffleId)
      .in('number', numbers);

    if (error) throw error;

    const unavailableNumbers = data?.map(item => item.number) || [];
    return numbers.filter(num => !unavailableNumbers.includes(num));
  }

  // Gerar números aleatórios disponíveis
  async generateRandomNumbers(raffleId: string, quantity: number, totalNumbers: number): Promise<number[]> {
    const { data: usedNumbers, error } = await supabase
      .from('purchased_numbers')
      .select('number')
      .eq('raffle_id', raffleId);

    if (error) throw error;

    const usedSet = new Set(usedNumbers?.map(item => item.number) || []);
    const availableNumbers = [];

    for (let i = 1; i <= totalNumbers; i++) {
      if (!usedSet.has(i)) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length < quantity) {
      throw new Error('Não há números suficientes disponíveis');
    }

    // Embaralhar e pegar a quantidade solicitada
    const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, quantity);
  }
}

export const supabaseService = new SupabaseService();
