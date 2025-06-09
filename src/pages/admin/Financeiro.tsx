
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminFinanceiro = () => {
  const [vendas, setVendas] = useState([]);
  const [saques, setSaques] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalVendas: 0,
    totalSaques: 0,
    comissoesTotais: 0,
    vendasMes: 0
  });

  // Dados mockados para demonstração
  useEffect(() => {
    // Simular dados de vendas
    setVendas([
      {
        id: '1',
        cliente: 'João Silva',
        whatsapp: '(11) 99999-9999',
        numeros: 10,
        valor: 50.00,
        influenciador: 'Maria Santos',
        comissao: 5.00,
        data: '2024-01-15',
        status: 'pago'
      },
      {
        id: '2',
        cliente: 'Ana Costa',
        whatsapp: '(11) 88888-8888',
        numeros: 5,
        valor: 25.00,
        influenciador: 'Pedro Oliveira',
        comissao: 2.50,
        data: '2024-01-14',
        status: 'pendente'
      }
    ]);

    // Simular dados de saques
    setSaques([
      {
        id: '1',
        influenciador: 'Maria Santos',
        valor: 150.00,
        data: '2024-01-10',
        status: 'processando',
        conta: 'Banco do Brasil - Ag: 1234 - CC: 56789-0'
      },
      {
        id: '2',
        influenciador: 'Pedro Oliveira',
        valor: 75.00,
        data: '2024-01-08',
        status: 'concluido',
        conta: 'Caixa Econômica - Ag: 5678 - CC: 12345-6'
      }
    ]);

    // Simular estatísticas
    setEstatisticas({
      totalVendas: 1250.00,
      totalSaques: 450.00,
      comissoesTotais: 125.00,
      vendasMes: 890.00
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
      case 'concluido':
        return 'bg-green-600';
      case 'pendente':
      case 'processando':
        return 'bg-yellow-600';
      case 'cancelado':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Gestão Financeira</h2>
        <p className="text-gray-400">Acompanhe vendas, comissões e saques</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {estatisticas.totalVendas.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Acumulado geral</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {estatisticas.vendasMes.toFixed(2)}</div>
            <p className="text-xs text-gray-400">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Comissões Totais</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {estatisticas.comissoesTotais.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Acumulado dos influenciadores</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Saques Solicitados</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {estatisticas.totalSaques.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Pendentes e processados</p>
          </CardContent>
        </Card>
      </div>

      {/* Abas de Vendas e Saques */}
      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="vendas" className="text-white data-[state=active]:bg-orange-600">
            Vendas
          </TabsTrigger>
          <TabsTrigger value="saques" className="text-white data-[state=active]:bg-orange-600">
            Saques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendas">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Vendas</CardTitle>
              <CardDescription className="text-gray-400">
                Todas as vendas realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">WhatsApp</TableHead>
                    <TableHead className="text-gray-300">Números</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Influenciador</TableHead>
                    <TableHead className="text-gray-300">Comissão</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendas.map((venda: any) => (
                    <TableRow key={venda.id} className="border-gray-800">
                      <TableCell className="text-white">{venda.cliente}</TableCell>
                      <TableCell className="text-white">{venda.whatsapp}</TableCell>
                      <TableCell className="text-white">{venda.numeros}</TableCell>
                      <TableCell className="text-white">R$ {venda.valor.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{venda.influenciador}</TableCell>
                      <TableCell className="text-white">R$ {venda.comissao.toFixed(2)}</TableCell>
                      <TableCell className="text-white">
                        {new Date(venda.data).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(venda.status)}>
                          {venda.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saques">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Solicitações de Saque</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie os pedidos de saque dos influenciadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Influenciador</TableHead>
                    <TableHead className="text-gray-300">Valor</TableHead>
                    <TableHead className="text-gray-300">Conta</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saques.map((saque: any) => (
                    <TableRow key={saque.id} className="border-gray-800">
                      <TableCell className="text-white">{saque.influenciador}</TableCell>
                      <TableCell className="text-white">R$ {saque.valor.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{saque.conta}</TableCell>
                      <TableCell className="text-white">
                        {new Date(saque.data).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(saque.status)}>
                          {saque.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {saque.status === 'processando' && (
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Aprovar
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                              Rejeitar
                            </Button>
                          </div>
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
};

export default AdminFinanceiro;
