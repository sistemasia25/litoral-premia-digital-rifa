
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDoorToDoorSales } from '@/hooks/useDoorToDoorSales';
import { DoorToDoorSaleForm } from '@/components/door-to-door/DoorToDoorSaleForm';
import { PendingDoorToDoorSales } from '@/components/door-to-door/PendingDoorToDoorSales';
import { SalesSummary } from '@/components/door-to-door/SalesSummary';
import { SalesHistory } from '@/components/door-to-door/SalesHistory';
import { SettleSaleDialog } from '@/components/door-to-door/SettleSaleDialog';
import { CancelSaleDialog } from '@/components/door-to-door/CancelSaleDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function DoorToDoorDashboard() {
  const { id: partnerId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('sales');
  const [isRegisteringSale, setIsRegisteringSale] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [settleDialogOpen, setSettleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  const {
    isLoading,
    isProcessing,
    pendingSales,
    loadPendingSales,
    registerSale,
    settleSale,
    cancelSale,
  } = useDoorToDoorSales();

  // Carregar vendas pendentes ao montar o componente
  useEffect(() => {
    if (partnerId) {
      loadPendingSales(partnerId);
    }
  }, [partnerId, loadPendingSales]);

  const handleRegisterSale = async () => {
    // A função onSuccess será chamada pelo DoorToDoorSaleForm
    if (partnerId) {
      await loadPendingSales(partnerId);
    }
    setIsRegisteringSale(false);
  };

  const handleSettleSale = async (saleId: string, amountPaid: number) => {
    try {
      if (!partnerId) return;
      
      await settleSale(partnerId, saleId, amountPaid);
      setSettleDialogOpen(false);
      
      toast({
        title: 'Venda acertada!',
        description: 'O valor foi adicionado ao seu saldo disponível.',
      });
    } catch (error) {
      console.error('Erro ao acertar venda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível acertar a venda. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelSale = async (saleId: string, reason: string) => {
    try {
      if (!partnerId) return;
      
      await cancelSale(partnerId, saleId, reason);
      setCancelDialogOpen(false);
      
      toast({
        title: 'Venda cancelada',
        description: 'A venda foi cancelada e os números estão disponíveis novamente.',
      });
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar a venda. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenSettleDialog = (sale: any) => {
    setSelectedSale(sale);
    setSettleDialogOpen(true);
  };

  const handleOpenCancelDialog = (sale: any) => {
    setSelectedSale(sale);
    setCancelDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendas Porta a Porta</h1>
          <p className="text-slate-400">Gerencie suas vendas presenciais de forma eficiente</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => partnerId && loadPendingSales(partnerId)}
            disabled={isLoading || Boolean(isProcessing)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            onClick={() => setIsRegisteringSale(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>
      </div>

      {/* Resumo de Vendas */}
      {partnerId && <SalesSummary partnerId={partnerId} />}

      <Tabs 
        defaultValue="sales" 
        className="mt-8"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full md:w-auto grid-cols-2 bg-slate-800 border border-slate-700">
          <TabsTrigger 
            value="sales" 
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-orange-400"
          >
            Vendas
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-orange-400"
          >
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Venda */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {isRegisteringSale ? 'Registrar Nova Venda' : 'Venda Rápida'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isRegisteringSale ? (
                    <div className="space-y-4">
                      <DoorToDoorSaleForm 
                        onSuccess={handleRegisterSale}
                        onCancel={() => setIsRegisteringSale(false)}
                      />
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-slate-400 mb-6">
                        Registre uma nova venda porta a porta para começar
                      </p>
                      <Button 
                        onClick={() => setIsRegisteringSale(true)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Venda
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Vendas Pendentes */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Vendas Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <PendingDoorToDoorSales />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              {partnerId ? (
                <SalesHistory partnerId={partnerId} />
              ) : (
                <div className="text-center p-8 text-slate-400">
                  Selecione um parceiro para visualizar o histórico
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      {selectedSale && (
        <>
          <SettleSaleDialog
            isOpen={settleDialogOpen}
            onClose={() => setSettleDialogOpen(false)}
            onConfirm={(amount, notes) => handleSettleSale(selectedSale.id, amount)}
            sale={{
              id: selectedSale.id,
              customerName: selectedSale.customerName,
              amount: selectedSale.amount,
              expectedAmount: selectedSale.amount,
            }}
          />

          <CancelSaleDialog
            isOpen={cancelDialogOpen}
            onClose={() => setCancelDialogOpen(false)}
            onConfirm={(reason) => handleCancelSale(selectedSale.id, reason)}
            sale={{
              customerName: selectedSale.customerName,
              numbers: selectedSale.numbers || [],
            }}
          />
        </>
      )}
    </div>
  );
}
