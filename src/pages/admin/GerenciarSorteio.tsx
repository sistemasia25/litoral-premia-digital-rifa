import { useState, useEffect } from 'react';
import { useRaffle, defaultRaffleData } from '@/contexts/RaffleContext';
import { Pedido, SorteioFinalizado, RaffleData } from '@/types/raffle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy } from 'lucide-react';

export default function GerenciarSorteio() {
  const raffle = useRaffle();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Estado para o formulário de gerenciamento
  const [formData, setFormData] = useState(raffle);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    raffle.endDate ? new Date(raffle.endDate) : undefined
  );
  const [time, setTime] = useState(
    raffle.endDate ? format(new Date(raffle.endDate), 'HH:mm') : '23:59'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para o novo fluxo de finalização
  const [isFinishing, setIsFinishing] = useState(false);
  const [isFinishingLoading, setIsFinishingLoading] = useState(false);
  const [winningNumberInput, setWinningNumberInput] = useState('');
  const [winnerInfo, setWinnerInfo] = useState<Pedido | null>(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const newEndDate = new Date(selectedDate);
      newEndDate.setHours(hours, minutes, 0, 0); // Zera segundos e milissegundos
      setFormData(prev => ({ ...prev, endDate: newEndDate.toISOString() }));
    }
  }, [selectedDate, time]);

  // Efeito para buscar o ganhador conforme o número é digitado
  useEffect(() => {
    if (winningNumberInput.trim() === '') {
      setWinnerInfo(null);
      setSearchMessage('');
      return;
    }

    const handler = setTimeout(() => {
      setIsSearching(true);
      setWinnerInfo(null);

      const foundPedido = raffle.pedidos?.find(
        (pedido) =>
          pedido.status === 'pago' &&
          pedido.numeros.includes(winningNumberInput)
      );

      if (foundPedido) {
        setWinnerInfo(foundPedido);
        setSearchMessage('');
      } else {
        setSearchMessage('Número não comprado ou com pagamento pendente.');
      }
      setIsSearching(false);
    }, 500); // 500ms de debounce para não buscar a cada tecla

    return () => {
      clearTimeout(handler);
    };
  }, [winningNumberInput, raffle.pedidos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;

    // Tratamento especial para upload de imagem
    if (name === 'bannerUrl' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, bannerUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
      return;
    }

    // Se for um campo de preço (dentro do objeto precos)
    if (name.startsWith('precos.')) {
      const fieldName = name.split('.')[1]; // Pega o nome do campo (ex: 'precoPadrao')
      const numericValue = type === 'number' ? parseFloat(value) || 0 : value;
      
      setFormData(prev => ({
        ...prev,
        precos: {
          ...prev.precos,
          [fieldName]: numericValue
        }
      }));
      return;
    }

    // Se for um campo aninhado (como cards.premio.descricao)
    if (name.includes('.')) {
      const [parent, child, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: {
            ...prev[parent][child],
            [field]: value
          }
        }
      }));
      return;
    }

    // Para campos não aninhados
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validação do banner
    if (!formData.bannerUrl) {
      newErrors.bannerUrl = 'Uma imagem de banner é obrigatória';
    }
    
    // Validação dos preços
    if (!formData.precos.precoPadrao || formData.precos.precoPadrao <= 0) {
      newErrors['precos.precoPadrao'] = 'O preço padrão deve ser maior que zero';
    }
    
    if (formData.precos.quantidadeMinimaDesconto > 0 && 
        (!formData.precos.precoComDesconto || formData.precos.precoComDesconto <= 0)) {
      newErrors['precos.precoComDesconto'] = 'O preço com desconto deve ser maior que zero';
    }

    if (!formData.totalNumeros || formData.totalNumeros <= 0) {
      newErrors.totalNumeros = 'A quantidade de números deve ser maior que zero.';
    }
    
    // Validação da data
    if (!selectedDate) {
      newErrors.endDate = 'A data de término é obrigatória';
    } else if (isBefore(selectedDate, new Date())) {
      newErrors.endDate = 'A data de término não pode ser no passado';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Erro de validação',
        description: 'Por favor, corrija os campos destacados antes de salvar.',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Garante que os valores numéricos sejam corretamente convertidos
      const dataToSave = {
        ...formData,
        totalNumeros: Number(formData.totalNumeros) || 0,
        precos: {
          precoPadrao: Number(formData.precos.precoPadrao) || 0,
          precoComDesconto: Number(formData.precos.precoComDesconto) || 0,
          quantidadeMinimaDesconto: Number(formData.precos.quantidadeMinimaDesconto) || 0,
        }
      };
      
      await raffle.updateRaffleData(dataToSave);
      
      toast({
        title: 'Sorteio Atualizado!',
        description: 'As informações do sorteio foram salvas com sucesso.',
      });
      
      navigate('/admin/sorteios');
    } catch (error) {
      console.error('Erro ao salvar sorteio:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleFinishRaffle() {
    if (!winnerInfo) {
      toast({
        variant: 'destructive',
        title: 'Nenhum ganhador selecionado',
        description: 'Por favor, insira um número de bilhete válido e pago.',
      });
      return;
    }

    setIsFinishingLoading(true);

    try {
      // 1. Criar o registro do sorteio finalizado
      const finishedRaffle: SorteioFinalizado = {
        id: winnerInfo.id, // Usa o ID do pedido como ID único
        premioPrincipal: {
          descricao: raffle.cards.premio.descricao,
          imagemUrl: raffle.bannerUrl,
        },
        dataFinalizacao: new Date().toISOString(),
        numeroGanhador: winningNumberInput,
        ganhadorInfo: winnerInfo.cliente,
      };

      // 2. Atualizar o histórico de sorteios
      const newHistory = [...(raffle.historico || []), finishedRaffle];

      // 3. Resetar o sorteio atual para o estado padrão, mantendo o histórico
      const resetData: RaffleData = {
        ...defaultRaffleData,
        historico: newHistory,
      };

      await raffle.updateRaffleData(resetData);

      toast({
        title: 'Sorteio Finalizado com Sucesso!',
        description: `O ganhador do número ${winningNumberInput} foi registrado.`,
      });

      setIsFinishing(false); // Fecha o modal
      setWinnerInfo(null);
      setWinningNumberInput('');

    } catch (error) {
      console.error('Erro ao finalizar o sorteio:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Finalizar',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsFinishingLoading(false);
    }
  }

  // Se não há data de término, significa que não há sorteio ativo
  if (!raffle.endDate) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-4">Nenhum Sorteio Ativo</h1>
        <p className="text-gray-400 mb-8">Crie um novo sorteio para começar a vender números.</p>
        <Button 
          onClick={() => raffle.updateRaffleData(defaultRaffleData)}
          className="bg-green-600 hover:bg-green-700"
        >
          Criar Novo Sorteio
        </Button>
      </div>
    );
  }

  // Renderiza o formulário de gerenciamento se houver um sorteio ativo
  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/admin/sorteios')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <h1 className="text-2xl font-bold text-white mb-8">Gerenciar Sorteio</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção de Informações Visuais */}
        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Informações Visuais</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="bannerUrl" className="text-gray-300">Imagem do Banner</Label>
              <div className="space-y-2">
                <Input 
                  id="bannerUrl" 
                  name="bannerUrl" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleChange} 
                  className={`bg-slate-700 border-slate-600 text-white file:text-white file:bg-slate-600 file:border-none file:px-4 file:py-2 file:mr-4 file:rounded-md ${errors.bannerUrl ? 'border-red-500' : ''}`} 
                />
                {errors.bannerUrl && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.bannerUrl}
                  </p>
                )}
              </div>
              {formData.bannerUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Pré-visualização:</p>
                  <img src={formData.bannerUrl} alt="Pré-visualização do Banner" className="rounded-lg max-w-xs max-h-48 object-cover" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="premio-descricao" className="text-gray-300">Título do Sorteio/Prêmio</Label>
              <Input id="premio-descricao" name="cards.premio.descricao" value={formData.cards.premio.descricao} onChange={handleChange} className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <Label htmlFor="premio-rodape" className="text-gray-300">Descrição do Prêmio (Rodapé)</Label>
              <Input id="premio-rodape" name="cards.premio.rodape" value={formData.cards.premio.rodape} onChange={handleChange} className="bg-slate-700 border-slate-600 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Configurações do Sorteio</h2>
          
          {/* Linha para Quantidade de Números e Preço Padrão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="totalNumeros" className="text-gray-300">Quantidade de Números</Label>
              <div className="space-y-2">
                <Input 
                  id="totalNumeros" 
                  name="totalNumeros" 
                  type="number" 
                  min="1"
                  value={formData.totalNumeros} 
                  onChange={handleChange} 
                  className={`bg-slate-700 border-slate-600 text-white ${errors.totalNumeros ? 'border-red-500' : ''}`} 
                  placeholder="Ex: 100000"
                />
                {errors.totalNumeros && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.totalNumeros}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="precoPadrao" className="text-gray-300">Preço Padrão (R$)</Label>
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input 
                    id="precoPadrao" 
                    name="precos.precoPadrao" 
                    type="number" 
                    step="0.01" 
                    min="0.01"
                    value={formData.precos.precoPadrao} 
                    onChange={handleChange} 
                    className={`bg-slate-700 border-slate-600 text-white pl-8 ${errors['precos.precoPadrao'] ? 'border-red-500' : ''}`} 
                    placeholder="0,00"
                  />
                </div>
                {errors['precos.precoPadrao'] && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors['precos.precoPadrao']}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Linha para Descontos */}
          <h3 className="text-lg font-semibold text-white mt-6 mb-4 border-t border-slate-700 pt-6">Promoção</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantidadeMinimaDesconto" className="text-gray-300">Qtd. Mínima para Desconto</Label>
              <div className="space-y-2">
                <Input 
                  id="quantidadeMinimaDesconto" 
                  name="precos.quantidadeMinimaDesconto" 
                  type="number" 
                  min="0"
                  value={formData.precos.quantidadeMinimaDesconto} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        value: value.toString(),
                        name: 'precos.quantidadeMinimaDesconto'
                      }
                    });
                  }}
                  className={`bg-slate-700 border-slate-600 text-white ${errors['precos.quantidadeMinimaDesconto'] ? 'border-red-500' : ''}`}
                  placeholder="Ex: 10"
                />
                {errors['precos.quantidadeMinimaDesconto'] && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors['precos.quantidadeMinimaDesconto']}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="precoComDesconto" className="text-gray-300">Preço Promocional (R$)</Label>
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input 
                    id="precoComDesconto" 
                    name="precos.precoComDesconto" 
                    type="number" 
                    step="0.01" 
                    min="0.01"
                    value={formData.precos.precoComDesconto} 
                    onChange={handleChange} 
                    className={`bg-slate-700 border-slate-600 text-white pl-8 ${errors['precos.precoComDesconto'] ? 'border-red-500' : ''}`} 
                    placeholder="0,00"
                    disabled={!formData.precos.quantidadeMinimaDesconto || formData.precos.quantidadeMinimaDesconto === 0}
                  />
                </div>
                {errors['precos.precoComDesconto'] && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors['precos.precoComDesconto']}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Data */}
        {/* Seção de Data */}
        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Data do Sorteio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Data de Término</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600 hover:text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time" className="text-gray-300">Hora de Término</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-700">
          <div className="text-sm text-gray-400">
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Corrija os erros antes de salvar
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>

      {/* Botão para finalizar o sorteio */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Finalizar Sorteio</h2>
        <p className="text-gray-400 mb-4">
          Finalize o sorteio atual, registre o vencedor e prepare um novo sorteio.
        </p>
        <Button
          variant="outline"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setIsFinishing(true)}
        >
          Finalizar Sorteio Principal
        </Button>
      </div>

      {/* Modal de Finalização */}
      <Dialog open={isFinishing} onOpenChange={setIsFinishing}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Finalizar Sorteio Principal</DialogTitle>
            <DialogDescription>
              Digite o número do bilhete vencedor para encontrar o comprador e finalizar o sorteio.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="winningNumber" className="text-gray-300">Número do Bilhete Vencedor</Label>
              <Input
                id="winningNumber"
                value={winningNumberInput}
                onChange={(e) => setWinningNumberInput(e.target.value)}
                placeholder="Digite o número"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            {isSearching && <p className="text-sm text-gray-400">Buscando informações do número...</p>}
            {searchMessage && !winnerInfo && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{searchMessage}</AlertDescription>
              </Alert>
            )}
            {winnerInfo && (
              <div className="p-4 bg-slate-700 rounded-lg space-y-2 text-sm">
                <h3 className="font-bold text-white">Informações do Ganhador Encontrado</h3>
                <p><strong className="text-gray-300">Nome:</strong> {winnerInfo.cliente.nome}</p>
                <p><strong className="text-gray-300">Email:</strong> {winnerInfo.cliente.email}</p>
                <p><strong className="text-gray-300">Telefone:</strong> {winnerInfo.cliente.telefone || 'Não informado'}</p>
                <p><strong className="text-gray-300">ID do Pedido:</strong> {winnerInfo.id}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsFinishing(false)}>Cancelar</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleFinishRaffle}
              disabled={!winnerInfo || isFinishingLoading}
            >
              {isFinishingLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finalizando...
                </>
              ) : (
                'Confirmar e Finalizar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

