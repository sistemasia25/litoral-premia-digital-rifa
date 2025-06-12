
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SalesHistoryProps {
  limit?: number;
}

export function SalesHistory({ limit = 10 }: SalesHistoryProps) {
  const handleRefresh = () => {
    // Implementar refresh quando a API estiver pronta
    console.log('Refreshing sales history...');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Histórico de Vendas</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
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
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhuma venda encontrada
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="text-center py-8 text-gray-400">
        <p>Nenhuma venda registrada ainda.</p>
        <p className="text-sm">Compartilhe seu link de afiliado para começar a vender!</p>
      </div>
    </div>
  );
}
