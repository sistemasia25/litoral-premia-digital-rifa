
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { PaymentModal } from "./PaymentModal";
import { formatCPF, formatPhone, validateCPF } from "@/lib/utils";
import { cn } from "@/lib/utils";
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
    whatsapp: ""
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    setFormData(prev => ({ ...prev, cpf: formattedValue }));
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
    if (!formData.name.trim() || !formData.cpf || !formData.whatsapp) {
      return;
    }

    if (!validateCPF(formData.cpf)) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsPaymentModalOpen(true);
    }, 1000);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    onClose();
    setFormData({ name: "", cpf: "", whatsapp: "" });
  };

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
              onCpfChange={handleCpfChange} 
              onWhatsAppChange={handleWhatsAppChange} 
            />

            {/* Botões */}
            <div className="pt-4">
              <Button
                onClick={handleFinalizePurchase}
                disabled={!formData.name || !validateCPF(formData.cpf) || !formData.whatsapp || isLoading}
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
                Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        saleData={{
          name: formData.name,
          cpf: formatCPF(formData.cpf),
          whatsapp: formatPhone(formData.whatsapp),
          quantity,
          total,
          indicatedBy
        }}
      />
    </>
  );
}
