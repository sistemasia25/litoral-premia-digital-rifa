import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, MousePointer, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePartner } from '@/hooks/usePartner';

export function PartnerOverview() {
  const { stats, isLoading } = usePartner();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const metrics = [
    {
      title: 'Total de Vendas',
      value: stats?.totalSales || 0,
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      change: 12, // Porcentagem de mudança em relação ao período anterior
      changeType: 'increase',
      format: formatNumber,
    },
    {
      title: 'Total de Cliques',
      value: stats?.totalClicks || 0,
      icon: <MousePointer className="h-4 w-4 text-blue-500" />,
      change: 8,
      changeType: 'increase',
      format: formatNumber,
    },
    {
      title: 'Taxa de Conversão',
      value: stats?.conversionRate || 0,
      icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
      change: 2.5,
      changeType: 'increase',
      format: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: 'Ganhos Totais',
      value: stats?.totalEarnings || 0,
      icon: <DollarSign className="h-4 w-4 text-purple-500" />,
      change: 15,
      changeType: 'increase',
      format: formatCurrency,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-700 bg-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              {metric.title}
            </CardTitle>
            <div className="p-2 rounded-full bg-slate-700/50">
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metric.format(metric.value)}
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              {metric.changeType === 'increase' ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                {metric.change}% em relação ao mês passado
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
