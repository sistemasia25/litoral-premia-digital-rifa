
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react";

interface FinancialSummaryCardsProps {
  sales: any[];
  withdrawalRequests: any[];
  pendingReceipts: any[];
}

export function FinancialSummaryCards({ sales, withdrawalRequests, pendingReceipts }: FinancialSummaryCardsProps) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalCommissions = sales.reduce((sum, sale) => sum + sale.partnerCommission, 0);
  const pendingWithdrawals = withdrawalRequests
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);
  const pendingReceiptsValue = pendingReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            +12.5% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Comissões Pagas</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">R$ {totalCommissions.toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            {sales.length} vendas processadas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Saques Pendentes</CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">R$ {pendingWithdrawals.toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            {withdrawalRequests.filter(w => w.status === 'pending').length} solicitações
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Aguardando Recebimento</CardTitle>
          <Users className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">R$ {pendingReceiptsValue.toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            {pendingReceipts.length} vendas porta a porta
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
