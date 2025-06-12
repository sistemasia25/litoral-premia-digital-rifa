
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { PurchaseModal } from "./PurchaseModal";
import { useRaffle } from "@/contexts/RaffleContext";

const NumberSelector = () => {
  const [quantity, setQuantity] = useState(1);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { precos, totalNumeros, sales } = useRaffle();
  const { precoPadrao, precoComDesconto, quantidadeMinimaDesconto } = precos;

  const numerosVendidos = useMemo(() => {
    return sales?.filter(s => s.status === 'completed').reduce((acc, sale) => acc + sale.quantity, 0) || 0;
  }, [sales]);

  const totalNumerosRifa = totalNumeros || 100000;
  const numerosDisponiveis = totalNumerosRifa - numerosVendidos;

  const precoPadraoNum = typeof precoPadrao === 'string' ? parseFloat(precoPadrao) : Number(precoPadrao) || 0;
  const precoComDescontoNum = typeof precoComDesconto === 'string' ? parseFloat(precoComDesconto) : Number(precoComDesconto) || 0;
  const quantidadeMinimaDescontoNum = typeof quantidadeMinimaDesconto === 'string' ? parseInt(quantidadeMinimaDesconto) : Number(quantidadeMinimaDesconto) || 0;

  const calculateTotal = () => {
    if (quantidadeMinimaDescontoNum > 0 && quantity >= quantidadeMinimaDescontoNum) {
      return (quantity * precoComDescontoNum).toFixed(2);
    }
    return (quantity * precoPadraoNum).toFixed(2);
  };

  const total = calculateTotal();

  const increaseQuantity = () => {
    if (quantity < numerosDisponiveis) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const setQuantityDirect = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= numerosDisponiveis) {
      setQuantity(newQuantity);
    } else if (newQuantity > numerosDisponiveis) {
      setQuantity(numerosDisponiveis);
    }
  };

  const handleBuyNumbers = () => {
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-orange-500/20">
      <h3 className="text-xl font-bold text-center mb-2 text-white">Escolha seus números</h3>
      <div className="text-center text-sm text-gray-400 mb-6">
        {numerosDisponiveis > 0 ? 
          `Restam ${numerosDisponiveis.toLocaleString('pt-BR')} de ${totalNumerosRifa.toLocaleString('pt-BR')} números!` :
          'Todos os números foram vendidos!'
        }
      </div>
      
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
          disabled={quantity >= numerosDisponiveis || numerosDisponiveis === 0}
          className="h-12 w-12 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        {[1, 5, 10, 20, 50].map((num) => (
          <Button
            key={num}
            variant={quantity === num ? "default" : "outline"}
            size="sm"
            onClick={() => setQuantityDirect(num)}
            disabled={num > numerosDisponiveis}
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
        {quantidadeMinimaDescontoNum > 0 && quantity >= quantidadeMinimaDescontoNum ? (
          <div className="text-xs text-yellow-400">
            Promoção: R$ {precoComDescontoNum.toFixed(2)} por número (acima de {quantidadeMinimaDescontoNum} números)
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            R$ {precoPadraoNum.toFixed(2)} por número
            {quantidadeMinimaDescontoNum > 0 && (
              <span className="block text-yellow-400">
                Compre {quantidadeMinimaDescontoNum} ou mais por R$ {precoComDescontoNum.toFixed(2)} cada
              </span>
            )}
          </div>
        )}
      </div>

      <Button 
        onClick={handleBuyNumbers}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
        disabled={numerosDisponiveis === 0}
      >
        {numerosDisponiveis > 0 ? 'Comprar números' : 'Sorteio Encerrado'}
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
