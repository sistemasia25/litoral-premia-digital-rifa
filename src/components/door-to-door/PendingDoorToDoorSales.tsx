import { useState, useEffect } from 'react';
import { usePartner } from '@/hooks/usePartner';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function PendingDoorToDoorSales() {
  const { toast } = useToast();
  const { getPendingDoorToDoorSales, settleDoorToDoorSale, cancelDoorToDoorSale } = usePartner();
  const [pendingSales, setPendingSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const loadPendingSales = async () => {
    try {
      setIsLoading(true);
      const sales = await getPendingDoorToDoorSales();
      setPendingSales(sales);
    } catch (error) {
      console.error('Erro ao carregar vendas pendentes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as vendas pendentes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingSales();
  }, []);

  const handleSettleSale = async (saleId: string) => {
    try {
      setIsProcessing(saleId);
      // Aqui você poderia abrir um modal para confirmar o valor pago
      // Por enquanto, vamos assumir que o valor total foi pago
      await settleDoorToDoorSale(saleId, 0); // O valor real deve ser obtido do usuário
      
      toast({
        title: 'Venda acertada!',
        description: 'O valor foi adicionado ao seu saldo disponível.',
      });
      
      // Atualiza a lista de vendas pendentes
      await loadPendingSales();
    } catch (error) {
      console.error('Erro ao acertar venda:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível acertar a venda.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCancelSale = async (saleId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta venda? Os números voltarão a ficar disponíveis para compra.')) {
      return;
    }

    try {
      setIsProcessing(saleId);
      await cancelDoorToDoorSale(saleId, 'Cancelado pelo vendedor');
      
      toast({
        title: 'Venda cancelada',
        description: 'A venda foi cancelada e os números estão disponíveis novamente.',
      });
      
      // Atualiza a lista de vendas pendentes
      await loadPendingSales();
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível cancelar a venda.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pendingSales.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhuma venda pendente</h3>
        <p className="text-muted-foreground mt-1">As vendas porta a porta aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Vendas Pendentes</CardTitle>
            <CardDescription>
              Vendas porta a porta que aguardam acerto financeiro
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadPendingSales} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <span>Atualizar</span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Números</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.customerName}</TableCell>
                  <TableCell>{sale.customerWhatsApp}</TableCell>
                  <TableCell>{formatCurrency(sale.amount)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {sale.numbers.slice(0, 3).map((num: string) => (
                        <Badge key={num} variant="secondary" className="text-xs">
                          {num}
                        </Badge>
                      ))}
                      {sale.numbers.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{sale.numbers.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell title={format(new Date(sale.date), 'PPpp', { locale: ptBR })}>
                    {formatDistanceToNow(new Date(sale.date), { locale: ptBR, addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handleSettleSale(sale.id)}
                      disabled={isProcessing === sale.id}
                    >
                      {isProcessing === sale.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Acertar
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handleCancelSale(sale.id)}
                      disabled={isProcessing === sale.id}
                    >
                      {isProcessing === sale.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Cancelar
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
