
import { Eye, Users, DollarSign, ShoppingBag, Copy, Loader2, Link as LinkIcon, LogOut, RefreshCw, Home, DoorOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useCallback } from "react";
import { formatPhone } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { usePartner } from "@/hooks/usePartner";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DoorToDoorSaleForm, PendingDoorToDoorSales } from '@/components/door-to-door';

const Parceiro = () => {
  const { toast } = useToast();
  const [saleData, setSaleData] = useState({
    name: "",
    whatsapp: "",
    city: "",
    quantity: 1,
    total: "1.99"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDoorToDoor, setShowDoorToDoor] = useState(false);
  const { logout, user } = useAuth();
  const { stats, isLoading, error, registerSale, requestWithdrawal, refreshStats } = usePartner();
  
  // Criar um slug a partir do nome do usuário
  const userSlug = user?.name
    ? user.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    : '';
    
  const referralLink = `https://litoraldasorte.com/r/${userSlug}`;
  
  // Atualizar estatísticas
  const handleRefreshStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshStats();
      toast({
        title: "Atualizado!",
        description: "As estatísticas foram atualizadas com sucesso.",
      });
    } catch (err) {
      console.error('Erro ao atualizar estatísticas:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as estatísticas. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshStats, toast]);
  
  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  // Dados do dashboard com valores padrão
  const dashboardStats = {
    clicksToday: stats?.todayClicks || 0,
    salesToday: stats?.todaySales || 0,
    commissionToday: stats?.todayEarnings || 0,
    availableBalance: stats?.availableBalance || 0,
    totalClicks: stats?.totalClicks || 0,
    totalSales: stats?.totalSales || 0,
    totalEarnings: stats?.totalEarnings || 0,
  };
  
  // Garante que stats não seja nulo para evitar erros
  const safeStats = stats || {
    todayClicks: 0,
    todaySales: 0,
    todayEarnings: 0,
    availableBalance: 0,
    totalClicks: 0,
    totalSales: 0,
    totalEarnings: 0,
  };

  const handleLogout = () => {
    logout('/');
  };

  // Calculate total whenever quantity changes
  useEffect(() => {
    const pricePerTicket = saleData.quantity >= 10 ? 0.99 : 1.99;
    const total = (saleData.quantity * pricePerTicket).toFixed(2);
    setSaleData(prev => ({ ...prev, total }));
  }, [saleData.quantity]);

  // Check if it's Friday at 9 AM
  const isFridayNineAM = () => {
    const now = new Date();
    return now.getDay() === 5 && now.getHours() === 9;
  };

  // Generate random numbers for the sale
  const generateRandomNumbers = (quantity: number) => {
    const numbers = [];
    for (let i = 0; i < quantity; i++) {
      numbers.push(Math.floor(Math.random() * 99999).toString().padStart(5, '0'));
    }
    return numbers.join(', ');
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaleData(prev => ({ ...prev, [name]: value }));
  };


  
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    let formattedValue = numbers;
    if (numbers.length > 10) {
      formattedValue = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length > 5) {
      formattedValue = numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (numbers.length > 2) {
      formattedValue = numbers.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (numbers.length > 0) {
      formattedValue = numbers.replace(/^(\d*)/, '($1');
    }
    
    setSaleData(prev => ({ ...prev, whatsapp: formattedValue }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setSaleData(prev => ({ ...prev, quantity: value }));
    }
  };

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!saleData.name.trim() || !saleData.whatsapp || !saleData.city.trim()) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      
      const whatsappNumeros = saleData.whatsapp.replace(/\D/g, '');
      if (whatsappNumeros.length < 10 || whatsappNumeros.length > 11) {
        throw new Error("Por favor, insira um número de WhatsApp válido com DDD.");
      }
      
      if (saleData.quantity < 1) {
        throw new Error("A quantidade deve ser maior que zero.");
      }
      
      // Gerar números para a venda
      const generatedNumbers = generateRandomNumbers(saleData.quantity);
      
      // Registrar a venda
      await registerSale({
        customerName: saleData.name,
        customerWhatsApp: saleData.whatsapp,
        customerCity: saleData.city,
        amount: parseFloat(saleData.total),
        commission: parseFloat(saleData.total) * 0.1, // 10% de comissão
        numbers: generatedNumbers.split(', '),
      });
      
      toast({
        title: "Venda registrada com sucesso!",
        description: `Números gerados: ${generatedNumbers}. Comissão de ${formatCurrency(parseFloat(saleData.total) * 0.1)} creditada na sua conta.`,
      });
      
      // Resetar formulário
      setSaleData({
        name: "",
        whatsapp: "",
        city: "",
        quantity: 1,
        total: "5.00"
      });
      
      // Atualizar estatísticas
      await refreshStats();
      
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      toast({
        title: "Erro ao processar venda",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Código copiado!",
      description: "Código de referência copiado para a área de transferência.",
    });
  };

  const copyReferralLink = () => {
    const link = `https://litoraldasorte.com/r/${userSlug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "Link de divulgação copiado para a área de transferência.",
    });
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para saque.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isFridayNineAM()) {
      toast({
        title: "Saque não disponível",
        description: "Saques só podem ser solicitados nas sextas-feiras às 9:00 da manhã.",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > safeStats.availableBalance) {
      toast({
        title: "Saldo insuficiente",
        description: `Seu saldo disponível é de ${formatCurrency(safeStats.availableBalance)}`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Aqui você pode adicionar os dados de pagamento do parceiro
      await requestWithdrawal(amount, 'pix', {
        pixKey: 'SEU_PIX_KEY', // Substitua pela chave PIX do parceiro
        keyType: 'email' // ou 'cpf', 'cnpj', 'telefone', 'chave_aleatoria'
      });
      
      toast({
        title: "Saque solicitado!",
        description: `Solicitação de saque de ${formatCurrency(amount)} enviada com sucesso.`,
      });
      
      setWithdrawAmount("");
      await refreshStats();
      
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      toast({
        title: "Erro ao solicitar saque",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard do Influenciador</h1>
            <p className="text-gray-300">Bem-vinda, Maria Oliveira</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-white border-white hover:bg-white hover:text-black flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Visão Geral</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshStats}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-md text-red-200">
            {error}
          </div>
        )}
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Cliques Hoje</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white">{dashboardStats.clicksToday}</div>
                  <p className="text-xs text-gray-400 mt-1">Total: {dashboardStats.totalClicks} cliques</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Vendas Hoje</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white">{dashboardStats.salesToday}</div>
                  <p className="text-xs text-gray-400 mt-1">Total: {dashboardStats.totalSales} vendas</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Comissão Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-yellow-400">{formatCurrency(dashboardStats.commissionToday)}</div>
                  <p className="text-xs text-gray-400 mt-1">Total: {formatCurrency(dashboardStats.totalEarnings)}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Saldo Disponível</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="text-3xl font-bold text-green-400">
                  {formatCurrency(dashboardStats.availableBalance)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Link de Divulgação e Saque */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Seu Link de Divulgação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Seu Link de Divulgação</Label>
                <p className="text-sm text-gray-400 mb-2">
                  Compartilhe este link para ganhar comissões de 10% em cada venda
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    value={referralLink} 
                    readOnly 
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(referralLink);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                      toast({
                        title: "Link copiado!",
                        description: "Agora você pode compartilhar seu link de afiliado.",
                      });
                    }}
                    className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
                  >
                    {isCopied ? "Copiado!" : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Cada clique no seu link é rastreado. Você ganha comissão quando um cliente faz uma compra.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Solicitar Saque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-sm text-gray-300">Saldo Disponível</div>
                <div className="text-lg font-bold text-green-400">
                  R$ {safeStats.availableBalance.toFixed(2)}
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Valor do Saque</Label>
                <Input 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00" 
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <Button 
                onClick={handleWithdraw}
                disabled={!isFridayNineAM() || !withdrawAmount || !safeStats.availableBalance || !safeStats.availableBalance}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isFridayNineAM() ? "Solicitar Saque" : "Disponível sextas 9h"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Venda Porta a Porta */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white flex items-center">
                  {showDoorToDoor ? (
                    <DoorOpen className="w-5 h-5 mr-2 text-orange-400" />
                  ) : (
                    <Home className="w-5 h-5 mr-2 text-blue-400" />
                  )}
                  {showDoorToDoor ? 'Venda Porta a Porta' : 'Venda Online'}
                </CardTitle>
                <p className="text-gray-300 text-sm mt-1">
                  {showDoorToDoor 
                    ? 'Registre uma venda presencial. O acerto será feito no final do dia.'
                    : 'Registre uma venda online através do seu link de afiliado.'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDoorToDoor(!showDoorToDoor)}
                className="text-xs"
              >
                {showDoorToDoor ? (
                  <>
                    <Home className="w-3.5 h-3.5 mr-1.5" />
                    Ver Venda Online
                  </>
                ) : (
                  <>
                    <DoorOpen className="w-3.5 h-3.5 mr-1.5" />
                    Ver Venda Porta a Porta
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showDoorToDoor ? (
              <>
                <DoorToDoorSaleForm 
                  onSuccess={() => {
                    refreshStats();
                    setSaleData({
                      name: "",
                      whatsapp: "",
                      city: "",
                      quantity: 1,
                      total: "5.00"
                    });
                  }} 
                />
                <div className="mt-8">
                  <PendingDoorToDoorSales />
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmitSale} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nome Completo</Label>
                    <Input
                      name="name"
                      value={saleData.name}
                      onChange={handleInputChange}
                      placeholder="Nome do cliente"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">WhatsApp</Label>
                    <Input
                      name="whatsapp"
                      value={saleData.whatsapp}
                      onChange={handleWhatsAppChange}
                      placeholder="(00) 00000-0000"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Cidade</Label>
                    <Input
                      name="city"
                      value={saleData.city}
                      onChange={handleInputChange}
                      placeholder="Cidade do cliente"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Quantidade de Números</Label>
                    <Input
                      name="quantity"
                      type="number"
                      min="1"
                      value={saleData.quantity}
                      onChange={handleQuantityChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2 flex flex-col justify-end">
                    <div className="text-sm font-medium text-gray-300">Valor Total</div>
                    <div className="text-2xl font-bold text-orange-400">
                      R$ {saleData.total}
                    </div>
                    {saleData.quantity >= 10 && (
                      <div className="text-xs text-green-400">
                        Promoção: R$ 0,99 por número
                      </div>
                    )}
                    {saleData.quantity > 0 && saleData.quantity < 10 && (
                      <div className="text-xs text-gray-400">
                        Compre 10+ números por R$ 0,99 cada
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando números...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Gerar Venda
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Parceiro;
