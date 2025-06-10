import { Button } from '@/components/ui/button';
import { useRaffle } from '@/contexts/RaffleContext';
import { PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sorteios() {
  const raffle = useRaffle();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Gerenciamento de Sorteios</h1>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white">Sorteio Ativo</h2>
        <p className="text-gray-400 mt-2">{raffle.cards.premio.descricao}</p>
        <div className="mt-6 flex justify-end">
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/admin/sorteios/gerenciar">
              <PenSquare className="mr-2 h-4 w-4" />
              Gerenciar Sorteio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
