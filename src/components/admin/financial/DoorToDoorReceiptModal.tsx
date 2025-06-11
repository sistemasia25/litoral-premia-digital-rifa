
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, User, Package } from "lucide-react";

interface DoorToDoorReceipt {
  id: string;
  partnerId: string;
  partnerName: string;
  customerName: string;
  amount: number;
  quantity: number;
  createdAt: string;
  commission: number;
}

interface DoorToDoorReceiptModalProps {
  receipt: DoorToDoorReceipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

export function DoorToDoorReceiptModal({ 
  receipt, 
  open, 
  onOpenChange, 
  onConfirm, 
  onCancel 
}: DoorToDoorReceiptModalProps) {
  if (!receipt) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Confirmar Recebimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Detalhes da Venda</CardTitle>
              <CardDescription className="text-gray-400">
                Venda porta a porta aguardando confirmação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span>Parceiro: {receipt.partnerName}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span>Cliente: {receipt.customerName}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Package className="h-4 w-4" />
                  <span>Quantidade: {receipt.quantity} números</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <DollarSign className="h-4 w-4" />
                  <span>Valor: R$ {receipt.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <DollarSign className="h-4 w-4" />
                  <span>Comissão: R$ {receipt.commission.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Data: {formatDate(receipt.createdAt)}</span>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-yellow-400 text-sm font-medium mb-2">
                  ⚠️ Confirmação de Recebimento
                </p>
                <p className="text-gray-300 text-sm">
                  Confirme que o valor de <strong>R$ {receipt.amount.toFixed(2)}</strong> foi 
                  recebido do parceiro. Ao confirmar, a comissão será creditada automaticamente.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => onConfirm(receipt.id)}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  Confirmar Recebimento
                </Button>
                <Button
                  onClick={() => onCancel(receipt.id)}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900 flex-1"
                >
                  Cancelar Venda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
