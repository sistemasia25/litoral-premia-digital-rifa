import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { partnerService } from '@/services/partnerService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, User, Mail, Smartphone, MapPin, Lock, Eye, EyeOff } from 'lucide-react';

// -------------------- Validação --------------------
// Validações reutilizáveis
const validatePhone = (value: string) => {
  const phone = value.replace(/\D/g, '');
  return phone.length >= 10 && phone.length <= 11;
};

const validatePasswordStrength = (value: string) => {
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

const schema = z
  .object({
    // Campos obrigatórios
    name: z.string()
      .min(3, 'Informe seu nome completo')
      .max(100, 'O nome deve ter no máximo 100 caracteres')
      .transform(name => name.replace(/\s+/g, ' ').trim()),
      
    email: z.string()
      .email('E-mail inválido')
      .max(100, 'O e-mail deve ter no máximo 100 caracteres')
      .transform(email => email.toLowerCase().trim()),
      
    phone: z.string()
      .min(1, 'Telefone é obrigatório')
      .refine(validatePhone, {
        message: 'Telefone inválido. Use o formato (DD) 9XXXX-XXXX',
      })
      .transform((val) => val.replace(/\D/g, '')), // Remove formatação
      
    city: z.string()
      .min(2, 'Informe a cidade')
      .max(100, 'O nome da cidade deve ter no máximo 100 caracteres')
      .transform(city => city.replace(/\s+/g, ' ').trim()),
      
    state: z.string()
      .length(2, 'UF obrigatória')
      .transform(state => state.toUpperCase().trim()),
      
    password: z.string()
      .min(8, 'Mínimo 8 caracteres')
      .max(50, 'A senha deve ter no máximo 50 caracteres')
      .refine(validatePasswordStrength, {
        message: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
      }),
      
    confirmPassword: z.string(),
    
    // Campos opcionais
    cpfCnpj: z.string().optional(),
    address: z.string().optional(),
    postalCode: z.string().optional(),
    
    accept: z.boolean()
      .refine((v) => v, {
        message: 'Você precisa aceitar os termos',
      }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

// -------------------- Página --------------------
export default function PartnerRegister() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const passwordMeterRef = useRef<HTMLDivElement>(null);
  
  // Estados para controle de foco
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // Estado para campos tocados - removida declaração duplicada
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Função para formatar o telefone
  const formatPhoneNumber = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      return !match[2] 
        ? match[1] 
        : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  }, []);
  
  // Função para validar força da senha
  const checkPasswordStrength = useCallback((password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return (strength / 5) * 100;
  }, []);
  
  // Efeito para formatar o telefone e validar senha
  useEffect(() => {
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    if (!phoneInput) return;
    
    const handlePhoneInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const formatted = formatPhoneNumber(target.value);
      if (formatted !== target.value) {
        target.value = formatted;
      }
    };
    
    phoneInput.addEventListener('input', handlePhoneInput);
    
    return () => {
      phoneInput.removeEventListener('input', handlePhoneInput);
    };
  }, [formatPhoneNumber]);
  
  // Atualiza a força da senha quando o campo de senha muda
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      password: '',
      confirmPassword: '',
      accept: false,
    },
  });
  
  // Observa as mudanças nos campos para validação em tempo real
  const watchPassword = watch('password', '');
  const watchEmail = watch('email', '');
  
  // Efeito para validar confirmação de senha quando a senha mudar
  useEffect(() => {
    if (watch('confirmPassword')) {
      trigger('confirmPassword');
    }
  }, [watch('password'), trigger]);
  
  // Função para lidar com o foco nos campos
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };
  
  // Função para lidar com o desfoque dos campos
  const handleBlur = (fieldName: string) => {
    setFocusedField(null);
    trigger(fieldName as keyof FormData);
  };

  // Função para obter a cor da força da senha
  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Função para obter o texto da força da senha
  const getPasswordStrengthText = (strength: number) => {
    if (strength < 30) return 'Fraca';
    if (strength < 60) return 'Moderada';
    if (strength < 90) return 'Forte';
    return 'Muito forte';
  };

  // Função para renderizar o indicador de força da senha
  const renderPasswordStrengthMeter = () => (
    <div className="mt-1">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Força da senha:</span>
        <span className={`font-medium ${passwordStrength > 70 ? 'text-green-500' : passwordStrength > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
          {getPasswordStrengthText(passwordStrength)}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
          style={{ width: `${Math.max(10, passwordStrength)}%` }}
        />
      </div>
    </div>
  );

  // Função para renderizar mensagens de validação
  const renderValidationMessage = (field: keyof FormData, message: string) => (
    <AnimatePresence>
      {errors[field] && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-red-500 text-xs mt-1 flex items-center"
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  // Função para renderizar campo de formulário com validação
  const renderFormField = ({
    name,
    label,
    type = 'text',
    placeholder,
    icon: Icon,
    autoComplete,
    required = false,
    showPasswordToggle = false,
    isPassword = false,
    isPhone = false,
    isSelect = false,
    options = [],
  }: {
    name: keyof FormData;
    label: string;
    type?: string;
    placeholder: string;
    icon: React.ElementType;
    autoComplete?: string;
    required?: boolean;
    showPasswordToggle?: boolean;
    isPassword?: boolean;
    isPhone?: boolean;
    isSelect?: boolean;
    options?: { value: string; label: string }[];
  }) => {
    const isTouched = touchedFields[name];
    const hasError = !!errors[name];
    const isFocused = focusedField === name;
    
    return (
      <div className="space-y-1">
        <Label htmlFor={name} className={`text-sm ${hasError ? 'text-red-500' : 'text-slate-300'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
            hasError ? 'text-red-500' : isFocused ? 'text-orange-500' : 'text-slate-500'
          }`}>
            <Icon className="h-4 w-4" />
          </div>
          
          {isSelect ? (
            <select
              id={name}
              {...register(name, { 
                onBlur: () => handleBlur(name),
              })}
              onFocus={() => handleFocus(name)}
              className={`block w-full pl-9 pr-10 py-2 rounded-md bg-slate-800 border ${
                hasError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : isFocused 
                    ? 'border-orange-500 focus:ring-orange-500 focus:border-orange-500' 
                    : 'border-slate-700 focus:ring-orange-500 focus:border-orange-500'
              } text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors`}
              disabled={isSubmitting}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={`${name}-error`}
            >
              <option value="">Selecione...</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="relative">
              <input
                id={name}
                type={isPassword ? (showPass ? 'text' : 'password') : type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={isSubmitting}
                className={`block w-full pl-9 pr-10 py-2 rounded-md bg-slate-800 border ${
                  hasError 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : isFocused 
                      ? 'border-orange-500 focus:ring-orange-500 focus:border-orange-500' 
                      : 'border-slate-700 focus:ring-orange-500 focus:border-orange-500'
                } text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors`}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={`${name}-error`}
                onFocus={() => handleFocus(name)}
                onBlur={() => handleBlur(name)}
                onChange={(e) => {
                  if (isPhone) {
                    e.target.value = formatPhoneNumber(e.target.value);
                  }
                  if (name === 'password') {
                    handlePasswordChange(e);
                  }
                  register(name).onChange(e);
                }}
                {...register(name, { 
                  onBlur: () => handleBlur(name),
                })}
              />
              
              {showPasswordToggle && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 focus:outline-none"
                  onClick={() => isPassword ? setShowPass(!showPass) : setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  {isPassword ? (
                    showPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )
                  ) : showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        
        {name === 'password' && watchPassword && (
          <div className="mt-1">
            {renderPasswordStrengthMeter()}
            <div className="mt-1 text-xs text-slate-500">
              <p className={watchPassword.length >= 8 ? 'text-green-500' : 'text-slate-500'}>
                • Mínimo de 8 caracteres
              </p>
              <p className={/[A-Z]/.test(watchPassword) ? 'text-green-500' : 'text-slate-500'}>
                • Pelo menos uma letra maiúscula
              </p>
              <p className={/[0-9]/.test(watchPassword) ? 'text-green-500' : 'text-slate-500'}>
                • Pelo menos um número
              </p>
              <p className={/[^A-Za-z0-9]/.test(watchPassword) ? 'text-green-500' : 'text-slate-500'}>
                • Pelo menos um caractere especial
              </p>
            </div>
          </div>
        )}
        
        {errors[name] && renderValidationMessage(name, errors[name]?.message as string)}
      </div>
    );
  };

  // Estados para animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const onSubmit = async (formData: FormData) => {
    // A validação já é feita pelo schema do Zod, mas verificamos novamente por segurança
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Prepara os dados para envio
      const { confirmPassword, accept, ...partnerData } = formData;
      
      // Validação adicional do lado do cliente
      if (partnerData.phone.replace(/\D/g, '').length < 10) {
        throw new Error('Número de telefone inválido');
      }
      
      // Adiciona metadados
      const metadata = {
        ipAddress: '', // Será preenchido pelo servidor
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        utmSource: router.query.utm_source as string || '',
        utmMedium: router.query.utm_medium as string || '',
        utmCampaign: router.query.utm_campaign as string || '',
      };
      
      // Cria o objeto de dados do parceiro com os tipos corretos
      const partnerRegistrationData = {
        name: partnerData.name,
        email: partnerData.email,
        phone: partnerData.phone.replace(/\D/g, ''),
        city: partnerData.city,
        state: partnerData.state,
        password: partnerData.password,
        confirmPassword: confirmPassword,
        accept: accept,
        // Campos opcionais
        cpfCnpj: partnerData.cpfCnpj,
        address: partnerData.address,
        postalCode: partnerData.postalCode,
        // Metadados
        metadata
      };
      
      // Chama o serviço de cadastro
      const response = await partnerService.registerPartner(partnerRegistrationData);
      
      // Sucesso no cadastro
      toast({
        title: '✅ Cadastro realizado com sucesso!',
        description: 'Sua conta foi criada com sucesso. Você será redirecionado para fazer login.',
        duration: 5000,
      });
      
      // Redireciona para a página de login após 3 segundos
      setTimeout(() => {
        router.push({
          pathname: '/entrar',
          query: { 
            email: formData.email, 
            registered: 'true',
            // Mantém os parâmetros UTM para o redirecionamento
            ...(router.query.utm_source && { utm_source: router.query.utm_source }),
            ...(router.query.utm_medium && { utm_medium: router.query.utm_medium }),
            ...(router.query.utm_campaign && { utm_campaign: router.query.utm_campaign }),
          }
        });
      }, 3000);
      
    } catch (error: any) {
      console.error('Erro ao cadastrar parceiro:', error);
      
      // Trata erros comuns
      let errorMessage: React.ReactNode = 'Não foi possível concluir o cadastro. Tente novamente mais tarde.';
      let errorTitle = 'Erro no cadastro';
      let showRecoveryButton = false;
      
      if (error.message?.includes('email') || error.message?.includes('já existe')) {
        errorTitle = 'E-mail já cadastrado';
        errorMessage = 'Este e-mail já está em uso. Deseja recuperar sua senha?';
        showRecoveryButton = true;
      } else if (error.message?.includes('phone')) {
        errorTitle = 'Telefone já cadastrado';
        errorMessage = 'Este telefone já está em uso. Tente recuperar sua senha ou use outro telefone.';
        showRecoveryButton = true;
      } else if (error.message?.includes('Número de telefone inválido')) {
        errorTitle = 'Telefone inválido';
        errorMessage = 'Por favor, insira um número de telefone válido com DDD.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: (
          <div className="space-y-2">
            <p>{errorMessage}</p>
            {showRecoveryButton && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => router.push('/recuperar-senha')}
              >
                Recuperar senha
              </Button>
            )}
          </div>
        ),
        variant: 'destructive',
        duration: 10000,
      });
      
      // Rola para o topo do formulário em caso de erro
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-lg space-y-8">
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Cadastro de Parceiro
          </h1>
          <p className="text-slate-400">
            Crie sua conta para começar a divulgar e ganhar comissões.
          </p>
        </motion.div>

        <motion.form 
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Nome */}
          <motion.div variants={itemVariants}>
            <div className="space-y-1">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="name" 
                  {...register('name')} 
                  className="pl-9" 
                  placeholder="Seu nome completo"
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="email" 
                  type="email" 
                  {...register('email')} 
                  className="pl-9" 
                  placeholder="seu@email.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Telefone */}
          <motion.div variants={itemVariants}>
            <div className="space-y-1">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="phone" 
                  type="tel" 
                  {...register('phone')} 
                  className="pl-9" 
                  placeholder="(00) 00000-0000"
                  disabled={isSubmitting}
                />
              </div>
              {errors.phone && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone.message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Cidade e Estado */}
          <motion.div className="grid grid-cols-3 gap-2" variants={itemVariants}>
            <div className="col-span-2">
              <div className="space-y-1">
                <Label htmlFor="city">Cidade</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    id="city" 
                    {...register('city')} 
                    className="pl-9" 
                    placeholder="Sua cidade"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.city && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.city.message}
                  </motion.p>
                )}
              </div>
            </div>
            <div>
              <div className="space-y-1">
                <Label htmlFor="state">UF</Label>
                <select 
                  id="state" 
                  {...register('state')} 
                  className="h-10 w-full rounded-md bg-slate-800 border border-slate-700 px-2"
                  disabled={isSubmitting}
                >
                  <option value="">UF</option>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((uf)=>(
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Senha */}
          <motion.div variants={itemVariants}>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  {...register('password')}
                  className="pl-9 pr-9"
                  placeholder="Sua senha"
                  disabled={isSubmitting}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </motion.p>
              ) : (
                <div className="text-xs text-slate-500 mt-1">
                  Mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos
                </div>
              )}
            </div>
          </motion.div>

          {/* Confirmar senha */}
          <motion.div variants={itemVariants}>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="pl-9 pr-9"
                  placeholder="Confirme sua senha"
                  disabled={isSubmitting}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Termos e Condições */}
          <motion.div variants={itemVariants}>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="accept" 
                {...register('accept', {
                  onChange: (e) => {
                    setValue('accept', e.target.checked, { shouldValidate: true });
                  }
                })} 
                disabled={isSubmitting}
                className={`mt-0.5 ${errors.accept ? 'border-red-500' : ''}`}
                aria-invalid={!!errors.accept}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="accept" className={`text-sm ${errors.accept ? 'text-red-500' : 'text-slate-300'}`}>
                  Eu li e aceito os{' '}
                  <Link 
                    href="/termos" 
                    className="text-orange-500 hover:text-orange-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    termos de uso
                  </Link>{' '}
                  e{' '}
                  <Link 
                    href="/politica-privacidade" 
                    className="text-orange-500 hover:text-orange-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    política de privacidade
                  </Link>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-slate-400 hover:text-slate-300 cursor-help transition-colors">
                        Por que precisamos dessas informações?
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border border-slate-700 text-slate-200">
                      <p className="text-sm">
                        Seus dados são importantes para garantir a segurança da sua conta e cumprir com as obrigações legais. 
                        Nós nunca compartilhamos suas informações com terceiros sem sua permissão.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {errors.accept && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1 flex items-center"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.accept.message}
              </motion.p>
            )}
          </motion.div>

          {/* Botão de Envio */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <Button 
                type="submit" 
                className={`w-full py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  isSubmitting || !isValid 
                    ? 'bg-orange-500/70 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-500/20'
                }`}
                disabled={isSubmitting || !isValid}
              >
                <motion.span 
                  className="flex items-center justify-center w-full h-full"
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Criando sua conta...
                    </>
                  ) : (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100">
                      Criar conta
                    </span>
                  )}
                </motion.span>
              </Button>
            </div>
            
            <p className="mt-4 text-center text-sm text-slate-400">
              Já tem uma conta?{' '}
              <Link 
                href="/entrar" 
                className="text-orange-500 hover:text-orange-400 font-medium hover:underline"
              >
                Faça login
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
