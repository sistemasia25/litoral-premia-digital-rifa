
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, DollarSign, TrendingUp, TrendingDown, Users, Eye, CheckCircle, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface Sale {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  total_amount: number;
  quantity: number;
  partner_name?: string;
  commission_amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  payment_method: string;
  created_at: string;
  is_door_to_door: boolean;
}

interface WithdrawalRequest {
  id: string;
  partner_id: string;
  partner_name?: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  created_at: string;
  payment_method: 'pix' | 'bank_transfer';
  payment_details: any;
}

export default function AdminFinanceiro() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Carregar vendas
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          profiles!partner_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      const formattedSales = salesData?.map(sale => ({
        id: sale.id,
        customer_name: sale.customer_name,
        customer_whatsapp: sale.customer_whatsapp,
        total_amount: sale.total_amount,
        quantity: sale.quantity,
        partner_name: sale.profiles ? `${sale.profiles.first_name} ${sale.profiles.last_name}` : 'Venda direta',
        commission_amount: sale.commission_amount || 0,
        status: sale.status,
        payment_method: sale.payment_method || 'Não informado',
        created_at: sale.created_at,
        is_door_to_door: sale.is_door_to_door
      })) || [];

      setSales(formattedSales);

      // Carregar solicitações de saque
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles!partner_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;

      const formattedWithdrawals = withdrawalsData?.map(withdrawal => ({
        id: withdrawal.id,
        partner_id: withdrawal.partner_id,
        partner_name: withdrawal.profiles ? `${withdrawal.profiles.first_name} ${withdrawal.profiles.last_name}` : 'Parceiro não encontrado',
        amount: withdrawal.amount,
        status: withdrawal.status,
        created_at: withdrawal.created_at,
        payment_method: withdrawal.payment_method,
        payment_details: withdrawal.payment_details
      })) || [];

      setWithdrawalRequests(formattedWithdrawals);

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

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ 
          status: action,
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (error) throw error;
      
      await fetchFinancialData();
      
      toast({
        title: action === 'approved' ? "Saque aprovado" : "Saque rejeitado",
        description: `Solicitação de saque ${action === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a solicitação.",
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
    sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.partner_name && sale.partner_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Cálculos de resumo
  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.status === 'completed' ? sale.total_amount : 0), 0);
  const totalCommissions = sales.reduce((acc, sale) => acc + (sale.status === 'completed' ? sale.commission_amount : 0), 0);
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Painel Financeiro</h2>
        <p className="text-gray-400">Controle completo das finanças, vendas e saques</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sales.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Comissões Pagas</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {totalCommissions.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Saques Pendentes</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingWithdrawals}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="sales" className="text-white data-[state=active]:bg-orange-600">
            Vendas ({sales.length})
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="text-white data-[state=active]:bg-orange-600">
            Saques ({withdrawalRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Vendas</CardTitle>
              <CardDescription className="text-gray-400">
                {sales.length === 0 
                  ? "Nenhuma venda registrada ainda."
                  : "Todas as vendas realizadas no sistema"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sales.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por cliente ou parceiro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>
              )}

              {sales.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Nenhuma venda registrada ainda.</p>
                </div>
              ) : (
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
                        <TableCell className="text-white">{sale.customer_name}</TableCell>
                        <TableCell className="text-gray-300">{sale.partner_name}</TableCell>
                        <TableCell className="text-gray-300">R$ {sale.total_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">R$ {sale.commission_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">
                          {sale.is_door_to_door ? 'Porta a Porta' : 'Online'}
                        </TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Solicitações de Saque</CardTitle>
              <CardDescription className="text-gray-400">
                {withdrawalRequests.length === 0 
                  ? "Nenhuma solicitação de saque ainda."
                  : "Gerencie as solicitações de saque dos parceiros"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawalRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Nenhuma solicitação de saque ainda.</p>
                </div>
              ) : (
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
                        <TableCell className="text-white">{withdrawal.partner_name}</TableCell>
                        <TableCell className="text-gray-300">R$ {withdrawal.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">
                          {withdrawal.payment_method === 'pix' ? 'PIX' : 'Transferência'}
                        </TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(withdrawal.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {withdrawal.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWithdrawalAction(withdrawal.id, 'approved')}
                                className="border-green-600 text-green-400 hover:bg-green-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWithdrawalAction(withdrawal.id, 'rejected')}
                                className="border-red-600 text-red-400 hover:bg-red-900"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
