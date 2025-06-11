import { useState, useEffect } from 'react';
import { usePartner } from '@/hooks/usePartner';
import { useAuth } from '@/contexts/AuthContext';
import { PartnerWithdrawal } from '@/types/partner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Wallet, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  CreditCard,
  TrendingUp,
  Calendar,
  Loader2,
  Download,
  Info
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function Withdrawals() {
  const { user } = useAuth();
  const { stats, getWithdrawalHistory, requestWithdrawal, isLoading } = usePartner();
  const { toast } = useToast();
  
  const [withdrawals, setWithdrawals] = useState<PartnerWithdrawal[]>([]);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    paymentMethod: 'pix' as 'pix' | 'bank_transfer',
    pixKey: '',
    pixKeyType: 'cpf' as 'cpf' | 'cnpj' | 'email' | 'phone' | 'random',
    bankName: '',
    bankAgency: '',
    bankAccount: '',
    bankAccountType: 'checking' as 'checking' | 'savings',
    bankAccountHolder: '',
    bankAccountDocument: '',
  });

  const loadWithdrawals = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoadingWithdrawals(true);
      const result = await getWithdrawalHistory(user.id);
      
      // Fix the type issue by handling both array and object return types
      if (Array.isArray(result)) {
        setWithdrawals(result);
      } else {
        setWithdrawals(result.withdrawals);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de saques:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de saques.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingWithdrawals(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWithdrawalForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value: 'pix' | 'bank_transfer') => {
    setWithdrawalForm(prev => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const handlePixKeyTypeChange = (value: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random') => {
    setWithdrawalForm(prev => ({
      ...prev,
      pixKeyType: value,
    }));
  };

  const handleBankAccountTypeChange = (value: 'checking' | 'savings') => {
    setWithdrawalForm(prev => ({
      ...prev,
      bankAccountType: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !stats) return;
    
    const amount = parseFloat(withdrawalForm.amount);
    
    if (amount < 50) {
      toast({
        title: 'Valor inválido',
        description: 'O valor mínimo para saque é R$ 50,00.',
        variant: 'destructive',
      });
      return;
    }
    
    if (amount > stats.availableBalance) {
      toast({
        title: 'Saldo insuficiente',
        description: 'Você não possui saldo suficiente para este saque.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const paymentDetails = withdrawalForm.paymentMethod === 'pix' 
        ? {
            pixKey: withdrawalForm.pixKey,
            pixKeyType: withdrawalForm.pixKeyType,
          }
        : {
            bankName: withdrawalForm.bankName,
            bankAgency: withdrawalForm.bankAgency,
            bankAccount: withdrawalForm.bankAccount,
            bankAccountType: withdrawalForm.bankAccountType,
            bankAccountHolder: withdrawalForm.bankAccountHolder,
            bankAccountDocument: withdrawalForm.bankAccountDocument,
          };
      
      await requestWithdrawal(amount, withdrawalForm.paymentMethod, paymentDetails);
      
      toast({
        title: 'Saque solicitado!',
        description: 'Sua solicitação de saque foi enviada e será processada em até 48 horas.',
      });
      
      setIsDialogOpen(false);
      setWithdrawalForm({
        amount: '',
        paymentMethod: 'pix',
        pixKey: '',
        pixKeyType: 'cpf',
        bankName: '',
        bankAgency: '',
        bankAccount: '',
        bankAccountType: 'checking',
        bankAccountHolder: '',
        bankAccountDocument: '',
      });
      
      // Recarregar dados
      loadWithdrawals();
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      toast({
        title: 'Erro ao solicitar saque',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'approved':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'processed':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'rejected':
      case 'failed':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'processed':
        return 'Processado';
      case 'rejected':
        return 'Rejeitado';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'processed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Saques</h2>
          <p className="text-muted-foreground">
            Gerencie suas solicitações de saque e histórico de pagamentos
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Saque
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Solicitar Saque</DialogTitle>
              <DialogDescription>
                Preencha os dados para solicitar um novo saque
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor do Saque</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    min="50"
                    max={stats.availableBalance}
                    step="0.01"
                    value={withdrawalForm.amount}
                    onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="pl-8"
                    placeholder="0,00"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Saldo disponível: {formatCurrency(stats.availableBalance)} • Mínimo: R$ 50,00
                </p>
              </div>

              <div className="space-y-2">
                <Label>Método de Pagamento</Label>
                <Select
                  value={withdrawalForm.paymentMethod}
                  onValueChange={(value: 'pix' | 'bank_transfer') =>
                    setWithdrawalForm(prev => ({ ...prev, paymentMethod: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {withdrawalForm.paymentMethod === 'pix' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Chave PIX</Label>
                    <Select
                      value={withdrawalForm.pixKeyType}
                      onValueChange={(value: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random') =>
                        setWithdrawalForm(prev => ({ ...prev, pixKeyType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="random">Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pixKey">Chave PIX</Label>
                    <Input
                      id="pixKey"
                      value={withdrawalForm.pixKey}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, pixKey: e.target.value }))}
                      placeholder={
                        withdrawalForm.pixKeyType === 'cpf' ? '000.000.000-00' :
                        withdrawalForm.pixKeyType === 'cnpj' ? '00.000.000/0000-00' :
                        withdrawalForm.pixKeyType === 'email' ? 'seu@email.com' :
                        withdrawalForm.pixKeyType === 'phone' ? '(00) 00000-0000' :
                        '00000000-0000-0000-0000-000000000000'
                      }
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Bank transfer fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Banco</Label>
                      <Input
                        id="bankName"
                        value={withdrawalForm.bankName}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, bankName: e.target.value }))}
                        placeholder="Nome do Banco"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bankAgency">Agência</Label>
                      <Input
                        id="bankAgency"
                        value={withdrawalForm.bankAgency}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, bankAgency: e.target.value }))}
                        placeholder="0000"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Conta</Label>
                      <Input
                        id="bankAccount"
                        value={withdrawalForm.bankAccount}
                        onChange={(e) => setWithdrawalForm(prev => ({ ...prev, bankAccount: e.target.value }))}
                        placeholder="00000-0"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo de Conta</Label>
                      <Select
                        value={withdrawalForm.bankAccountType}
                        onValueChange={(value: 'checking' | 'savings') =>
                          setWithdrawalForm(prev => ({ ...prev, bankAccountType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Conta Corrente</SelectItem>
                          <SelectItem value="savings">Poupança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountHolder">Titular da Conta</Label>
                    <Input
                      id="bankAccountHolder"
                      value={withdrawalForm.bankAccountHolder}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, bankAccountHolder: e.target.value }))}
                      placeholder="Nome completo do titular"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountDocument">CPF/CNPJ do Titular</Label>
                    <Input
                      id="bankAccountDocument"
                      value={withdrawalForm.bankAccountDocument}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, bankAccountDocument: e.target.value }))}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Solicitar Saque'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.availableBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponível para saque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sacado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.withdrawnAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Histórico de saques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saque Pendente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(stats.pendingWithdrawal || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Em processamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Saque</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sexta</div>
            <p className="text-xs text-muted-foreground">
              Saques processados às sextas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">Informações sobre Saques</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Valor mínimo para saque: R$ 50,00</p>
                <p>• Saques são processados às sextas-feiras</p>
                <p>• Tempo de processamento: até 48 horas</p>
                <p>• Não cobramos taxas para saques via PIX</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Saques</CardTitle>
              <CardDescription>
                Acompanhe suas solicitações de saque e pagamentos
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingWithdrawals ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : withdrawals.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">
                        {format(new Date(withdrawal.requestDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(withdrawal.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          {withdrawal.paymentMethod === 'pix' ? 'PIX' : 'Transferência'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(withdrawal.status)}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(withdrawal.status)}
                            {getStatusText(withdrawal.status)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {withdrawal.processedDate
                          ? format(new Date(withdrawal.processedDate), 'dd/MM/yyyy', { locale: ptBR })
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum saque realizado</h3>
              <p className="text-sm">Seus saques aparecerão aqui quando solicitados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
