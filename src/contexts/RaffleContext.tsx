
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Estrutura principal de dados do sorteio
export interface RaffleData {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  total_numbers: number;
  price_per_number: number;
  discount_price: number;
  discount_min_quantity: number;
  commission_rate: number;
  draw_date: string | null;
  status: 'active' | 'finished' | 'cancelled';
  rules: string;
  created_at?: string;
  updated_at?: string;
}

// Contexto do Sorteio
export interface RaffleContextType {
  raffle: RaffleData | null;
  isLoading: boolean;
  error: string | null;
  refreshRaffle: () => Promise<void>;
  updateRaffle: (data: Partial<RaffleData>) => Promise<void>;
  
  // Propriedades para compatibilidade com componentes existentes
  bannerUrl: string;
  endDate: string;
  cards: {
    premio: {
      titulo: string;
      descricao: string;
      rodape: string;
      icone: string;
    };
    desconto: {
      titulo: string;
      descricao: string;
      rodape: string;
      icone: string;
    };
    tempo: {
      titulo: string;
      descricao: string;
      rodape: string;
      icone: string;
    };
  };
  precos: {
    precoPadrao: number;
    precoComDesconto: number;
    quantidadeMinimaDesconto: number;
  };
  totalNumeros: number;
  numerosPremiados: any[];
  sales: any[];
  prizes: any[];
  activeRaffle: RaffleData | null;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export function RaffleProvider({ children }: { children: ReactNode }) {
  const [raffle, setRaffle] = useState<RaffleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRaffle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setRaffle(data);
    } catch (err: any) {
      console.error('Erro ao carregar sorteio:', err);
      setError(err.message || 'Erro ao carregar sorteio');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRaffle = async (data: Partial<RaffleData>) => {
    if (!raffle?.id) {
      throw new Error('Nenhum sorteio ativo encontrado');
    }
    
    try {
      const { error } = await supabase
        .from('raffles')
        .update(data)
        .eq('id', raffle.id);

      if (error) throw error;
      
      setRaffle(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      console.error('Erro ao atualizar sorteio:', err);
      throw new Error(err.message || 'Erro ao atualizar sorteio');
    }
  };

  // Carregar sorteio apenas na inicialização
  useEffect(() => {
    let mounted = true;
    
    const loadRaffle = async () => {
      if (mounted) {
        await refreshRaffle();
      }
    };
    
    loadRaffle();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Propriedades calculadas para compatibilidade
  const bannerUrl = raffle?.image_url || '/banner-avelloz-2025.png';
  const endDate = raffle?.draw_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const cards = {
    premio: {
      titulo: "🏆 PRÊMIO PRINCIPAL",
      descricao: raffle?.title || "Grande Sorteio",
      rodape: "Sorteio transparente e confiável",
      icone: "🎯"
    },
    desconto: {
      titulo: "💰 DESCONTO ESPECIAL",
      descricao: `A partir de ${raffle?.discount_min_quantity || 10} números`,
      rodape: `Por apenas R$ ${raffle?.discount_price || 0.99} cada`,
      icone: "🔥"
    },
    tempo: {
      titulo: "⏰ ÚLTIMOS DIAS",
      descricao: "Não perca esta oportunidade",
      rodape: "Garante já seus números da sorte!",
      icone: "⚡"
    }
  };

  const precos = {
    precoPadrao: raffle?.price_per_number || 1.99,
    precoComDesconto: raffle?.discount_price || 0.99,
    quantidadeMinimaDesconto: raffle?.discount_min_quantity || 10
  };

  const contextValue: RaffleContextType = {
    raffle,
    isLoading,
    error,
    refreshRaffle,
    updateRaffle,
    bannerUrl,
    endDate,
    cards,
    precos,
    totalNumeros: raffle?.total_numbers || 10000,
    numerosPremiados: [],
    sales: [],
    prizes: [],
    activeRaffle: raffle
  };

  return (
    <RaffleContext.Provider value={contextValue}>
      {children}
    </RaffleContext.Provider>
  );
}

export function useRaffle() {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
}
