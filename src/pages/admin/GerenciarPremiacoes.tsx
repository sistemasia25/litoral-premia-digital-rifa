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
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
}

interface FormData {
  numero: string;
  premio: string;
  descricao: string;
  dataSorteio: string; // Mantido para compatibilidade, mas será removido em breve
  ativo: boolean;
  status?: 'disponivel' | 'reservado' | 'premiado';
  dataPremiacao?: string | null;
  cliente?: Cliente | null;
  comprovanteUrl?: string;
}

export default function GerenciarPremiacoes() {
  const raffle = useRaffle();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
    setEditingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.premio) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Número e prêmio são obrigatórios',
      });
      return;
    }

    const updatedNumerosPremiados = [...(raffle?.numerosPremiados || [])];
    
    const numeroData = {
      ...formData,
      status: 'disponivel' as const,
      dataPremiacao: null,
      cliente: null,
      comprovanteUrl: undefined
    };
    
    if (editingIndex !== null) {
      // Mantém os dados existentes de status e cliente ao atualizar
      updatedNumerosPremiados[editingIndex] = {
        ...numeroData,
        status: updatedNumerosPremiados[editingIndex].status || 'disponivel',
        dataPremiacao: updatedNumerosPremiados[editingIndex].dataPremiacao || null,
        cliente: updatedNumerosPremiados[editingIndex].cliente || null,
        comprovanteUrl: updatedNumerosPremiados[editingIndex].comprovanteUrl
      };
    } else {
      updatedNumerosPremiados.push(numeroData);
    }

    raffle.updateRaffleData({ numerosPremiados: updatedNumerosPremiados });
    
    toast({
      title: 'Sucesso!',
      description: `Número ${formData.numero} ${editingIndex !== null ? 'atualizado' : 'adicionado'} com sucesso`,
    });
    
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    if (!raffle?.numerosPremiados?.[index]) return;
    const numero = raffle.numerosPremiados[index];
    setFormData({
      numero: numero.numero,
      premio: numero.premio,
      descricao: numero.descricao,
      dataSorteio: numero.dataSorteio.split('T')[0],
      ativo: numero.ativo
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    if (!raffle?.numerosPremiados) return;
    const updatedNumerosPremiados = raffle.numerosPremiados.filter((_, i) => i !== index);
    raffle.updateRaffleData({ numerosPremiados: updatedNumerosPremiados });
    
    toast({
      title: 'Removido',
      description: 'Número premiado removido com sucesso',
    });
  };

  const toggleStatus = (index: number) => {
    if (!raffle?.numerosPremiados?.[index]) return;
    const updatedNumerosPremiados = [...(raffle.numerosPremiados || [])];
    updatedNumerosPremiados[index] = {
      ...updatedNumerosPremiados[index],
      ativo: !updatedNumerosPremiados[index].ativo
    };
    
    raffle.updateRaffleData({ numerosPremiados: updatedNumerosPremiados });
    
    toast({
      title: 'Status Atualizado',
      description: `Número ${updatedNumerosPremiados[index].numero} ${updatedNumerosPremiados[index].ativo ? 'ativado' : 'desativado'}`,
    });
  };

  // Função para converter string de moeda para número
  const parseMoeda = (valor: string): number => {
    if (!valor) return 0;
    try {
      // Remove todos os caracteres não numéricos, exceto a primeira vírgula
      const valorLimpo = valor
        .replace(/([^\d,])/g, '') // Mantém apenas dígitos e vírgulas
        .replace(/(\d+),(\d*)/, '$1.$2') // Substitui a primeira vírgula por ponto
        .replace(/,/g, ''); // Remove quaisquer outras vírgulas
      
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
      // Se for string, converte para número
      const valorNumerico = typeof valor === 'string' ? parseMoeda(valor) : valor;
      
      // Se não for um número válido, retorna string vazia
      if (isNaN(valorNumerico) || valorNumerico <= 0) return '';
      
      // Formata o valor como moeda brasileira
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
    // Se for vazio, retorna vazio
    if (!valor) return '';
    
    // Remove todos os caracteres não numéricos, exceto a primeira vírgula
    let valorFormatado = valor.replace(/[^\d,]/g, '');
    
    // Remove vírgulas extras, mantendo apenas a primeira
    const partes = valorFormatado.split(',');
    if (partes.length > 2) {
      valorFormatado = `${partes[0]},${partes.slice(1).join('')}`;
    }
    
    // Se tiver vírgula, garante que tenha no máximo 2 casas decimais
    if (valorFormatado.includes(',')) {
      const [parteInteira, parteDecimal] = valorFormatado.split(',');
      
      // Limita a parte inteira a 6 dígitos
      const parteInteiraLimitada = parteInteira.slice(0, 6);
      
      // Limita a parte decimal a 2 dígitos
      const parteDecimalLimitada = parteDecimal ? 
        parteDecimal.slice(0, 2) : 
        '';
      
      valorFormatado = parteDecimal ? 
        `${parteInteiraLimitada},${parteDecimalLimitada}` : 
        parteInteiraLimitada;
    } else if (valorFormatado.length > 6) {
      // Se não tiver vírgula, limita a 6 dígitos
      valorFormatado = valorFormatado.slice(0, 6);
    }
    
    return valorFormatado;
  };

  const validarFormulario = (): { valido: boolean; mensagem?: string; campo?: string } => {
    // Validação da quantidade
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

    // Validação do valor
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
    
    // Data atual para registro do prêmio
    const dataAtual = new Date().toISOString();

    return { valido: true };
  };

  const [erros, setErros] = useState<Record<string, string>>({});
  const [campoComFoco, setCampoComFoco] = useState<string | null>(null);

  const validarCampo = (campo: string, valor: any) => {
    const validacao = validarFormulario();
    if (!validacao.valido && validacao.campo === campo) {
      setErros(prev => ({
        ...prev,
        [campo]: validacao.mensagem || 'Campo inválido'
      }));
      return false;
    } else {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[campo];
        return novosErros;
      });
      return true;
    }
  };

  const handleGeneratePrizes = async () => {
    // Valida o formulário
    const validacao = validarFormulario();
    
    if (!validacao.valido) {
      // Atualiza os erros para exibição nos campos
      if (validacao.campo) {
        setErros(prev => ({
          ...prev,
          [validacao.campo!]: validacao.mensagem!
        }));
        
        // Rola até o primeiro campo com erro
        setTimeout(() => {
          const elemento = document.getElementById(validacao.campo!);
          if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            elemento.focus({ preventScroll: true });
          }
        }, 100);
      }
      
      toast({
        variant: 'destructive',
        title: 'Erro de validação',
        description: validacao.mensagem || 'Por favor, preencha todos os campos corretamente',
      });
      return;
    }
    
    // Limpa os erros se o formulário for válido
    setErros({});
    setCampoComFoco(null);

    const quantidade = Number(generateForm.quantidade);
    const valorNumerico = parseMoeda(generateForm.valor);
    
    // Exibe aviso para grandes quantidades
    if (quantidade > 50) {
      toast({
        variant: 'default',
        title: 'Atenção',
        description: `Você está prestes a gerar ${quantidade} números. Isso pode afetar o desempenho.`,
        duration: 5000,
      });
    }

    setIsGenerating(true);
    
    // Formata o valor para o padrão brasileiro (R$ X.XXX,XX)
    const valorFormatado = formatarMoeda(valorNumerico);
    const descricao = generateForm.descricao || `Prêmio de ${valorFormatado}`;
    
    // Gera os números premiados
    const novosNumerosPremiados = Array.from({ length: quantidade }, () => {
      // Gera um número único de 6 dígitos
      let numero: string;
      let tentativas = 0;
      const maxTentativas = 100;
      const numerosExistentes = raffle?.numerosPremiados?.map(n => n.numero) || [];
      
      do {
        // Gera um número aleatório de 6 dígitos
        numero = Math.floor(100000 + Math.random() * 900000).toString();
        tentativas++;
        
        // Se exceder o número máximo de tentativas, adiciona um sufixo
        if (tentativas > maxTentativas) {
          numero = numero + '-' + Math.floor(10 + Math.random() * 90);
          break;
        }
      } while (numerosExistentes.includes(numero));
      
      // Definindo o status com o tipo correto
      const status: 'disponivel' | 'reservado' | 'premiado' = 'disponivel';
      
      return {
        numero,
        premio: valorFormatado,
        descricao,
        dataSorteio: new Date().toISOString(), // Data de criação do prêmio
        ativo: true,
        status, // Usando a constante tipada
        dataPremiacao: null, // Será preenchido quando o número for premiado
        cliente: null // Será preenchido quando o número for atribuído a um cliente
      };
    });

    // Adiciona os novos números aos existentes
    const numerosExistentes = raffle?.numerosPremiados || [];
    const todosNumeros = [...numerosExistentes, ...novosNumerosPremiados];
    
    try {
      // Atualiza o estado global
      raffle.updateRaffleData({ 
        numerosPremiados: todosNumeros 
      });
      
      // Fecha o modal e reseta o formulário
      setShowGenerateModal(false);
      setGenerateForm({
        quantidade: '1',
        valor: '',
        descricao: ''
      });
      
      // Mostra mensagem de sucesso com detalhes
      toast({
        title: 'Sucesso!',
        description: (
          <div className="space-y-1">
            <p>{quantidade} número(s) premiado(s) gerado(s) com sucesso</p>
            <p className="text-sm text-green-200">
              Valor: {valorFormatado}
            </p>
            <p className="text-xs text-gray-300">
              Os números serão atribuídos automaticamente aos clientes nas próximas compras.
            </p>
          </div>
        ),
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
            {raffle?.numerosPremiados?.filter(n => n.ativo).length || 0} ativos
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
                  {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {(!raffle?.numerosPremiados || raffle.numerosPremiados.length === 0) ? (
              <p className="text-gray-400 text-center py-4">Nenhum número premiado cadastrado</p>
            ) : (
              (raffle?.numerosPremiados || []).map((numero, index) => (
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
                      onClick={() => toggleStatus(index)}
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
                      onClick={() => handleEdit(index)}
                      className="text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(index)}
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
            {(!raffle?.numerosPremiados || raffle.numerosPremiados.filter(n => n.status === 'premiado').length === 0) ? (
              <p className="text-gray-400 text-center py-4">Nenhum ganhador registrado</p>
            ) : (
              raffle.numerosPremiados
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
