import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PartnerLayout } from '@/components/partner/PartnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Bell, Mail, Lock, Shield } from 'lucide-react';

// Esquema de validação com Zod
const settingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  twoFactorAuth: z.boolean().default(false),
  currentPassword: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres').optional().or(z.literal('')),
  newPassword: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'A senha atual é necessária para alterar a senha',
  path: ['currentPassword'],
}).refine((data) => {
  if (data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function PartnerSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      twoFactorAuth: false,
    },
  });

  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setIsLoading(true);
      
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Configurações salvas!',
        description: 'Suas configurações foram atualizadas com sucesso.',
      });
      
      // Se estiver alterando a senha, limpar os campos
      if (data.newPassword) {
        setValue('currentPassword', '');
        setValue('newPassword', '');
        setValue('confirmPassword', '');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PartnerLayout 
      title="Configurações"
      description="Gerencie suas preferências e configurações de conta"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações de conta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Notificações */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                Notificações
              </CardTitle>
              <CardDescription>
                Controle como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Notificações por e-mail</Label>
                  <p className="text-sm text-gray-400">
                    Receba atualizações importantes por e-mail
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  {...register('emailNotifications')}
                  onCheckedChange={(checked) => setValue('emailNotifications', checked)}
                  defaultChecked
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Notificações no navegador</Label>
                  <p className="text-sm text-gray-400">
                    Receba notificações em tempo real no seu navegador
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  {...register('pushNotifications')}
                  onCheckedChange={(checked) => setValue('pushNotifications', checked)}
                  defaultChecked
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketingEmails">E-mails de marketing</Label>
                  <p className="text-sm text-gray-400">
                    Receba ofertas e novidades por e-mail
                  </p>
                </div>
                <Switch
                  id="marketingEmails"
                  {...register('marketingEmails')}
                  onCheckedChange={(checked) => setValue('marketingEmails', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Segurança
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Autenticação em duas etapas</Label>
                  <p className="text-sm text-gray-400">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  {...register('twoFactorAuth')}
                  onCheckedChange={(checked) => setValue('twoFactorAuth', checked)}
                />
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <Lock className="h-4 w-4 text-yellow-400" />
                  Alterar senha
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Senha atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...register('currentPassword')}
                      className="mt-1 bg-slate-800 border-slate-700"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...register('newPassword')}
                      className="mt-1 bg-slate-800 border-slate-700"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                      className="mt-1 bg-slate-800 border-slate-700"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências de conta */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Preferências da Conta
              </CardTitle>
              <CardDescription>
                Personalize sua experiência na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-800 border-slate-700 text-white mt-1"
                    defaultValue="pt-BR"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Fuso horário</Label>
                  <select
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-800 border-slate-700 text-white mt-1"
                    defaultValue="America/Sao_Paulo"
                  >
                    <option value="America/Sao_Paulo">(GMT-03:00) Brasília</option>
                    <option value="America/New_York">(GMT-04:00) Nova Iorque</option>
                    <option value="Europe/London">(GMT+01:00) Londres</option>
                    <option value="Europe/Paris">(GMT+02:00) Paris</option>
                    <option value="Asia/Tokyo">(GMT+09:00) Tóquio</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </PartnerLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar?callbackUrl=/parceiro/configuracoes',
        permanent: false,
      },
    };
  }

  // Verifica se o usuário tem permissão de parceiro
  if (session.user.role !== 'partner') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }


  return {
    props: {},
  };
};
