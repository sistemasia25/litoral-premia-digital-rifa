
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { PurchaseModal } from "./PurchaseModal";

const NumberSelector = () => {
  const [quantity, setQuantity] = useState(1);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const pricePerNumber = 5;
  const total = (quantity * pricePerNumber).toFixed(2);

  const increaseQuantity = () => {
    if (quantity < 100) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuyNumbers = () => {
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-center mb-6">Escolha seus números</h3>
      
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
          className="h-12 w-12"
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-primary">{quantity}</div>
          <div className="text-sm text-gray-500">números</div>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={increaseQuantity}
          disabled={quantity >= 100}
          className="h-12 w-12"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="text-center mb-6">
        <div className="text-sm text-gray-600 mb-2">Total a pagar:</div>
        <div className="text-2xl font-bold text-green-600">R$ {total}</div>
        <div className="text-xs text-gray-500">R$ {pricePerNumber.toFixed(2)} por número</div>
      </div>

      <Button 
        onClick={handleBuyNumbers}
        className="w-full bg-orange-primary hover:bg-orange-600 text-white py-3 text-lg font-semibold"
      >
        Comprar números
      </Button>

      <div className="mt-4 text-center text-xs text-gray-500">
        Sorteio realizado ao vivo • Pagamento seguro via PIX
      </div>

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        quantity={quantity}
        total={total}
      />
    </div>
  );
};

export default NumberSelector;
