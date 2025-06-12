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
      setError(null);
      console.log('Carregando sorteio ativo...');
      
      const { data, error } = await supabase
        .from('sorteios')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar sorteio:', error);
        throw error;
      }
      
      console.log('Sorteio carregado:', data);
      
      const sorteioFormatado = data ? {
        ...data,
        status: data.status as 'ativo' | 'pausado' | 'finalizado' | 'rascunho'
      } : null;
      
      setSorteioAtivo(sorteioFormatado);
      return sorteioFormatado;
    } catch (error: any) {
      console.error('Erro ao carregar sorteio ativo:', error);
      const errorMessage = error.message || 'Erro desconhecido';
      setError(errorMessage);
      setSorteioAtivo(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validarDadosSorteio = (dados: any): string | null => {
    if (!dados.titulo?.trim()) {
      return 'Título é obrigatório';
    }
    if (!dados.descricao?.trim()) {
      return 'Descrição é obrigatória';
    }
    if (!dados.data_fim) {
      return 'Data de fim é obrigatória';
    }
    if (dados.preco_padrao <= 0) {
      return 'Preço padrão deve ser maior que zero';
    }
    if (dados.total_numeros <= 0) {
      return 'Total de números deve ser maior que zero';
    }
    
    // Validar data de fim
    const dataFim = new Date(dados.data_fim);
    if (dataFim <= new Date()) {
      return 'Data de fim deve ser no futuro';
    }

    return null;
  };

  const atualizarSorteio = async (id: string, dados: Partial<Sorteio>) => {
    try {
      console.log('Atualizando sorteio ID:', id, 'com dados:', dados);
      
      // Validar dados
      const erro = validarDadosSorteio(dados);
      if (erro) {
        throw new Error(erro);
      }

      const dadosUpdate = {
        ...dados,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('sorteios')
        .update(dadosUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar sorteio:', error);
        throw new Error(error.message || 'Erro ao atualizar sorteio');
      }

      console.log('Sorteio atualizado:', data);

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
        description: error.message || 'Erro ao atualizar sorteio',
      });
      throw error;
    }
  };

  const criarSorteio = async (dados: Omit<Sorteio, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Criando novo sorteio com dados:', dados);
      
      // Validar dados
      const erro = validarDadosSorteio(dados);
      if (erro) {
        throw new Error(erro);
      }

      // Verificar se já existe sorteio ativo
      const { data: sorteioExistente } = await supabase
        .from('sorteios')
        .select('id')
        .eq('status', 'ativo')
        .maybeSingle();

      if (sorteioExistente) {
        throw new Error('Já existe um sorteio ativo. Finalize-o antes de criar um novo.');
      }

      const { data, error } = await supabase
        .from('sorteios')
        .insert([dados])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar sorteio:', error);
        throw new Error(error.message || 'Erro ao criar sorteio');
      }

      console.log('Sorteio criado:', data);

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
        description: error.message || 'Erro ao criar sorteio',
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
