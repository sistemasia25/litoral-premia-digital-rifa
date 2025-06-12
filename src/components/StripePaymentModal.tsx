
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type StripePaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saleData: any) => void;
  saleData: {
    name: string;
    cpf: string;
    whatsapp: string;
    city: string;
    quantity: number;
    total: string;
  };
};

export function StripePaymentModal({ isOpen, onClose, onSuccess, saleData }: StripePaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Criar sessão de pagamento PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && !paymentUrl) {
      createPixPayment();
    }
  }, [isOpen]);

  const createPixPayment = async () => {
    setIsLoading(true);
    try {
      console.log('Creating PIX payment with data:', saleData);
      
      const { data, error } = await supabase.functions.invoke('create-pix-payment', {
        body: { saleData }
      });

      if (error) throw error;

      console.log('PIX payment created:', data);
      setPaymentUrl(data.paymentUrl);
      setSessionId(data.sessionId);
      
    } catch (error) {
      console.error('Error creating PIX payment:', error);
      toast({
        title: 'Erro ao criar pagamento',
        description: 'Não foi possível gerar o pagamento PIX. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!sessionId) return;
    
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data.paid) {
        toast({
          title: 'Pagamento confirmado!',
          description: 'Seus números foram gerados com sucesso.',
        });
        onSuccess(data);
        onClose();
      } else {
        toast({
          title: 'Pagamento pendente',
          description: 'O pagamento ainda está sendo processado.',
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: 'Erro ao verificar pagamento',
        description: 'Não foi possível verificar o status do pagamento.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const openPaymentInNewTab = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-orange-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">Pagamento via PIX</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Finalize sua compra com PIX através do Stripe
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
            <p className="text-sm text-gray-400">Criando pagamento PIX...</p>
          </div>
        ) : (
          <div className="space-y-6">
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

            {paymentUrl && (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300">
                  Clique no botão abaixo para abrir o pagamento PIX em uma nova aba
                </p>
                <Button 
                  onClick={openPaymentInNewTab}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir Pagamento PIX
                </Button>
              </div>
            )}

            {sessionId && (
              <div className="text-center space-y-4">
                <p className="text-xs text-gray-400">
                  Após efetuar o pagamento, clique no botão abaixo para confirmar
                </p>
                <Button 
                  onClick={verifyPayment}
                  disabled={isVerifying}
                  variant="outline"
                  className="w-full text-orange-500 border-orange-500 hover:bg-orange-500/10"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Pagamento
                    </>
                  )}
                </Button>
              </div>
            )}

            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full text-orange-500 border-orange-500 hover:bg-orange-500/10"
            >
              Cancelar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
