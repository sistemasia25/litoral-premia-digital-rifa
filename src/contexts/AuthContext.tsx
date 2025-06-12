
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  email: string;
  name?: string;
  slug?: string;
  role: 'partner' | 'customer';
  phone?: string;
  whatsapp?: string;
  cpf?: string;
  city?: string;
  state?: string;
  instagram?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Inicializando autenticação...');
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Sessão atual:', session);
        
        if (session?.user && mounted) {
          await loadUserData(session.user);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Carregando dados do usuário:', supabaseUser.email);
      
      // Verificar se é parceiro
      const { data: parceiro, error: parceiroError } = await supabase
        .from('parceiros')
        .select('*')
        .eq('email', supabaseUser.email)
        .maybeSingle();

      if (parceiroError) {
        console.error('Erro ao buscar parceiro:', parceiroError);
        throw parceiroError;
      }

      if (parceiro) {
        console.log('Parceiro encontrado:', parceiro);
        setUser({
          id: parceiro.id,
          email: parceiro.email,
          name: parceiro.nome,
          slug: parceiro.slug,
          role: 'partner',
          phone: parceiro.telefone,
          whatsapp: parceiro.whatsapp,
          city: parceiro.cidade,
          state: parceiro.estado,
          instagram: parceiro.instagram,
        });
        return;
      }

      // Se não é parceiro, tratar como cliente
      console.log('Usuário não é parceiro, tratando como cliente');
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: 'customer'
      });

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Tentando fazer login com:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('Erro no login:', error);
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: error.message === 'Invalid login credentials' ? 
            'Email ou senha incorretos' : error.message
        });
        return false;
      }

      if (data.user) {
        console.log('Login realizado com sucesso');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast({
        variant: 'destructive',
        title: 'Erro inesperado',
        description: 'Não foi possível fazer login. Tente novamente.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Registrando novo parceiro:', userData);

      // Primeiro, criar o usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado');
      }

      // Inserir dados do parceiro na tabela parceiros
      const { error: parceiroError } = await supabase
        .from('parceiros')
        .insert({
          email: userData.email,
          nome: userData.name,
          telefone: userData.phone,
          whatsapp: userData.whatsapp,
          cidade: userData.city,
          estado: userData.state,
          instagram: userData.instagram,
          slug: userData.slug,
          chave_pix: userData.chave_pix,
          user_id: authData.user.id
        });

      if (parceiroError) {
        console.error('Erro ao inserir parceiro:', parceiroError);
        throw parceiroError;
      }

      toast({
        title: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso. Verifique seu email para confirmar.',
      });

    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: error.message || 'Não foi possível criar sua conta.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Fazendo logout...');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
