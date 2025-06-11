
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, TrendingUp, DollarSign, Calendar, ArrowLeft, User, Mail, Phone, MapPin, Key, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const CadastroParceiroPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Dados pessoais
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    
    // Dados de pagamento
    pixKey: "",
    pixKeyType: "cpf" as "cpf" | "cnpj" | "email" | "phone" | "random",
    
    // Bio
    bio: "",
    
    // Termos
    accept: false,
    
    // Senha
    password: "",
    confirmPassword: ""
  });

  const steps = [
    { id: 1, title: "Dados Pessoais", icon: User, description: "Informações básicas sobre você" },
    { id: 2, title: "Pagamento", icon: DollarSign, description: "Como você quer receber suas comissões" },
    { id: 3, title: "Perfil", icon: FileText, description: "Conte um pouco sobre você" },
    { id: 4, title: "Confirmação", icon: Shield, description: "Revise e finalize seu cadastro" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    let formattedValue = numbers;
    if (numbers.length > 10) {
      formattedValue = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length > 5) {
      formattedValue = numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (numbers.length > 2) {
      formattedValue = numbers.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (numbers.length > 0) {
      formattedValue = numbers.replace(/^(\d*)/, '($1');
    }
    
    setFormData(prev => ({ ...prev, phone: formattedValue }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.phone && formData.city && formData.state);
      case 2:
        return !!(formData.pixKey && formData.pixKeyType);
      case 3:
        return true; // Bio é opcional
      case 4:
        return !!(formData.accept && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, verifique todos os campos antes de finalizar.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular envio dos dados
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seu cadastro foi enviado para análise. Você receberá um e-mail em até 24 horas.",
      });
      
      // Redirecionar para página de login após sucesso
      navigate('/entrar');
      
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
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
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Seu estado"
                required
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Chave PIX *</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { value: "cpf", label: "CPF" },
                  { value: "cnpj", label: "CNPJ" },
                  { value: "email", label: "E-mail" },
                  { value: "phone", label: "Telefone" },
                  { value: "random", label: "Aleatória" }
                ].map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={formData.pixKeyType === type.value ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setFormData(prev => ({ ...prev, pixKeyType: type.value as any }))}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX *</Label>
              <Input
                id="pixKey"
                name="pixKey"
                value={formData.pixKey}
                onChange={handleInputChange}
                placeholder={
                  formData.pixKeyType === 'cpf' ? '000.000.000-00' :
                  formData.pixKeyType === 'cnpj' ? '00.000.000/0000-00' :
                  formData.pixKeyType === 'email' ? 'seu@email.com' :
                  formData.pixKeyType === 'phone' ? '(00) 00000-0000' :
                  '00000000-0000-0000-0000-000000000000'
                }
                required
              />
              <p className="text-xs text-gray-500">
                Esta chave PIX será usada para receber suas comissões
              </p>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Conte um pouco sobre você</Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Conte um pouco sobre sua experiência, seus objetivos como parceiro, ou qualquer outra informação relevante..."
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={6}
              />
              <p className="text-xs text-gray-500">
                Esta informação ajuda a entender melhor seu perfil (opcional)
              </p>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold">Resumo do Cadastro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><strong>Nome:</strong> {formData.name}</div>
                <div><strong>E-mail:</strong> {formData.email}</div>
                <div><strong>WhatsApp:</strong> {formData.phone}</div>
                <div><strong>Cidade:</strong> {formData.city}</div>
                <div><strong>Estado:</strong> {formData.state}</div>
                <div><strong>Chave PIX:</strong> {formData.pixKey}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Sua senha"
                    required
                  />
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
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accept"
                  checked={formData.accept}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, accept: !!checked }))}
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="accept" className="text-sm font-normal cursor-pointer">
                    Eu aceito os{" "}
                    <a href="#" className="text-orange-600 hover:underline">
                      Termos de Uso
                    </a>{" "}
                    e a{" "}
                    <a href="#" className="text-orange-600 hover:underline">
                      Política de Privacidade
                    </a>
                  </Label>
                  <p className="text-xs text-gray-500">
                    Você deve aceitar os termos para continuar
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

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
            Seja um Parceiro
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cadastre-se como parceiro e comece a ganhar comissões divulgando nossos sorteios
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    currentStep >= step.id
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-4 transition-colors",
                      currentStep > step.id ? "bg-orange-500" : "bg-gray-300"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div key={step.id} className="text-center flex-1">
                  <p className={cn(
                    "text-sm font-medium",
                    currentStep >= step.id ? "text-orange-600" : "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <steps[currentStep - 1].icon className="w-5 h-5 mr-2 text-orange-500" />
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Anterior
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep(4) || isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? "Finalizando..." : "Finalizar Cadastro"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Rede de Contatos</h3>
                <p className="text-sm text-gray-600">
                  Use sua rede de contatos para gerar vendas e ganhar comissões
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Comissões Altas</h3>
                <p className="text-sm text-gray-600">
                  Ganhe até 30% de comissão em cada venda realizada através do seu link
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Calendar className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Pagamentos Semanais</h3>
                <p className="text-sm text-gray-600">
                  Receba suas comissões toda sexta-feira via PIX
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroParceiroPage;
