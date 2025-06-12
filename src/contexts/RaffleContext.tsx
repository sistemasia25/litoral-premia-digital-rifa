import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { RaffleData, Pedido, SorteioFinalizado } from '@/types/raffle';

// Dados padrão do sorteio
export const defaultRaffleData: RaffleData = {
  bannerUrl: "/banner-avelloz-2025.png",
  cards: {
    premio: {
      titulo: "Prêmio Principal",
      descricao: "Avelloz 2025 0km",
      rodape: "ou R$ 90.000,00",
      icone: "gift"
    },
    desconto: {
      titulo: "Desconto Especial",
      descricao: "Combo com 25% OFF",
      rodape: "Apenas R$ 0,99",
      icone: "trending-up"
    },
    tempo: {
      titulo: "Termina em",
      descricao: "", // Este campo será calculado dinamicamente
      rodape: "Não perca essa chance!",
      icone: "clock"
    }
  },
  precos: {
    precoPadrao: 1.99,
    precoComDesconto: 0.99,
    quantidadeMinimaDesconto: 10
  },
  endDate: new Date(Date.now() + 51 * 24 * 60 * 60 * 1000).toISOString(), // Adiciona 51 dias a partir de agora
  totalNumeros: 100000, // Total de números disponíveis para o sorteio
  numerosPremiados: [
    {
      numero: "0001",
      premio: "R$ 1.000,00",
      descricao: "Prêmio em dinheiro",
      dataSorteio: new Date().toISOString(),
      ativo: true,
      status: 'premiado' as const,
      dataPremiacao: new Date().toISOString(),
      cliente: {
        nome: "João Silva",
        email: "joao@exemplo.com"
      },
      comprovanteUrl: "/comprovantes/comprovante-0001.jpg"
    },
    {
      numero: "1000",
      premio: "Smartphone",
      descricao: "Smartphone Top de Linha",
      dataSorteio: new Date().toISOString(),
      ativo: true,
      status: 'disponivel' as const,
      dataPremiacao: null,
      cliente: null
    }
  ],
  pedidos: [
    {
      id: 'pedido-teste-pago-12345',
      cliente: {
        nome: 'Cliente de Teste',
        email: 'cliente.teste@email.com',
        telefone: '11999998888',
      },
      numeros: ['12345'],
      valorTotal: 1.99,
      dataPedido: new Date().toISOString(),
      status: 'pago',
    }
  ],
  historico: []
};

type RaffleContextType = RaffleData & {
  updateRaffleData: (data: Partial<RaffleData>) => void;
};

export const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export function RaffleProvider({ children }: { children: ReactNode }) {
  const [raffleData, setRaffleData] = useState<RaffleData>(() => {
    if (typeof window === 'undefined') {
      return defaultRaffleData;
    }
    try {
      const saved = localStorage.getItem('raffleData');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Garante que todos os campos essenciais existam
        return { ...defaultRaffleData, ...parsed };
      }
    } catch (error) {
      console.error('Falha ao carregar dados do sorteio do localStorage:', error);
      // Se falhar, remove o item corrompido
      localStorage.removeItem('raffleData');
    }
    return defaultRaffleData;
  });

  // Salva no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('raffleData', JSON.stringify(raffleData));
  }, [raffleData]);

  const updateRaffleData = (data: Partial<RaffleData>) => {
    setRaffleData(prev => {
      // Cria um novo estado mesclando o anterior com os novos dados
      const newState = {
        ...prev,
        ...data,
        // Garante que objetos aninhados sejam mesclados e não substituídos
        cards: {
          ...prev.cards,
          ...(data.cards || {}),
        },
        precos: {
          ...prev.precos,
          ...(data.precos || {}),
        },
        numerosPremiados: data.numerosPremiados || prev.numerosPremiados,
        pedidos: data.pedidos || prev.pedidos,
        historico: data.historico || prev.historico,
      };
      return newState;
    });
  };

  return (
    <RaffleContext.Provider value={{ ...raffleData, updateRaffleData }}>
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
