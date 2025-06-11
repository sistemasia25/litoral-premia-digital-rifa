export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      partner_clicks: {
        Row: {
          converted: boolean
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          partner_id: string
          referrer: string | null
          sale_id: string | null
          user_agent: string | null
        }
        Insert: {
          converted?: boolean
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          partner_id: string
          referrer?: string | null
          sale_id?: string | null
          user_agent?: string | null
        }
        Update: {
          converted?: boolean
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          partner_id?: string
          referrer?: string | null
          sale_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_clicks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_clicks_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          cpf: string | null
          created_at: string
          email: string
          id: string
          instagram: string | null
          is_active: boolean
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          slug: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          city?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          id: string
          instagram?: string | null
          is_active?: boolean
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          slug?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          city?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          id?: string
          instagram?: string | null
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          slug?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      purchased_numbers: {
        Row: {
          created_at: string
          id: string
          is_winner: boolean
          number: number
          raffle_id: string
          sale_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_winner?: boolean
          number: number
          raffle_id: string
          sale_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_winner?: boolean
          number?: number
          raffle_id?: string
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_numbers_raffle_id_fkey"
            columns: ["raffle_id"]
            isOneToOne: false
            referencedRelation: "raffles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchased_numbers_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      raffle_prizes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          position: number
          raffle_id: string
          title: string
          value: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          position: number
          raffle_id: string
          title: string
          value?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          position?: number
          raffle_id?: string
          title?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "raffle_prizes_raffle_id_fkey"
            columns: ["raffle_id"]
            isOneToOne: false
            referencedRelation: "raffles"
            referencedColumns: ["id"]
          },
        ]
      }
      raffles: {
        Row: {
          commission_rate: number
          created_at: string
          created_by: string | null
          description: string | null
          discount_min_quantity: number | null
          discount_price: number | null
          draw_date: string | null
          id: string
          image_url: string | null
          price_per_number: number
          rules: string | null
          status: Database["public"]["Enums"]["raffle_status"]
          title: string
          total_numbers: number
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_min_quantity?: number | null
          discount_price?: number | null
          draw_date?: string | null
          id?: string
          image_url?: string | null
          price_per_number?: number
          rules?: string | null
          status?: Database["public"]["Enums"]["raffle_status"]
          title: string
          total_numbers?: number
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_min_quantity?: number | null
          discount_price?: number | null
          draw_date?: string | null
          id?: string
          image_url?: string | null
          price_per_number?: number
          rules?: string | null
          status?: Database["public"]["Enums"]["raffle_status"]
          title?: string
          total_numbers?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "raffles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          commission_amount: number | null
          created_at: string
          customer_city: string
          customer_email: string | null
          customer_name: string
          customer_profile_id: string | null
          customer_whatsapp: string
          id: string
          is_door_to_door: boolean
          metadata: Json | null
          notes: string | null
          partner_id: string | null
          payment_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          quantity: number
          raffle_id: string
          status: Database["public"]["Enums"]["sale_status"]
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          commission_amount?: number | null
          created_at?: string
          customer_city: string
          customer_email?: string | null
          customer_name: string
          customer_profile_id?: string | null
          customer_whatsapp: string
          id?: string
          is_door_to_door?: boolean
          metadata?: Json | null
          notes?: string | null
          partner_id?: string | null
          payment_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          quantity: number
          raffle_id: string
          status?: Database["public"]["Enums"]["sale_status"]
          total_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          commission_amount?: number | null
          created_at?: string
          customer_city?: string
          customer_email?: string | null
          customer_name?: string
          customer_profile_id?: string | null
          customer_whatsapp?: string
          id?: string
          is_door_to_door?: boolean
          metadata?: Json | null
          notes?: string | null
          partner_id?: string | null
          payment_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          quantity?: number
          raffle_id?: string
          status?: Database["public"]["Enums"]["sale_status"]
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_profile_id_fkey"
            columns: ["customer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_raffle_id_fkey"
            columns: ["raffle_id"]
            isOneToOne: false
            referencedRelation: "raffles"
            referencedColumns: ["id"]
          },
        ]
      }
      winning_numbers: {
        Row: {
          claimed_at: string | null
          created_at: string
          id: string
          number: number
          prize_id: string | null
          raffle_id: string
          winner_profile_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          id?: string
          number: number
          prize_id?: string | null
          raffle_id: string
          winner_profile_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          id?: string
          number?: number
          prize_id?: string | null
          raffle_id?: string
          winner_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "winning_numbers_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "raffle_prizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winning_numbers_raffle_id_fkey"
            columns: ["raffle_id"]
            isOneToOne: false
            referencedRelation: "raffles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winning_numbers_winner_profile_id_fkey"
            columns: ["winner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          partner_id: string
          payment_details: Json
          payment_method: Database["public"]["Enums"]["payment_method"]
          processed_at: string | null
          processed_by: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["withdrawal_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          partner_id: string
          payment_details: Json
          payment_method: Database["public"]["Enums"]["payment_method"]
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          partner_id?: string
          payment_details?: Json
          payment_method?: Database["public"]["Enums"]["payment_method"]
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawals_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_method:
        | "pix"
        | "credit_card"
        | "debit_card"
        | "money"
        | "bank_transfer"
      raffle_status: "active" | "finished" | "cancelled"
      sale_status: "pending" | "completed" | "cancelled" | "refunded"
      user_role: "admin" | "partner" | "customer"
      withdrawal_status:
        | "pending"
        | "approved"
        | "rejected"
        | "processed"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_method: [
        "pix",
        "credit_card",
        "debit_card",
        "money",
        "bank_transfer",
      ],
      raffle_status: ["active", "finished", "cancelled"],
      sale_status: ["pending", "completed", "cancelled", "refunded"],
      user_role: ["admin", "partner", "customer"],
      withdrawal_status: [
        "pending",
        "approved",
        "rejected",
        "processed",
        "failed",
      ],
    },
  },
} as const
