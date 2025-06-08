
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { formatPhone } from "@/lib/utils";

const MeusNumeros = () => {
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  // Dados de exemplo do usuário
  const userData = {
    name: "João Silva",
    whatsapp: "(11) 99999-9999",
    purchasedNumbers: [
      { id: 1, numbers: "12345, 67890, 11111", date: "2024-01-15", status: "Confirmado", prize: null },
      { id: 2, numbers: "22222, 33333, 44444", date: "2024-01-14", status: "Pendente", prize: null },
      { id: 3, numbers: "55555, 66666, 77777", date: "2024-01-13", status: "Confirmado", prize: "R$ 100,00" },
    ]
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
    
    setWhatsapp(formattedValue);
  };

  const handleLogin = () => {
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

    setIsLoggedIn(true);
    toast({
      title: "Acesso liberado!",
      description: "Bem-vindo(a) à área dos seus números.",
    });
  };

  const contactWhatsApp = (prize: string) => {
    const message = `Olá! Ganhei um prêmio instantâneo de ${prize} no sorteio. Gostaria de mais informações sobre como receber.`;
    const phoneNumber = "5511999999999"; // Número da empresa
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-900 border-orange-500/20">
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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Acessar Meus Números
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
            <p className="text-gray-300">Olá, {userData.name}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsLoggedIn(false)}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Sair
          </Button>
        </div>

        {/* Números Comprados */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-orange-500">Suas Compras</h2>
          
          {userData.purchasedNumbers.map((purchase) => (
            <Card key={purchase.id} className="bg-gray-900 border-orange-500/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">
                      Compra #{purchase.id}
                    </CardTitle>
                    <p className="text-sm text-gray-400">Data: {purchase.date}</p>
                  </div>
                  <Badge 
                    variant={purchase.status === "Confirmado" ? "default" : "secondary"}
                    className={purchase.status === "Confirmado" ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {purchase.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Números:</Label>
                  <p className="text-orange-400 font-mono text-lg">{purchase.numbers}</p>
                </div>
                
                {purchase.prize && (
                  <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-green-400 font-semibold">🎉 Prêmio Instantâneo!</h3>
                        <p className="text-2xl font-bold text-green-400">{purchase.prize}</p>
                      </div>
                      <Button 
                        onClick={() => contactWhatsApp(purchase.prize)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Falar com a Empresa
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações */}
        <Card className="mt-8 bg-gray-900 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-white">Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-300 text-sm">
            <p>• Os números pendentes serão confirmados após a validação do pagamento</p>
            <p>• O sorteio é realizado ao vivo todas as sextas-feiras</p>
            <p>• Prêmios instantâneos são creditados automaticamente</p>
            <p>• Em caso de dúvidas, entre em contato conosco</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeusNumeros;
