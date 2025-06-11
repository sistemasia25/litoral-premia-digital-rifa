
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, MapPin } from "lucide-react";

interface PendingDoorToDoorSalesProps {
  sales?: any[];
  isLoading?: boolean;
  onSettle?: (sale: any) => void;
  onCancel?: (sale: any) => void;
}

export function PendingDoorToDoorSales({ 
  sales = [], 
  isLoading = false,
  onSettle,
  onCancel 
}: PendingDoorToDoorSalesProps) {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-slate-400 mt-2">Carregando vendas pendentes...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center p-8 text-slate-400">
        <Clock className="h-12 w-12 mx-auto mb-4 text-slate-500" />
        <p>Nenhuma venda pendente</p>
        <p className="text-sm">Suas vendas porta a porta aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <Card key={sale.id} className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">{sale.customerName}</CardTitle>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Pendente
              </Badge>
            </div>
            <CardDescription className="text-slate-300">
              {sale.customerWhatsApp} • {sale.customerCity}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-slate-400">Valor</p>
                <p className="text-xl font-bold text-white">{formatCurrency(sale.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Quantidade</p>
                <p className="text-xl font-bold text-white">{sale.quantity} números</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-400">Pagamento</p>
              <p className="text-white">{sale.paymentMethod === 'money' ? 'Dinheiro' : sale.paymentMethod}</p>
            </div>

            {sale.location && (
              <div className="mb-4 flex items-center text-sm text-slate-400">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Localização registrada</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => onSettle?.(sale)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Acertar
              </Button>
              <Button
                onClick={() => onCancel?.(sale)}
                variant="outline"
                className="flex-1 border-red-600 text-red-400 hover:bg-red-900"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
