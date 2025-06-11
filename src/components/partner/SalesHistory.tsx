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
import { PartnerSale } from '@/types/partner';

interface SalesHistoryProps {
  limit?: number;
}

export function SalesHistory({ limit = 10 }: SalesHistoryProps) {
  const { getSalesHistory, isLoading, stats } = usePartner();
  const [sales, setSales] = useState<PartnerSale[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSales = async () => {
    try {
      setIsRefreshing(true);
      // A função getSalesHistory será implementada no hook usePartner
      const data = await getSalesHistory(limit);
      setSales(data);
    } catch (error) {
      console.error('Erro ao carregar histórico de vendas:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [limit]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      completed: { label: 'Concluído', variant: 'default' },
      pending: { label: 'Pendente', variant: 'secondary' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
      refunded: { label: 'Reembolsado', variant: 'outline' },
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
        <h3 className="text-lg font-semibold">Histórico de Vendas</h3>
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
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Números</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {formatDate(sale.date)}
                  </TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.customerWhatsApp}</TableCell>
                  <TableCell>{formatCurrency(sale.amount)}</TableCell>
                  <TableCell className="text-green-400 font-medium">
                    {formatCurrency(sale.commission)}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={sale.numbers.join(', ')}>
                    {sale.numbers.length} números
                  </TableCell>
                  <TableCell>{getStatusBadge(sale.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && sales.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhuma venda registrada ainda.</p>
          <p className="text-sm">Compartilhe seu link de afiliado para começar a vender!</p>
        </div>
      )}
    </div>
  );
}
