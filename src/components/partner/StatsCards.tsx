
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, DollarSign } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/lib/utils';

interface PartnerStats {
  todayClicks: number;
  todaySales: number;
  todayEarnings: number;
  availableBalance: number;
  totalSales?: number;
  totalEarnings?: number;
  totalWithdrawals?: number;
  pendingWithdrawals?: number;
}

interface StatsCardsProps {
  stats: PartnerStats | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const safeStats = stats || {
    todayClicks: 0,
    todaySales: 0,
    todayEarnings: 0,
    availableBalance: 0,
    totalSales: 0,
    totalEarnings: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-800 border-slate-700">
            <CardContent className="flex justify-center items-center h-24">
              <Spinner size="large" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Cliques Hoje</CardTitle>
          <Eye className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{safeStats.todayClicks}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Vendas Hoje</CardTitle>
          <Users className="h-5 w-5 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{safeStats.todaySales}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Comissão Hoje</CardTitle>
          <DollarSign className="h-5 w-5 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatCurrency(safeStats.todayEarnings)}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Saldo Disponível</CardTitle>
          <DollarSign className="h-5 w-5 text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatCurrency(safeStats.availableBalance)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
