
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type SorteioAtivo = Tables<'sorteios'>;

export function useSorteioAtivo() {
  const [sorteio, setSorteio] = useState<SorteioAtivo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarSorteioAtivo();
  }, []);

  const carregarSorteioAtivo = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sorteios')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Nenhum sorteio encontrado
          setSorteio(null);
          setError('Nenhum sorteio ativo encontrado');
        } else {
          throw error;
        }
      } else {
        setSorteio(data);
        setError(null);
      }
    } catch (error: any) {
      console.error('Erro ao carregar sorteio ativo:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getNumerosSelecionados = () => {
    // Esta função pode ser implementada posteriormente para integrar com a lógica de números selecionados
    return [];
  };

  const getPrecoTotal = (quantidade: number) => {
    if (!sorteio) return 0;
    return Number(sorteio.preco_por_numero) * quantidade;
  };

  return {
    sorteio,
    isLoading,
    error,
    carregarSorteioAtivo,
    getNumerosSelecionados,
    getPrecoTotal
  };
}
