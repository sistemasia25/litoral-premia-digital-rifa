
import { Card } from "@/components/ui/card";
import { Trophy, Gift, Award } from "lucide-react";
import { useRaffle } from "@/contexts/RaffleContext";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PrizeNumbers = () => {
  const { numerosPremiados = [], prizes = [] } = useRaffle();
  
  // Como a estrutura mudou, vamos adaptar os dados
  // Números disponíveis são os que não têm ganhador
  const availablePrizes = numerosPremiados
    .filter(num => !num.winner_profile_id)
    .map((prize, index) => {
      const prizeInfo = prizes.find(p => p.id === prize.prize_id);
      return {
        id: `premio-${prize.number}-${index}`,
        amount: prizeInfo?.title || 'Prêmio',
        number: prize.number.toString(),
        status: 'disponivel' as const,
        winner: null,
        descricao: prizeInfo?.description || 'Prêmio instantâneo'
      };
    });
    
  // Números premiados são os que têm ganhador
  const wonPrizes = numerosPremiados
    .filter(prize => prize.winner_profile_id && prize.claimed_at)
    .sort((a, b) => new Date(b.claimed_at || 0).getTime() - new Date(a.claimed_at || 0).getTime())
    .map((prize, index) => {
      const prizeInfo = prizes.find(p => p.id === prize.prize_id);
      return {
        id: `ganhador-${index}`,
        amount: prizeInfo?.title || 'Prêmio',
        number: prize.number.toString(),
        status: 'premiado' as const,
        descricao: prizeInfo?.description || 'Prêmio instantâneo',
        winner: {
          name: 'Ganhador', // Seria necessário fazer join com profiles para pegar o nome
          city: "",
          date: prize.claimed_at 
            ? format(new Date(prize.claimed_at), "dd/MM/yyyy", { locale: ptBR })
            : "Data não disponível"
        }
      };
    });
  
  // Se não houver prêmios, não exibe a seção
  if (availablePrizes.length === 0 && wonPrizes.length === 0) {
    return null;
  }

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
