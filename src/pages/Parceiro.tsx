
import { Eye, Users, DollarSign, ShoppingBag, Copy, Loader2, Link as LinkIcon, LogOut, RefreshCw, DoorOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { formatPhone } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { usePartner } from "@/hooks/usePartner";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DoorToDoorSaleForm, PendingDoorToDoorSales } from '@/components/door-to-door';

const Parceiro = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // Check if it's Friday at 9 AM
  const isFridayNineAM = () => {
    const now = new Date();
    return now.getDay() === 5 && now.getHours() === 9;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
            <h1 className="text-3xl font-bold">Dashboard do Parceiro</h1>
            <p className="text-gray-300">Bem-vindo, {user?.name || 'Parceiro'}</p>
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
                  Compartilhe este link para ganhar comissões de 30% em cada venda
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    value={referralLink} 
                    readOnly 
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                  <Button 
                    onClick={copyReferralLink}
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
                  <DoorOpen className="w-5 h-5 mr-2 text-orange-400" />
                  Venda Porta a Porta
                </CardTitle>
                <p className="text-gray-300 text-sm mt-1">
                  Registre vendas presenciais. Os valores seguem os mesmos preços e descontos da página principal.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DoorToDoorSaleForm 
              onSuccess={() => {
                refreshStats();
              }} 
            />
            <div className="mt-8">
              <PendingDoorToDoorSales />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Parceiro;
