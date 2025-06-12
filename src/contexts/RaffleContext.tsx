
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Raffle = Database['public']['Tables']['raffles']['Row'];
type RafflePrize = Database['public']['Tables']['raffle_prizes']['Row'];
type WinningNumber = Database['public']['Tables']['winning_numbers']['Row'];
type Sale = Database['public']['Tables']['sales']['Row'];

export interface RaffleCard {
  titulo: string;
  descricao: string;
  rodape: string;
  icone: string;
}

export interface RafflePrices {
  precoPadrao: number;
  precoComDesconto: number;
  quantidadeMinimaDesconto: number;
}

export interface RaffleContextType {
  bannerUrl: string;
  cards: {
    premio: RaffleCard;
    desconto: RaffleCard;
    tempo: RaffleCard;
  };
  precos: RafflePrices;
  endDate: string;
  totalNumeros: number;
  numerosPremiados: WinningNumber[];
  activeRaffle: Raffle | null;
  prizes: RafflePrize[];
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
  updateRaffleData: (data: Partial<RaffleContextType>) => void;
  refreshRaffle: () => Promise<void>;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export function RaffleProvider({ children }: { children: ReactNode }) {
  const [activeRaffle, setActiveRaffle] = useState<Raffle | null>(null);
  const [prizes, setPrizes] = useState<RafflePrize[]>([]);
  const [numerosPremiados, setNumerosPremiados] = useState<WinningNumber[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRaffle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar sorteio ativo
      const { data: raffleData, error: raffleError } = await supabase
        .from('raffles')
        .select('*')
        .eq('status', 'active')
        .single();

      if (raffleError && raffleError.code !== 'PGRST116') {
        throw raffleError;
      }

      setActiveRaffle(raffleData);

      if (raffleData) {
        // Buscar prêmios do sorteio
        const { data: prizesData, error: prizesError } = await supabase
          .from('raffle_prizes')
          .select('*')
          .eq('raffle_id', raffleData.id)
          .order('position');

        if (prizesError) {
          throw prizesError;
        }

        setPrizes(prizesData || []);

        // Buscar números premiados
        const { data: winningData, error: winningError } = await supabase
          .from('winning_numbers')
          .select('*')
          .eq('raffle_id', raffleData.id);

        if (winningError) {
          throw winningError;
        }

        setNumerosPremiados(winningData || []);

        // Buscar vendas do sorteio
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .eq('raffle_id', raffleData.id);

        if (salesError) {
          throw salesError;
        }

        setSales(salesData || []);
      }
    } catch (err) {
      console.error('Erro ao carregar sorteio:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshRaffle();
  }, []);

  const updateRaffleData = (data: Partial<RaffleContextType>) => {
    console.log('Atualização de dados do sorteio:', data);
    if (data.numerosPremiados) {
      setNumerosPremiados(data.numerosPremiados);
    }
  };

  // Dados padrão - usando dados reais do banco
  const bannerUrl = activeRaffle?.image_url || "/banner-avelloz-2025.png";
  
  const cards = {
    premio: {
      titulo: "🏆 Grande Prêmio",
      descricao: prizes[0]?.title || "Aguardando sorteio",
      rodape: "Prêmio principal",
      icone: "trophy"
    },
    desconto: {
      titulo: "💰 Desconto Especial",
      descricao: `A partir de ${activeRaffle?.discount_min_quantity || 10} números`,
      rodape: `Por apenas R$ ${activeRaffle?.discount_price || 0.99}`,
      icone: "discount"
    },
    tempo: {
      titulo: "⏰ Sorteio",
      descricao: activeRaffle?.draw_date ? new Date(activeRaffle.draw_date).toLocaleDateString('pt-BR') : "Aguardando",
      rodape: "Data do sorteio",
      icone: "clock"
    }
  };

  const precos = {
    precoPadrao: activeRaffle?.price_per_number || 1.99,
    precoComDesconto: activeRaffle?.discount_price || 0.99,
    quantidadeMinimaDesconto: activeRaffle?.discount_min_quantity || 10
  };

  const endDate = activeRaffle?.draw_date || '2025-12-31T23:59:59.999Z';
  const totalNumeros = activeRaffle?.total_numbers || 10000;

  return (
    <RaffleContext.Provider value={{
      bannerUrl,
      cards,
      precos,
      endDate,
      totalNumeros,
      numerosPremiados,
      activeRaffle,
      prizes,
      sales,
      isLoading,
      error,
      updateRaffleData,
      refreshRaffle
    }}>
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
