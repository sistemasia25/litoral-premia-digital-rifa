import { useState, useEffect } from 'react';
import { usePartner } from '@/hooks/usePartner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Wallet, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { PartnerWithdrawal } from '@/types/partner';

export function Withdrawals() {
  const { stats, requestWithdrawal, getWithdrawalHistory, isLoading } = usePartner();
  const [withdrawals, setWithdrawals] = useState<PartnerWithdrawal[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'bank_transfer'>('pix');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'cpf' | 'email' | 'phone' | 'random'>('cpf');
  const { toast } = useToast();

  const loadWithdrawals = async () => {
    try {
      setIsRefreshing(true);
      const data = await getWithdrawalHistory(5); // Últimos 5 saques
      setWithdrawals(data);
    } catch (error) {
      console.error('Erro ao carregar histórico de saques:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de saques. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

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
      pending: { label: 'Pendente', variant: 'secondary' },
      approved: { label: 'Aprovado', variant: 'default' },
      processed: { label: 'Processado', variant: 'default' },
      rejected: { label: 'Rejeitado', variant: 'destructive' },
      failed: { label: 'Falhou', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) {
      toast({
        title: 'Erro',
        description: 'Por favor, informe o valor do saque.',
        variant: 'destructive',
      });
      return;
    }

    const amountValue = parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.'));
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor válido para saque.',
        variant: 'destructive',
      });
      return;
    }

    if (!stats || amountValue > stats.availableBalance) {
      toast({
        title: 'Saldo insuficiente',
        description: `Seu saldo disponível é de ${formatCurrency(stats?.availableBalance || 0)}`,
        variant: 'destructive',
      });
      return;
    }

    if (paymentMethod === 'pix' && !pixKey) {
      toast({
        title: 'Chave PIX obrigatória',
        description: 'Por favor, informe sua chave PIX para continuar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const paymentDetails = paymentMethod === 'pix' 
        ? { pixKey, keyType: pixKeyType }
        : {}; // Adicionar detalhes de transferência bancária se necessário
      
      await requestWithdrawal(amountValue, paymentMethod, paymentDetails);
      
      toast({
        title: 'Solicitação enviada!',
        description: 'Sua solicitação de saque foi enviada com sucesso e está em análise.',
      });
      
      // Limpar formulário
      setAmount('');
      setPixKey('');
      
      // Atualizar histórico
      await loadWithdrawals();
      
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

  const formatAmount = (value: string) => {
    // Formata o valor para o formato de moeda brasileira
    let onlyDigits = value.replace(/\D/g, '');
    
    if (onlyDigits === '') return '';
    
    // Converte para número e formata
    const number = parseInt(onlyDigits, 10) / 100;
    return number.toLocaleString('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setAmount(formattedValue);
  };

  // Verifica se é sexta-feira às 9h
  const isFriday9AM = () => {
    const now = new Date();
    return now.getDay() === 5 && now.getHours() === 9 && now.getMinutes() < 30;
  };

  const isWithdrawalAvailable = isFriday9AM();
  const minWithdrawal = 50; // Valor mínimo de saque
  const availableBalance = stats?.availableBalance || 0;
  const canWithdraw = availableBalance >= minWithdrawal;

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Solicitar Saque</h2>
            <p className="text-sm text-gray-400">
              {isWithdrawalAvailable 
                ? 'Solicitação de saque disponível' 
                : 'Saques disponíveis apenas nas sextas-feiras às 9h'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Saldo disponível</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(availableBalance)}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor do saque</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount ? `R$ ${amount}` : ''}
                    onChange={handleAmountChange}
                    placeholder="0,00"
                    className="pl-10"
                    disabled={!isWithdrawalAvailable || !canWithdraw || isSubmitting}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Valor mínimo: {formatCurrency(minWithdrawal)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de pagamento</Label>
                <Select 
                  value={paymentMethod} 
                  onValueChange={(value: 'pix' | 'bank_transfer') => setPaymentMethod(value)}
                  disabled={!isWithdrawalAvailable || !canWithdraw || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="bank_transfer" disabled>Transferência Bancária (em breve)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={
                    !isWithdrawalAvailable || 
                    !canWithdraw || 
                    isSubmitting || 
                    parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.')) < minWithdrawal ||
                    parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.')) > availableBalance
                  }
                >
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
            </div>

            {paymentMethod === 'pix' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="pixKeyType">Tipo de chave PIX</Label>
                  <Select 
                    value={pixKeyType} 
                    onValueChange={(value: 'cpf' | 'email' | 'phone' | 'random') => setPixKeyType(value)}
                    disabled={!isWithdrawalAvailable || !canWithdraw || isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de chave" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
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
                    type={pixKeyType === 'email' ? 'email' : 'text'}
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder={
                      pixKeyType === 'cpf' ? '000.000.000-00' :
                      pixKeyType === 'email' ? 'seu@email.com' :
                      pixKeyType === 'phone' ? '(00) 00000-0000' :
                      '00000000-0000-0000-0000-000000000000'
                    }
                    disabled={!isWithdrawalAvailable || !canWithdraw || isSubmitting}
                  />
                </div>
              </div>
            )}
          </form>

          {!isWithdrawalAvailable && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-400">Fora do horário de saque</h4>
                <p className="text-sm text-yellow-300">
                  Os saques só podem ser solicitados nas sextas-feiras às 9h da manhã.
                  O próximo horário disponível será na próxima sexta-feira às 9h.
                </p>
              </div>
            </div>
          )}

          {!canWithdraw && availableBalance > 0 && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-md flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-400">Valor mínimo não atingido</h4>
                <p className="text-sm text-blue-300">
                  O valor mínimo para saque é de {formatCurrency(minWithdrawal)}. 
                  Continue vendendo para atingir o valor mínimo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Histórico de Saques</h3>
            <p className="text-sm text-gray-400">Acompanhe o status dos seus saques</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadWithdrawals}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <div className="rounded-md border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comprovante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{formatDate(withdrawal.requestDate)}</span>
                        {withdrawal.processedDate && (
                          <span className="text-xs text-gray-400">
                            Processado em {formatDate(withdrawal.processedDate)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(withdrawal.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {withdrawal.paymentMethod === 'pix' ? (
                          <>
                            <Wallet className="h-4 w-4 text-purple-400" />
                            <span>PIX</span>
                          </>
                        ) : (
                          <span>Transferência Bancária</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(withdrawal.status)}
                        {withdrawal.status === 'rejected' && withdrawal.rejectionReason && (
                          <span 
                            className="text-xs text-red-400 cursor-help" 
                            title={withdrawal.rejectionReason}
                          >
                            Ver motivo
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {withdrawal.status === 'processed' ? (
                        <Button variant="ghost" size="sm" className="h-8">
                          <Download className="h-4 w-4 mr-2" />
                          Comprovante
                        </Button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum saque encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
