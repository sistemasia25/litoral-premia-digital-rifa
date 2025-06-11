
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          whatsapp: string | null;
          cpf: string | null;
          city: string | null;
          state: string | null;
          instagram: string | null;
          slug: string | null;
          role: 'admin' | 'partner' | 'customer';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          whatsapp?: string | null;
          cpf?: string | null;
          city?: string | null;
          state?: string | null;
          instagram?: string | null;
          slug?: string | null;
          role?: 'admin' | 'partner' | 'customer';
          is_active?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string | null;
          whatsapp?: string | null;
          cpf?: string | null;
          city?: string | null;
          state?: string | null;
          instagram?: string | null;
          slug?: string | null;
          role?: 'admin' | 'partner' | 'customer';
          is_active?: boolean;
        };
      };
      raffles: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          total_numbers: number;
          price_per_number: number;
          discount_price: number | null;
          discount_min_quantity: number | null;
          commission_rate: number;
          status: 'active' | 'finished' | 'cancelled';
          draw_date: string | null;
          image_url: string | null;
          rules: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          total_numbers?: number;
          price_per_number?: number;
          discount_price?: number | null;
          discount_min_quantity?: number | null;
          commission_rate?: number;
          status?: 'active' | 'finished' | 'cancelled';
          draw_date?: string | null;
          image_url?: string | null;
          rules?: string | null;
          created_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          total_numbers?: number;
          price_per_number?: number;
          discount_price?: number | null;
          discount_min_quantity?: number | null;
          commission_rate?: number;
          status?: 'active' | 'finished' | 'cancelled';
          draw_date?: string | null;
          image_url?: string | null;
          rules?: string | null;
        };
      };
      sales: {
        Row: {
          id: string;
          raffle_id: string;
          customer_profile_id: string | null;
          customer_name: string;
          customer_email: string | null;
          customer_whatsapp: string;
          customer_city: string;
          partner_id: string | null;
          quantity: number;
          unit_price: number;
          total_amount: number;
          commission_amount: number;
          status: 'pending' | 'completed' | 'cancelled' | 'refunded';
          payment_method: 'pix' | 'credit_card' | 'debit_card' | 'money' | 'bank_transfer' | null;
          payment_id: string | null;
          is_door_to_door: boolean;
          notes: string | null;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          raffle_id: string;
          customer_profile_id?: string | null;
          customer_name: string;
          customer_email?: string | null;
          customer_whatsapp: string;
          customer_city: string;
          partner_id?: string | null;
          quantity: number;
          unit_price: number;
          total_amount: number;
          commission_amount?: number;
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
          payment_method?: 'pix' | 'credit_card' | 'debit_card' | 'money' | 'bank_transfer' | null;
          payment_id?: string | null;
          is_door_to_door?: boolean;
          notes?: string | null;
          metadata?: any;
        };
        Update: {
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
          payment_method?: 'pix' | 'credit_card' | 'debit_card' | 'money' | 'bank_transfer' | null;
          payment_id?: string | null;
          notes?: string | null;
        };
      };
      purchased_numbers: {
        Row: {
          id: string;
          sale_id: string;
          raffle_id: string;
          number: number;
          is_winner: boolean;
          created_at: string;
        };
        Insert: {
          sale_id: string;
          raffle_id: string;
          number: number;
          is_winner?: boolean;
        };
        Update: {
          is_winner?: boolean;
        };
      };
      winning_numbers: {
        Row: {
          id: string;
          raffle_id: string;
          number: number;
          prize_id: string | null;
          winner_profile_id: string | null;
          claimed_at: string | null;
          created_at: string;
        };
        Insert: {
          raffle_id: string;
          number: number;
          prize_id?: string | null;
          winner_profile_id?: string | null;
          claimed_at?: string | null;
        };
        Update: {
          winner_profile_id?: string | null;
          claimed_at?: string | null;
        };
      };
      partner_clicks: {
        Row: {
          id: string;
          partner_id: string;
          ip_address: string | null;
          user_agent: string | null;
          referrer: string | null;
          converted: boolean;
          sale_id: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: {
          partner_id: string;
          ip_address?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          converted?: boolean;
          sale_id?: string | null;
          metadata?: any;
        };
        Update: {
          converted?: boolean;
          sale_id?: string | null;
        };
      };
      withdrawals: {
        Row: {
          id: string;
          partner_id: string;
          amount: number;
          status: 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
          payment_method: 'pix' | 'credit_card' | 'debit_card' | 'money' | 'bank_transfer';
          payment_details: any;
          processed_by: string | null;
          processed_at: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          partner_id: string;
          amount: number;
          status?: 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
          payment_method: 'pix' | 'credit_card' | 'debit_card' | 'money' | 'bank_transfer';
          payment_details: any;
          processed_by?: string | null;
          processed_at?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
          processed_by?: string | null;
          processed_at?: string | null;
          rejection_reason?: string | null;
        };
      };
    };
  };
}
