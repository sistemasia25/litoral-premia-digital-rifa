
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, DollarSign, Calendar, ArrowLeft, Eye, EyeOff, LogIn, Star, Shield, Headphones, Zap, Award, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LoginParceiroPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formData.email || !formData.password) {
        throw new Error("Por favor, preencha todos os campos.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: '1',
        name: 'Maria Oliveira',
        email: formData.email,
        phone: '(11) 99999-9999',
        whatsapp: '(11) 99999-9999',
        cpf: '123.456.789-00',
        city: 'São Paulo',
        state: 'SP',
        instagram: '@maria_oliveira',
        slug: 'maria-oliveira',
        role: 'partner' as const
      };
      
      login(userData);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao seu dashboard de parceiro.",
      });
      
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas. Verifique seu e-mail e senha.",
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
      description: "Ganhe 30% em cada venda realizada através do seu link",
      color: "text-green-600"
    },
    {
      icon: Calendar,
      title: "Saques Semanais",
      description: "Receba suas comissões todas as sextas-feiras via PIX",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Rede de Contatos",
      description: "Use sua rede para gerar vendas e multiplicar ganhos",
      color: "text-purple-600"
    },
    {
      icon: Star,
      title: "Material Exclusivo",
      description: "Artes, vídeos e materiais para divulgação",
      color: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Suporte Dedicado",
      description: "Atendimento exclusivo para parceiros",
      color: "text-indigo-600"
    },
    {
      icon: Zap,
      title: "Pagamentos Rápidos",
      description: "Comissões processadas automaticamente",
      color: "text-orange-600"
    }
  ];

  const stats = [
    { label: "Parceiros Ativos", value: "2.500+", icon: Users },
    { label: "Comissões Pagas", value: "R$ 1.2M", icon: DollarSign },
    { label: "Taxa de Conversão", value: "8.5%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header com botão voltar */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800 hover:bg-white/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header principal */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Área do <span className="text-orange-500">Parceiro</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Faça login para acessar seu painel de vendas e comissões
          </p>
        </motion.div>

        {/* Stats rápidas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 lg:mb-12 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-none shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Formulário de Login */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">
                    Entrar na Conta
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Acesse seu painel de vendas e comissões
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Sua senha"
                          className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 pr-12"
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
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                          />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5 mr-2" />
                          Entrar
                        </>
                      )}
                    </Button>
                  </form>
                  
                  <div className="text-center space-y-4">
                    <Button
                      variant="link"
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Esqueci minha senha
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">
                          Ainda não tem conta?
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate('/cadastro-parceiro')}
                      className="w-full h-12 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-semibold"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Cadastrar-se como Parceiro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seção de Benefícios */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <div className="text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  Vantagens de ser <span className="text-orange-500">Parceiro</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Junte-se a milhares de parceiros e comece a ganhar hoje mesmo
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
                      <CardContent className="p-5">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                              <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1">
                              {benefit.title}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA de Potencial de Ganhos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <Award className="w-16 h-16 mx-auto mb-4 text-orange-100" />
                    <h3 className="text-xl lg:text-2xl font-bold mb-3">Potencial de Ganhos</h3>
                    <p className="text-orange-100 mb-4 text-lg">
                      Com nossa comissão de 30%, você pode ganhar muito mais que outros programas
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">10 vendas</p>
                          <p className="text-orange-100 text-sm">por mês</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">R$ 300</p>
                          <p className="text-orange-100 text-sm">em comissões</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-orange-100">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Pagamento em até 7 dias</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginParceiroPage;
