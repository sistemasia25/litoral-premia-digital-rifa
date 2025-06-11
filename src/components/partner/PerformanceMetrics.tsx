import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { usePartner } from '@/hooks/usePartner';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

export function PerformanceMetrics() {
  const { stats, isLoading } = usePartner();

  // Dados de exemplo para o gráfico
  const performanceData = [
    { name: 'Seg', clicks: 45, sales: 12 },
    { name: 'Ter', clicks: 60, sales: 18 },
    { name: 'Qua', clicks: 38, sales: 10 },
    { name: 'Qui', clicks: 52, sales: 15 },
    { name: 'Sex', clicks: 78, sales: 25 },
    { name: 'Sáb', clicks: 95, sales: 32 },
    { name: 'Dom', clicks: 120, sales: 45 },
  ];

  const metrics = [
    {
      title: 'Taxa de Conversão',
      value: stats?.conversionRate || 0,
      change: 2.5,
      changeType: 'increase' as const,
      format: (value: number) => `${value.toFixed(1)}%`,
      description: 'Conversões por clique',
    },
    {
      title: 'Ticket Médio',
      value: stats?.averageOrderValue || 0,
      change: 1.2,
      changeType: 'increase' as const,
      format: (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
      description: 'Valor médio por venda',
    },
    {
      title: 'Taxa de Rejeição',
      value: 8.5,
      change: 1.3,
      changeType: 'decrease' as const,
      format: (value: number) => `${value.toFixed(1)}%`,
      description: 'Cliques sem conversão',
    },
  ];

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-8 w-8 rounded-full mr-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Desempenho Semanal</CardTitle>
          <p className="text-sm text-gray-400">
            Comparativo de cliques e vendas nos últimos 7 dias
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'clicks') return [value, 'Cliques'];
                    if (name === 'sales') return [value, 'Vendas'];
                    return value;
                  }}
                />
                <Bar dataKey="clicks" name="Cliques" radius={[4, 4, 0, 0]}">
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[0]} />
                  ))}
                </Bar>
                <Bar dataKey="sales" name="Vendas" radius={[4, 4, 0, 0]}">
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[2]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {metric.format(metric.value)}
              </div>
              <div className="mt-2 flex items-center text-sm">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full ${
                    metric.changeType === 'increase'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span className="text-xs font-medium">
                    {metric.change}%
                  </span>
                </div>
                <span className="ml-2 text-xs text-gray-400">
                  {metric.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Dicas para Aumentar suas Vendas</CardTitle>
          <p className="text-sm text-gray-400">
            Ações que podem ajudar a melhorar seu desempenho
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              'Compartilhe seu link em grupos de WhatsApp relacionados a sorteios e promoções.',
              'Crie um perfil no Instagram dedicado a divulgar seus números da sorte.',
              'Ofereça descontos especiais para clientes que compram múltiplos números.',
              'Peça para amigos e familiares compartilharem seu link de afiliado.',
              'Divulgue depoimentos de clientes que já ganharam prêmios.',
            ].map((tip, index) => (
              <div key={index} className="flex items-start">
                <ArrowUpRight className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
