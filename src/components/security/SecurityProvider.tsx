
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { rateLimiter } from '@/utils/authSecurity';

interface SecurityContextType {
  isSecureSession: boolean;
  checkRateLimit: (key: string, max?: number, window?: number) => boolean;
  resetRateLimit: (key: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSecureAuth();

  // Monitor for suspicious activity
  useEffect(() => {
    let failedAttempts = 0;
    const maxFailedAttempts = 5;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from tab
        console.log('User navigation detected');
      }
    };

    const handleBeforeUnload = () => {
      // Clean up any sensitive data before page unload
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('temp_sale_data');
        sessionStorage.removeItem('temp_payment_data');
      }
    };

    // Security event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Monitor for excessive API errors (potential attacks)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok && response.status === 401) {
          failedAttempts++;
          if (failedAttempts >= maxFailedAttempts) {
            console.warn('Excessive unauthorized requests detected');
            // Could trigger additional security measures here
          }
        } else if (response.ok) {
          failedAttempts = 0; // Reset on successful request
        }
        
        return response;
      } catch (error) {
        console.error('Network request failed:', error);
        throw error;
      }
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.fetch = originalFetch;
    };
  }, []);

  const checkRateLimit = (key: string, max: number = 10, window: number = 60 * 1000) => {
    return rateLimiter.isRateLimited(key, max, window);
  };

  const resetRateLimit = (key: string) => {
    rateLimiter.reset(key);
  };

  const contextValue: SecurityContextType = {
    isSecureSession: !!user && !isLoading,
    checkRateLimit,
    resetRateLimit,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
