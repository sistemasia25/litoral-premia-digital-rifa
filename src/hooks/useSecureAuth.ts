
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database';
import { secureSignIn, secureSignOut, cleanupAuthState, rateLimiter } from '@/utils/authSecurity';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useSecureAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Configure auth state listener with security measures
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth event:', event, 'Session exists:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setAuthError(null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer profile loading to prevent deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const { data: userProfile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error loading profile:', error);
                setAuthError('Erro ao carregar perfil do usuário');
              } else {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Profile loading error:', error);
              setAuthError('Erro ao carregar dados do usuário');
            }
          }, 100);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Initial session check with cleanup
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          cleanupAuthState();
          setAuthError('Erro na sessão, faça login novamente');
        }
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: userProfile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error loading initial profile:', profileError);
              setAuthError('Erro ao carregar perfil');
            } else {
              setProfile(userProfile);
            }
          } catch (error) {
            console.error('Initial profile loading error:', error);
            setAuthError('Erro ao carregar dados');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        cleanupAuthState();
        setAuthError('Erro na inicialização');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: {
    name?: string;
    role?: 'admin' | 'partner' | 'customer';
    phone?: string;
    whatsapp?: string;
    cpf?: string;
    city?: string;
    state?: string;
    instagram?: string;
    slug?: string;
  }) => {
    const clientIP = 'user-signup'; // In a real app, you'd get this from the request
    
    if (rateLimiter.isRateLimited(clientIP, 3, 15 * 60 * 1000)) {
      return { 
        data: null, 
        error: { message: 'Muitas tentativas de cadastro. Tente novamente em 15 minutos.' }
      };
    }

    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });

      if (error) {
        console.error('Sign up error:', error);
      } else {
        rateLimiter.reset(clientIP);
      }

      return { data, error };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const clientIP = email; // Use email as identifier for rate limiting
    
    if (rateLimiter.isRateLimited(clientIP, 5, 15 * 60 * 1000)) {
      return { 
        data: null, 
        error: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
      };
    }

    const result = await secureSignIn(email, password);
    
    if (result.error) {
      console.error('Secure sign in error:', result.error);
    } else {
      rateLimiter.reset(clientIP);
    }
    
    return result;
  };

  const signOut = async () => {
    return await secureSignOut();
  };

  const resetPassword = async (email: string) => {
    const clientIP = email;
    
    if (rateLimiter.isRateLimited(clientIP, 3, 60 * 60 * 1000)) {
      return { 
        error: { message: 'Muitas tentativas de reset. Tente novamente em 1 hora.' }
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (!error) {
        rateLimiter.reset(clientIP);
      }

      return { error };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      return { error: { message: 'Usuário não autenticado' } };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        return { data: null, error };
      }

      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Profile update exception:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    profile,
    isLoading,
    authError,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };
}
