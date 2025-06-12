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
      clientes: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      cliques_parceiros: {
        Row: {
          data_clique: string | null
          id: string
          ip_address: unknown | null
          parceiro_id: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          data_clique?: string | null
          id?: string
          ip_address?: unknown | null
          parceiro_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          data_clique?: string | null
          id?: string
          ip_address?: unknown | null
          parceiro_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cliques_parceiros_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      numeros_premiados: {
        Row: {
          ativo: boolean | null
          cliente_id: string | null
          comprovante_url: string | null
          created_at: string | null
          data_premiacao: string | null
          data_sorteio: string | null
          descricao: string | null
          id: string
          numero: string
          premio: string
          sorteio_id: string | null
          status: string
        }
        Insert: {
          ativo?: boolean | null
          cliente_id?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_premiacao?: string | null
          data_sorteio?: string | null
          descricao?: string | null
          id?: string
          numero: string
          premio: string
          sorteio_id?: string | null
          status?: string
        }
        Update: {
          ativo?: boolean | null
          cliente_id?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_premiacao?: string | null
          data_sorteio?: string | null
          descricao?: string | null
          id?: string
          numero?: string
          premio?: string
          sorteio_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "numeros_premiados_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "numeros_premiados_sorteio_id_fkey"
            columns: ["sorteio_id"]
            isOneToOne: false
            referencedRelation: "sorteios"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiros: {
        Row: {
          chave_pix: string | null
          cidade: string | null
          comissao_percentual: number | null
          created_at: string | null
          email: string
          estado: string | null
          id: string
          instagram: string | null
          nome: string
          slug: string
          status: string
          telefone: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          chave_pix?: string | null
          cidade?: string | null
          comissao_percentual?: number | null
          created_at?: string | null
          email: string
          estado?: string | null
          id?: string
          instagram?: string | null
          nome: string
          slug: string
          status?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          chave_pix?: string | null
          cidade?: string | null
          comissao_percentual?: number | null
          created_at?: string | null
          email?: string
          estado?: string | null
          id?: string
          instagram?: string | null
          nome?: string
          slug?: string
          status?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_pedido: string | null
          id: string
          numeros: string[]
          sorteio_id: string | null
          status: string
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_pedido?: string | null
          id?: string
          numeros: string[]
          sorteio_id?: string | null
          status?: string
          valor_total: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_pedido?: string | null
          id?: string
          numeros?: string[]
          sorteio_id?: string | null
          status?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_sorteio_id_fkey"
            columns: ["sorteio_id"]
            isOneToOne: false
            referencedRelation: "sorteios"
            referencedColumns: ["id"]
          },
        ]
      }
      saques_parceiros: {
        Row: {
          created_at: string | null
          data_processamento: string | null
          data_solicitacao: string | null
          id: string
          observacoes: string | null
          parceiro_id: string | null
          status: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_processamento?: string | null
          data_solicitacao?: string | null
          id?: string
          observacoes?: string | null
          parceiro_id?: string | null
          status?: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_processamento?: string | null
          data_solicitacao?: string | null
          id?: string
          observacoes?: string | null
          parceiro_id?: string | null
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "saques_parceiros_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      sorteios: {
        Row: {
          banner_url: string | null
          created_at: string | null
          data_fim: string
          descricao: string
          id: string
          preco_com_desconto: number | null
          preco_padrao: number
          quantidade_minima_desconto: number | null
          status: string
          titulo: string
          total_numeros: number
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          data_fim: string
          descricao: string
          id?: string
          preco_com_desconto?: number | null
          preco_padrao?: number
          quantidade_minima_desconto?: number | null
          status?: string
          titulo: string
          total_numeros?: number
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          data_fim?: string
          descricao?: string
          id?: string
          preco_com_desconto?: number | null
          preco_padrao?: number
          quantidade_minima_desconto?: number | null
          status?: string
          titulo?: string
          total_numeros?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      sorteios_finalizados: {
        Row: {
          created_at: string | null
          data_finalizacao: string
          ganhador_email: string
          ganhador_nome: string
          ganhador_telefone: string | null
          id: string
          numero_ganhador: string
          premio_principal_descricao: string
          premio_principal_imagem_url: string | null
          sorteio_original_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_finalizacao: string
          ganhador_email: string
          ganhador_nome: string
          ganhador_telefone?: string | null
          id?: string
          numero_ganhador: string
          premio_principal_descricao: string
          premio_principal_imagem_url?: string | null
          sorteio_original_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_finalizacao?: string
          ganhador_email?: string
          ganhador_nome?: string
          ganhador_telefone?: string | null
          id?: string
          numero_ganhador?: string
          premio_principal_descricao?: string
          premio_principal_imagem_url?: string | null
          sorteio_original_id?: string | null
        }
        Relationships: []
      }
      vendas_parceiros: {
        Row: {
          comissao_percentual: number
          comissao_valor: number
          created_at: string | null
          data_venda: string | null
          id: string
          parceiro_id: string | null
          pedido_id: string | null
          valor_venda: number
        }
        Insert: {
          comissao_percentual: number
          comissao_valor: number
          created_at?: string | null
          data_venda?: string | null
          id?: string
          parceiro_id?: string | null
          pedido_id?: string | null
          valor_venda: number
        }
        Update: {
          comissao_percentual?: number
          comissao_valor?: number
          created_at?: string | null
          data_venda?: string | null
          id?: string
          parceiro_id?: string | null
          pedido_id?: string | null
          valor_venda?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_parceiros_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_parceiros_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas_porta_porta: {
        Row: {
          cliente_nome: string
          cliente_telefone: string | null
          comissao_valor: number
          created_at: string | null
          data_venda: string | null
          id: string
          numeros: string[]
          observacoes: string | null
          parceiro_id: string | null
          status: string
          valor_total: number
        }
        Insert: {
          cliente_nome: string
          cliente_telefone?: string | null
          comissao_valor: number
          created_at?: string | null
          data_venda?: string | null
          id?: string
          numeros: string[]
          observacoes?: string | null
          parceiro_id?: string | null
          status?: string
          valor_total: number
        }
        Update: {
          cliente_nome?: string
          cliente_telefone?: string | null
          comissao_valor?: number
          created_at?: string | null
          data_venda?: string | null
          id?: string
          numeros?: string[]
          observacoes?: string | null
          parceiro_id?: string | null
          status?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_porta_porta_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
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
