
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseData {
  sale_id: string;
  numbers: string;
  purchase_date: string;
  status: string;
  total_amount: number;
  quantity: number;
}

const MeusNumeros = () => {
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purchasedNumbers, setPurchasedNumbers] = useState<PurchaseData[]>([]);
  const { toast } = useToast();

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
    setWhatsapp(formattedValue);
  };

  const loadPurchasedNumbers = async (whatsappNumber: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_purchased_numbers_by_whatsapp', {
        whatsapp_number: whatsappNumber
      });

      if (error) {
        throw error;
      }

      setPurchasedNumbers(data || []);
    } catch (error) {
      console.error('Erro ao carregar números:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus números. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!whatsapp.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu número de WhatsApp.",
        variant: "destructive"
      });
      return;
    }
    const whatsappNumbers = whatsapp.replace(/\D/g, '');
    if (whatsappNumbers.length < 10 || whatsappNumbers.length > 11) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de WhatsApp válido com DDD.",
        variant: "destructive"
      });
      return;
    }

    await loadPurchasedNumbers(whatsapp);
    setIsLoggedIn(true);
    toast({
      title: "Acesso liberado!",
      description: "Bem-vindo(a) à área dos seus números."
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-900 border-orange-500/20 relative">
          <button 
            onClick={() => window.history.back()}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            aria-label="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Meus Números</CardTitle>
            <p className="text-gray-400">Digite seu WhatsApp para acessar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">WhatsApp</Label>
              <Input 
                value={whatsapp} 
                onChange={handleWhatsAppChange} 
                placeholder="(11) 99999-9999" 
                className="bg-slate-800 border-slate-600 text-white" 
              />
            </div>
            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Acessar Meus Números'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Meus Números</h1>
            <p className="text-gray-300">WhatsApp: {whatsapp}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsLoggedIn(false);
              setPurchasedNumbers([]);
              setWhatsapp("");
            }}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Sair
          </Button>
        </div>

        {/* Números Comprados */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-orange-500">Suas Compras</h2>
          
          {purchasedNumbers.length === 0 ? (
            <Card className="bg-gray-900 border-orange-500/20">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">Nenhuma compra encontrada para este WhatsApp.</p>
              </CardContent>
            </Card>
          ) : (
            purchasedNumbers.map((purchase, index) => (
              <Card key={purchase.sale_id} className="bg-gray-900 border-orange-500/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-white">
                        Compra #{index + 1}
                      </CardTitle>
                      <p className="text-sm text-gray-400">
                        Data: {formatDate(purchase.purchase_date)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Quantidade: {purchase.quantity} números
                      </p>
                      <p className="text-sm text-gray-400">
                        Valor: R$ {purchase.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(purchase.status)}>
                      {getStatusLabel(purchase.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Números:</Label>
                    <p className="text-orange-400 font-mono text-lg">
                      {purchase.numbers || 'Aguardando confirmação do pagamento'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Informações */}
        <Card className="mt-8 bg-gray-900 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-white">Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-300 text-sm">
            <p>• Os números pendentes serão confirmados após a validação do pagamento</p>
            <p>• O sorteio é realizado pela loteria federal</p>
            <p>• Prêmios instantâneos são creditados pelo suporte da empresa</p>
            <p>• Em caso de dúvidas, entre em contato conosco</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeusNumeros;
