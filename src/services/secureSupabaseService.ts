
// Secure wrapper for Supabase operations with additional security measures
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database';
import { validateSensitiveOperation, rateLimiter } from '@/utils/authSecurity';
import { sanitizeAndValidate } from '@/utils/inputValidation';

type Sale = Database['public']['Tables']['sales']['Row'];
type SaleInsert = Database['public']['Tables']['sales']['Insert'];

export class SecureSupabaseService {
  // Secure sale creation with comprehensive validation
  async createSecureSale(saleData: Omit<SaleInsert, 'id' | 'created_at' | 'updated_at'>) {
    const operationKey = `create-sale-${saleData.customer_whatsapp}`;
    
    // Rate limiting: max 3 sales per WhatsApp per hour
    if (rateLimiter.isRateLimited(operationKey, 3, 60 * 60 * 1000)) {
      throw new Error('Muitas vendas criadas. Aguarde 1 hora para criar novamente.');
    }

    // Validate the operation
    if (!(await validateSensitiveOperation('create_sale'))) {
      throw new Error('Operação não autorizada');
    }

    // Validate and sanitize input data
    const validation = sanitizeAndValidate.salesForm({
      customer_name: saleData.customer_name,
      customer_email: saleData.customer_email || undefined,
      customer_whatsapp: saleData.customer_whatsapp,
      customer_city: saleData.customer_city,
      quantity: saleData.quantity,
      notes: saleData.notes || undefined,
    });

    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join(', ');
      throw new Error(`Dados inválidos: ${errorMessages}`);
    }

    // Check if raffle exists and is active
    const { data: raffle, error: raffleError } = await supabase
      .from('raffles')
      .select('id, status, total_numbers, price_per_number, discount_price, discount_min_quantity, commission_rate')
      .eq('id', saleData.raffle_id)
      .eq('status', 'active')
      .single();

    if (raffleError || !raffle) {
      throw new Error('Sorteio não encontrado ou inativo');
    }

    // Calculate pricing
    const unitPrice = saleData.quantity >= (raffle.discount_min_quantity || 10) 
      ? raffle.discount_price || raffle.price_per_number
      : raffle.price_per_number;
    
    const totalAmount = unitPrice * saleData.quantity;
    
    // Get commission rate for partner
    let commissionAmount = 0;
    if (saleData.partner_id) {
      const { data: partner } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', saleData.partner_id)
        .eq('role', 'partner')
        .eq('is_active', true)
        .single();
      
      if (partner) {
        commissionAmount = totalAmount * (raffle.commission_rate || 30) / 100;
      }
    }

    // Create the sale with validated data
    const { data, error } = await supabase
      .from('sales')
      .insert({
        ...validation.sanitized,
        raffle_id: saleData.raffle_id,
        partner_id: saleData.partner_id,
        unit_price: unitPrice,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        payment_method: saleData.payment_method,
        is_door_to_door: saleData.is_door_to_door || false,
        metadata: saleData.metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Sale creation error:', error);
      throw new Error('Erro ao criar venda');
    }

    // Reset rate limit on successful creation
    rateLimiter.reset(operationKey);
    
    return data;
  }

  // Secure number generation with availability check
  async generateSecureNumbers(raffleId: string, quantity: number): Promise<number[]> {
    if (!(await validateSensitiveOperation('generate_numbers'))) {
      throw new Error('Operação não autorizada');
    }

    // Get raffle info
    const { data: raffle, error: raffleError } = await supabase
      .from('raffles')
      .select('total_numbers, status')
      .eq('id', raffleId)
      .eq('status', 'active')
      .single();

    if (raffleError || !raffle) {
      throw new Error('Sorteio não encontrado');
    }

    // Get all purchased numbers for this raffle
    const { data: purchasedNumbers, error: numbersError } = await supabase
      .from('purchased_numbers')
      .select('number')
      .eq('raffle_id', raffleId);

    if (numbersError) {
      throw new Error('Erro ao verificar números disponíveis');
    }

    const usedNumbers = new Set(purchasedNumbers?.map(pn => pn.number) || []);
    const availableNumbers = [];

    // Generate list of available numbers
    for (let i = 1; i <= raffle.total_numbers; i++) {
      if (!usedNumbers.has(i)) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length < quantity) {
      throw new Error(`Apenas ${availableNumbers.length} números disponíveis`);
    }

    // Shuffle and return requested quantity
    const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, quantity);
  }

  // Secure withdrawal request with validation
  async createSecureWithdrawal(
    partnerId: string,
    amount: number,
    paymentMethod: 'pix' | 'bank_transfer',
    paymentDetails: any
  ) {
    const operationKey = `withdrawal-${partnerId}`;
    
    // Rate limiting: max 1 withdrawal request per day per partner
    if (rateLimiter.isRateLimited(operationKey, 1, 24 * 60 * 60 * 1000)) {
      throw new Error('Apenas 1 solicitação de saque por dia permitida');
    }

    if (!(await validateSensitiveOperation('create_withdrawal'))) {
      throw new Error('Operação não autorizada');
    }

    // Validate amount
    if (amount <= 0 || amount > 100000) {
      throw new Error('Valor de saque inválido');
    }

    // Check partner's available balance
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('commission_amount')
      .eq('partner_id', partnerId)
      .eq('status', 'completed');

    if (salesError) {
      throw new Error('Erro ao verificar comissões');
    }

    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('partner_id', partnerId)
      .in('status', ['approved', 'processed']);

    if (withdrawalsError) {
      throw new Error('Erro ao verificar saques anteriores');
    }

    const totalEarnings = sales?.reduce((sum, sale) => sum + (sale.commission_amount || 0), 0) || 0;
    const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;
    const availableBalance = totalEarnings - totalWithdrawn;

    if (amount > availableBalance) {
      throw new Error(`Saldo insuficiente. Disponível: R$ ${availableBalance.toFixed(2)}`);
    }

    // Create withdrawal request
    const { data, error } = await supabase
      .from('withdrawals')
      .insert({
        partner_id: partnerId,
        amount,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Withdrawal creation error:', error);
      throw new Error('Erro ao criar solicitação de saque');
    }

    rateLimiter.reset(operationKey);
    return data;
  }

  // Secure partner click tracking
  async trackSecurePartnerClick(partnerId: string, metadata: any = {}) {
    const operationKey = `click-${partnerId}`;
    
    // Rate limiting: max 100 clicks per hour per partner to prevent abuse
    if (rateLimiter.isRateLimited(operationKey, 100, 60 * 60 * 1000)) {
      console.warn('Click tracking rate limited for partner:', partnerId);
      return null;
    }

    // Verify partner exists and is active
    const { data: partner, error: partnerError } = await supabase
      .from('profiles')
      .select('id, role, is_active')
      .eq('id', partnerId)
      .eq('role', 'partner')
      .eq('is_active', true)
      .single();

    if (partnerError || !partner) {
      console.warn('Invalid partner for click tracking:', partnerId);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('partner_clicks')
        .insert({
          partner_id: partnerId,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Click tracking error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Click tracking exception:', error);
      return null;
    }
  }
}

export const secureSupabaseService = new SecureSupabaseService();
