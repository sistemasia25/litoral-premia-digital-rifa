
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Prize {
  descricao: string;
  imagem: string;
  icone: string;
  titulo: string;
  rodape: string;
}

interface Cards {
  premio: Prize;
  desconto: Prize;
  tempo: Prize;
}

interface RaffleContextType {
  cards: Cards;
  precos: {
    precoPadrao: number;
    precoComDesconto: number;
    quantidadeMinimaDesconto: number;
  };
  bannerUrl: string;
  endDate: string;
  totalNumeros: number;
  numerosPremiados: any[];
  sales: any[];
  prizes: any[];
  activeRaffle: any;
  refreshRaffle: () => Promise<void>;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export function RaffleProvider({ children }: { children: ReactNode }) {
  const [activeRaffle, setActiveRaffle] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [numerosPremiados, setNumerosPremiados] = useState<any[]>([]);
  const [prizes, setPrizes] = useState<any[]>([]);

  const loadRaffleData = async () => {
    try {
      // Carregar sorteio ativo
      const { data: raffle } = await supabase
        .from('raffles')
        .select('*')
        .eq('status', 'active')
        .single();

      if (raffle) {
        setActiveRaffle(raffle);

        // Carregar vendas
        const { data: salesData } = await supabase
          .from('sales')
          .select('*')
          .eq('raffle_id', raffle.id);

        setSales(salesData || []);

        // Carregar números premiados
        const { data: winningNumbers } = await supabase
          .from('winning_numbers')
          .select('*')
          .eq('raffle_id', raffle.id);

        setNumerosPremiados(winningNumbers || []);

        // Carregar prêmios
        const { data: prizesData } = await supabase
          .from('raffle_prizes')
          .select('*')
          .eq('raffle_id', raffle.id);

        setPrizes(prizesData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do sorteio:', error);
    }
  };

  useEffect(() => {
    loadRaffleData();
  }, []);

  const refreshRaffle = async () => {
    await loadRaffleData();
  };

  // Dados padrão quando não há sorteio ativo
  const defaultCards: Cards = {
    premio: {
      descricao: activeRaffle?.title || "Configure seu primeiro sorteio no painel administrativo",
      imagem: activeRaffle?.image_url || "/placeholder.svg",
      icone: "gift",
      titulo: "Prêmio Principal",
      rodape: "Sorteio ao vivo"
    },
    desconto: {
      descricao: activeRaffle ? `${((1 - (activeRaffle.discount_price / activeRaffle.price_per_number)) * 100).toFixed(0)}% OFF` : "Configure desconto",
      imagem: "/placeholder.svg",
      icone: "trending-up",
      titulo: "Desconto Combo",
      rodape: `${activeRaffle?.discount_min_quantity || 10}+ números`
    },
    tempo: {
      descricao: "Tempo restante",
      imagem: "/placeholder.svg",
      icone: "clock",
      titulo: "Tempo Restante",
      rodape: "Até o sorteio"
    }
  };

  const contextValue: RaffleContextType = {
    cards: defaultCards,
    precos: {
      precoPadrao: activeRaffle?.price_per_number || 1.99,
      precoComDesconto: activeRaffle?.discount_price || 0.99,
      quantidadeMinimaDesconto: activeRaffle?.discount_min_quantity || 10
    },
    bannerUrl: activeRaffle?.image_url || "/placeholder.svg",
    endDate: activeRaffle?.draw_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalNumeros: activeRaffle?.total_numbers || 10000,
    numerosPremiados,
    sales,
    prizes,
    activeRaffle,
    refreshRaffle
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
