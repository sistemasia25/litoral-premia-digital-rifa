import { useState, useEffect } from 'react';
import { useRaffle } from '@/contexts/RaffleContext';
import { useSorteios } from '@/hooks/useSorteios';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore } from 'date-fns';

export default function GerenciarSorteio() {
  const raffle = useRaffle();
  const { sorteioAtivo, atualizarSorteio, criarSorteio, carregarSorteioAtivo } = useSorteios();
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Estado para o formulário
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    bannerUrl: '',
    precoPadrao: 1.99,
    precoComDesconto: 0.99,
    quantidadeMinimaDesconto: 10,
    totalNumeros: 100000,
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime] = useState('23:59');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerUploaded, setBannerUploaded] = useState(false);

  // Carregar dados do sorteio ativo quando disponível
  useEffect(() => {
    console.log('Sorteio ativo carregado:', sorteioAtivo);
    if (sorteioAtivo) {
      setFormData({
        titulo: sorteioAtivo.titulo,
        descricao: sorteioAtivo.descricao,
        bannerUrl: sorteioAtivo.banner_url || '',
        precoPadrao: sorteioAtivo.preco_padrao,
        precoComDesconto: sorteioAtivo.preco_com_desconto,
        quantidadeMinimaDesconto: sorteioAtivo.quantidade_minima_desconto,
        totalNumeros: sorteioAtivo.total_numeros,
      });
      
      const dataFim = new Date(sorteioAtivo.data_fim);
      setSelectedDate(dataFim);
      setTime(format(dataFim, 'HH:mm'));
      setBannerUploaded(!!sorteioAtivo.banner_url);
    }
  }, [sorteioAtivo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Arquivo selecionado para upload:', file);

    try {
      setBannerUploaded(false);
      const url = await uploadImage(file, 'banners');
      console.log('URL retornada do upload:', url);
      
      if (url) {
        setFormData(prev => ({ ...prev, bannerUrl: url }));
        setBannerUploaded(true);
        toast({
          title: 'Banner carregado!',
          description: 'A imagem foi carregada com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro no upload do banner:', error);
      setBannerUploaded(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória';
    }
    
    if (formData.precoPadrao <= 0) {
      newErrors.precoPadrao = 'O preço padrão deve ser maior que zero';
    }
    
    if (formData.quantidadeMinimaDesconto > 0 && formData.precoComDesconto <= 0) {
      newErrors.precoComDesconto = 'O preço com desconto deve ser maior que zero';
    }

    if (formData.totalNumeros <= 0) {
      newErrors.totalNumeros = 'A quantidade de números deve ser maior que zero';
    }
    
    if (!selectedDate) {
      newErrors.dataFim = 'A data de término é obrigatória';
    } else if (isBefore(selectedDate, new Date())) {
      newErrors.dataFim = 'A data de término não pode ser no passado';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando salvamento do sorteio');
    console.log('Dados do formulário:', formData);
    console.log('Data selecionada:', selectedDate);
    console.log('Hora:', time);
    
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
      
      // Combinar data e hora
      const [hours, minutes] = time.split(':').map(Number);
      const dataFim = new Date(selectedDate!);
      dataFim.setHours(hours, minutes, 0, 0);
      
      const dadosSorteio = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        banner_url: formData.bannerUrl || null,
        preco_padrao: formData.precoPadrao,
        preco_com_desconto: formData.precoComDesconto,
        quantidade_minima_desconto: formData.quantidadeMinimaDesconto,
        total_numeros: formData.totalNumeros,
        data_fim: dataFim.toISOString(),
        status: 'ativo' as const,
      };
      
      console.log('Dados preparados para salvamento:', dadosSorteio);
      
      let resultado;
      if (sorteioAtivo) {
        console.log('Atualizando sorteio existente ID:', sorteioAtivo.id);
        resultado = await atualizarSorteio(sorteioAtivo.id, dadosSorteio);
      } else {
        console.log('Criando novo sorteio');
        resultado = await criarSorteio(dadosSorteio);
      }
      
      console.log('Resultado do salvamento:', resultado);
      
      if (resultado) {
        // Recarregar dados
        await carregarSorteioAtivo();
        
        toast({
          title: 'Sucesso!',
          description: sorteioAtivo ? 'Sorteio atualizado com sucesso!' : 'Sorteio criado com sucesso!',
        });
        
        // Pequeno delay antes de navegar para garantir que os dados foram atualizados
        setTimeout(() => {
          navigate('/admin/sorteios');
        }, 500);
      }
    } catch (error: any) {
      console.error('Erro ao salvar sorteio:', error);
      // O erro já é mostrado no hook, não precisa mostrar novamente
    } finally {
      setIsSubmitting(false);
    }
  };

  if (raffle.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/admin/sorteios')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <h1 className="text-2xl font-bold text-white mb-8">
        {sorteioAtivo ? 'Gerenciar Sorteio' : 'Criar Novo Sorteio'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Informações Básicas</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo" className="text-gray-300">Título do Sorteio</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className={`bg-slate-700 border-slate-600 text-white ${errors.titulo ? 'border-red-500' : ''}`}
                placeholder="Ex: Sorteio Avelloz 2025"
              />
              {errors.titulo && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.titulo}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="descricao" className="text-gray-300">Descrição do Prêmio</Label>
              <Input
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className={`bg-slate-700 border-slate-600 text-white ${errors.descricao ? 'border-red-500' : ''}`}
                placeholder="Ex: Avelloz 2025 0km"
              />
              {errors.descricao && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.descricao}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Banner do Sorteio</h2>
          
          {formData.bannerUrl && (
            <div className="mb-4">
              <img 
                src={formData.bannerUrl} 
                alt="Banner do Sorteio" 
                className="w-full h-auto max-h-80 object-cover rounded-lg"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', formData.bannerUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('Imagem carregada com sucesso:', formData.bannerUrl)}
              />
            </div>
          )}
          
          <div>
            <Label className="block text-gray-300 mb-2">Upload do Banner</Label>
            <label className={`flex items-center justify-center px-4 py-8 border border-dashed rounded-md cursor-pointer transition-colors ${
              uploading ? 'border-blue-500 bg-blue-500/10' : 
              bannerUploaded ? 'border-green-500 bg-green-500/10' :
              'border-gray-600 hover:bg-slate-700'
            }`}>
              <div className="text-center">
                {uploading ? (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-blue-400 animate-pulse" />
                    <span className="text-blue-300">Enviando...</span>
                  </>
                ) : bannerUploaded ? (
                  <>
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    <span className="text-green-300">Banner carregado com sucesso!</span>
                    <p className="text-xs text-gray-500 mt-1">Clique para alterar</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-gray-300">Clique para selecionar ou arraste uma imagem</span>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG até 5MB</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleBannerUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Configurações */}
        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Configurações</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="totalNumeros" className="text-gray-300">Quantidade de Números</Label>
              <Input
                id="totalNumeros"
                name="totalNumeros"
                type="number"
                min="1"
                value={formData.totalNumeros}
                onChange={handleChange}
                className={`bg-slate-700 border-slate-600 text-white ${errors.totalNumeros ? 'border-red-500' : ''}`}
              />
              {errors.totalNumeros && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.totalNumeros}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="precoPadrao" className="text-gray-300">Preço por Número (R$)</Label>
              <Input
                id="precoPadrao"
                name="precoPadrao"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.precoPadrao}
                onChange={handleChange}
                className={`bg-slate-700 border-slate-600 text-white ${errors.precoPadrao ? 'border-red-500' : ''}`}
              />
              {errors.precoPadrao && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.precoPadrao}
                </p>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mt-6 mb-4 border-t border-slate-700 pt-6">Promoção</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="quantidadeMinimaDesconto" className="text-gray-300">Qtd. Mínima para Desconto</Label>
              <Input
                id="quantidadeMinimaDesconto"
                name="quantidadeMinimaDesconto"
                type="number"
                min="0"
                value={formData.quantidadeMinimaDesconto}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="precoComDesconto" className="text-gray-300">Preço Promocional (R$)</Label>
              <Input
                id="precoComDesconto"
                name="precoComDesconto"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.precoComDesconto}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={formData.quantidadeMinimaDesconto === 0}
              />
            </div>
          </div>
        </div>

        {/* Data e Hora */}
        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Data do Sorteio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Data de Término</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600 hover:text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : <span>Escolha uma data</span>}
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
              {errors.dataFim && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dataFim}
                </p>
              )}
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

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? 'Salvando...' : (sorteioAtivo ? 'Atualizar Sorteio' : 'Criar Sorteio')}
          </Button>
        </div>
      </form>
    </div>
  );
}
