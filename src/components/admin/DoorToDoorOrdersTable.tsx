
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoorToDoorOrder {
  id: string;
  partnerId: string;
  partnerName: string;
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  amount: number;
  quantity: number;
  status: 'pending' | 'received' | 'cancelled';
  createdAt: string;
  agentName: string;
}

interface DoorToDoorOrdersTableProps {
  orders: DoorToDoorOrder[];
  onOrderUpdate: () => void;
}

export function DoorToDoorOrdersTable({ orders, onOrderUpdate }: DoorToDoorOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<DoorToDoorOrder | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'cancel'>('approve');
  const [cancellationReason, setCancellationReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case 'received':
        return <Badge className="bg-green-600">Recebido</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-600">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAction = (order: DoorToDoorOrder, type: 'approve' | 'cancel') => {
    setSelectedOrder(order);
    setActionType(type);
    setActionDialogOpen(true);
    setCancellationReason('');
  };

  const confirmAction = async () => {
    if (!selectedOrder) return;

    if (actionType === 'cancel' && !cancellationReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo do cancelamento.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      // Aqui seria uma chamada real para a API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API

      const newStatus = actionType === 'approve' ? 'received' : 'cancelled';
      
      toast({
        title: `Pedido ${newStatus === 'received' ? 'aprovado' : 'cancelado'}`,
        description: `O pedido foi ${newStatus === 'received' ? 'marcado como recebido' : 'cancelado'} com sucesso.`
      });

      setActionDialogOpen(false);
      onOrderUpdate(); // Atualiza a lista
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Não foi possível processar o pedido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processedOrders = orders.filter(order => order.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pedidos Pendentes */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Pedidos Pendentes</CardTitle>
          <CardDescription className="text-gray-400">
            Pedidos porta a porta aguardando confirmação ({pendingOrders.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum pedido pendente no momento</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Parceiro</TableHead>
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">WhatsApp</TableHead>
                  <TableHead className="text-gray-300">Cidade</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Qtd</TableHead>
                  <TableHead className="text-gray-300">Data</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-700">
                    <TableCell className="text-white">{order.partnerName}</TableCell>
                    <TableCell className="text-gray-300">{order.customerName}</TableCell>
                    <TableCell className="text-gray-300">{order.customerWhatsApp}</TableCell>
                    <TableCell className="text-gray-300">{order.customerCity}</TableCell>
                    <TableCell className="text-gray-300">R$ {order.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-300">{order.quantity}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(order, 'approve')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(order, 'cancel')}
                          className="border-red-600 text-red-400 hover:bg-red-900"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Pedidos */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Histórico de Pedidos</CardTitle>
          <CardDescription className="text-gray-400">
            Pedidos processados ({processedOrders.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processedOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum pedido processado ainda</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Parceiro</TableHead>
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-700">
                    <TableCell className="text-white">{order.partnerName}</TableCell>
                    <TableCell className="text-gray-300">{order.customerName}</TableCell>
                    <TableCell className="text-gray-300">R$ {order.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmação */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionType === 'approve' ? 'Confirmar Recebimento' : 'Cancelar Pedido'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {actionType === 'approve' 
                ? 'Confirme que o pagamento foi recebido e o pedido deve ser processado.'
                : 'Informe o motivo do cancelamento do pedido.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedOrder && (
              <div className="bg-slate-800 p-4 rounded-lg space-y-2">
                <p className="text-white"><strong>Cliente:</strong> {selectedOrder.customerName}</p>
                <p className="text-gray-300"><strong>Valor:</strong> R$ {selectedOrder.amount.toFixed(2)}</p>
                <p className="text-gray-300"><strong>Quantidade:</strong> {selectedOrder.quantity} números</p>
                <p className="text-gray-300"><strong>Parceiro:</strong> {selectedOrder.partnerName}</p>
              </div>
            )}

            {actionType === 'cancel' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Motivo do cancelamento*
                </label>
                <Textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Informe o motivo do cancelamento..."
                  className="bg-slate-800 border-slate-600 text-white"
                  rows={3}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
                disabled={processing}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmAction}
                disabled={processing}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {processing ? 'Processando...' : 
                 actionType === 'approve' ? 'Confirmar Recebimento' : 'Cancelar Pedido'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
