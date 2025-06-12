
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Pedido {
  id: string;
  sorteio_id: string;
  cliente_id: string;
  numeros: string[];
  valor_total: number;
  status: 'pendente' | 'pago' | 'cancelado';
  data_pedido: string;
  created_at: string;
}

export const usePedidos = (sorteioId?: string) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const carregarPedidos = async () => {
    if (!sorteioId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('sorteio_id', sorteioId)
        .order('data_pedido', { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar pedidos',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sorteioId) {
      carregarPedidos();
    }
  }, [sorteioId]);

  return {
    pedidos,
    loading,
    carregarPedidos,
  };
};
