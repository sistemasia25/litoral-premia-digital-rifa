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
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          nivel_acesso: string
          nome: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nivel_acesso?: string
          nome: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nivel_acesso?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      influenciadores: {
        Row: {
          codigo_referencia: string
          created_at: string
          email: string
          id: string
          nome: string
          percentual_comissao: number
          saldo_disponivel: number
          status: string
          total_vendas: number
          updated_at: string
          user_id: string | null
          whatsapp: string
        }
        Insert: {
          codigo_referencia: string
          created_at?: string
          email: string
          id?: string
          nome: string
          percentual_comissao?: number
          saldo_disponivel?: number
          status?: string
          total_vendas?: number
          updated_at?: string
          user_id?: string | null
          whatsapp: string
        }
        Update: {
          codigo_referencia?: string
          created_at?: string
          email?: string
          id?: string
          nome?: string
          percentual_comissao?: number
          saldo_disponivel?: number
          status?: string
          total_vendas?: number
          updated_at?: string
          user_id?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      parceiros: {
        Row: {
          codigo_referencia: string
          created_at: string
          id: string
          nome: string
          saldo_disponivel: number | null
          updated_at: string
          user_id: string
          whatsapp: string
        }
        Insert: {
          codigo_referencia: string
          created_at?: string
          id?: string
          nome: string
          saldo_disponivel?: number | null
          updated_at?: string
          user_id: string
          whatsapp: string
        }
        Update: {
          codigo_referencia?: string
          created_at?: string
          id?: string
          nome?: string
          saldo_disponivel?: number | null
          updated_at?: string
          user_id?: string
          whatsapp?: string
        }
        Relationships: []
      }
      saques: {
        Row: {
          dados_bancarios: Json
          data_processamento: string | null
          data_solicitacao: string
          id: string
          influenciador_id: string
          observacoes: string | null
          processado_por: string | null
          status: string
          valor_solicitado: number
        }
        Insert: {
          dados_bancarios: Json
          data_processamento?: string | null
          data_solicitacao?: string
          id?: string
          influenciador_id: string
          observacoes?: string | null
          processado_por?: string | null
          status?: string
          valor_solicitado: number
        }
        Update: {
          dados_bancarios?: Json
          data_processamento?: string | null
          data_solicitacao?: string
          id?: string
          influenciador_id?: string
          observacoes?: string | null
          processado_por?: string | null
          status?: string
          valor_solicitado?: number
        }
        Relationships: [
          {
            foreignKeyName: "saques_influenciador_id_fkey"
            columns: ["influenciador_id"]
            isOneToOne: false
            referencedRelation: "influenciadores"
            referencedColumns: ["id"]
          },
        ]
      }
      sorteios: {
        Row: {
          banner_url: string | null
          created_at: string
          data_sorteio: string
          descricao: string | null
          id: string
          numeros_premiados: Json | null
          numeros_vendidos: number
          preco_por_numero: number
          premio_principal: string
          premios_extras: Json | null
          quantidade_total_numeros: number
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          data_sorteio: string
          descricao?: string | null
          id?: string
          numeros_premiados?: Json | null
          numeros_vendidos?: number
          preco_por_numero?: number
          premio_principal: string
          premios_extras?: Json | null
          quantidade_total_numeros?: number
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          data_sorteio?: string
          descricao?: string | null
          id?: string
          numeros_premiados?: Json | null
          numeros_vendidos?: number
          preco_por_numero?: number
          premio_principal?: string
          premios_extras?: Json | null
          quantidade_total_numeros?: number
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cidade_cliente: string | null
          cpf_cliente: string | null
          created_at: string
          id: string
          influenciador_id: string | null
          nome_cliente: string
          numeros_comprados: Json
          quantidade_numeros: number
          sorteio_id: string
          status_pagamento: string
          tipo_venda: string
          updated_at: string
          valor_comissao: number | null
          valor_total: number
          whatsapp_cliente: string
        }
        Insert: {
          cidade_cliente?: string | null
          cpf_cliente?: string | null
          created_at?: string
          id?: string
          influenciador_id?: string | null
          nome_cliente: string
          numeros_comprados: Json
          quantidade_numeros: number
          sorteio_id: string
          status_pagamento?: string
          tipo_venda?: string
          updated_at?: string
          valor_comissao?: number | null
          valor_total: number
          whatsapp_cliente: string
        }
        Update: {
          cidade_cliente?: string | null
          cpf_cliente?: string | null
          created_at?: string
          id?: string
          influenciador_id?: string | null
          nome_cliente?: string
          numeros_comprados?: Json
          quantidade_numeros?: number
          sorteio_id?: string
          status_pagamento?: string
          tipo_venda?: string
          updated_at?: string
          valor_comissao?: number | null
          valor_total?: number
          whatsapp_cliente?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendas_influenciador_id_fkey"
            columns: ["influenciador_id"]
            isOneToOne: false
            referencedRelation: "influenciadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_sorteio_id_fkey"
            columns: ["sorteio_id"]
            isOneToOne: false
            referencedRelation: "sorteios"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
