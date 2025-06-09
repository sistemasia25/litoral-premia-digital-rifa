
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AdminUser = {
  id: string;
  nome: string;
  email: string;
  nivel_acesso: string;
  user_id: string;
};

type AdminAuthContextType = {
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkAdminUser(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setAdminUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await checkAdminUser(session.user.id);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdminUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        setAdminUser(null);
        return;
      }

      setAdminUser(data);
    } catch (error) {
      console.error('Erro ao verificar usuário admin:', error);
      setAdminUser(null);
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
        await checkAdminUser(data.user.id);
        if (!adminUser) {
          throw new Error('Usuário não tem permissões de administrador');
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAdminUser(null);
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      isLoading,
      isAuthenticated: !!adminUser,
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
