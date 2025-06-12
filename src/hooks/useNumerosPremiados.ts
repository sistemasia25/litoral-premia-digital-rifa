
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface NumeroPremiado {
  id: string;
  sorteio_id: string;
  numero: string;
  premio: string;
  descricao: string;
  data_sorteio: string;
  ativo: boolean;
  status: 'disponivel' | 'reservado' | 'premiado';
  data_premiacao: string | null;
  cliente_id: string | null;
  comprovante_url: string | null;
  cliente?: {
    nome: string;
    email: string;
    telefone?: string;
  };
}

export const useNumerosPremiados = (sorteioId?: string) => {
  const [numerosPremiados, setNumerosPremiados] = useState<NumeroPremiado[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const carregarNumerosPremiados = async () => {
    if (!sorteioId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('numeros_premiados')
        .select(`
          *,
          cliente:clientes(nome, email, telefone)
        `)
        .eq('sorteio_id', sorteioId)
        .order('numero');

      if (error) throw error;
      
      // Converter status string para tipo union
      const numerosFormatados = (data || []).map(numero => ({
        ...numero,
        status: numero.status as 'disponivel' | 'reservado' | 'premiado'
      }));
      
      setNumerosPremiados(numerosFormatados);
    } catch (error: any) {
      console.error('Erro ao carregar números premiados:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar números premiados',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarNumeroPremiado = async (numero: Omit<NumeroPremiado, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('numeros_premiados')
        .insert([numero])
        .select()
        .single();

      if (error) throw error;
      
      await carregarNumerosPremiados();
      toast({
        title: 'Sucesso!',
        description: 'Número premiado adicionado com sucesso.',
      });
      
      return data;
    } catch (error: any) {
      console.error('Erro ao adicionar número premiado:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar número',
        description: error.message,
      });
      throw error;
    }
  };

  const atualizarNumeroPremiado = async (id: string, dados: Partial<NumeroPremiado>) => {
    try {
      const { data, error } = await supabase
        .from('numeros_premiados')
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await carregarNumerosPremiados();
      toast({
        title: 'Sucesso!',
        description: 'Número premiado atualizado com sucesso.',
      });
      
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar número premiado:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar número',
        description: error.message,
      });
      throw error;
    }
  };

  const removerNumeroPremiado = async (id: string) => {
    try {
      const { error } = await supabase
        .from('numeros_premiados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await carregarNumerosPremiados();
      toast({
        title: 'Sucesso!',
        description: 'Número premiado removido com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao remover número premiado:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover número',
        description: error.message,
      });
      throw error;
    }
  };

  useEffect(() => {
    if (sorteioId) {
      carregarNumerosPremiados();
    }
  }, [sorteioId]);

  return {
    numerosPremiados,
    loading,
    carregarNumerosPremiados,
    adicionarNumeroPremiado,
    atualizarNumeroPremiado,
    removerNumeroPremiado,
  };
};
