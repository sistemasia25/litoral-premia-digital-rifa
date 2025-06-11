
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  UserPlus, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const chartConfig = {
  sales: {
    label: "Vendas",
    color: "#f97316",
  },
  revenue: {
    label: "Receita",
    color: "#10b981",
  },
  partners: {
    label: "Parceiros",
    color: "#3b82f6",
  },
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 125000,
    monthlyRevenue: 25000,
    totalSales: 1250,
    monthlySales: 180,
    totalPartners: 45,
    activePartners: 32,
    pendingWithdrawals: 8500,
    pendingReceipts: 12,
    conversionRate: 3.2,
    averageTicket: 199.99
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Mock data para os gráficos
  const salesTrendData = [
    { name: "Jan", sales: 65, revenue: 12000, partners: 25 },
    { name: "Fev", sales: 78, revenue: 15600, partners: 28 },
    { name: "Mar", sales: 90, revenue: 18000, partners: 32 },
    { name: "Abr", sales: 110, revenue: 22000, partners: 35 },
    { name: "Mai", sales: 125, revenue: 25000, partners: 38 },
    { name: "Jun", sales: 180, revenue: 36000, partners: 45 },
  ];

  const partnerPerformanceData = [
    { name: "Ativos", value: 32, color: "#10b981" },
    { name: "Inativos", value: 8, color: "#6b7280" },
    { name: "Novos", value: 5, color: "#3b82f6" },
  ];

  const topPartnersData = [
    { name: "Maria Santos", sales: 45, revenue: 9000, commission: 1800 },
    { name: "João Silva", sales: 38, revenue: 7600, commission: 1520 },
    { name: "Ana Costa", sales: 32, revenue: 6400, commission: 1280 },
    { name: "Carlos Oliveira", sales: 28, revenue: 5600, commission: 1120 },
    { name: "Pedro Lima", sales: 25, revenue: 5000, commission: 1000 },
  ];

  const recentActivities = [
    { type: "sale", description: "Nova venda realizada por Maria Santos", time: "5 min atrás", status: "success" },
    { type: "withdrawal", description: "Saque solicitado por João Silva - R$ 1.200", time: "15 min atrás", status: "pending" },
    { type: "partner", description: "Novo parceiro cadastrado: Ana Costa", time: "1 hora atrás", status: "info" },
    { type: "receipt", description: "Venda porta a porta aguardando confirmação", time: "2 horas atrás", status: "warning" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h2>
        <p className="text-gray-400">Visão geral completa do sistema de sorteios</p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {dashboardData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-400">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Vendas Totais</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardData.totalSales}</div>
            <p className="text-xs text-blue-400">
              +{dashboardData.monthlySales} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Parceiros Ativos</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardData.activePartners}</div>
            <p className="text-xs text-purple-400">
              de {dashboardData.totalPartners} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardData.conversionRate}%</div>
            <p className="text-xs text-orange-400">
              Ticket médio: R$ {dashboardData.averageTicket}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Pendências */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Saques Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {dashboardData.pendingWithdrawals.toLocaleString()}
            </div>
            <p className="text-xs text-yellow-400">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Recebimentos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardData.pendingReceipts}</div>
            <p className="text-xs text-blue-400">
              Vendas porta a porta
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Meta do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">72%</div>
            <Progress value={72} className="mt-2" />
            <p className="text-xs text-green-400 mt-1">
              R$ 18.000 de R$ 25.000
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tendência de Vendas</CardTitle>
            <CardDescription className="text-gray-400">
              Evolução das vendas nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData}>
                  <XAxis dataKey="name" className="text-gray-400" />
                  <YAxis className="text-gray-400" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="Vendas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Status dos Parceiros</CardTitle>
            <CardDescription className="text-gray-400">
              Distribuição dos parceiros por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={partnerPerformanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {partnerPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Parceiros e Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Parceiros</CardTitle>
            <CardDescription className="text-gray-400">
              Melhores performes do mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPartnersData.map((partner, index) => (
                <div key={partner.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{partner.name}</div>
                      <div className="text-gray-400 text-sm">{partner.sales} vendas</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">R$ {partner.revenue.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">R$ {partner.commission} comissão</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Atividades Recentes</CardTitle>
            <CardDescription className="text-gray-400">
              Últimas movimentações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'pending' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'success' ? 'default' : 'secondary'}
                    className={
                      activity.status === 'success' ? 'bg-green-600' :
                      activity.status === 'warning' ? 'bg-yellow-600' :
                      activity.status === 'pending' ? 'bg-orange-600' :
                      'bg-blue-600'
                    }
                  >
                    {activity.status === 'success' ? 'Concluído' :
                     activity.status === 'warning' ? 'Atenção' :
                     activity.status === 'pending' ? 'Pendente' :
                     'Novo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
