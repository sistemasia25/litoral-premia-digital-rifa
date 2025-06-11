
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, CreditCard, User } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestDate: string;
  paymentMethod: 'pix' | 'bank_transfer';
  paymentDetails: any;
}

interface WithdrawalRequestModalProps {
  withdrawal: WithdrawalRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
}

export function WithdrawalRequestModal({ 
  withdrawal, 
  open, 
  onOpenChange, 
  onApprove, 
  onReject 
}: WithdrawalRequestModalProps) {
  if (!withdrawal) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rejeitado</Badge>;
      case 'processed':
        return <Badge className="bg-blue-600">Processado</Badge>;
      default:
        return <Badge className="bg-gray-600">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Solicitação de Saque</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Detalhes da Solicitação
                {getStatusBadge(withdrawal.status)}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Informações completas da solicitação de saque
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span>Parceiro: {withdrawal.partnerName}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <DollarSign className="h-4 w-4" />
                  <span>Valor: R$ {withdrawal.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <CreditCard className="h-4 w-4" />
                  <span>Método: {withdrawal.paymentMethod === 'pix' ? 'PIX' : 'Transferência Bancária'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Data: {formatDate(withdrawal.requestDate)}</span>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div>
                <h4 className="text-white font-medium mb-2">Dados de Pagamento</h4>
                {withdrawal.paymentMethod === 'pix' ? (
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="font-medium">Chave PIX:</span> {withdrawal.paymentDetails.pixKey}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Tipo:</span> {withdrawal.paymentDetails.pixKeyType}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="font-medium">Banco:</span> {withdrawal.paymentDetails.bankName}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Agência:</span> {withdrawal.paymentDetails.bankAgency}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Conta:</span> {withdrawal.paymentDetails.bankAccount}
                    </p>
                  </div>
                )}
              </div>

              {withdrawal.status === 'pending' && (
                <>
                  <Separator className="bg-slate-700" />
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => onApprove(withdrawal.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Aprovar Saque
                    </Button>
                    <Button
                      onClick={() => onReject(withdrawal.id)}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-900"
                    >
                      Rejeitar Saque
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
