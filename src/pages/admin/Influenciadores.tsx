
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Search, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

type Influenciador = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  codigo_referencia: string;
  percentual_comissao: number;
  saldo_disponivel: number;
  total_vendas: number;
  status: string;
  created_at: string;
};

export default function Influenciadores() {
  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([]);
  const [filteredInfluenciadores, setFilteredInfluenciadores] = useState<Influenciador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInfluenciadores();
  }, []);

  useEffect(() => {
    const filtered = influenciadores.filter(inf =>
      inf.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.codigo_referencia.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInfluenciadores(filtered);
  }, [searchTerm, influenciadores]);

  const loadInfluenciadores = async () => {
    try {
      const { data, error } = await supabase
        .from('influenciadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInfluenciadores(data || []);
    } catch (error) {
      console.error('Erro ao carregar influenciadores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: 'bg-green-500',
      inativo: 'bg-gray-500',
      suspenso: 'bg-red-500'
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
          <h1 className="text-3xl font-bold text-white">Influenciadores</h1>
          <p className="text-slate-400 mt-2">
            Gerencie todos os influenciadores da plataforma
          </p>
        </div>
        <Link to="/admin/influenciadores/novo">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Novo Influenciador
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Influenciadores</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInfluenciadores.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                {searchTerm ? 'Nenhum influenciador encontrado' : 'Nenhum influenciador cadastrado'}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm 
                  ? 'Tente buscar com outros termos.'
                  : 'Comece cadastrando seu primeiro influenciador.'
                }
              </p>
              {!searchTerm && (
                <Link to="/admin/influenciadores/novo">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Influenciador
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Nome</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Código</TableHead>
                  <TableHead className="text-slate-300">Comissão</TableHead>
                  <TableHead className="text-slate-300">Saldo</TableHead>
                  <TableHead className="text-slate-300">Total Vendas</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInfluenciadores.map((influenciador) => (
                  <TableRow key={influenciador.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">
                      {influenciador.nome}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {influenciador.email}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      {influenciador.codigo_referencia}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {influenciador.percentual_comissao}%
                    </TableCell>
                    <TableCell className="text-slate-300">
                      R$ {influenciador.saldo_disponivel.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      R$ {influenciador.total_vendas.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(influenciador.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/admin/influenciadores/${influenciador.id}`}>
                          <Button size="sm" variant="ghost">
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/influenciadores/${influenciador.id}/editar`}>
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
