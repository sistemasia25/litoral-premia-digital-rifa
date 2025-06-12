
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  Loader2 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalPartners: number;
  pendingSales: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalPartners: 0,
    pendingSales: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Carregar vendas
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('total_amount, status');

      if (salesError) throw salesError;

      // Carregar parceiros
      const { data: partners, error: partnersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'partner');

      if (partnersError) throw partnersError;

      const totalSales = sales?.length || 0;
      const totalRevenue = sales?.reduce((acc, sale) => acc + (sale.total_amount || 0), 0) || 0;
      const totalPartners = partners?.length || 0;
      const pendingSales = sales?.filter(sale => sale.status === 'pending').length || 0;

      setStats({
        totalSales,
        totalRevenue,
        totalPartners,
        pendingSales
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Bem-vindo ao painel administrativo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total de Parceiros
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalPartners}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Vendas Pendentes
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingSales}</div>
          </CardContent>
        </Card>
      </div>

      {stats.totalSales === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-white mb-2">
              Sistema Configurado e Pronto!
            </h3>
            <p className="text-gray-400 mb-4">
              Seu sistema está limpo e pronto para uso. Comece configurando seu primeiro sorteio.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Configure sorteios na seção "Sorteios"</p>
              <p>• Gerencie parceiros na seção "Parceiros"</p>
              <p>• Acompanhe o financeiro na seção "Financeiro"</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
