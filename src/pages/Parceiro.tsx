
import { Eye, Users, DollarSign, ShoppingBag, Copy, Loader2, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { formatCPF, formatPhone, validateCPF } from "@/lib/utils";
import { cn } from "@/lib/utils";

const Parceiro = () => {
  const { toast } = useToast();
  const [saleData, setSaleData] = useState({
    name: "",
    cpf: "",
    whatsapp: "",
    city: "",
    quantity: 1,
    total: "5.00"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode] = useState("MARIA2024");
  const [isCopied, setIsCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Calculate total whenever quantity changes
  useEffect(() => {
    const pricePerTicket = 5;
    const total = (saleData.quantity * pricePerTicket).toFixed(2);
    setSaleData(prev => ({ ...prev, total }));
  }, [saleData.quantity]);

  // Check if it's Friday at 9 AM
  const isFridayNineAM = () => {
    const now = new Date();
    return now.getDay() === 5 && now.getHours() === 9;
  };

  // Generate random numbers for the sale
  const generateRandomNumbers = (quantity: number) => {
    const numbers = [];
    for (let i = 0; i < quantity; i++) {
      numbers.push(Math.floor(Math.random() * 99999).toString().padStart(5, '0'));
    }
    return numbers.join(', ');
  };

  // Dados do dashboard
  const stats = {
    clicksToday: 45,
    salesToday: 8,
    commissionToday: 24.00,
    availableBalance: 380.50,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaleData(prev => ({ ...prev, [name]: value }));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    let formattedValue = numbers;
    if (numbers.length > 9) {
      formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (numbers.length > 6) {
      formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (numbers.length > 3) {
      formattedValue = numbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    setSaleData(prev => ({ ...prev, cpf: formattedValue }));
  };
  
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
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
    
    setSaleData(prev => ({ ...prev, whatsapp: formattedValue }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setSaleData(prev => ({ ...prev, quantity: value }));
    }
  };

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!saleData.name.trim() || !saleData.cpf || !saleData.whatsapp || !saleData.city.trim()) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      
      const cpfNumeros = saleData.cpf.replace(/\D/g, '');
      if (cpfNumeros.length !== 11 || !validateCPF(saleData.cpf)) {
        throw new Error("Por favor, insira um CPF válido.");
      }
      
      const whatsappNumeros = saleData.whatsapp.replace(/\D/g, '');
      if (whatsappNumeros.length < 10 || whatsappNumeros.length > 11) {
        throw new Error("Por favor, insira um número de WhatsApp válido com DDD.");
      }
      
      if (saleData.quantity < 1) {
        throw new Error("A quantidade deve ser maior que zero.");
      }
      
      // Generate numbers for the sale
      const generatedNumbers = generateRandomNumbers(saleData.quantity);
      
      // Simulate sale generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Venda registrada com sucesso!",
        description: `Números gerados: ${generatedNumbers}. Acerto será feito no final do dia.`,
      });
      
      // Reset form
      setSaleData({
        name: "",
        cpf: "",
        whatsapp: "",
        city: "",
        quantity: 1,
        total: "5.00"
      });
      
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

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Código copiado!",
      description: "Código de referência copiado para a área de transferência.",
    });
  };

  const copyReferralLink = () => {
    const link = `https://litoraldasorte.com/r/${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "Link de divulgação copiado para a área de transferência.",
    });
  };

  const handleWithdraw = () => {
    if (!isFridayNineAM()) {
      toast({
        title: "Saque não disponível",
        description: "Saques só podem ser solicitados nas sextas-feiras às 9:00 da manhã.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Saque solicitado!",
      description: `Solicitação de saque de R$ ${withdrawAmount} enviada com sucesso.`,
    });
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard do Influenciador</h1>
            <p className="text-gray-300">Bem-vinda, Maria Oliveira</p>
          </div>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Cliques Hoje</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.clicksToday}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Vendas Hoje</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.salesToday}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Comissão Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">R$ {stats.commissionToday.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Saldo Disponível</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">R$ {stats.availableBalance.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Link de Divulgação e Saque */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Seu Link de Divulgação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Código de Referência</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    value={referralCode} 
                    readOnly 
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button 
                    onClick={copyReferralCode}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {isCopied ? "Copiado!" : "Copiar"}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Link Completo</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    value={`https://litoraldasorte.com/r/${referralCode}`} 
                    readOnly 
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                  <Button 
                    onClick={copyReferralLink}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Copiar Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Solicitar Saque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-sm text-gray-300">Saldo Disponível</div>
                <div className="text-lg font-bold text-green-400">R$ {stats.availableBalance.toFixed(2)}</div>
              </div>
              <div>
                <Label className="text-gray-300">Valor do Saque</Label>
                <Input 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00" 
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <Button 
                onClick={handleWithdraw}
                disabled={!isFridayNineAM() || !withdrawAmount}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isFridayNineAM() ? "Solicitar Saque" : "Disponível sextas 9h"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Venda Porta a Porta */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Venda Porta a Porta</CardTitle>
            <p className="text-gray-300 text-sm">
              Registre uma venda presencial. Os números serão gerados e o acerto será feito no final do dia.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitSale} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nome Completo</Label>
                  <Input
                    name="name"
                    value={saleData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do cliente"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">CPF</Label>
                  <div className="relative">
                    <Input
                      name="cpf"
                      value={saleData.cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      className={cn(
                        "bg-slate-700 border-slate-600 text-white pr-10",
                        saleData.cpf && !validateCPF(saleData.cpf) && "border-red-500"
                      )}
                      required
                    />
                    {saleData.cpf && !validateCPF(saleData.cpf) && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">✕</span>
                    )}
                    {saleData.cpf && validateCPF(saleData.cpf) && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">WhatsApp</Label>
                  <Input
                    name="whatsapp"
                    value={saleData.whatsapp}
                    onChange={handleWhatsAppChange}
                    placeholder="(00) 00000-0000"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Cidade</Label>
                  <Input
                    name="city"
                    value={saleData.city}
                    onChange={handleInputChange}
                    placeholder="Cidade do cliente"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Quantidade de Números</Label>
                  <Input
                    name="quantity"
                    type="number"
                    min="1"
                    value={saleData.quantity}
                    onChange={handleQuantityChange}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <div className="text-sm font-medium text-gray-300">Valor Total</div>
                  <div className="text-2xl font-bold text-orange-400">
                    R$ {saleData.total}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando números...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Gerar Venda
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Parceiro;
