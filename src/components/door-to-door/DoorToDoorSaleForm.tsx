
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePartner } from '@/hooks/usePartner';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Esquema de validação
const formSchema = z.object({
  customerName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  customerWhatsApp: z.string().min(11, 'WhatsApp inválido').max(15, 'WhatsApp inválido'),
  customerCity: z.string().min(2, 'Cidade inválida'),
  quantity: z.number().min(1, 'Quantidade mínima é 1').max(100, 'Quantidade máxima é 100'),
  paymentMethod: z.enum(['money', 'pix', 'credit_card', 'debit_card']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DoorToDoorSaleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DoorToDoorSaleForm({ onSuccess, onCancel }: DoorToDoorSaleFormProps) {
  const { toast } = useToast();
  const { registerDoorToDoorSale } = usePartner();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      paymentMethod: 'money',
    },
  });

  const quantity = watch('quantity', 1);
  
  // Preços conforme a página principal
  const getTicketPrice = (qty: number) => {
    if (qty >= 10) return 0.99; // Desconto para 10 ou mais
    return 1.99; // Preço normal
  };
  
  const ticketPrice = getTicketPrice(quantity);
  const total = quantity * ticketPrice;

  // Atualiza o valor total quando a quantidade mudar
  useEffect(() => {
    setValue('quantity', Math.max(1, Math.min(100, quantity)));
  }, [quantity, setValue]);

  const formatPhone = (value: string) => {
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
    
    return formattedValue;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await registerDoorToDoorSale({
        customerName: data.customerName,
        customerWhatsApp: data.customerWhatsApp,
        customerCity: data.customerCity,
        paymentMethod: data.paymentMethod,
        amount: total,
        quantity: data.quantity,
        notes: data.notes,
      });

      toast({
        title: 'Venda registrada!',
        description: `Venda de ${quantity} número(s) por ${formatCurrency(total)} registrada com sucesso.`,
      });

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast({
        title: 'Erro ao registrar venda',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao registrar a venda.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nome do Cliente *</Label>
          <Input
            id="customerName"
            placeholder="Nome completo"
            {...register('customerName')}
            className={errors.customerName ? 'border-red-500' : ''}
          />
          {errors.customerName && (
            <p className="text-sm text-red-500">{errors.customerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerWhatsApp">WhatsApp *</Label>
          <Input
            id="customerWhatsApp"
            placeholder="(00) 00000-0000"
            {...register('customerWhatsApp')}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setValue('customerWhatsApp', formatted);
            }}
            className={errors.customerWhatsApp ? 'border-red-500' : ''}
          />
          {errors.customerWhatsApp && (
            <p className="text-sm text-red-500">{errors.customerWhatsApp.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerCity">Cidade *</Label>
          <Input
            id="customerCity"
            placeholder="Cidade"
            {...register('customerCity')}
            className={errors.customerCity ? 'border-red-500' : ''}
          />
          {errors.customerCity && (
            <p className="text-sm text-red-500">{errors.customerCity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
          <Select
            onValueChange={(value: 'money' | 'pix' | 'credit_card' | 'debit_card') =>
              setValue('paymentMethod', value)
            }
            defaultValue="money"
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="money">Dinheiro</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
              <SelectItem value="debit_card">Cartão de Débito</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade de Números *</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setValue('quantity', Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setValue('quantity', parseInt(e.target.value) || 1)}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setValue('quantity', Math.min(100, quantity + 1))}
              disabled={quantity >= 100}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{quantity} número(s) × {formatCurrency(ticketPrice)} = {formatCurrency(total)}</p>
            {quantity >= 10 && (
              <p className="text-green-600 font-medium">🎉 Desconto aplicado! R$ 0,99 por número</p>
            )}
            {quantity < 10 && (
              <p className="text-orange-600">Compre 10+ números e pague apenas R$ 0,99 cada</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Input
            id="notes"
            placeholder="Alguma observação importante?"
            {...register('notes')}
          />
        </div>
      </div>

      <div className="bg-slate-700 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-300">Total a pagar:</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
            <p className="text-xs text-gray-400">Comissão do parceiro: {formatCurrency(total * 0.3)}</p>
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Registrando...' : 'Registrar Venda'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
