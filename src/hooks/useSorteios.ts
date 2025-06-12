
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Sorteio {
  id: string;
  titulo: string;
  descricao: string;
  banner_url: string | null;
  preco_padrao: number;
  preco_com_desconto: number;
  quantidade_minima_desconto: number;
  data_fim: string;
  total_numeros: number;
  status: 'ativo' | 'pausado' | 'finalizado' | 'rascunho';
  created_at: string;
  updated_at: string;
}

export const useSorteios = () => {
  const [sorteioAtivo, setSorteioAtivo] = useState<Sorteio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const carregarSorteioAtivo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sorteios')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      // Converter o tipo de status para garantir compatibilidade
      const sorteioFormatado = data ? {
        ...data,
        status: data.status as 'ativo' | 'pausado' | 'finalizado' | 'rascunho'
      } : null;
      
      setSorteioAtivo(sorteioFormatado);
      setError(null);
    } catch (error: any) {
      console.error('Erro ao carregar sorteio ativo:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const atualizarSorteio = async (id: string, dados: Partial<Sorteio>) => {
    try {
      const { data, error } = await supabase
        .from('sorteios')
        .update({ ...dados, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const sorteioFormatado = {
        ...data,
        status: data.status as 'ativo' | 'pausado' | 'finalizado' | 'rascunho'
      };

      setSorteioAtivo(sorteioFormatado);
      toast({
        title: 'Sucesso!',
        description: 'Sorteio atualizado com sucesso.',
      });
      
      return sorteioFormatado;
    } catch (error: any) {
      console.error('Erro ao atualizar sorteio:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: error.message,
      });
      throw error;
    }
  };

  const criarSorteio = async (dados: Omit<Sorteio, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sorteios')
        .insert([dados])
        .select()
        .single();

      if (error) throw error;

      const sorteioFormatado = {
        ...data,
        status: data.status as 'ativo' | 'pausado' | 'finalizado' | 'rascunho'
      };

      setSorteioAtivo(sorteioFormatado);
      toast({
        title: 'Sucesso!',
        description: 'Novo sorteio criado com sucesso.',
      });
      
      return sorteioFormatado;
    } catch (error: any) {
      console.error('Erro ao criar sorteio:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar sorteio',
        description: error.message,
      });
      throw error;
    }
  };

  const finalizarSorteio = async (sorteioId: string, numeroGanhador: string, ganhador: any) => {
    try {
      // Finalizar o sorteio atual
      await supabase
        .from('sorteios')
        .update({ status: 'finalizado' })
        .eq('id', sorteioId);

      // Criar registro no histórico
      await supabase
        .from('sorteios_finalizados')
        .insert([{
          sorteio_original_id: sorteioId,
          premio_principal_descricao: sorteioAtivo?.descricao || '',
          premio_principal_imagem_url: sorteioAtivo?.banner_url,
          data_finalizacao: new Date().toISOString(),
          numero_ganhador: numeroGanhador,
          ganhador_nome: ganhador.nome,
          ganhador_email: ganhador.email,
          ganhador_telefone: ganhador.telefone || null,
        }]);

      // Recarregar sorteio ativo
      await carregarSorteioAtivo();

      toast({
        title: 'Sorteio Finalizado!',
        description: `O ganhador do número ${numeroGanhador} foi registrado.`,
      });
    } catch (error: any) {
      console.error('Erro ao finalizar sorteio:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao finalizar sorteio',
        description: error.message,
      });
      throw error;
    }
  };

  useEffect(() => {
    carregarSorteioAtivo();
  }, []);

  return {
    sorteioAtivo,
    loading,
    error,
    carregarSorteioAtivo,
    atualizarSorteio,
    criarSorteio,
    finalizarSorteio,
  };
};
