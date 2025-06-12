
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { StripePaymentModal } from "./StripePaymentModal";
import { PurchaseSummary } from "./PurchaseSummary";
import { CustomerForm } from "./CustomerForm";

type PurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  total: string;
  indicatedBy?: string;
};

export function PurchaseModal({ isOpen, onClose, quantity, total, indicatedBy }: PurchaseModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    whatsapp: "",
    city: ""
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<any>(null);
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    setFormData(prev => ({ ...prev, whatsapp: formattedValue }));
  };

  const handleFinalizePurchase = () => {
    if (!formData.name.trim() || !formData.whatsapp || !formData.city) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsPaymentModalOpen(true);
    }, 1000);
  };

  const handlePaymentSuccess = (saleData: any) => {
    setPurchaseSuccess(saleData);
    setIsPaymentModalOpen(false);
    // Aqui você pode adicionar lógica adicional, como enviar email de confirmação
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  const handleMainModalClose = () => {
    onClose();
    setFormData({ name: "", cpf: "", whatsapp: "", city: "" });
    setPurchaseSuccess(null);
  };

  // Se a compra foi bem-sucedida, mostrar tela de sucesso
  if (purchaseSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-orange-500/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white text-center">Compra Realizada!</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Seus números foram gerados com sucesso
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Pagamento Aprovado!</h3>
              <p className="text-sm text-gray-400 mb-4">
                Seus {purchaseSuccess.quantity} números: {purchaseSuccess.numbers?.join(', ')}
              </p>
              
              {purchaseSuccess.prizes && purchaseSuccess.prizes.length > 0 && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
                  <h4 className="text-yellow-400 font-bold">🎉 Parabéns! Você ganhou!</h4>
                  {purchaseSuccess.prizes.map((prize: any, index: number) => (
                    <p key={index} className="text-yellow-300 text-sm">
                      Número {prize.number}: {prize.prize}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleMainModalClose}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Finalizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-orange-500/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Finalizar Compra</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha seus dados para finalizar a compra
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 h-6 w-6 p-0 text-white hover:bg-gray-800"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6">
            <PurchaseSummary quantity={quantity} total={total} indicatedBy={indicatedBy} />
            <CustomerForm 
              formData={formData} 
              onInputChange={handleInputChange}
              onWhatsAppChange={handleWhatsAppChange}
              onCityChange={handleInputChange}
            />

            <div className="pt-4">
              <Button
                onClick={handleFinalizePurchase}
                disabled={!formData.name || !formData.whatsapp || !formData.city || isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold mb-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Finalizar Compra'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Pagamento seguro via Stripe • Cartão de crédito ou débito
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <StripePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        onSuccess={handlePaymentSuccess}
        saleData={{
          name: formData.name,
          cpf: formData.cpf,
          whatsapp: formData.whatsapp,
          city: formData.city,
          quantity,
          total
        }}
      />
    </>
  );
}
