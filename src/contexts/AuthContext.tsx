
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  cpf: string;
  city: string;
  state: string;
  instagram?: string;
  slug: string;
  role: 'user' | 'partner';
  chave_pix?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (redirectPath?: string) => void;
  register: (userData: Omit<User, 'id' | 'role'>, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verificar sessão existente e buscar dados do parceiro
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadPartnerData(session.user.id);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer para evitar deadlocks
          setTimeout(async () => {
            await loadPartnerData(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadPartnerData = async (userId: string) => {
    try {
      console.log('Carregando dados do parceiro para userId:', userId);
      
      const { data: parceiro, error } = await supabase
        .from('parceiros')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar dados do parceiro:', error);
        if (error.code === 'PGRST116') {
          console.log('Parceiro não encontrado para este usuário');
        }
        return;
      }

      if (parceiro) {
        console.log('Dados do parceiro carregados:', parceiro);
        const userData: User = {
          id: parceiro.id,
          name: parceiro.nome,
          email: parceiro.email,
          phone: parceiro.telefone || '',
          whatsapp: parceiro.whatsapp || '',
          cpf: '',
          city: parceiro.cidade || '',
          state: parceiro.estado || '',
          instagram: parceiro.instagram || '',
          slug: parceiro.slug,
          role: 'partner',
          chave_pix: parceiro.chave_pix || ''
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do parceiro:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }

      if (data.user) {
        console.log('Login bem sucedido:', data.user.email);
        // Verificar se é um parceiro
        const { data: parceiro, error: parceiroError } = await supabase
          .from('parceiros')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (parceiroError && parceiroError.code !== 'PGRST116') {
          console.error('Erro ao verificar parceiro:', parceiroError);
          throw new Error('Erro ao verificar dados do parceiro');
        }

        if (!parceiro) {
          throw new Error('Esta conta não está registrada como parceiro. Por favor, faça seu cadastro primeiro.');
        }

        await loadPartnerData(data.user.id);
        
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo ao seu painel de parceiro.',
        });
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro no login',
        description: error.message || 'Credenciais inválidas. Verifique seu e-mail e senha.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'role'>, password: string) => {
    try {
      console.log('Iniciando cadastro para:', userData.email);
      
      // Verificar se o slug já existe
      const { data: existingPartner } = await supabase
        .from('parceiros')
        .select('slug')
        .eq('slug', userData.slug)
        .single();

      if (existingPartner) {
        throw new Error('Este código de referência já está em uso. Escolha outro.');
      }

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        console.error('Erro no signup:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('Usuário criado no auth:', authData.user.id);
        
        // Criar registro na tabela parceiros
        const { data: parceiro, error: parceiroError } = await supabase
          .from('parceiros')
          .insert([
            {
              user_id: authData.user.id,
              nome: userData.name,
              email: userData.email,
              telefone: userData.whatsapp,
              whatsapp: userData.whatsapp,
              cidade: userData.city,
              estado: userData.state,
              instagram: userData.instagram,
              chave_pix: userData.chave_pix,
              slug: userData.slug,
              status: 'ativo'
            }
          ])
          .select()
          .single();

        if (parceiroError) {
          console.error('Erro ao criar parceiro:', parceiroError);
          throw parceiroError;
        }

        console.log('Parceiro criado:', parceiro);

        const newUser: User = {
          id: parceiro.id,
          name: parceiro.nome,
          email: parceiro.email,
          phone: parceiro.telefone || '',
          whatsapp: parceiro.whatsapp || '',
          cpf: '',
          city: parceiro.cidade || '',
          state: parceiro.estado || '',
          instagram: parceiro.instagram || '',
          slug: parceiro.slug,
          role: 'partner',
          chave_pix: parceiro.chave_pix || ''
        };

        setUser(newUser);

        toast({
          title: 'Cadastro realizado com sucesso!',
          description: `Bem-vindo ao programa de parceiros! Seu link: /?ref=${userData.slug}`,
        });
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Não foi possível realizar o cadastro.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = useCallback((redirectPath: string = '/') => {
    supabase.auth.signOut();
    setUser(null);
    
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
