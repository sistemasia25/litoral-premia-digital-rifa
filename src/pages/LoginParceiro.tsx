
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, DollarSign, Calendar, ArrowLeft, Eye, EyeOff, LogIn, UserPlus, Star, Shield, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LoginParceiroPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
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
      
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular dados do usuário
      const userData = {
        id: '1',
        name: 'Maria Oliveira',
        email: formData.email,
        role: 'partner' as const
      };
      
      login(userData);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao seu dashboard de parceiro.",
      });
      
      navigate('/parceiro');
      
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas.",
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
      description: "Ganhe 30% em cada venda realizada através do seu link de afiliado"
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
            Área do Parceiro
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Entre na sua conta ou cadastre-se para começar a ganhar comissões
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center mb-2">
                    <LogIn className="w-5 h-5 mr-2 text-orange-500" />
                    {isLogin ? 'Entrar na Conta' : 'Criar Conta'}
                  </CardTitle>
                  <CardDescription>
                    {isLogin 
                      ? 'Acesse seu dashboard de parceiro'
                      : 'Cadastre-se e comece a ganhar comissões'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
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
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Sua senha"
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
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                          />
                          {isLogin ? 'Entrando...' : 'Cadastrando...'}
                        </>
                      ) : (
                        <>
                          {isLogin ? (
                            <LogIn className="w-4 h-4 mr-2" />
                          ) : (
                            <UserPlus className="w-4 h-4 mr-2" />
                          )}
                          {isLogin ? 'Entrar' : 'Cadastrar'}
                        </>
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      {isLogin ? 'Ainda não é parceiro?' : 'Já tem uma conta?'}
                    </p>
                    <Button
                      variant="link"
                      onClick={() => {
                        if (isLogin) {
                          navigate('/cadastro-parceiro');
                        } else {
                          setIsLogin(true);
                        }
                      }}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      {isLogin ? 'Cadastre-se aqui' : 'Fazer login'}
                    </Button>
                  </div>
                  
                  {isLogin && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="link"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Esqueci minha senha
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits Section */}
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
                  <h3 className="text-xl font-bold mb-2">Potencial de Ganhos</h3>
                  <p className="text-orange-100 mb-4">
                    Com nossa comissão de 30%, você pode ganhar muito mais do que outros programas de afiliados.
                  </p>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm">Exemplo: 10 vendas de R$ 100 = <strong>R$ 300 em comissões</strong></p>
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

export default LoginParceiroPage;
