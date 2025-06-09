
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DollarSign, CreditCard, Banknote, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Venda = {
  id: string;
  nome_cliente: string;
  whatsapp_cliente: string;
  quantidade_numeros: number;
  valor_total: number;
  status_pagamento: string;
  created_at: string;
  influenciadores: {
    nome: string;
    codigo_referencia: string;
  } | null;
};

type Saque = {
  id: string;
  valor_solicitado: number;
  status: string;
  data_solicitacao: string;
  data_processamento: string | null;
  influenciadores: {
    nome: string;
    codigo_referencia: string;
  };
};

export default function Financeiro() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [saques, setSaques] = useState<Saque[]>([]);
  const [stats, setStats] = useState({
    totalFaturamento: 0,
    faturamentoMes: 0,
    vendasPendentes: 0,
    saquesPendentes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFinanceiroData();
  }, []);

  const loadFinanceiroData = async () => {
    try {
      // Carregar vendas
      const { data: vendasData, error: vendasError } = await supabase
        .from('vendas')
        .select(`
          *,
          influenciadores (
            nome,
            codigo_referencia
          )
        `)
        .order('created_at', { ascending: false });

      if (vendasError) throw vendasError;

      // Carregar saques
      const { data: saquesData, error: saquesError } = await supabase
        .from('saques')
        .select(`
          *,
          influenciadores (
            nome,
            codigo_referencia
          )
        `)
        .order('data_solicitacao', { ascending: false });

      if (saquesError) throw saquesError;

      setVendas(vendasData || []);
      setSaques(saquesData || []);

      // Calcular estatísticas
      const totalFaturamento = vendasData?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const faturamentoMes = vendasData?.filter(v => {
        const vendaDate = new Date(v.created_at);
        return vendaDate.getMonth() === currentMonth && vendaDate.getFullYear() === currentYear;
      }).reduce((sum, v) => sum + Number(v.valor_total), 0) || 0;

      const vendasPendentes = vendasData?.filter(v => v.status_pagamento === 'pendente').length || 0;
      const saquesPendentes = saquesData?.filter(s => s.status === 'pendente').length || 0;

      setStats({
        totalFaturamento,
        faturamentoMes,
        vendasPendentes,
        saquesPendentes
      });

    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string, type: 'venda' | 'saque') => {
    const variants = {
      venda: {
        pendente: 'bg-yellow-500',
        pago: 'bg-green-500',
        cancelado: 'bg-red-500'
      },
      saque: {
        pendente: 'bg-yellow-500',
        aprovado: 'bg-blue-500',
        pago: 'bg-green-500',
        rejeitado: 'bg-red-500'
      }
    };

    const statusLabels = {
      venda: {
        pendente: 'Pendente',
        pago: 'Pago',
        cancelado: 'Cancelado'
      },
      saque: {
        pendente: 'Pendente',
        aprovado: 'Aprovado',
        pago: 'Pago',
        rejeitado: 'Rejeitado'
      }
    };

    return (
      <Badge className={`${variants[type][status as keyof typeof variants[typeof type]]} text-white`}>
        {statusLabels[type][status as keyof typeof statusLabels[typeof type]]}
      </Badge>
    );
  };

  const processarSaque = async (saqueId: string, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from('saques')
        .update({
          status: novoStatus,
          data_processamento: new Date().toISOString()
        })
        .eq('id', saqueId);

      if (error) throw error;
      
      await loadFinanceiroData();
    } catch (error) {
      console.error('Erro ao processar saque:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Financeiro</h1>
        <p className="text-slate-400 mt-2">
          Gerencie vendas, pagamentos e saques
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Faturamento Total
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.totalFaturamento)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Faturamento do Mês
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.faturamentoMes)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Vendas Pendentes
            </CardTitle>
            <CreditCard className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.vendasPendentes}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Saques Pendentes
            </CardTitle>
            <Banknote className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.saquesPendentes}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="vendas" className="data-[state=active]:bg-orange-500">
            Vendas
          </TabsTrigger>
          <TabsTrigger value="saques" className="data-[state=active]:bg-orange-500">
            Saques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendas">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Cliente</TableHead>
                    <TableHead className="text-slate-300">Influenciador</TableHead>
                    <TableHead className="text-slate-300">Números</TableHead>
                    <TableHead className="text-slate-300">Valor</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendas.map((venda) => (
                    <TableRow key={venda.id} className="border-slate-700">
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{venda.nome_cliente}</div>
                          <div className="text-sm text-slate-400">{venda.whatsapp_cliente}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {venda.influenciadores ? (
                          <div>
                            <div>{venda.influenciadores.nome}</div>
                            <div className="text-xs text-slate-500 font-mono">
                              {venda.influenciadores.codigo_referencia}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Venda direta</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {venda.quantidade_numeros}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        R$ {venda.valor_total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(venda.status_pagamento, 'venda')}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {format(new Date(venda.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saques">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Solicitações de Saque</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Influenciador</TableHead>
                    <TableHead className="text-slate-300">Valor</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Data Solicitação</TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saques.map((saque) => (
                    <TableRow key={saque.id} className="border-slate-700">
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{saque.influenciadores.nome}</div>
                          <div className="text-xs text-slate-500 font-mono">
                            {saque.influenciadores.codigo_referencia}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        R$ {saque.valor_solicitado.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(saque.status, 'saque')}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {format(new Date(saque.data_solicitacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {saque.status === 'pendente' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => processarSaque(saque.id, 'aprovado')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => processarSaque(saque.id, 'rejeitado')}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        )}
                        {saque.status === 'aprovado' && (
                          <Button
                            size="sm"
                            onClick={() => processarSaque(saque.id, 'pago')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Marcar como Pago
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
