
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

  // Lista de emails autorizados como administradores
  const ADMIN_EMAILS = ['sistemasia25@gmail.com', 'admin@litoralpremia.com'];

  // Verificar sessão existente ao carregar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && ADMIN_EMAILS.includes(session.user.email || '')) {
          const adminData: AdminUser = {
            id: '1',
            nome: 'Administrador',
            email: session.user.email!,
            nivel_acesso: 'admin',
            user_id: session.user.id
          };
          setAdminUser(adminData);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão admin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          if (ADMIN_EMAILS.includes(session.user.email || '')) {
            const adminData: AdminUser = {
              id: '1',
              nome: 'Administrador',
              email: session.user.email!,
              nivel_acesso: 'admin',
              user_id: session.user.id
            };
            setAdminUser(adminData);
          } else {
            setAdminUser(null);
            toast({
              title: "Acesso negado",
              description: "Este e-mail não tem permissão de administrador.",
              variant: "destructive",
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setAdminUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      if (!ADMIN_EMAILS.includes(email)) {
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
        
        toast({
          title: "Login realizado",
          description: "Bem-vindo ao painel administrativo.",
        });
      }
    } catch (error: any) {
      console.error('Erro no login admin:', error);
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
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro no logout admin:', error);
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
