
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, DollarSign, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 12.234</div>
            <p className="text-xs text-gray-400">+20.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Números Vendidos</CardTitle>
            <BarChart2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1.234</div>
            <p className="text-xs text-gray-400">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Influenciadores Ativos</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">45</div>
            <p className="text-xs text-gray-400">+3 novos este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24.5%</div>
            <p className="text-xs text-gray-400">+2.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Informações Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Vendas Recentes</CardTitle>
            <CardDescription className="text-gray-400">Últimas transações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">João Silva</p>
                  <p className="text-gray-400 text-sm">10 números</p>
                </div>
                <p className="text-green-500">R$ 50,00</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Maria Santos</p>
                  <p className="text-gray-400 text-sm">5 números</p>
                </div>
                <p className="text-green-500">R$ 25,00</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Pedro Oliveira</p>
                  <p className="text-gray-400 text-sm">20 números</p>
                </div>
                <p className="text-green-500">R$ 100,00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sorteio Ativo</CardTitle>
            <CardDescription className="text-gray-400">Status do sorteio atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Prêmio Principal:</span>
                <span className="text-white">Honda Biz 0km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data do Sorteio:</span>
                <span className="text-white">31/12/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Números Vendidos:</span>
                <span className="text-white">1.234 / 10.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Progresso:</span>
                <span className="text-white">12.34%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
