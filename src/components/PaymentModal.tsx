
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check } from "lucide-react";
import QRCode from "react-qr-code";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  saleData: {
    name: string;
    cpf: string;
    whatsapp: string;
    city: string;
    quantity: number;
    total: string;
  };
};

export function PaymentModal({ isOpen, onClose, saleData }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLink, setPaymentLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending");

  useEffect(() => {
    if (isOpen) {
      console.log('PaymentModal: isOpen mudou para true');
    }
  }, [isOpen]);

  // Gerar código Pix de demonstração
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        // Exemplo de Pix Copia e Cola (CHAVE ALEATÓRIA)
        // Em um cenário real, este código viria do seu backend de pagamentos Pix
        setPaymentLink("00020126580014BR.GOV.BCB.PIX0136a6f837f4-a478-42d7-8f0c-f9f1a3c5b2c75204000053039865802BR5925Litoral Premia Digital6009SAO PAULO62070503***6304E5C4"); 
        setIsLoading(false);
        console.log('PaymentModal: Código Pix de demonstração gerado.');
      }, 1000); // Reduzido o tempo para demonstração
      return () => clearTimeout(timer);
    } else {
      // Resetar estado quando o modal é fechado
      setPaymentStatus("pending");
      setPaymentLink("");
      setIsLoading(true); 
    }
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePaymentComplete = () => {
    setPaymentStatus("completed");
    // Em um cenário real, você verificaria o status do pagamento na sua API
    setTimeout(() => {
      onClose();
      setPaymentStatus("pending");
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-orange-500/20">
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl font-bold text-center text-white">Pagamento via PIX</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Escaneie o QR Code ou copie o código
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
            <p className="text-sm text-gray-400">Gerando QR Code de pagamento...</p>
          </div>
        ) : paymentStatus === "completed" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">Pagamento Aprovado!</h3>
            <p className="text-sm text-gray-400">Os números foram gerados com sucesso.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-4 border-2 border-dashed border-orange-500/30 rounded-lg bg-white">
                <QRCode value={paymentLink} size={180} level="H" />
              </div>
            </div>

            {/* Dados do Pagamento */}
            <div className="bg-gray-800 p-4 rounded-lg space-y-3 border border-orange-500/20">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Nome</span>
                <span className="text-sm font-medium text-right text-white">{saleData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Cidade</span>
                <span className="text-sm font-medium text-white">{saleData.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Quantidade</span>
                <span className="text-sm font-medium text-white">{saleData.quantity} números</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Valor</span>
                <span className="text-sm font-bold text-orange-500">R$ {saleData.total}</span>
              </div>
            </div>

            {/* Código PIX Copia e Cola */}
            <div className="space-y-2">
              <p className="text-sm text-gray-300 font-medium">Código PIX (copia e cola)</p>
              <div className="relative">
                <input 
                  type="text" 
                  value={paymentLink} 
                  readOnly 
                  className="w-full p-3 pr-10 text-xs border rounded-md bg-gray-800 border-gray-600 text-white font-mono"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:bg-gray-700"
                  onClick={handleCopyLink}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col space-y-2 pt-2">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handlePaymentComplete}
              >
                Já efetuei o pagamento
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="text-orange-500 border-orange-500 hover:bg-orange-500/10"
              >
                Voltar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
