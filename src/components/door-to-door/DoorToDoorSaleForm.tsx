import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePartner } from '@/hooks/usePartner';
import { useToast } from '@/components/ui/use-toast';
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
  location: z.object({
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),
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
  const [ticketPrice] = useState(5); // Valor fixo por número
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      paymentMethod: 'money',
    },
  });

  const quantity = watch('quantity', 1);
  const total = quantity * ticketPrice;

  // Atualiza o valor total quando a quantidade mudar
  useEffect(() => {
    setValue('quantity', Math.max(1, Math.min(100, quantity)));
  }, [quantity, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await registerDoorToDoorSale({
        ...data,
        amount: total,
        quantity: data.quantity,
      });

      toast({
        title: 'Venda registrada!',
        description: 'A venda foi registrada com sucesso.',
      });

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

  // Função para obter a localização atual
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Erro',
        description: 'Geolocalização não é suportada pelo seu navegador',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('location', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: 'Localização obtida com sucesso'
        });
        
        toast({
          title: 'Localização obtida',
          description: 'Sua localização foi registrada com sucesso!',
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast({
          title: 'Erro ao obter localização',
          description: 'Não foi possível obter sua localização. Por favor, tente novamente.',
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
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
          <p className="text-sm text-muted-foreground">
            {quantity} número(s) × {formatCurrency(ticketPrice)} = {formatCurrency(total)}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Localização</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="w-full"
            >
              Obter Localização Atual
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Sua localização será usada para registrar onde a venda foi feita.
          </p>
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

      <div className="flex justify-between pt-4">
        <div>
          <p className="text-sm text-muted-foreground">Total a pagar:</p>
          <p className="text-2xl font-bold">{formatCurrency(total)}</p>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Registrando...' : 'Registrar Venda'}
          </Button>
        </div>
      </div>
    </form>
  );
}
