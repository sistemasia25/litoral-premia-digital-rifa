
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { PurchaseModal } from "./PurchaseModal";

const NumberSelector = () => {
  const [quantity, setQuantity] = useState(1);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const pricePerNumber = 1.99;
  
  // Calcular o total com desconto para 10 números ou mais
  const calculateTotal = () => {
    if (quantity >= 10) {
      return (quantity * 0.99).toFixed(2);
    }
    return (quantity * pricePerNumber).toFixed(2);
  };

  const total = calculateTotal();

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

  const setQuantityDirect = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNumbers = () => {
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-orange-500/20">
      <h3 className="text-xl font-bold text-center mb-6 text-white">Escolha seus números</h3>
      
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
          className="h-12 w-12 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-500">{quantity}</div>
          <div className="text-sm text-gray-400">números</div>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={increaseQuantity}
          disabled={quantity >= 100}
          className="h-12 w-12 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Botões de quantidade rápida */}
      <div className="flex justify-center space-x-2 mb-6">
        {[1, 5, 10, 20, 50].map((num) => (
          <Button
            key={num}
            variant={quantity === num ? "default" : "outline"}
            size="sm"
            onClick={() => setQuantityDirect(num)}
            className={
              quantity === num
                ? "bg-orange-500 text-white"
                : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            }
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="text-center mb-6">
        <div className="text-sm text-gray-400 mb-2">Total a pagar:</div>
        <div className="text-2xl font-bold text-green-400">R$ {total}</div>
        {quantity >= 10 ? (
          <div className="text-xs text-yellow-400">Promoção: R$ 0,99 por número</div>
        ) : (
          <div className="text-xs text-gray-500">R$ {pricePerNumber.toFixed(2)} por número</div>
        )}
      </div>

      <Button 
        onClick={handleBuyNumbers}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
      >
        Comprar números
      </Button>

      <div className="mt-4 text-center text-xs text-gray-400">
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
