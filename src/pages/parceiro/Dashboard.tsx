import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SimplePartnerLayout } from '@/components/partner/SimplePartnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DoorToDoorDashboard } from '../DoorToDoorDashboard';
import { Withdrawals } from '@/components/partner/Withdrawals';
import { Eye, Users, DollarSign, Link2, Copy, AlertTriangle } from 'lucide-react';
import { usePartner } from '@/hooks/usePartner';
import { formatCurrency } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

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

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, isLoading, error, loadStats } = usePartner() as {
    stats: PartnerStats | null;
    isLoading: boolean;
    error: string | null;
    loadStats: () => Promise<void>;
  };
  
  // Valores padrão para evitar erros de propriedades indefinidas
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
  const [copied, setCopied] = useState('');

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const codigoReferencia = user?.id || 'CARREGANDO...';
  const linkAfiliado = `https://litoralpremia.com/r/${codigoReferencia}`;

  if (isLoading) {
    return (
      <SimplePartnerLayout title="Visão Geral">
        <div className="flex justify-center items-center h-64">
          <Spinner size="large" />
        </div>
      </SimplePartnerLayout>
    );
  }

  if (error) {
    return (
      <SimplePartnerLayout title="Visão Geral">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Ocorreu um erro</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={() => loadStats()}>Tentar Novamente</Button>
        </div>
      </SimplePartnerLayout>
    );
  }

  return (
    <SimplePartnerLayout title="Visão Geral">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo(a) de volta, {user?.name?.split(' ')[0] || 'Parceiro'}!</h1>
          <p className="text-slate-400">Aqui está um resumo do seu desempenho.</p>
        </div>

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

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Link2 className="h-5 w-5 mr-2 text-indigo-400" /> Seus Links de Divulgação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="codigoReferencia" className="block text-sm font-medium text-slate-300 mb-1">Código de Referência</label>
              <div className="flex">
                <Input id="codigoReferencia" type="text" value={codigoReferencia} readOnly className="bg-slate-700 border-slate-600 text-white flex-grow" />
                <Button onClick={() => handleCopy(codigoReferencia, 'código')} variant="outline" className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500">
                  {copied === 'código' ? 'Copiado!' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <label htmlFor="linkAfiliado" className="block text-sm font-medium text-slate-300 mb-1">Link de Afiliado</label>
              <div className="flex">
                <Input id="linkAfiliado" type="text" value={linkAfiliado} readOnly className="bg-slate-700 border-slate-600 text-white flex-grow" />
                <Button onClick={() => handleCopy(linkAfiliado, 'link')} variant="outline" className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500">
                  {copied === 'link' ? 'Copiado!' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <DoorToDoorDashboard />

        <Withdrawals />

      </div>
    </SimplePartnerLayout>
  );
}