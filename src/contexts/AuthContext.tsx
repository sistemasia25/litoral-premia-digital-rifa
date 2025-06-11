
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  cpf?: string;
  city?: string;
  state?: string;
  instagram?: string;
  slug?: string;
  role: 'user' | 'partner';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userDataOrToken: User | string, userData?: User, redirectPath?: string) => void;
  logout: (redirectPath?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há um token válido no localStorage ao carregar
  useEffect(() => {
    const token = localStorage.getItem('partnerToken');
    if (token) {
      // Aqui você faria uma chamada para validar o token e obter os dados do usuário
      // Por enquanto, vamos apenas simular
      const userData = JSON.parse(localStorage.getItem('partnerUser') || 'null');
      if (userData) {
        setUser(userData);
      } else {
        localStorage.removeItem('partnerToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userDataOrToken: User | string, userData?: User, redirectPath?: string) => {
    try {
      let user: User;
      let token: string;

      if (typeof userDataOrToken === 'string') {
        // Caso de login com token
        token = userDataOrToken;
        user = userData as User;
      } else {
        // Caso de login direto com dados do usuário
        user = userDataOrToken;
        token = 'partner_token_' + Date.now();
      }

      // Salvar no localStorage
      localStorage.setItem('partnerToken', token);
      localStorage.setItem('partnerUser', JSON.stringify(user));
      setUser(user);
      
      // Redirecionar se necessário
      if (redirectPath) {
        window.location.href = redirectPath;
      } else if (user.role === 'partner') {
        window.location.href = '/parceiro/dashboard';
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback((redirectPath: string = '/') => {
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
