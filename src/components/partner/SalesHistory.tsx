
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Sale {
  id: string;
  data_venda: string;
  valor_venda: number;
  comissao_valor: number;
  cliente_nome?: string;
  cliente_telefone?: string;
}

interface SalesHistoryProps {
  limit?: number;
}

export function SalesHistory({ limit = 10 }: SalesHistoryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSales = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Buscar vendas de parceiros
      const { data: vendasParceiros, error: errorParceiros } = await supabase
        .from('vendas_parceiros')
        .select(`
          id,
          data_venda,
          valor_venda,
          comissao_valor,
          pedido_id
        `)
        .eq('parceiro_id', user.id)
        .order('data_venda', { ascending: false })
        .limit(limit);

      if (errorParceiros) throw errorParceiros;

      // Buscar vendas porta a porta
      const { data: vendasPortaPorta, error: errorPortaPorta } = await supabase
        .from('vendas_porta_porta')
        .select(`
          id,
          data_venda,
          valor_total,
          comissao_valor,
          cliente_nome,
          cliente_telefone
        `)
        .eq('parceiro_id', user.id)
        .eq('status', 'confirmada')
        .order('data_venda', { ascending: false })
        .limit(limit);

      if (errorPortaPorta) throw errorPortaPorta;

      // Combinar e formatar os dados
      const salesData: Sale[] = [
        ...(vendasParceiros?.map(venda => ({
          id: venda.id,
          data_venda: venda.data_venda,
          valor_venda: venda.valor_venda,
          comissao_valor: venda.comissao_valor,
          cliente_nome: 'Cliente Online',
          cliente_telefone: '-'
        })) || []),
        ...(vendasPortaPorta?.map(venda => ({
          id: venda.id,
          data_venda: venda.data_venda,
          valor_venda: venda.valor_total,
          comissao_valor: venda.comissao_valor,
          cliente_nome: venda.cliente_nome,
          cliente_telefone: venda.cliente_telefone || '-'
        })) || [])
      ];

      // Ordenar por data
      salesData.sort((a, b) => new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime());

      setSales(salesData.slice(0, limit));
    } catch (error: any) {
      console.error('Erro ao carregar vendas:', error);
      toast({
        title: "Erro ao carregar vendas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [user?.id, limit]);

  const handleRefresh = () => {
    loadSales();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Histórico de Vendas</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="rounded-md border border-slate-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{formatDate(sale.data_venda)}</TableCell>
                  <TableCell>{sale.cliente_nome}</TableCell>
                  <TableCell>{sale.cliente_telefone}</TableCell>
                  <TableCell>{formatCurrency(sale.valor_venda)}</TableCell>
                  <TableCell className="text-green-400">{formatCurrency(sale.comissao_valor)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Confirmada
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {sales.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhuma venda registrada ainda.</p>
          <p className="text-sm">Compartilhe seu link de afiliado para começar a vender!</p>
        </div>
      )}
    </div>
  );
}
