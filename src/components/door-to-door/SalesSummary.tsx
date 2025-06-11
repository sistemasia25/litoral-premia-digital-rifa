import { useEffect, useState } from 'react';
import { usePartner } from '@/hooks/usePartner';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Clock, RefreshCw, AlertCircle, DollarSign, Info } from 'lucide-react';

interface SalesSummaryProps {
  partnerId: string;
  period?: 'today' | 'week' | 'month' | 'all';
}

interface SummaryData {
  totalSales: number;
  pendingSales: number;
  settledAmount: number;
  pendingAmount: number;
  changeFromLastPeriod: number;
}

export function SalesSummary({ partnerId, period = 'today' }: SalesSummaryProps) {
  const { getDoorToDoorSalesSummary } = usePartner();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData>({
    totalSales: 0,
    pendingSales: 0,
    settledAmount: 0,
    pendingAmount: 0,
    changeFromLastPeriod: 0,
  });

  const periodLabels = {
    today: 'hoje',
    week: 'esta semana',
    month: 'este mês',
    all: 'todas as vendas'
  };

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true);
        const data = await getDoorToDoorSalesSummary(partnerId, period);
        
        // Mapear a resposta para o formato esperado
        setSummary({
          totalSales: data.total || 0,
          pendingSales: 0, // Será implementado no backend
          settledAmount: data.totalAmount || 0,
          pendingAmount: 0, // Será implementado no backend
          changeFromLastPeriod: 0, // Será implementado no backend
        });
      } catch (error) {
        console.error('Erro ao carregar resumo de vendas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [partnerId, period, getDoorToDoorSalesSummary]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Resumo de Vendas</h2>
          <p className="text-sm text-slate-400">
            Visão geral das suas vendas porta a porta {periodLabels[period]}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Período:</span>
          <select 
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={period}
            onChange={(e) => console.log('Period changed:', e.target.value)}
          >
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="all">Todo Período</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Vendas */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total de Vendas</p>
              <p className="text-2xl font-bold text-white mt-1">{summary.totalSales}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-500/10">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className={`mt-2 flex items-center text-xs ${summary.changeFromLastPeriod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {summary.changeFromLastPeriod >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
            )}
            <span>
              {Math.abs(summary.changeFromLastPeriod)}% em relação ao período anterior
            </span>
          </div>
        </div>

        {/* Vendas Pendentes */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Vendas Pendentes</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{summary.pendingSales}</p>
            </div>
            <div className="p-2 rounded-full bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Aguardando acerto
          </div>
        </div>

        {/* Valor Acertado */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Valor Acertado</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {formatCurrency(summary.settledAmount)}
              </p>
            </div>
            <div className="p-2 rounded-full bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Total recebido
          </div>
        </div>

        {/* Valor Pendente */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Valor Pendente</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {formatCurrency(summary.pendingAmount)}
              </p>
            </div>
            <div className="p-2 rounded-full bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            A receber
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center text-sm text-slate-400">
          <Info className="h-4 w-4 mr-2 text-blue-400" />
          <p>
            As vendas pendentes não afetam seu saldo até serem acertadas. 
            Lembre-se de acertar suas vendas diariamente para manter seu fluxo de caixa organizado.
          </p>
        </div>
      </div>
    </div>
  );
}
