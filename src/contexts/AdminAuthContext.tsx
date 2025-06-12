
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

  // Verificar sessão existente ao carregar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Verificar se é um admin válido
          if (session.user.email === 'sistemasia25@gmail.com') {
            const adminData: AdminUser = {
              id: '1',
              nome: 'Administrador',
              email: session.user.email,
              nivel_acesso: 'admin',
              user_id: session.user.id
            };
            setAdminUser(adminData);
          }
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
          if (session.user.email === 'sistemasia25@gmail.com') {
            const adminData: AdminUser = {
              id: '1',
              nome: 'Administrador',
              email: session.user.email,
              nivel_acesso: 'admin',
              user_id: session.user.id
            };
            setAdminUser(adminData);
          }
        } else if (event === 'SIGNED_OUT') {
          setAdminUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (email !== 'sistemasia25@gmail.com') {
        throw new Error('Acesso negado. Este e-mail não tem permissão de administrador.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const adminData: AdminUser = {
          id: '1',
          nome: 'Administrador',
          email: data.user.email!,
          nivel_acesso: 'admin',
          user_id: data.user.id
        };
        setAdminUser(adminData);
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
      await supabase.auth.signOut();
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
