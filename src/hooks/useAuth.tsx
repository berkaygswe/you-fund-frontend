// hooks/useAuth.ts
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/auth';
import { authClient } from '@/lib/auth-client';
import { 
  createSessionAction, 
  deleteSessionAction, 
  refreshSessionAction,
  getSessionAction 
} from '@/lib/auth-actions';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser?: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [loading, setLoading] = useState(!initialUser);

  const login = async (email: string, password: string) => {
    try {
      await authClient.login({ email, password });
      // After successful login, fetch user data
      const userData = await authClient.getCurrentUser();
      setUser(userData);

      // Create session after successful login
      await createSessionAction(userData.email);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await authClient.register({ email, password });
      // After successful registration, fetch user data
      const userData = await authClient.getCurrentUser();
      setUser(userData);

      // Create session after successful registration
      await createSessionAction(userData.email);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authClient.logout();
      await deleteSessionAction();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state and session
      await deleteSessionAction();
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    try {
      setLoading(true);
      
      // First try to refresh the session (this will call /me if JWT exists)
      const result = await refreshSessionAction();
      
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        // If session refresh fails, clear user state
        setUser(null);
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh session when it's about to expire
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      // Check if session is still valid
      const sessionResult = await getSessionAction();
      
      if (!sessionResult.success || !sessionResult.session) {
        // Session expired, try to refresh
        await refreshAuth();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  // Initial auth check only if we don't have initial user
  useEffect(() => {
    if (!initialUser) {
      refreshAuth();
    }
  }, [initialUser]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
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