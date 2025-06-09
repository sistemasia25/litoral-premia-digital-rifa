
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type SorteioAtivo = {
  id: string;
  titulo: string;
  descricao: string | null;
  banner_url: string | null;
  preco_por_numero: number;
  quantidade_total_numeros: number;
  numeros_vendidos: number;
  data_sorteio: string;
  premio_principal: string;
  premios_extras: any[];
  status: string;
};

export function useSorteioAtivo() {
  const [sorteio, setSorteio] = useState<SorteioAtivo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarSorteioAtivo = async () => {
      try {
        const { data, error } = await supabase
          .from('sorteios')
          .select('*')
          .eq('status', 'ativo')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setSorteio(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    carregarSorteioAtivo();

    // Escutar mudanças em tempo real
    const subscription = supabase
      .channel('sorteios-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'sorteios' 
        }, 
        () => {
          carregarSorteioAtivo();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { sorteio, isLoading, error };
}
