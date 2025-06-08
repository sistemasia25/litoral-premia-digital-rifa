
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { PaymentModal } from "./PaymentModal";
import { formatCPF, formatPhone, validateCPF } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
    email: "",
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setFormData({ name: "", cpf: "", whatsapp: "", email: "" });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-bold">Finalizar Compra</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Resumo da Compra */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Resumo da Compra</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Quantidade:</span>
                  <span>{quantity} número(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold">R$ {total}</span>
                </div>
                {indicatedBy && (
                  <div className="flex justify-between">
                    <span>Indicado por:</span>
                    <span className="text-green-600 font-medium">{indicatedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <div className="relative">
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    className={cn(
                      "pr-10",
                      formData.cpf && !validateCPF(formData.cpf) && "border-red-500"
                    )}
                    required
                  />
                  {formData.cpf && !validateCPF(formData.cpf) && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      ✕
                    </span>
                  )}
                  {formData.cpf && validateCPF(formData.cpf) && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleWhatsAppChange}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleFinalizePurchase}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading || !formData.name.trim() || !formData.cpf || !formData.whatsapp || !validateCPF(formData.cpf)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Finalizar Compra"
                )}
              </Button>
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
          city: "Online",
          quantity,
          total
        }}
      />
    </>
  );
}
