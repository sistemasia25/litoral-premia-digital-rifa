
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
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            loadPartnerData(session.user.id);
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
      const { data: parceiro, error } = await supabase
        .from('parceiros')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar dados do parceiro:', error);
        return;
      }

      if (parceiro) {
        const userData: User = {
          id: parceiro.id,
          name: parceiro.nome,
          email: parceiro.email,
          phone: parceiro.telefone || '',
          whatsapp: parceiro.telefone || '',
          cpf: '',
          city: '',
          state: '',
          instagram: '',
          slug: parceiro.slug,
          role: 'partner'
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do parceiro:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadPartnerData(data.user.id);
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo ao seu painel de parceiro.',
        });
      }
    } catch (error: any) {
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
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Criar registro na tabela parceiros
        const { data: parceiro, error: parceiroError } = await supabase
          .from('parceiros')
          .insert([
            {
              user_id: authData.user.id,
              nome: userData.name,
              email: userData.email,
              telefone: userData.whatsapp,
              slug: userData.slug,
              status: 'ativo'
            }
          ])
          .select()
          .single();

        if (parceiroError) throw parceiroError;

        const newUser: User = {
          id: parceiro.id,
          name: parceiro.nome,
          email: parceiro.email,
          phone: parceiro.telefone || '',
          whatsapp: parceiro.telefone || '',
          cpf: userData.cpf,
          city: userData.city,
          state: userData.state,
          instagram: userData.instagram,
          slug: parceiro.slug,
          role: 'partner'
        };

        setUser(newUser);

        toast({
          title: 'Cadastro realizado com sucesso!',
          description: `Bem-vindo ao programa de parceiros! Seu link: /r/${userData.slug}`,
        });
      }
    } catch (error: any) {
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
