
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PrizeNumbers = () => {
  const prizes = [
    { amount: "R$ 100", number: "476907", status: "Disponível" },
    { amount: "R$ 100", number: "33f929", status: "Disponível" },
    { amount: "R$ 100", number: "987416", status: "Disponível" },
    { amount: "R$ 50", number: "184527", status: "Disponível" },
    { amount: "R$ 50", number: "45783", status: "Disponível" }
  ];

  return (
    <Card className="bg-card border-orange-primary/20 p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        🎁 Números Premiados
      </h3>
      <p className="text-gray-400 mb-6">
        Números especiais com valores de prêmio definidos. Garantia já seu!
      </p>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="todos" className="text-white">Todos (25)</TabsTrigger>
          <TabsTrigger value="disponiveis" className="text-white">Disponíveis (13)</TabsTrigger>
          <TabsTrigger value="ganhadores" className="text-white">Ganhadores (7)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="space-y-3 mt-4">
          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
              <div>
                <p className="text-orange-primary font-bold">{prize.amount}</p>
                <p className="text-gray-400 text-sm">📍 Número: {prize.number}</p>
              </div>
              <Button 
                className="bg-orange-primary hover:bg-orange-secondary text-white"
                size="sm"
              >
                Disponível
              </Button>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="disponiveis">
          <p className="text-gray-400">Números disponíveis para compra...</p>
        </TabsContent>
        
        <TabsContent value="ganhadores">
          <p className="text-gray-400">Números já sorteados...</p>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-6">
        <Button variant="outline" className="border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white">
          Ver Mais Números
        </Button>
      </div>
    </Card>
  );
};

export default PrizeNumbers;
