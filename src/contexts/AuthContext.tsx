
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type User = {
  id: string;
  name: string;
  whatsapp: string;
  codigo_referencia?: string;
  saldo_disponivel?: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User, redirectPath?: string) => void;
  logout: (redirectPath?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPartnerData = useCallback(async (userId: string) => {
    const { data: parceiro } = await supabase
      .from('parceiros')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (parceiro) {
      return {
        id: parceiro.user_id,
        name: parceiro.nome,
        whatsapp: parceiro.whatsapp,
        codigo_referencia: parceiro.codigo_referencia,
        saldo_disponivel: parceiro.saldo_disponivel
      };
    }
    return null;
  }, []);

  // Verificar se há um usuário autenticado ao carregar
  useEffect(() => {
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const partnerData = await fetchPartnerData(session.user.id);
          if (partnerData) {
            setUser(partnerData);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const partnerData = await fetchPartnerData(session.user.id);
        if (partnerData) {
          setUser(partnerData);
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchPartnerData]);

  const login = useCallback((token: string, userData: User, redirectPath?: string) => {
    localStorage.setItem('partnerToken', token);
    localStorage.setItem('partnerUser', JSON.stringify(userData));
    setUser(userData);
    
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  }, []);

  const logout = useCallback(async (redirectPath: string = '/parceiro') => {
    await supabase.auth.signOut();
    localStorage.removeItem('partnerToken');
    localStorage.removeItem('partnerUser');
    setUser(null);
    
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      logout 
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
