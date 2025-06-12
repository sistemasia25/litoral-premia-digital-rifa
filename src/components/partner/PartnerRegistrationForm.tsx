
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Phone, Instagram, CreditCard } from 'lucide-react';

interface PartnerRegistrationData {
  firstName: string;
  lastName: string;
  whatsapp: string;
  instagram: string;
  pixKey: string;
}

interface PartnerRegistrationFormProps {
  onSubmit: (data: PartnerRegistrationData) => Promise<void>;
  isLoading?: boolean;
}

export function PartnerRegistrationForm({ onSubmit, isLoading = false }: PartnerRegistrationFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PartnerRegistrationData>({
    firstName: '',
    lastName: '',
    whatsapp: '',
    instagram: '',
    pixKey: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setFormData(prev => ({ ...prev, whatsapp: formattedValue }));
  };

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value && !value.startsWith('@')) {
      value = '@' + value.replace('@', '');
    }
    setFormData(prev => ({ ...prev, instagram: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.whatsapp || !formData.pixKey.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const whatsappNumbers = formData.whatsapp.replace(/\D/g, '');
    if (whatsappNumbers.length < 10 || whatsappNumbers.length > 11) {
      toast({
        title: 'WhatsApp inválido',
        description: 'Por favor, insira um número de WhatsApp válido com DDD.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro no cadastro:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 border-orange-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white text-center">
          Cadastro de Parceiro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Nome"
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Sobrenome *</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Sobrenome"
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">WhatsApp *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={formData.whatsapp}
                onChange={handleWhatsAppChange}
                placeholder="(85) 99999-9999"
                className="pl-10 bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Instagram</Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="instagram"
                value={formData.instagram}
                onChange={handleInstagramChange}
                placeholder="@seuusuario"
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Chave PIX *</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="pixKey"
                value={formData.pixKey}
                onChange={handleInputChange}
                placeholder="CPF, email, telefone ou chave aleatória"
                className="pl-10 bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Parceiro'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
