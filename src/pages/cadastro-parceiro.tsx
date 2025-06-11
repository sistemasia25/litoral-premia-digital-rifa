
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, DollarSign, Calendar, ArrowLeft, Eye, EyeOff, UserPlus, Star, Shield, Headphones, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CadastroParceiroPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    whatsapp: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    instagram: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação específica para CPF
    if (name === 'cpf') {
      const formattedCpf = formatCPF(value);
      setFormData(prev => ({ ...prev, [name]: formattedCpf }));
      return;
    }
    
    // Formatação específica para WhatsApp
    if (name === 'whatsapp') {
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (numbers.length <= 2) return numbers.length > 0 ? `(${numbers}` : '';
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.cpf || !formData.whatsapp || !formData.city) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.whatsapp.replace(/\D/g, '').length < 10) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, insira um número de WhatsApp válido.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não coincidem.",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      handleNextStep();
      return;
    }
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      // Simular cadastro na API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar slug personalizado baseado no nome
      const slug = formData.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      // Dados do usuário que seriam retornados pela API
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
        whatsapp: formData.whatsapp.replace(/\D/g, ''), // Remove formatação
        city: formData.city,
        instagram: formData.instagram,
        slug: slug,
        role: 'partner' as const
      };
      
      // Em um ambiente real, aqui seria feita a chamada para a API de cadastro
      // const response = await api.post('/auth/register', {
      //   ...formData,
      //   cpf: formData.cpf.replace(/\D/g, ''),
      //   whatsapp: formData.whatsapp.replace(/\D/g, '')
      // });
      // const { user: userData, token } = response.data;
      
      // Fazer login automaticamente após o cadastro
      // O AuthContext irá gerar um token e redirecionar para o dashboard
      login(userData);
      
      // Esta mensagem será exibida após o redirecionamento
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo ao programa de parceiros! Seu link personalizado: /r/${slug}`,
      });
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Não foi possível realizar o cadastro. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "30% de Comissão",
      description: "Ganhe 30% em cada venda realizada através do seu link personalizado"
    },
    {
      icon: Calendar,
      title: "Saques Semanais",
      description: "Receba suas comissões todas as sextas-feiras via PIX"
    },
    {
      icon: Users,
      title: "Rede de Contatos",
      description: "Use sua rede para gerar vendas e multiplicar seus ganhos"
    },
    {
      icon: Star,
      title: "Material de Apoio",
      description: "Receba artes, vídeos e materiais exclusivos para divulgação"
    },
    {
      icon: Shield,
      title: "Suporte Dedicado",
      description: "Tenha acesso a suporte exclusivo para parceiros"
    },
    {
      icon: Headphones,
      title: "Treinamentos",
      description: "Participe de treinamentos para maximizar suas vendas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute left-4 top-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro de Parceiro
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cadastre-se e comece a ganhar comissões de 30% em cada venda
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Cadastro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center mb-2">
                    <UserPlus className="w-5 h-5 mr-2 text-orange-500" />
                    {currentStep === 1 ? 'Dados Pessoais' : 'Dados de Acesso'}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 
                      ? 'Preencha seus dados pessoais para continuar'
                      : 'Crie sua conta de acesso ao painel'
                    }
                  </CardDescription>
                  
                  {/* Indicador de etapas */}
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                    </div>
                    <div className={`w-12 h-1 ${currentStep > 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      2
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {currentStep === 1 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Seu nome completo"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF *</Label>
                            <Input
                              id="cpf"
                              name="cpf"
                              value={formData.cpf}
                              onChange={handleInputChange}
                              placeholder="000.000.000-00"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp *</Label>
                            <Input
                              id="whatsapp"
                              name="whatsapp"
                              value={formData.whatsapp}
                              onChange={handleInputChange}
                              placeholder="(00) 00000-0000"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="city">Cidade *</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Sua cidade"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram (opcional)</Label>
                          <Input
                            id="instagram"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            placeholder="@seu_instagram"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password">Senha *</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Mínimo 6 caracteres"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirme sua senha"
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="flex gap-4">
                      {currentStep === 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                          className="flex-1"
                        >
                          Voltar
                        </Button>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                            />
                            Cadastrando...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            {currentStep === 1 ? 'Continuar' : 'Finalizar Cadastro'}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Já tem uma conta?
                    </p>
                    <Button
                      variant="link"
                      onClick={() => navigate('/login-parceiro')}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Fazer login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seção de Benefícios */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Vantagens de ser Parceiro
                </h2>
                <p className="text-gray-600">
                  Conheça os benefícios exclusivos para nossos parceiros
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <benefit.icon className="w-8 h-8 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Link Personalizado</h3>
                  <p className="text-orange-100 mb-4">
                    Você receberá um link personalizado com seu nome para compartilhar e gerar vendas.
                  </p>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm">Exemplo: litoraldasorte.com/r/<strong>seu-nome</strong></p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroParceiroPage;
