
import { useState, useEffect } from 'react';

type SorteioAtivo = {
  id: string;
  titulo: string;
  descricao: string;
  banner_url: string;
  preco_por_numero: number;
  quantidade_total_numeros: number;
  data_sorteio: string;
  premio_principal: string;
  premios_extras: any[];
  status: 'ativo' | 'pausado' | 'finalizado' | 'rascunho';
  created_at: string;
  updated_at?: string;
};

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
      
      // Simulando uma requisição assíncrona
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados mockados de um sorteio ativo
      const sorteioMock: SorteioAtivo = {
        id: '1',
        titulo: 'Sorteio de Exemplo',
        descricao: 'Um sorteio incrível com prêmios especiais!',
        banner_url: 'https://via.placeholder.com/800x400',
        preco_por_numero: 10.0,
        quantidade_total_numeros: 100,
        data_sorteio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias a partir de agora
        premio_principal: 'Um prêmio incrível!',
        premios_extras: [
          { nome: 'Segundo Prêmio', descricao: 'Um prêmio muito legal' },
          { nome: 'Terceiro Prêmio', descricao: 'Outro prêmio incrível' }
        ],
        status: 'ativo',
        created_at: new Date().toISOString()
      };
      
      // Para simular que não há sorteio ativo, descomente a linha abaixo
      // throw new Error('Nenhum sorteio ativo encontrado');
      
      setSorteio(sorteioMock);
      setError(null);
    } catch (error: any) {
      console.error('Erro ao carregar sorteio ativo:', error);
      setSorteio(null);
      setError(error.message || 'Nenhum sorteio ativo encontrado');
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
