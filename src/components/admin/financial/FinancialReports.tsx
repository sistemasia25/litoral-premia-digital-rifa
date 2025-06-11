
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { CalendarDays, Download, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { useState } from "react";

interface FinancialReportsProps {
  sales: any[];
  withdrawalRequests: any[];
  pendingReceipts: any[];
}

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "#10b981",
  },
  commissions: {
    label: "Comissões",
    color: "#f97316",
  },
  withdrawals: {
    label: "Saques",
    color: "#ef4444",
  },
};

const COLORS = ['#10b981', '#f97316', '#3b82f6', '#8b5cf6', '#f59e0b'];

export function FinancialReports({ sales, withdrawalRequests, pendingReceipts }: FinancialReportsProps) {
  const [reportPeriod, setReportPeriod] = useState("7d");
  const [reportType, setReportType] = useState("revenue");

  // Mock data para os gráficos
  const revenueData = [
    { name: "01/06", revenue: 4000, commissions: 800, withdrawals: 600 },
    { name: "02/06", revenue: 3000, commissions: 600, withdrawals: 400 },
    { name: "03/06", revenue: 5000, commissions: 1000, withdrawals: 800 },
    { name: "04/06", revenue: 2780, commissions: 556, withdrawals: 300 },
    { name: "05/06", revenue: 1890, commissions: 378, withdrawals: 200 },
    { name: "06/06", revenue: 2390, commissions: 478, withdrawals: 350 },
    { name: "07/06", revenue: 3490, commissions: 698, withdrawals: 500 },
  ];

  const partnerPerformanceData = [
    { name: "Maria Santos", value: 15000, sales: 45 },
    { name: "João Silva", value: 12000, sales: 38 },
    { name: "Ana Costa", value: 8500, sales: 25 },
    { name: "Carlos Oliveira", value: 6200, sales: 18 },
    { name: "Pedro Lima", value: 4800, sales: 15 },
  ];

  const paymentMethodsData = [
    { name: "PIX", value: 45, amount: 25000 },
    { name: "Cartão de Crédito", value: 30, amount: 18000 },
    { name: "Dinheiro", value: 15, amount: 8500 },
    { name: "Transferência", value: 10, amount: 5500 },
  ];

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalCommissions = sales.reduce((sum, sale) => sum + sale.partnerCommission, 0);
  const totalWithdrawals = withdrawalRequests
    .filter(w => w.status === 'processed')
    .reduce((sum, w) => sum + w.amount, 0);

  const handleExportReport = () => {
    // Implementar exportação de relatório
    console.log("Exportando relatório...");
  };

  return (
    <div className="space-y-6">
      {/* Controles do Relatório */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Relatórios Financeiros</h3>
          <p className="text-gray-400">Análise detalhada do desempenho financeiro</p>
        </div>
        <div className="flex gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleExportReport}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Líquida</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {(totalRevenue - totalCommissions).toFixed(2)}
            </div>
            <p className="text-xs text-green-400">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Margem de Lucro</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalRevenue > 0 ? (((totalRevenue - totalCommissions) / totalRevenue) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-blue-400">
              Margem saudável
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">ROI Parceiros</CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalCommissions > 0 ? ((totalRevenue / totalCommissions) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-purple-400">
              Retorno sobre comissões
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita vs Gastos */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Receita vs Gastos</CardTitle>
          <CardDescription className="text-gray-400">
            Comparativo de receitas, comissões e saques ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" className="text-gray-400" />
                <YAxis className="text-gray-400" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="#10b981" name="Receita" />
                <Bar dataKey="commissions" fill="#f97316" name="Comissões" />
                <Bar dataKey="withdrawals" fill="#ef4444" name="Saques" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance dos Parceiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Parceiros</CardTitle>
            <CardDescription className="text-gray-400">
              Maiores geradores de receita
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
                    label={({ name, value }) => `${name}: R$ ${value.toLocaleString()}`}
                  >
                    {partnerPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Métodos de Pagamento</CardTitle>
            <CardDescription className="text-gray-400">
              Distribuição por forma de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodsData.map((method, index) => (
                <div key={method.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-300">{method.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">R$ {method.amount.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">{method.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Resumo Mensal */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Resumo Mensal</CardTitle>
          <CardDescription className="text-gray-400">
            Análise consolidada por mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-gray-400">Mês</th>
                  <th className="text-right py-3 px-4 text-gray-400">Receita Bruta</th>
                  <th className="text-right py-3 px-4 text-gray-400">Comissões</th>
                  <th className="text-right py-3 px-4 text-gray-400">Saques</th>
                  <th className="text-right py-3 px-4 text-gray-400">Receita Líquida</th>
                  <th className="text-right py-3 px-4 text-gray-400">Margem</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-white">Junho 2024</td>
                  <td className="py-3 px-4 text-right text-white">R$ 25.000,00</td>
                  <td className="py-3 px-4 text-right text-orange-400">R$ 5.000,00</td>
                  <td className="py-3 px-4 text-right text-red-400">R$ 4.500,00</td>
                  <td className="py-3 px-4 text-right text-green-400">R$ 20.000,00</td>
                  <td className="py-3 px-4 text-right text-white">80%</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-white">Maio 2024</td>
                  <td className="py-3 px-4 text-right text-white">R$ 22.300,00</td>
                  <td className="py-3 px-4 text-right text-orange-400">R$ 4.460,00</td>
                  <td className="py-3 px-4 text-right text-red-400">R$ 4.200,00</td>
                  <td className="py-3 px-4 text-right text-green-400">R$ 17.840,00</td>
                  <td className="py-3 px-4 text-right text-white">80%</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-white">Abril 2024</td>
                  <td className="py-3 px-4 text-right text-white">R$ 18.700,00</td>
                  <td className="py-3 px-4 text-right text-orange-400">R$ 3.740,00</td>
                  <td className="py-3 px-4 text-right text-red-400">R$ 3.500,00</td>
                  <td className="py-3 px-4 text-right text-green-400">R$ 14.960,00</td>
                  <td className="py-3 px-4 text-right text-white">80%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
