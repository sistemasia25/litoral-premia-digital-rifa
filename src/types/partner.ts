export interface PartnerStats {
  partnerId: string;
  partnerName: string;
  partnerSlug: string;
  totalClicks: number;
  todayClicks: number;
  totalSales: number;
  todaySales: number;
  totalEarnings: number;
  todayEarnings: number;
  availableBalance: number;
  withdrawnAmount: number;
  pendingWithdrawal: number;
  conversionRate: number;
  lastUpdated: string;
  // Métricas adicionais
  averageOrderValue: number;
  topPerformingDays: Array<{
    date: string;
    sales: number;
    earnings: number;
  }>;
}

export interface PartnerSale {
  id: string;
  partnerId: string;
  affiliateId?: string; // ID do afiliado que indicou a venda (opcional)
  date: string;
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'door_to_door';
  numbers: string[];
  paymentMethod?: string;
  // Indica se é uma venda porta a porta
  isDoorToDoor?: boolean;
  // Data de acerto da venda porta a porta
  settledAt?: string | null;
  // Metadados adicionais
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    // Metadados específicos para venda porta a porta
    doorToDoorAgent?: string; // Nome/ID do vendedor
    doorToDoorStatus?: 'pending' | 'settled' | 'cancelled' | 'disputed';
    location?: {
      latitude?: number;
      longitude?: number;
      address?: string;
      accuracy?: number;
      timestamp?: number;
    };
    // Informações de pagamento para venda porta a porta
    paymentDetails?: {
      method?: 'money' | 'pix' | 'credit_card' | 'debit_card';
      transactionId?: string;
      paidAt?: string;
      receivedAmount?: number;
      change?: number;
    };
    // Informações de cancelamento
    cancellation?: {
      reason: string;
      notes?: string;
      cancelledAt?: string;
      cancelledBy?: string;
      refundIssued?: boolean;
      refundAmount?: number;
    };
  };
}

// Status específicos para vendas porta a porta
export type DoorToDoorSaleStatus = 'pending' | 'settled' | 'cancelled' | 'disputed';

// Interface para registro de venda porta a porta
export interface DoorToDoorSaleData {
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  amount: number;
  quantity: number;
  paymentMethod: 'money' | 'pix' | 'credit_card' | 'debit_card';
  agentName: string;
  status?: DoorToDoorSaleStatus;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
    accuracy?: number;
    timestamp?: number;
  };
  notes?: string;
  numbers?: string[];
  settledAt?: string | null;
  cancelledAt?: string | null;
  cancelledReason?: string;
  metadata?: {
    deviceInfo?: string;
    ipAddress?: string;
    userAgent?: string;
    [key: string]: any;
  };
}

// Interface para resposta de venda porta a porta
export interface DoorToDoorSaleResponse extends Omit<DoorToDoorSaleData, 'agentName'> {
  id: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  agentName: string;
  agentId?: string;
  settledBy?: string;
  cancelledBy?: string;
  commissionRate: number;
  commissionAmount: number;
}

// Interface para filtro de vendas porta a porta
export interface DoorToDoorSalesFilter {
  startDate?: string;
  endDate?: string;
  status?: DoorToDoorSaleStatus | DoorToDoorSaleStatus[];
  agentId?: string;
  customerName?: string;
  customerWhatsApp?: string;
  sortBy?: 'date' | 'amount' | 'status' | 'customerName';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Interface para estatísticas de vendas porta a porta
export interface DoorToDoorStats {
  totalSales: number;
  pendingSales: number;
  settledSales: number;
  cancelledSales: number;
  totalAmount: number;
  pendingAmount: number;
  settledAmount: number;
  averageTicket: number;
  conversionRate: number;
  byDay?: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  byAgent?: Array<{
    agentId: string;
    agentName: string;
    count: number;
    amount: number;
  }>;
}

// Interface para acerto de venda
export interface SettleDoorToDoorSaleData {
  amountPaid: number;
  paymentMethod: 'money' | 'pix' | 'credit_card' | 'debit_card' | 'other';
  paymentDate: string;
  notes?: string;
  transactionId?: string;
}

// Interface para cancelamento de venda
export interface CancelDoorToDoorSaleData {
  reason: string;
  notes?: string;
  refundCustomer?: boolean;
  refundAmount?: number;
}

export interface PartnerClick {
  id: string;
  partnerId: string;
  partnerSlug: string;
  date: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
  converted: boolean;
  conversionDate?: string;
  // Dados de geolocalização (preenchidos pelo backend)
  location?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  // Dados do dispositivo (extraídos do userAgent)
  device?: {
    type?: 'desktop' | 'mobile' | 'tablet' | 'bot' | 'other';
    os?: string;
    browser?: string;
    isMobile?: boolean;
    isTablet?: boolean;
    isDesktop?: boolean;
    isBot?: boolean;
  };
}

export interface PartnerWithdrawal {
  id: string;
  partnerId: string;
  partnerName: string;
  requestDate: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
  processedDate?: string;
  paymentMethod: 'pix' | 'bank_transfer' | 'other';
  paymentDetails: {
    // Para PIX
    pixKey?: string;
    pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
    // Para transferência bancária
    bankName?: string;
    bankAgency?: string;
    bankAccount?: string;
    bankAccountType?: 'checking' | 'savings';
    bankAccountHolder?: string;
    bankAccountDocument?: string;
    // Outros métodos
    [key: string]: any;
  };
  rejectionReason?: string;
  // Metadados adicionais
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    processedBy?: string;
    notes?: string;
  };
}

// Interface para cadastro de parceiro
export interface PartnerRegistrationData {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  password: string;
  confirmPassword: string;
  accept: boolean;
  // Dados adicionais opcionais
  cpfCnpj?: string;
  address?: string;
  postalCode?: string;
  // Metadados
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

// Tipos para formulários
export interface PartnerSaleFormData {
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  amount: number;
  quantity: number;
  numbers?: string[];
  affiliateId?: string;
}

export interface PartnerWithdrawalRequestData {
  amount: number;
  paymentMethod: 'pix' | 'bank_transfer';
  paymentDetails: Record<string, any>;
}

// Tipos para filtros e consultas
export interface PartnerSalesFilter {
  startDate?: string;
  endDate?: string;
  status?: PartnerSale['status'];
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PartnerClicksFilter {
  startDate?: string;
  endDate?: string;
  converted?: boolean;
  sortBy?: 'date' | 'converted';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PartnerWithdrawalsFilter {
  startDate?: string;
  endDate?: string;
  status?: PartnerWithdrawal['status'];
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
