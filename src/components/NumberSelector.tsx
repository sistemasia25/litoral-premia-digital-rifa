
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const NumberSelector = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number>(1);
  const pricePerNumber = 1.99;

  const quickSelect = (amount: number) => {
    setSelectedNumbers(prev => Math.max(1, prev + amount));
  };

  const updateQuantity = (change: number) => {
    setSelectedNumbers(prev => Math.max(1, prev + change));
  };

  return (
    <Card className="bg-card border-orange-primary/20 p-6 mb-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center">
          🔥 Escolha seus Números da Sorte
        </h3>
        <p className="text-gray-400">
          Selecione quantos números deseja comprar. Quanto mais números, mais chances!
        </p>
      </div>

      {/* Seleção rápida */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Button
          onClick={() => quickSelect(1)}
          className="bg-gray-700 hover:bg-orange-primary text-white border border-gray-600 hover:border-orange-primary transition-all"
          size="lg"
        >
          +1
        </Button>
        <Button
          onClick={() => quickSelect(5)}
          className="bg-gray-700 hover:bg-orange-primary text-white border border-gray-600 hover:border-orange-primary transition-all"
          size="lg"
        >
          +5
        </Button>
        <Button
          onClick={() => quickSelect(10)}
          className="bg-gray-700 hover:bg-orange-primary text-white border border-gray-600 hover:border-orange-primary transition-all"
          size="lg"
        >
          +10
        </Button>
        <Button
          onClick={() => quickSelect(50)}
          className="bg-gray-700 hover:bg-orange-primary text-white border border-gray-600 hover:border-orange-primary transition-all"
          size="lg"
        >
          +50
        </Button>
      </div>

      {/* Contador manual */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          onClick={() => updateQuantity(-1)}
          disabled={selectedNumbers <= 1}
          variant="outline"
          size="lg"
          className="w-12 h-12 border-gray-600 text-white hover:bg-orange-primary hover:border-orange-primary"
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{selectedNumbers}</p>
          <p className="text-sm text-gray-400">Número(s)</p>
        </div>
        
        <Button
          onClick={() => updateQuantity(1)}
          variant="outline"
          size="lg"
          className="w-12 h-12 border-gray-600 text-white hover:bg-orange-primary hover:border-orange-primary"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Preço total */}
      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-orange-primary">
          R$ {(selectedNumbers * pricePerNumber).toFixed(2)}
        </p>
      </div>

      {/* Botão de compra */}
      <Button 
        className="w-full bg-orange-primary hover:bg-orange-secondary text-white font-bold py-4 text-lg pulse-orange"
        size="lg"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Ir para Pagamento
      </Button>
    </Card>
  );
};

export default NumberSelector;
