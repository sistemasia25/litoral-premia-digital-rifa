
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Eye, Calendar, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

type Sorteio = {
  id: string;
  titulo: string;
  banner_url: string | null;
  preco_por_numero: number;
  quantidade_total_numeros: number;
  numeros_vendidos: number;
  data_sorteio: string;
  premio_principal: string;
  status: string;
  created_at: string;
};

export default function Sorteios() {
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSorteios();
  }, []);

  const loadSorteios = async () => {
    try {
      const { data, error } = await supabase
        .from('sorteios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSorteios(data || []);
    } catch (error) {
      console.error('Erro ao carregar sorteios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: 'bg-green-500',
      pausado: 'bg-yellow-500',
      finalizado: 'bg-red-500'
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Sorteios</h1>
          <p className="text-slate-400 mt-2">
            Gerencie todos os sorteios da plataforma
          </p>
        </div>
        <Link to="/admin/sorteios/novo">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Novo Sorteio
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Sorteios</CardTitle>
        </CardHeader>
        <CardContent>
          {sorteios.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                Nenhum sorteio encontrado
              </h3>
              <p className="text-slate-500 mb-6">
                Comece criando seu primeiro sorteio.
              </p>
              <Link to="/admin/sorteios/novo">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Sorteio
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Título</TableHead>
                  <TableHead className="text-slate-300">Prêmio</TableHead>
                  <TableHead className="text-slate-300">Preço</TableHead>
                  <TableHead className="text-slate-300">Números</TableHead>
                  <TableHead className="text-slate-300">Data Sorteio</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorteios.map((sorteio) => (
                  <TableRow key={sorteio.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">
                      {sorteio.titulo}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {sorteio.premio_principal}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      R$ {sorteio.preco_por_numero.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {sorteio.numeros_vendidos}/{sorteio.quantidade_total_numeros}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {format(new Date(sorteio.data_sorteio), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sorteio.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/admin/sorteios/${sorteio.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/sorteios/${sorteio.id}/editar`}>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
