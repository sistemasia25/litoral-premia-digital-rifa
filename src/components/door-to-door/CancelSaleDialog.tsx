import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface CancelSaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  sale: {
    customerName: string;
    numbers: string[];
  };
}

export function CancelSaleDialog({ isOpen, onClose, onConfirm, sale }: CancelSaleDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Por favor, informe o motivo do cancelamento');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(reason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                Cancelar Venda
              </div>
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Tem certeza que deseja cancelar a venda para {sale.customerName}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3">
              <p className="text-sm text-red-200">
                <strong>Atenção:</strong> Esta ação não pode ser desfeita. Ao cancelar esta venda:
              </p>
              <ul className="list-disc list-inside text-red-300 text-sm mt-2 space-y-1">
                <li>Os números serão liberados para nova venda</li>
                <li>O cliente não terá mais acesso aos números</li>
                <li>Um registro do cancelamento será mantido</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-slate-300">
                Motivo do Cancelamento *
              </label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                className={`bg-slate-700 border-slate-600 text-white min-h-[100px] ${error ? 'border-red-500' : ''}`}
                placeholder="Informe o motivo do cancelamento..."
                required
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
            
            <div className="bg-slate-700/50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Números que serão liberados:</h4>
              <div className="flex flex-wrap gap-1">
                {sale.numbers.slice(0, 10).map((num) => (
                  <span key={num} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-600 text-slate-200">
                    {num}
                  </span>
                ))}
                {sale.numbers.length > 10 && (
                  <span className="text-xs text-slate-400 self-center">
                    +{sale.numbers.length - 10} números
                  </span>
                )}
              </div>
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
              Voltar
            </Button>
            <Button 
              type="submit" 
              variant="destructive"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cancelando...
                </>
              ) : (
                'Confirmar Cancelamento'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
