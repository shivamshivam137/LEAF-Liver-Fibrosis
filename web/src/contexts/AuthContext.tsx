// LiverAsist - Auth Context
// Provides authentication state and actions throughout the app

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '../types/api';
import { mockApi } from '../api/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'liverasist_token';
const USER_KEY = 'liverasist_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Restore from session storage on mount
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      const userJson = sessionStorage.getItem(USER_KEY);
      if (token && userJson) {
        return {
          user: JSON.parse(userJson),
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      }
    } catch {
      // Ignore parse errors
    }
    return { user: null, token: null, isAuthenticated: false, isLoading: false, error: null };
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await mockApi.login(email, password);
      if (result) {
        sessionStorage.setItem(TOKEN_KEY, result.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));
        setState({ user: result.user, token: result.token, isAuthenticated: true, isLoading: false, error: null });
        return true;
      } else {
        setState(s => ({ ...s, isLoading: false, error: 'Invalid email or password. Try doctor@example.test / demo-password' }));
        return false;
      }
    } catch {
      setState(s => ({ ...s, isLoading: false, error: 'Unable to connect. Please try again.' }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({ ...s, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
