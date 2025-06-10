
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

  // Verifica se há um usuário logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Simula um usuário admin para desenvolvimento
  const mockAdminUser: AdminUser = {
    id: '1',
    nome: 'Admin',
    email: 'admin@example.com',
    nivel_acesso: 'admin',
    user_id: '1'
  };

  const login = async (email: string, password: string) => {
    try {
      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificação simples de login (apenas para desenvolvimento)
      if (email === 'admin@example.com' && password === 'admin123') {
        setAdminUser(mockAdminUser);
        localStorage.setItem('adminUser', JSON.stringify(mockAdminUser));
      } else {
        throw new Error('Credenciais inválidas');
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
      setAdminUser(null);
      localStorage.removeItem('adminUser');
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
