import { Card } from "@/components/ui/card";
import { Trophy, Gift } from "lucide-react";

const PrizeNumbers = () => {
  // Dados de exemplo - 15 números premiados e 5 ganhadores
  const allPrizes = [
    { id: 1, amount: "R$ 100", number: "476907", status: "disponivel", winner: null },
    { id: 2, amount: "R$ 50", number: "184527", status: "disponivel", winner: null },
    { id: 3, amount: "R$ 100", number: "123789", status: "disponivel", winner: null },
    { id: 4, amount: "R$ 50", number: "456123", status: "disponivel", winner: null },
    { id: 5, amount: "R$ 200", number: "789456", status: "disponivel", winner: null },
    { id: 6, amount: "R$ 100", number: "321654", status: "disponivel", winner: null },
    { id: 7, amount: "R$ 50", number: "987123", status: "disponivel", winner: null },
    { id: 8, amount: "R$ 100", number: "654987", status: "disponivel", winner: null },
    { id: 9, amount: "R$ 50", number: "147258", status: "disponivel", winner: null },
    { id: 10, amount: "R$ 150", number: "369258", status: "disponivel", winner: null },
    { id: 11, amount: "R$ 75", number: "258147", status: "disponivel", winner: null },
    { id: 12, amount: "R$ 100", number: "963852", status: "disponivel", winner: null },
    { id: 13, amount: "R$ 50", number: "741852", status: "disponivel", winner: null },
    { id: 14, amount: "R$ 100", number: "852963", status: "disponivel", winner: null },
    { id: 15, amount: "R$ 50", number: "159357", status: "disponivel", winner: null },
    { 
      id: 16, 
      amount: "R$ 500", 
      number: "987416", 
      status: "premiado", 
      winner: { 
        name: "Carlos Silva", 
        city: "São Paulo/SP",
        date: "06/06/2024"
      } 
    },
    { 
      id: 17, 
      amount: "R$ 250", 
      number: "123456", 
      status: "premiado", 
      winner: { 
        name: "Ana Paula Oliveira", 
        city: "Rio de Janeiro/RJ",
        date: "05/06/2024"
      } 
    },
    { 
      id: 18, 
      amount: "R$ 100", 
      number: "456789", 
      status: "premiado", 
      winner: { 
        name: "Roberto Almeida", 
        city: "Belo Horizonte/MG",
        date: "04/06/2024"
      } 
    },
    { 
      id: 19, 
      amount: "R$ 100", 
      number: "321654", 
      status: "premiado", 
      winner: { 
        name: "Juliana Santos", 
        city: "Curitiba/PR",
        date: "03/06/2024"
      } 
    },
    { 
      id: 20, 
      amount: "R$ 50", 
      number: "789123", 
      status: "premiado", 
      winner: { 
        name: "Marcos Vinícius", 
        city: "Porto Alegre/RS",
        date: "02/06/2024"
      } 
    },
  ];

  const availablePrizes = allPrizes.filter(prize => prize.status === 'disponivel');
  const wonPrizes = allPrizes.filter(prize => prize.status === 'premiado');

  const renderAvailablePrize = (prize: any) => (
    <div key={prize.id} className="bg-gray-800/50 p-3 rounded-lg border border-orange-primary/20 hover:border-orange-primary/40 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-primary font-bold">{prize.amount}</p>
          <p className="text-gray-300 text-sm">Nº {prize.number}</p>
        </div>
        <div className="bg-orange-primary/10 text-orange-400 text-xs px-2 py-1 rounded">
          Disponível
        </div>
      </div>
    </div>
  );

  const renderWonPrize = (prize: any) => (
    <div key={prize.id} className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-yellow-400">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-400 font-bold">{prize.amount}</p>
          </div>
          <p className="text-gray-300 text-sm">Nº {prize.number}</p>
          <div className="mt-1">
            <p className="text-green-400 text-xs">{prize.winner.name}</p>
            <p className="text-gray-400 text-xs">{prize.winner.city} • {prize.winner.date}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-card border-orange-primary/20 p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">
          🎯 Números Premiados
        </h3>
        <p className="text-gray-400">
          Compre números para concorrer a prêmios instantâneos!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Números Disponíveis */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Prêmios Disponíveis</h4>
            <span className="bg-orange-primary/10 text-orange-400 text-xs px-2 py-1 rounded">
              {availablePrizes.length} prêmios
            </span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {availablePrizes.length > 0 ? (
              availablePrizes.map(prize => renderAvailablePrize(prize))
            ) : (
              <p className="text-gray-400 text-center py-4">
                Todos os prêmios foram sorteados!
              </p>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Ao comprar números, você concorre automaticamente a estes prêmios!
            </p>
          </div>
        </div>
        
        {/* Últimos Ganhadores */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Últimos Ganhadores</h4>
            <div className="flex items-center">
              <Gift className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-400 text-sm">{wonPrizes.length} premiados</span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {wonPrizes.length > 0 ? (
              wonPrizes.map(prize => renderWonPrize(prize))
            ) : (
              <p className="text-gray-400 text-center py-4">
                Nenhum ganhador ainda. Seja o primeiro!
              </p>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Você pode ser o próximo a ganhar um prêmio instantâneo!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PrizeNumbers;
