
import { useState } from 'react';
import { useRaffle } from '@/contexts/RaffleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Zap,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

export default function GerenciarPremiacoes() {
  const raffle = useRaffle();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    quantidade: '1',
    valor: '',
    descricao: ''
  });

  const handleGeneratePrizes = async () => {
    if (!raffle.activeRaffle) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Nenhum sorteio ativo encontrado',
      });
      return;
    }

    const quantidade = Number(generateForm.quantidade);
    const valor = parseFloat(generateForm.valor.replace(',', '.'));
    
    if (!quantidade || quantidade < 1 || !valor || valor <= 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor, preencha todos os campos corretamente',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Gerar números aleatórios únicos
      const numerosExistentes = raffle.numerosPremiados.map(n => n.number);
      const novosNumeros: number[] = [];
      
      while (novosNumeros.length < quantidade) {
        const numero = Math.floor(Math.random() * raffle.totalNumeros) + 1;
        if (!numerosExistentes.includes(numero) && !novosNumeros.includes(numero)) {
          novosNumeros.push(numero);
        }
      }

      // Inserir números premiados no banco
      const { error } = await supabase
        .from('winning_numbers')
        .insert(
          novosNumeros.map(numero => ({
            raffle_id: raffle.activeRaffle!.id,
            number: numero,
            prize_id: null // Pode ser associado a um prêmio específico depois
          }))
        );

      if (error) {
        throw error;
      }

      // Atualizar dados
      await raffle.refreshRaffle();
      
      setShowGenerateModal(false);
      setGenerateForm({
        quantidade: '1',
        valor: '',
        descricao: ''
      });
      
      toast({
        title: 'Sucesso!',
        description: `${quantidade} número(s) premiado(s) gerado(s) com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao gerar números premiados:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao gerar os números premiados',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteWinningNumber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('winning_numbers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await raffle.refreshRaffle();
      
      toast({
        title: 'Removido',
        description: 'Número premiado removido com sucesso',
      });
    } catch (error) {
      console.error('Erro ao remover número premiado:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao remover número premiado',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/sorteios')} 
            className="mb-4 sm:mb-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-white text-center sm:text-left">
          Gerenciar Premiações
        </h1>
        <div className="w-full sm:w-auto flex justify-end">
          <div className="text-sm text-gray-400 bg-slate-800 px-3 py-1 rounded-full">
            {raffle?.numerosPremiados?.length || 0} números premiados
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seção de Números Premiados */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Números Premiados</h2>
            <div className="flex space-x-2">
              <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Gerar Números
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Gerar Números Premiados</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantidade" className="text-gray-300">
                        Quantidade de Números
                      </Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        max="100"
                        value={generateForm.quantidade}
                        onChange={(e) => setGenerateForm(prev => ({
                          ...prev,
                          quantidade: e.target.value
                        }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="valor" className="text-gray-300">
                        Valor do Prêmio (R$)
                      </Label>
                      <Input
                        id="valor"
                        type="text"
                        placeholder="Ex: 1250.99"
                        value={generateForm.valor}
                        onChange={(e) => setGenerateForm(prev => ({
                          ...prev,
                          valor: e.target.value
                        }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao" className="text-gray-300">
                        Descrição (opcional)
                      </Label>
                      <Input
                        id="descricao"
                        value={generateForm.descricao}
                        onChange={(e) => setGenerateForm(prev => ({
                          ...prev,
                          descricao: e.target.value
                        }))}
                        placeholder="Ex: Prêmio em dinheiro"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowGenerateModal(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleGeneratePrizes}
                      disabled={isGenerating}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        'Gerar Números'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {(!raffle?.numerosPremiados || raffle.numerosPremiados.length === 0) ? (
              <p className="text-gray-400 text-center py-4">Nenhum número premiado cadastrado</p>
            ) : (
              (raffle?.numerosPremiados || []).map((numero) => (
                <div 
                  key={numero.id} 
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div>
                    <div className="font-medium text-white">
                      Nº {numero.number}
                      {numero.winner_profile_id && numero.claimed_at && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                          Premiado em {format(new Date(numero.claimed_at), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      )}
                      {!numero.winner_profile_id && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          Disponível
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">Número premiado do sorteio</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteWinningNumber(numero.id)}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Seção de Últimos Ganhadores */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Últimos Ganhadores</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {(!raffle?.numerosPremiados || raffle.numerosPremiados.filter(n => n.winner_profile_id).length === 0) ? (
              <p className="text-gray-400 text-center py-4">Nenhum ganhador registrado</p>
            ) : (
              raffle.numerosPremiados
                .filter(numero => numero.winner_profile_id && numero.claimed_at)
                .sort((a, b) => new Date(b.claimed_at || 0).getTime() - new Date(a.claimed_at || 0).getTime())
                .map((numero) => (
                  <div key={numero.id} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">Ganhador #{numero.number}</h3>
                        <p className="text-sm text-gray-300">Nº {numero.number}</p>
                        <p className="text-sm text-yellow-400">Prêmio conquistado</p>
                        <p className="text-xs text-gray-400">
                          Premiado em {format(new Date(numero.claimed_at || numero.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
