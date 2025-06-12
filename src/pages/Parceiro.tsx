
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Loader2, 
  LogOut, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Parceiro() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [partnerData, setPartnerData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCommission: 0,
    totalClicks: 0,
    conversionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadPartnerData();
      loadStats();
    }
  }, [user]);

  const loadPartnerData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .eq('role', 'partner')
        .single();

      if (error) {
        throw error;
      }

      setPartnerData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do parceiro:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar dados do parceiro.',
      });
    }
  };

  const loadStats = async () => {
    try {
      // Carregar vendas
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('partner_id', user?.id);

      if (salesError) throw salesError;

      // Carregar cliques
      const { data: clicks, error: clicksError } = await supabase
        .from('partner_clicks')
        .select('*')
        .eq('partner_id', user?.id);

      if (clicksError) throw clicksError;

      const totalSales = sales?.length || 0;
      const totalCommission = sales?.reduce((acc, sale) => acc + (sale.commission_amount || 0), 0) || 0;
      const totalClicks = clicks?.length || 0;
      const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;

      setStats({
        totalSales,
        totalCommission,
        totalClicks,
        conversionRate
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const copyPartnerLink = () => {
    const link = `${window.location.origin}/r/${partnerData?.slug}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast({
      title: 'Link copiado!',
      description: 'O link de indicação foi copiado para a área de transferência.',
    });
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!partnerData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Parceiro não encontrado</h1>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Painel do Parceiro</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-slate-600 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Informações do Parceiro */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Olá, {partnerData.name}!
          </h2>
          
          {/* Link de Indicação */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Seu Link de Indicação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700 p-3 rounded border text-gray-300 font-mono text-sm">
                  {window.location.origin}/r/{partnerData.slug}
                </div>
                <Button
                  onClick={copyPartnerLink}
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Vendas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalSales}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Comissões Ganhas
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {stats.totalCommission.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Cliques no Link
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalClicks}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Taxa de Conversão
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.conversionRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Vendas Porta a Porta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Registre vendas feitas diretamente aos clientes
              </p>
              <Button 
                onClick={() => navigate('/door-to-door')}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Acessar Vendas Porta a Porta
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Atualize suas informações pessoais e de pagamento
              </p>
              <Button 
                variant="outline"
                className="w-full border-slate-600 hover:bg-slate-700"
                onClick={() => navigate('/parceiro/perfil')}
              >
                Editar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
