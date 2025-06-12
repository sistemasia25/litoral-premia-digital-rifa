
// Security utilities for authentication and authorization
import { supabase } from '@/integrations/supabase/client';

// Clean up authentication state to prevent limbo states
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
  
  // Clear any stored affiliate references for security
  localStorage.removeItem('affiliate_partner_id');
  localStorage.removeItem('affiliate_slug');
  sessionStorage.removeItem('affiliate_partner_id');
  sessionStorage.removeItem('affiliate_slug');
};

// Secure sign in process
export const secureSignIn = async (email: string, password: string) => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    // Attempt global sign out first
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.warn('Global signout failed during secure signin:', err);
    }
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Sign in with email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Force page reload for clean state
      window.location.href = '/';
      return { data, error: null };
    }
    
    return { data, error };
  } catch (error) {
    console.error('Secure sign in error:', error);
    return { data: null, error };
  }
};

// Secure sign out process
export const secureSignOut = async () => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('Global signout failed:', err);
    }
    
    // Force page reload for a clean state
    window.location.href = '/';
  } catch (error) {
    console.error('Secure sign out error:', error);
    // Force reload even if sign out fails
    window.location.href = '/';
  }
};

// Rate limiting utility for preventing abuse
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isRateLimited(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }
    
    if (record.count >= maxAttempts) {
      return true;
    }
    
    record.count++;
    return false;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Input sanitization utilities
export const sanitizeInput = {
  // Sanitize text input to prevent XSS
  text: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  },
  
  // Sanitize phone number (Brazilian format)
  phone: (input: string): string => {
    return input.replace(/[^\d+()-\s]/g, '').trim();
  },
  
  // Sanitize email
  email: (input: string): string => {
    return input.toLowerCase().trim();
  },
  
  // Sanitize numeric input
  number: (input: string): number | null => {
    const num = parseFloat(input.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? null : num;
  }
};

// Validate sensitive operations
export const validateSensitiveOperation = async (operation: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn(`Unauthorized attempt to perform: ${operation}`);
      return false;
    }
    
    // Check if session is fresh (less than 1 hour old)
    const sessionAge = Date.now() - new Date(user.last_sign_in_at || 0).getTime();
    const oneHour = 60 * 60 * 1000;
    
    if (sessionAge > oneHour) {
      console.warn(`Stale session detected for operation: ${operation}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error validating operation ${operation}:`, error);
    return false;
  }
};
