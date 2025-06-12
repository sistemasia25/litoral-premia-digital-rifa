
import { createContext, useContext, ReactNode } from 'react';

interface Prize {
  descricao: string;
  imagem: string;
}

interface Cards {
  premio: Prize;
}

interface RaffleContextType {
  cards: Cards;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export function RaffleProvider({ children }: { children: ReactNode }) {
  const cards: Cards = {
    premio: {
      descricao: "Configure seu primeiro sorteio no painel administrativo",
      imagem: "/placeholder.svg"
    }
  };

  return (
    <RaffleContext.Provider value={{ cards }}>
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
