
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSorteios, Sorteio } from '@/hooks/useSorteios';

// Estrutura para compatibilidade com o código existente
export interface RaffleData {
  bannerUrl: string;
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
  endDate: string;
  totalNumeros: number;
}

type RaffleContextType = RaffleData & {
  updateRaffleData: (data: Partial<RaffleData>) => void;
  sorteioOriginal?: Sorteio | null;
  loading: boolean;
};

export const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

// Função para converter dados do banco para o formato esperado
const convertSorteioToRaffleData = (sorteio: Sorteio | null): RaffleData => {
  if (!sorteio) {
    return {
      bannerUrl: "/banner-avelloz-2025.png",
      cards: {
        premio: {
          titulo: "Prêmio Principal",
          descricao: "Sem sorteio ativo",
          rodape: "",
          icone: "gift"
        },
        desconto: {
          titulo: "Desconto Especial",
          descricao: "Sem promoção",
          rodape: "",
          icone: "trending-up"
        },
        tempo: {
          titulo: "Termina em",
          descricao: "Sem sorteio",
          rodape: "",
          icone: "clock"
        }
      },
      precos: {
        precoPadrao: 1.99,
        precoComDesconto: 0.99,
        quantidadeMinimaDesconto: 10
      },
      endDate: new Date().toISOString(),
      totalNumeros: 100000,
    };
  }

  return {
    bannerUrl: sorteio.banner_url || "/banner-avelloz-2025.png",
    cards: {
      premio: {
        titulo: "Prêmio Principal",
        descricao: sorteio.descricao,
        rodape: `Total: ${sorteio.total_numeros.toLocaleString()} números`,
        icone: "gift"
      },
      desconto: {
        titulo: "Desconto Especial",
        descricao: `Combo com ${Math.round(((sorteio.preco_padrao - sorteio.preco_com_desconto) / sorteio.preco_padrao) * 100)}% OFF`,
        rodape: `Apenas R$ ${sorteio.preco_com_desconto.toFixed(2)}`,
        icone: "trending-up"
      },
      tempo: {
        titulo: "Termina em",
        descricao: "", // Será calculado dinamicamente no componente
        rodape: "Não perca essa chance!",
        icone: "clock"
      }
    },
    precos: {
      precoPadrao: sorteio.preco_padrao,
      precoComDesconto: sorteio.preco_com_desconto,
      quantidadeMinimaDesconto: sorteio.quantidade_minima_desconto
    },
    endDate: sorteio.data_fim,
    totalNumeros: sorteio.total_numeros,
  };
};

export function RaffleProvider({ children }: { children: ReactNode }) {
  const { sorteioAtivo, loading, atualizarSorteio } = useSorteios();
  const [raffleData, setRaffleData] = useState<RaffleData>(() => convertSorteioToRaffleData(null));

  // Atualizar dados quando o sorteio ativo mudar
  useEffect(() => {
    const newData = convertSorteioToRaffleData(sorteioAtivo);
    setRaffleData(newData);
  }, [sorteioAtivo]);

  const updateRaffleData = async (data: Partial<RaffleData>) => {
    if (!sorteioAtivo) return;

    try {
      // Converter dados do formato RaffleData para o formato do banco
      const updateData: Partial<Sorteio> = {};
      
      if (data.bannerUrl) updateData.banner_url = data.bannerUrl;
      if (data.cards?.premio?.descricao) updateData.descricao = data.cards.premio.descricao;
      if (data.precos?.precoPadrao) updateData.preco_padrao = data.precos.precoPadrao;
      if (data.precos?.precoComDesconto) updateData.preco_com_desconto = data.precos.precoComDesconto;
      if (data.precos?.quantidadeMinimaDesconto) updateData.quantidade_minima_desconto = data.precos.quantidadeMinimaDesconto;
      if (data.endDate) updateData.data_fim = data.endDate;
      if (data.totalNumeros) updateData.total_numeros = data.totalNumeros;

      await atualizarSorteio(sorteioAtivo.id, updateData);
    } catch (error) {
      console.error('Erro ao atualizar sorteio:', error);
    }
  };

  return (
    <RaffleContext.Provider value={{ 
      ...raffleData, 
      updateRaffleData,
      sorteioOriginal: sorteioAtivo,
      loading
    }}>
      {children}
    </RaffleContext.Provider>
  );
}

export const useRaffle = (): RaffleContextType => {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
};

export type { RaffleContextType };
