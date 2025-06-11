
import { useState, useEffect } from 'react';
import { usePartner } from '@/hooks/usePartner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface SalesHistoryProps {
  partnerId: string;
  limit?: number;
}

export function SalesHistory({ partnerId, limit = 10 }: SalesHistoryProps) {
  const { getDoorToDoorSales, isLoading } = usePartner();
  const [sales, setSales] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSales = async () => {
    try {
      setIsRefreshing(true);
      const data = await getDoorToDoorSales(partnerId, limit);
      setSales(data);
    } catch (error) {
      console.error('Erro ao carregar histórico de vendas:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [partnerId, limit]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      settled: { label: 'Acertado', variant: 'default' },
      pending: { label: 'Pendente', variant: 'secondary' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Histórico de Vendas Porta a Porta</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadSales}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="rounded-md border border-slate-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-slate-300">Data</TableHead>
              <TableHead className="text-slate-300">Cliente</TableHead>
              <TableHead className="text-slate-300">WhatsApp</TableHead>
              <TableHead className="text-slate-300">Valor</TableHead>
              <TableHead className="text-slate-300">Quantidade</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id} className="border-slate-700">
                  <TableCell className="font-medium text-white">
                    {formatDate(sale.createdAt)}
                  </TableCell>
                  <TableCell className="text-slate-300">{sale.customerName}</TableCell>
                  <TableCell className="text-slate-300">{sale.customerWhatsApp}</TableCell>
                  <TableCell className="text-slate-300">{formatCurrency(sale.amount)}</TableCell>
                  <TableCell className="text-slate-300">{sale.quantity} números</TableCell>
                  <TableCell>{getStatusBadge(sale.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && sales.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Nenhuma venda porta a porta registrada ainda.</p>
          <p className="text-sm">Registre suas primeiras vendas para começar!</p>
        </div>
      )}
    </div>
  );
}
