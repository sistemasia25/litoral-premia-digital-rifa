
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, DollarSign, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSorteios: 0,
    sorteiosAtivos: 0,
    totalInfluenciadores: 0,
    influenciadoresAtivos: 0,
    totalVendas: 0,
    vendasPendentes: 0,
    faturamentoTotal: 0,
    saquesPendentes: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Carregar estatísticas dos sorteios
      const { data: sorteios } = await supabase
        .from('sorteios')
        .select('status');

      // Carregar estatísticas dos influenciadores
      const { data: influenciadores } = await supabase
        .from('influenciadores')
        .select('status');

      // Carregar estatísticas das vendas
      const { data: vendas } = await supabase
        .from('vendas')
        .select('status_pagamento, valor_total');

      // Carregar estatísticas dos saques
      const { data: saques } = await supabase
        .from('saques')
        .select('status, valor_solicitado');

      setStats({
        totalSorteios: sorteios?.length || 0,
        sorteiosAtivos: sorteios?.filter(s => s.status === 'ativo').length || 0,
        totalInfluenciadores: influenciadores?.length || 0,
        influenciadoresAtivos: influenciadores?.filter(i => i.status === 'ativo').length || 0,
        totalVendas: vendas?.length || 0,
        vendasPendentes: vendas?.filter(v => v.status_pagamento === 'pendente').length || 0,
        faturamentoTotal: vendas?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0,
        saquesPendentes: saques?.filter(s => s.status === 'pendente').length || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const statsCards = [
    {
      title: 'Sorteios Ativos',
      value: `${stats.sorteiosAtivos}/${stats.totalSorteios}`,
      icon: Trophy,
      color: 'text-blue-500'
    },
    {
      title: 'Influenciadores Ativos',
      value: `${stats.influenciadoresAtivos}/${stats.totalInfluenciadores}`,
      icon: Users,
      color: 'text-green-500'
    },
    {
      title: 'Vendas Pendentes',
      value: `${stats.vendasPendentes}/${stats.totalVendas}`,
      icon: ShoppingCart,
      color: 'text-orange-500'
    },
    {
      title: 'Faturamento Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(stats.faturamentoTotal),
      icon: DollarSign,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Visão geral do sistema Litoral da Sorte
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/sorteios/novo"
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors"
              >
                Novo Sorteio
              </a>
              <a
                href="/admin/influenciadores/novo"
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors"
              >
                Novo Influenciador
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.saquesPendentes > 0 && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-orange-400 text-sm">
                    {stats.saquesPendentes} saque{stats.saquesPendentes > 1 ? 's' : ''} pendente{stats.saquesPendentes > 1 ? 's' : ''}
                  </p>
                </div>
              )}
              {stats.vendasPendentes > 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    {stats.vendasPendentes} venda{stats.vendasPendentes > 1 ? 's' : ''} pendente{stats.vendasPendentes > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
