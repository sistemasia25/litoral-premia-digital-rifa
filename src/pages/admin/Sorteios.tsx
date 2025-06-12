
import { Button } from '@/components/ui/button';
import { useSorteios } from '@/hooks/useSorteios';
import { PenSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sorteios() {
  const { sorteioAtivo, loading } = useSorteios();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Gerenciamento de Sorteios</h1>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link to="/admin/sorteios/gerenciar">
            <Plus className="mr-2 h-4 w-4" />
            {sorteioAtivo ? 'Gerenciar Sorteio' : 'Criar Sorteio'}
          </Link>
        </Button>
      </div>

      {sorteioAtivo ? (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{sorteioAtivo.titulo}</h2>
              <p className="text-gray-400 mt-2">{sorteioAtivo.descricao}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-300">
                <p><span className="font-medium">Preço:</span> R$ {sorteioAtivo.preco_padrao.toFixed(2)}</p>
                {sorteioAtivo.quantidade_minima_desconto > 0 && (
                  <p><span className="font-medium">Promoção:</span> {sorteioAtivo.quantidade_minima_desconto}+ números por R$ {sorteioAtivo.preco_com_desconto.toFixed(2)} cada</p>
                )}
                <p><span className="font-medium">Total de números:</span> {sorteioAtivo.total_numeros.toLocaleString()}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    sorteioAtivo.status === 'ativo' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {sorteioAtivo.status}
                  </span>
                </p>
              </div>
            </div>
            {sorteioAtivo.banner_url && (
              <img 
                src={sorteioAtivo.banner_url} 
                alt="Banner do sorteio" 
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link to="/admin/sorteios/gerenciar">
                <PenSquare className="mr-2 h-4 w-4" />
                Editar Sorteio
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Nenhum sorteio ativo</h2>
          <p className="text-gray-400 mb-6">Crie um novo sorteio para começar a vender números.</p>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/admin/sorteios/gerenciar">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Sorteio
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
