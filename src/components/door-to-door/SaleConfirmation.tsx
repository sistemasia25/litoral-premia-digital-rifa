import { CheckCircle2, X, Copy, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface SaleConfirmationProps {
  sale: {
    customerName: string;
    customerWhatsApp: string;
    numbers: string[];
    amount: number;
    paymentMethod: string;
    createdAt: string;
    prizes?: Array<{
      number: string;
      prize: string;
      description: string;
    }>;
  };
  onClose: () => void;
}

export function SaleConfirmation({ sale, onClose }: SaleConfirmationProps) {
  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(sale.numbers.join(', '));
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'money':
        return 'Dinheiro';
      case 'pix':
        return 'PIX';
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'debit_card':
        return 'Cartão de Débito';
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-500 flex items-center">
              <CheckCircle2 className="h-8 w-8 mr-2" />
              Venda Registrada com Sucesso!
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Resumo da Venda</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                  <p className="font-medium">{sale.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                  <p className="font-medium">{sale.customerWhatsApp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total</p>
                  <p className="font-medium text-green-600 dark:text-green-500">
                    {formatCurrency(sale.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Forma de Pagamento</p>
                  <p className="font-medium">{formatPaymentMethod(sale.paymentMethod)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">Números Sorteados</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyNumbers}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copiar
                </Button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {sale.numbers.map((number, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-center font-mono font-bold"
                  >
                    {number.padStart(4, '0')}
                  </div>
                ))}
              </div>
            </div>

            {sale.prizes && sale.prizes.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-400 flex items-center mb-3">
                  <Award className="h-5 w-5 mr-2" />
                  Parabéns! Números Premiados
                </h3>
                <div className="space-y-3">
                  {sale.prizes.map((prize, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 p-3 rounded-md border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold">{prize.number.padStart(4, '0')}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {prize.prize}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{prize.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Próximos Passos
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Envie uma mensagem para o cliente com os números sorteados</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>O sorteio será realizado em breve</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>O cliente será notificado automaticamente em caso de prêmio</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  const whatsappUrl = `https://wa.me/${sale.customerWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá ${sale.customerName}, sua compra foi registrada com sucesso!\n\n` +
                    `*Números sorteados:* ${sale.numbers.join(', ')}\n` +
                    `Valor: ${formatCurrency(sale.amount)}\n` +
                    `Forma de pagamento: ${formatPaymentMethod(sale.paymentMethod)}\n\n` +
                    'Aguardem o sorteio! Em caso de prêmio, entraremos em contato.'
                  )}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Enviar WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
