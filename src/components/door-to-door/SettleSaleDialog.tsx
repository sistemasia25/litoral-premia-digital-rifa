import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';

interface SettleSaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, notes: string) => Promise<void>;
  sale: {
    id: string;
    customerName: string;
    amount: number;
    expectedAmount: number;
  };
}

export function SettleSaleDialog({ isOpen, onClose, onConfirm, sale }: SettleSaleDialogProps) {
  const [amount, setAmount] = useState(sale.expectedAmount.toString());
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(amountValue, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const difference = parseFloat(amount) - sale.expectedAmount;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Acertar Venda</DialogTitle>
            <DialogDescription className="text-slate-400">
              Confirme os detalhes do pagamento recebido de {sale.customerName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expectedAmount" className="text-slate-300">
                Valor Esperado
              </Label>
              <Input
                id="expectedAmount"
                value={formatCurrency(sale.expectedAmount)}
                disabled
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-300">
                Valor Recebido *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
              {!isNaN(difference) && difference !== 0 && (
                <p className={`text-xs ${difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {difference > 0 ? `+${formatCurrency(difference)}` : formatCurrency(difference)} 
                  {difference > 0 ? ' (Troco)' : ' (Falta)'}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-300">
                Observações (opcional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                placeholder="Alguma observação sobre o pagamento?"
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : (
                'Confirmar Pagamento'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
