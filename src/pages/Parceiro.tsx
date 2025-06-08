
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Link as LinkIcon, Users, DollarSign, ShoppingBag, ClipboardList, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { formatCPF, formatPhone, validateCPF } from "@/lib/utils";
import { cn } from "@/lib/utils";

const Parceiro = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [saleData, setSaleData] = useState({
    name: "",
    cpf: "",
    whatsapp: "",
    city: "",
    quantity: 1,
    total: "5.00"
  });
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total whenever quantity changes
  useEffect(() => {
    const pricePerTicket = 5;
    const total = (saleData.quantity * pricePerTicket).toFixed(2);
    setSaleData(prev => ({ ...prev, total }));
  }, [saleData.quantity]);

  // Dados de exemplo
  const stats = {
    totalSales: 42,
    todaySales: 5,
    totalClicks: 128,
    todayClicks: 12,
    commission: 1260,
    pendingCommission: 420,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove todos os caracteres não numéricos e limita a 11 dígitos
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    // Formatação dinâmica do CPF
    let formattedValue = numbers;
    if (numbers.length > 9) {
      formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (numbers.length > 6) {
      formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (numbers.length > 3) {
      formattedValue = numbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (numbers.length > 0) {
      formattedValue = numbers;
    }
    
    setSaleData(prev => ({
      ...prev,
      cpf: formattedValue
    }));
  };
  
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove todos os caracteres não numéricos e limita a 11 dígitos
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    // Formatação dinâmica do WhatsApp
    let formattedValue = numbers;
    if (numbers.length > 10) {
      formattedValue = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length > 5) {
      formattedValue = numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (numbers.length > 2) {
      formattedValue = numbers.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (numbers.length > 0) {
      formattedValue = numbers.replace(/^(\d*)/, '($1');
    }
    
    setSaleData(prev => ({
      ...prev,
      whatsapp: formattedValue
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setSaleData(prev => ({
        ...prev,
        quantity: value
      }));
    }
  };

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validação básica
      if (!saleData.name.trim() || !saleData.cpf || !saleData.whatsapp || !saleData.city.trim()) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      
      // Validação do CPF
      const cpfNumeros = saleData.cpf.replace(/\D/g, '');
      if (cpfNumeros.length !== 11 || !validateCPF(saleData.cpf)) {
        throw new Error("Por favor, insira um CPF válido.");
      }
      
      // Validação do WhatsApp
      const whatsappNumeros = saleData.whatsapp.replace(/\D/g, '');
      if (whatsappNumeros.length < 10 || whatsappNumeros.length > 11) {
        throw new Error("Por favor, insira um número de WhatsApp válido com DDD.");
      }
      
      // Validação da quantidade
      if (saleData.quantity < 1) {
        throw new Error("A quantidade deve ser maior que zero.");
      }
      
      // Formata os dados para o modal
      const formattedData = {
        ...saleData,
        cpf: formatCPF(saleData.cpf),
        whatsapp: formatPhone(saleData.whatsapp)
      };
      
      // Abre o modal de pagamento
      console.log('Parceiro.tsx: Abrindo modal de pagamento com dados:', formattedData);
      setIsPaymentModalOpen(true);
      
    } catch (error) {
      toast({
        title: "Erro ao processar venda",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePaymentComplete = () => {
    // Aqui você pode adicionar a lógica para processar a venda após o pagamento
    setIsPaymentModalOpen(false);
    
    // Reset form
    setSaleData({
      name: "",
      cpf: "",
      whatsapp: "",
      city: "",
      quantity: 1,
      total: "5.00"
    });
    
    toast({
      title: "Venda concluída!",
      description: `Números gerados para ${saleData.name}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel do Parceiro</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Seu link de afiliado:</span>
          <div className="flex items-center bg-gray-800 rounded px-3 py-1">
            <span className="text-orange-primary">litoralpremia.com/af/12345</span>
            <Button variant="ghost" size="sm" className="ml-2 text-gray-400 hover:text-white">
              <LinkIcon className="w-4 h-4" />
              <span className="ml-1">Copiar</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="visao-geral">
            <BarChart2 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="vendas">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="comissoes">
            <DollarSign className="w-4 h-4 mr-2" />
            Comissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSales}</div>
                <p className="text-xs text-muted-foreground">+{stats.todaySales} hoje</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cliques no Link</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClicks}</div>
                <p className="text-xs text-muted-foreground">+{stats.todayClicks} hoje</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats.commission.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">R$ {stats.pendingCommission} a receber</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((stats.totalSales / Math.max(stats.totalClicks, 1)) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">de cliques em vendas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-gray-500">
              Gráfico de vendas será exibido aqui
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Venda Porta a Porta</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preencha os dados do cliente para registrar uma venda manual
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSale} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={saleData.name}
                      onChange={handleInputChange}
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <div className="relative">
                      <Input
                        id="cpf"
                        name="cpf"
                        value={saleData.cpf}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                        className={cn(
                          "pr-10",
                          saleData.cpf && !validateCPF(saleData.cpf) && "border-red-500"
                        )}
                        required
                      />
                      {saleData.cpf && !validateCPF(saleData.cpf) && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                          ✕
                        </span>
                      )}
                      {saleData.cpf && validateCPF(saleData.cpf) && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      value={saleData.whatsapp}
                      onChange={handleWhatsAppChange}
                      placeholder="(00) 00000-0000"
                      required
                      className={cn(
                        saleData.whatsapp.replace(/\D/g, '').length > 0 && 
                        saleData.whatsapp.replace(/\D/g, '').length < 10 && 
                        "border-yellow-500"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={saleData.city}
                      onChange={handleInputChange}
                      placeholder="Cidade do cliente"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantidade de Números</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={saleData.quantity}
                      onChange={handleQuantityChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 flex flex-col justify-end">
                    <div className="text-sm font-medium">Valor Total</div>
                    <div className="text-2xl font-bold text-orange-primary">
                      R$ {saleData.total}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="bg-orange-primary hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Ir para o Pagamento
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Tabela de histórico de vendas será exibida aqui
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comissoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suas Comissões</CardTitle>
              <p className="text-sm text-muted-foreground">
                Acompanhe suas comissões e pagamentos
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Ganho</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {stats.commission.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20% no último mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">A Receber</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {stats.pendingCommission}</div>
                    <p className="text-xs text-muted-foreground">Próximo pagamento: 05/07</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+5 em relação ao mês passado</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Extrato de Pagamentos</h3>
                <div className="border rounded-md">
                  <div className="h-[200px] flex items-center justify-center text-gray-500">
                    Tabela de extrato será exibida aqui
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        saleData={{
          ...saleData,
          cpf: formatCPF(saleData.cpf) // Garante que o CPF esteja formatado
        }}
      />
    </div>
  );
};

export default Parceiro;
