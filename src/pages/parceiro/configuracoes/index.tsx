import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth, type User } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon, Instagram } from 'lucide-react';

export default function PartnerConfigPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    cpf: user?.cpf || '',
    city: user?.city || '',
    state: user?.state || '',
    instagram: user?.instagram || '',
    receiveEmails: true,
    receiveWhatsapp: true,
  });

  if (!isAuthenticated || user?.role !== 'partner') {
    return <Navigate to="/entrar" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Houve um problema ao atualizar suas informações. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PartnerLayout
      title="Configurações"
      description="Gerencie suas informações pessoais e preferências"
    >
      <div className="container mx-auto py-10">
        <Card className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-white tracking-tight">
              Configurações do Perfil
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gerencie suas informações pessoais e preferências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Nome Completo
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  E-mail
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">
                  Telefone
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(XX) XXXX-XXXX"
                    className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-slate-300">
                  WhatsApp
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="(XX) XXXXX-XXXX"
                    className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-slate-300">
                  CPF
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="XXX.XXX.XXX-XX"
                    className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-300">
                  Cidade
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Sua cidade"
                  className="bg-slate-800 border-slate-700 text-white h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-300">
                  Estado
                </Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Seu estado"
                  className="bg-slate-800 border-slate-700 text-white h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-slate-300">
                  Instagram
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Instagram className="h-5 w-5 text-slate-500" />
                  </div>
                  <Input
                    id="instagram"
                    name="instagram"
                    type="text"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@seu_instagram"
                    className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="receiveEmails"
                    name="receiveEmails"
                    checked={formData.receiveEmails}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, receiveEmails: !!checked })
                    }
                    className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <Label
                    htmlFor="receiveEmails"
                    className="text-sm font-medium text-slate-300"
                  >
                    Receber e-mails
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="receiveWhatsapp"
                    name="receiveWhatsapp"
                    checked={formData.receiveWhatsapp}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, receiveWhatsapp: !!checked })
                    }
                    className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <Label
                    htmlFor="receiveWhatsapp"
                    className="text-sm font-medium text-slate-300"
                  >
                    Receber mensagens no WhatsApp
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Atualizando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PartnerLayout>
  );
}
