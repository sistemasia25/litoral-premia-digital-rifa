
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";

interface PerformanceMetricsProps {
  stats: {
    totalClicks: number;
    todayClicks: number;
    totalSales: number;
    todaySales: number;
    totalEarnings: number;
    todayEarnings: number;
    conversionRate: number;
    averageOrderValue: number;
    topPerformingDays: Array<{
      date: string;
      sales: number;
      earnings: number;
    }>;
  };
}

const chartConfig = {
  sales: {
    label: "Vendas",
    color: "#f97316",
  },
  earnings: {
    label: "Ganhos",
    color: "#06b6d4",
  },
};

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total de Cliques</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              +{stats.todayClicks} hoje
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total de Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSales}</div>
            <p className="text-xs text-gray-400">
              +{stats.todaySales} hoje
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Ganhos Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-gray-400">
              +{formatCurrency(stats.todayEarnings)} hoje
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              Ticket médio: {formatCurrency(stats.averageOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Performance dos Últimos Dias</CardTitle>
          <CardDescription className="text-gray-400">
            Vendas e ganhos diários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topPerformingDays}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  className="text-gray-400"
                />
                <YAxis className="text-gray-400" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
