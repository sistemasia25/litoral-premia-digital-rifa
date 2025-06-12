import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, DollarSign, TrendingUp, TrendingDown, Users, Eye, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WithdrawalRequestModal } from "@/components/admin/financial/WithdrawalRequestModal";
import { DoorToDoorReceiptModal } from "@/components/admin/financial/DoorToDoorReceiptModal";
import { FinancialSummaryCards } from "@/components/admin/financial/FinancialSummaryCards";
import { FinancialReports } from "@/components/admin/financial/FinancialReports";

interface Sale {
  id: string;
  customerName: string;
  customerWhatsApp: string;
  amount: number;
  quantity: number;
  partnerName: string;
  partnerCommission: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  type: 'online' | 'door_to_door';
}

interface WithdrawalRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestDate: string;
  paymentMethod: 'pix' | 'bank_transfer';
  paymentDetails: any;
}

interface DoorToDoorPendingReceipt {
  id: string;
  partnerId: string;
  partnerName: string;
  customerName: string;
  amount: number;
  quantity: number;
  createdAt: string;
  commission: number;
}

export default function AdminFinanceiro() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [pendingReceipts, setPendingReceipts] = useState<DoorToDoorPendingReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<DoorToDoorPendingReceipt | null>(null);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Simulação de dados - aqui seria uma chamada real para a API
      const mockSales: Sale[] = [
        {
          id: '1',
          customerName: 'João Silva',
          customerWhatsApp: '(11) 99999-9999',
          amount: 199.99,
          quantity: 10,
          partnerName: 'Maria Santos',
          partnerCommission: 39.99,
          status: 'completed',
          paymentMethod: 'PIX',
          createdAt: '2024-06-10T10:30:00Z',
          type: 'online'
        },
        {
          id: '2',
          customerName: 'Ana Costa',
          customerWhatsApp: '(21) 88888-8888',
          amount: 99.99,
          quantity: 5,
          partnerName: 'Carlos Oliveira',
          partnerCommission: 19.99,
          status: 'pending',
          paymentMethod: 'Dinheiro',
          createdAt: '2024-06-10T14:20:00Z',
          type: 'door_to_door'
        }
      ];

      const mockWithdrawals: WithdrawalRequest[] = [
        {
          id: '1',
          partnerId: '1',
          partnerName: 'Maria Santos',
          amount: 500.00,
          status: 'pending',
          requestDate: '2024-06-10T09:00:00Z',
          paymentMethod: 'pix',
          paymentDetails: { pixKey: 'maria@email.com', pixKeyType: 'email' }
        }
      ];

      const mockPendingReceipts: DoorToDoorPendingReceipt[] = [
        {
          id: '1',
          partnerId: '2',
          partnerName: 'Carlos Oliveira',
          customerName: 'Ana Costa',
          amount: 99.99,
          quantity: 5,
          createdAt: '2024-06-10T14:20:00Z',
          commission: 19.99
        }
      ];

      setSales(mockSales);
      setWithdrawalRequests(mockWithdrawals);
      setPendingReceipts(mockPendingReceipts);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados financeiros.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      // Aqui seria uma chamada real para a API
      setWithdrawalRequests(prev => prev.map(w => 
        w.id === withdrawalId ? { ...w, status: action === 'approve' ? 'approved' : 'rejected' } : w
      ));
      
      toast({
        title: action === 'approve' ? "Saque aprovado" : "Saque rejeitado",
        description: `Solicitação de saque ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a solicitação.",
        variant: "destructive"
      });
    }
  };

  const handleReceiptConfirmation = async (receiptId: string, received: boolean) => {
    try {
      // Aqui seria uma chamada real para a API
      if (received) {
        // Move para vendas confirmadas
        const receipt = pendingReceipts.find(r => r.id === receiptId);
        if (receipt) {
          const newSale: Sale = {
            id: `sale_${receiptId}`,
            customerName: receipt.customerName,
            customerWhatsApp: '',
            amount: receipt.amount,
            quantity: receipt.quantity,
            partnerName: receipt.partnerName,
            partnerCommission: receipt.commission,
            status: 'completed',
            paymentMethod: 'Dinheiro',
            createdAt: receipt.createdAt,
            type: 'door_to_door'
          };
          setSales(prev => [newSale, ...prev]);
        }
      }
      
      setPendingReceipts(prev => prev.filter(r => r.id !== receiptId));
      
      toast({
        title: received ? "Recebimento confirmado" : "Venda cancelada",
        description: received ? "O valor foi adicionado ao sistema." : "A venda foi cancelada."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a ação.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <Badge className="bg-green-600">Concluído</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case 'cancelled':
      case 'rejected':
        return <Badge className="bg-red-600">Cancelado</Badge>;
      case 'processed':
        return <Badge className="bg-blue-600">Processado</Badge>;
      default:
        return <Badge className="bg-gray-600">Desconhecido</Badge>;
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Painel Financeiro</h2>
        <p className="text-gray-400">Controle completo das finanças, vendas e saques</p>
      </div>

      <FinancialSummaryCards 
        sales={sales}
        withdrawalRequests={withdrawalRequests}
        pendingReceipts={pendingReceipts}
      />

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="sales" className="text-white data-[state=active]:bg-orange-600">
            Vendas
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="text-white data-[state=active]:bg-orange-600">
            Saques
          </TabsTrigger>
          <TabsTrigger value="receipts" className="text-white data-[state=active]:bg-orange-600">
            Recebimentos
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-white data-[state=active]:bg-orange-600">
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Vendas</CardTitle>
              <CardDescription className="text-gray-400">
                Todas as vendas realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente ou parceiro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Parceiro</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Comissão</TableHead>
                    <TableHead className="text-gray-300">Tipo</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="border-slate-700">
                      <TableCell className="text-white">{sale.customerName}</TableCell>
                      <TableCell className="text-gray-300">{sale.partnerName}</TableCell>
                      <TableCell className="text-gray-300">R$ {sale.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">R$ {sale.partnerCommission.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">
                        {sale.type === 'online' ? 'Online' : 'Porta a Porta'}
                      </TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Solicitações de Saque</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie as solicitações de saque dos parceiros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Parceiro</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Método</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalRequests.map((withdrawal) => (
                    <TableRow key={withdrawal.id} className="border-slate-700">
                      <TableCell className="text-white">{withdrawal.partnerName}</TableCell>
                      <TableCell className="text-gray-300">R$ {withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">
                        {withdrawal.paymentMethod === 'pix' ? 'PIX' : 'Transferência'}
                      </TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(withdrawal.requestDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setWithdrawalModalOpen(true);
                            }}
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {withdrawal.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWithdrawalAction(withdrawal.id, 'approve')}
                                className="border-green-600 text-green-400 hover:bg-green-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWithdrawalAction(withdrawal.id, 'reject')}
                                className="border-red-600 text-red-400 hover:bg-red-900"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recebimentos Porta a Porta</CardTitle>
              <CardDescription className="text-gray-400">
                Confirme o recebimento de vendas porta a porta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Parceiro</TableHead>
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Comissão</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReceipts.map((receipt) => (
                    <TableRow key={receipt.id} className="border-slate-700">
                      <TableCell className="text-white">{receipt.partnerName}</TableCell>
                      <TableCell className="text-gray-300">{receipt.customerName}</TableCell>
                      <TableCell className="text-gray-300">R$ {receipt.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">R$ {receipt.commission.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(receipt.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReceipt(receipt);
                              setReceiptModalOpen(true);
                            }}
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReceiptConfirmation(receipt.id, true)}
                            className="border-green-600 text-green-400 hover:bg-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReceiptConfirmation(receipt.id, false)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <FinancialReports 
            sales={sales}
            withdrawalRequests={withdrawalRequests}
            pendingReceipts={pendingReceipts}
          />
        </TabsContent>
      </Tabs>

      <WithdrawalRequestModal
        withdrawal={selectedWithdrawal}
        open={withdrawalModalOpen}
        onOpenChange={setWithdrawalModalOpen}
        onApprove={(id) => handleWithdrawalAction(id, 'approve')}
        onReject={(id, reason) => handleWithdrawalAction(id, 'reject', reason)}
      />

      <DoorToDoorReceiptModal
        receipt={selectedReceipt}
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        onConfirm={(id) => handleReceiptConfirmation(id, true)}
        onCancel={(id) => handleReceiptConfirmation(id, false)}
      />
    </div>
  );
}
