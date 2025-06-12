import { useState } from 'react';
import { useNumerosPremiados, NumeroPremiado } from '@/hooks/useNumerosPremiados';
import { useSorteios } from '@/hooks/useSorteios';
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

interface FormData {
  numero: string;
  premio: string;
  descricao: string;
  dataSorteio: string;
  ativo: boolean;
}

export default function GerenciarPremiacoes() {
  const { sorteioAtivo } = useSorteios();
  const { 
    numerosPremiados, 
    loading, 
    adicionarNumeroPremiado, 
    atualizarNumeroPremiado, 
    removerNumeroPremiado 
  } = useNumerosPremiados(sorteioAtivo?.id);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    numero: '',
    premio: '',
    descricao: '',
    dataSorteio: new Date().toISOString().split('T')[0],
    ativo: true
  });

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    quantidade: '1',
    valor: '',
    descricao: ''
  });

  const resetForm = () => {
    setFormData({
      numero: '',
      premio: '',
      descricao: '',
      dataSorteio: new Date().toISOString().split('T')[0],
      ativo: true
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.premio || !sorteioAtivo) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Número e prêmio são obrigatórios',
      });
      return;
    }

    try {
      const numeroData = {
        sorteio_id: sorteioAtivo.id,
        numero: formData.numero,
        premio: formData.premio,
        descricao: formData.descricao,
        data_sorteio: new Date().toISOString(),
        ativo: formData.ativo,
        status: 'disponivel' as const,
        data_premiacao: null,
        cliente_id: null,
        comprovante_url: null
      };
      
      if (editingId) {
        await atualizarNumeroPremiado(editingId, numeroData);
      } else {
        await adicionarNumeroPremiado(numeroData);
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar número premiado:', error);
    }
  };

  const handleEdit = (numero: NumeroPremiado) => {
    setFormData({
      numero: numero.numero,
      premio: numero.premio,
      descricao: numero.descricao,
      dataSorteio: numero.data_sorteio.split('T')[0],
      ativo: numero.ativo
    });
    setEditingId(numero.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await removerNumeroPremiado(id);
    } catch (error) {
      console.error('Erro ao remover número premiado:', error);
    }
  };

  const toggleStatus = async (numero: NumeroPremiado) => {
    try {
      await atualizarNumeroPremiado(numero.id, { ativo: !numero.ativo });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  // Função para converter string de moeda para número
  const parseMoeda = (valor: string): number => {
    if (!valor) return 0;
    try {
      const valorLimpo = valor
        .replace(/([^\d,])/g, '')
        .replace(/(\d+),(\d*)/, '$1.$2')
        .replace(/,/g, '');
      
      const numero = parseFloat(valorLimpo);
      return isNaN(numero) ? 0 : numero;
    } catch (error) {
      console.error('Erro ao converter moeda:', error);
      return 0;
    }
  };

  // Função para formatar valor em moeda brasileira
  const formatarMoeda = (valor: number | string): string => {
    try {
      const valorNumerico = typeof valor === 'string' ? parseMoeda(valor) : valor;
      if (isNaN(valorNumerico) || valorNumerico <= 0) return '';
      
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(valorNumerico);
    } catch (error) {
      console.error('Erro ao formatar moeda:', error);
      return '';
    }
  };
  
  // Função para validar e formatar o valor monetário durante a digitação
  const formatarValorMonetario = (valor: string): string => {
    if (!valor) return '';
    
    let valorFormatado = valor.replace(/[^\d,]/g, '');
    
    const partes = valorFormatado.split(',');
    if (partes.length > 2) {
      valorFormatado = `${partes[0]},${partes.slice(1).join('')}`;
    }
    
    if (valorFormatado.includes(',')) {
      const [parteInteira, parteDecimal] = valorFormatado.split(',');
      const parteInteiraLimitada = parteInteira.slice(0, 6);
      const parteDecimalLimitada = parteDecimal ? parteDecimal.slice(0, 2) : '';
      
      valorFormatado = parteDecimal ? 
        `${parteInteiraLimitada},${parteDecimalLimitada}` : 
        parteInteiraLimitada;
    } else if (valorFormatado.length > 6) {
      valorFormatado = valorFormatado.slice(0, 6);
    }
    
    return valorFormatado;
  };

  const validarFormulario = (): { valido: boolean; mensagem?: string; campo?: string } => {
    if (!generateForm.quantidade) {
      return { 
        valido: false,
        mensagem: 'A quantidade é obrigatória',
        campo: 'quantidade'
      };
    }
    
    const quantidade = Number(generateForm.quantidade);
    
    if (isNaN(quantidade) || quantidade < 1) {
      return { 
        valido: false, 
        mensagem: 'A quantidade deve ser um número maior que zero',
        campo: 'quantidade'
      };
    }

    const maxNumeros = 100;
    
    if (quantidade > maxNumeros) {
      return { 
        valido: false, 
        mensagem: `A quantidade máxima permitida é ${maxNumeros}`,
        campo: 'quantidade'
      };
    }

    if (!generateForm.valor) {
      return { 
        valido: false,
        mensagem: 'O valor é obrigatório',
        campo: 'valor'
      };
    }
    
    const valorNumerico = parseMoeda(generateForm.valor);
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      return { 
        valido: false, 
        mensagem: 'O valor do prêmio deve ser maior que zero',
        campo: 'valor'
      };
    }

    return { valido: true };
  };

  const [erros, setErros] = useState<Record<string, string>>({});

  const handleGeneratePrizes = async () => {
    const validacao = validarFormulario();
    
    if (!validacao.valido) {
      if (validacao.campo) {
        setErros(prev => ({
          ...prev,
          [validacao.campo!]: validacao.mensagem!
        }));
      }
      
      toast({
        variant: 'destructive',
        title: 'Erro de validação',
        description: validacao.mensagem || 'Por favor, preencha todos os campos corretamente',
      });
      return;
    }
    
    if (!sorteioAtivo) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Nenhum sorteio ativo encontrado',
      });
      return;
    }

    setErros({});
    const quantidade = Number(generateForm.quantidade);
    const valorNumerico = parseMoeda(generateForm.valor);
    
    if (quantidade > 50) {
      toast({
        variant: 'default',
        title: 'Atenção',
        description: `Você está prestes a gerar ${quantidade} números. Isso pode afetar o desempenho.`,
        duration: 5000,
      });
    }

    setIsGenerating(true);
    
    const valorFormatado = formatarMoeda(valorNumerico);
    const descricao = generateForm.descricao || `Prêmio de ${valorFormatado}`;
    
    try {
      for (let i = 0; i < quantidade; i++) {
        let numero: string;
        let tentativas = 0;
        const maxTentativas = 100;
        const numerosExistentes = numerosPremiados.map(n => n.numero);
        
        do {
          numero = Math.floor(100000 + Math.random() * 900000).toString();
          tentativas++;
          
          if (tentativas > maxTentativas) {
            numero = numero + '-' + Math.floor(10 + Math.random() * 90);
            break;
          }
        } while (numerosExistentes.includes(numero));
        
        await adicionarNumeroPremiado({
          sorteio_id: sorteioAtivo.id,
          numero,
          premio: valorFormatado,
          descricao,
          data_sorteio: new Date().toISOString(),
          ativo: true,
          status: 'disponivel',
          data_premiacao: null,
          cliente_id: null,
          comprovante_url: null
        });
      }
      
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
        description: 'Ocorreu um erro ao gerar os números premiados. Tente novamente.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!sorteioAtivo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Nenhum sorteio ativo</h2>
          <p className="text-gray-400">Crie um sorteio primeiro para gerenciar premiações.</p>
        </div>
      </div>
    );
  }

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
            {numerosPremiados?.filter(n => n.ativo).length || 0} ativos
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
                      <div className="flex justify-between items-center">
                        <Label htmlFor="quantidade" className="text-gray-300">
                          Quantidade de Números *
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${
                            generateForm.quantidade && Number(generateForm.quantidade) > 50 ? 'text-yellow-400' : 'text-gray-400'
                          }`}>
                            {generateForm.quantidade || '0'}
                          </span>
                          <span className="text-xs text-gray-500">/</span>
                          <span className="text-xs text-gray-400">100</span>
                        </div>
                        {erros.quantidade && (
                          <p className="text-xs text-red-400 mt-1">
                            {erros.quantidade}
                          </p>
                        )}
                      </div>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        max="100"
                        value={generateForm.quantidade}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || '';
                          setGenerateForm(prev => ({
                            ...prev,
                            quantidade: value === '' ? '' : value.toString()
                          }));
                          
                          // Validação em tempo real
                          if (typeof value === 'number' && value > 100) {
                            setErros(prev => ({
                              ...prev,
                              quantidade: 'Máximo de 100 números permitidos'
                            }));
                          } else if (erros.quantidade) {
                            setErros(prev => {
                              const novosErros = { ...prev };
                              delete novosErros.quantidade;
                              return novosErros;
                            });
                          }
                        }}
                        onFocus={() => setCampoComFoco('quantidade')}
                        onBlur={(e) => {
                          let value = parseInt(e.target.value) || 1;
                          value = Math.max(1, Math.min(100, value));
                          
                          setGenerateForm(prev => ({
                            ...prev,
                            quantidade: value.toString()
                          }));
                          
                          // Validação ao sair do campo
                          validarCampo('quantidade', value);
                          
                          if (value > 50 && value <= 100) {
                            toast({
                              variant: 'default',
                              title: 'Atenção',
                              description: 'Gerar muitos números pode afetar o desempenho',
                              duration: 3000,
                            });
                          }
                        }}
                        className={`bg-slate-700 border ${
                          erros.quantidade ? 'border-red-500 focus-visible:ring-red-500/50' : 'border-slate-600 focus-visible:ring-slate-400'
                        } text-white focus-visible:ring-1`}
                        aria-invalid={!!erros.quantidade}
                        aria-describedby={erros.quantidade ? 'erro-quantidade' : undefined}
                      />
                      {erros.quantidade && (
                        <p id="erro-quantidade" className="text-xs text-red-400 mt-1">
                          {erros.quantidade}
                        </p>
                      )}
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-400">
                          Mín: 1 • Máx: 100
                        </p>
                        {Number(generateForm.quantidade) > 50 && (
                          <p className="text-xs text-yellow-400">
                            ⚠️ Muitos números podem afetar o desempenho
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor" className="text-gray-300">
                        Valor do Prêmio (R$) *
                      </Label>
                      <div className="space-y-1">
                        <div className="relative">
                          <Input
                            id="valor"
                            type="text"
                            inputMode="decimal"
                            placeholder="Ex: 1.250,99"
                            value={generateForm.valor}
                            onChange={(e) => {
                              const valorFormatado = formatarValorMonetario(e.target.value);
                              setGenerateForm(prev => ({
                                ...prev,
                                valor: valorFormatado
                              }));
                            }}
                            onBlur={(e) => {
                              const valorNumerico = parseMoeda(e.target.value);
                              
                              if (valorNumerico > 0) {
                                
                                // Não limpa o valor para permitir correção
                                if (!e.target.value) {
                                  setGenerateForm(prev => ({
                                    ...prev,
                                    valor: ''
                                  }));
                                }
                                
                                // Não mostra toast para não poluir a interface
                              }
                            }}
                            className={`bg-slate-700 border ${
                              erros.valor || (generateForm.valor && parseMoeda(generateForm.valor) <= 0)
                                ? 'border-red-500 focus-visible:ring-red-500/50' 
                                : 'border-slate-600 focus-visible:ring-slate-400'
                            } text-white pl-7 focus-visible:ring-1`}
                            aria-invalid={!!erros.valor}
                            aria-describedby={erros.valor ? 'erro-valor' : undefined}
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            R$
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400">
                            Ex: 1.250,99
                          </p>
                          {erros.valor ? (
                            <p className="text-xs text-red-400">
                              {erros.valor}
                            </p>
                          ) : generateForm.valor ? (
                            <p className="text-xs text-green-400">
                              {formatarMoeda(parseMoeda(generateForm.valor))}
                            </p>
                          ) : (
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-400">
                                Data para o sorteio
                              </p>
                              {erros.dataSorteio && (
                                <p id="erro-data" className="text-xs text-red-400">
                                  {erros.dataSorteio}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao" className="text-gray-300">
                        Descrição (opcional)
                      </Label>
                      <Input
                        id="descricao"
                        value={generateForm.descricao}
                        onChange={(e) => setGenerateForm({ ...generateForm, descricao: e.target.value })}
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
              
              <Button 
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? 'Cancelar' : 'Novo Número'}
              </Button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4 p-4 bg-slate-700 rounded-lg">
              <div>
                <Label htmlFor="numero" className="text-gray-300">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  placeholder="Ex: 0001"
                  className="bg-slate-600 border-slate-500 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="premio" className="text-gray-300">Prêmio</Label>
                <Input
                  id="premio"
                  value={formData.premio}
                  onChange={(e) => setFormData({...formData, premio: e.target.value})}
                  placeholder="Ex: R$ 1.000,00"
                  className="bg-slate-600 border-slate-500 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="descricao" className="text-gray-300">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição detalhada do prêmio"
                  className="bg-slate-600 border-slate-500 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dataSorteio" className="text-gray-300">Data do Sorteio</Label>
                <Input
                  id="dataSorteio"
                  type="date"
                  value={formData.dataSorteio}
                  onChange={(e) => setFormData({...formData, dataSorteio: e.target.value})}
                  className="bg-slate-600 border-slate-500 text-white mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="border-slate-500 text-white hover:bg-slate-600"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId !== null ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {(!numerosPremiados || numerosPremiados.length === 0) ? (
              <p className="text-gray-400 text-center py-4">Nenhum número premiado cadastrado</p>
            ) : (
              (numerosPremiados || []).map((numero, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div>
                    <div className="font-medium text-white">
                      Nº {numero.numero} - {numero.premio}
                      {!numero.ativo && (
                        <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                          Inativo
                        </span>
                      )}
                      {numero.status === 'premiado' && numero.dataPremiacao && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                          Premiado em {format(new Date(numero.dataPremiacao), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      )}
                      {numero.status === 'reservado' && (
                        <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                          Reservado
                        </span>
                      )}
                      {numero.status === 'disponivel' && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          Disponível
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">{numero.descricao}</div>
                    {numero.cliente && (
                      <div className="text-xs text-gray-400">
                        Cliente: {numero.cliente.nome} ({numero.cliente.email})
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleStatus(numero)}
                      className="text-gray-300 hover:bg-slate-500 hover:text-white"
                    >
                      {numero.ativo ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(numero)}
                      className="text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(numero.id)}
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
            {(!numerosPremiados || numerosPremiados.filter(n => n.status === 'premiado').length === 0) ? (
              <p className="text-gray-400 text-center py-4">Nenhum ganhador registrado</p>
            ) : (
              numerosPremiados
                .filter(numero => numero.status === 'premiado' && numero.cliente)
                .sort((a, b) => new Date(b.dataPremiacao || 0).getTime() - new Date(a.dataPremiacao || 0).getTime())
                .map((numero, index) => (
                  <div key={index} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{numero.cliente?.nome || 'Cliente não identificado'}</h3>
                        <p className="text-sm text-gray-300">Nº {numero.numero}</p>
                        <p className="text-sm text-yellow-400">{numero.premio}</p>
                        <p className="text-xs text-gray-400">
                          Premiado em {format(new Date(numero.dataPremiacao || numero.dataSorteio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      {numero.comprovanteUrl && (
                        <a 
                          href={numero.comprovanteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Ver Comprovante
                        </a>
                      )}
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
