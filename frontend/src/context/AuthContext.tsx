import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAccessToken, setRefreshToken } from '../lib/api';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  address?: string;
  studentId?: string | null;
  teacherId?: string | null;
  parentId?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error parsing stored user:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Silent refresh on app load
  useEffect(() => {
    async function checkAuth() {
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken && !localStorage.getItem('accessToken')) {
          setLoading(false);
          return;
        }

        const data = await apiRequest('/auth/refresh', {
          method: 'POST',
          skipAuth: true,
          headers: storedRefreshToken ? { 'x-refresh-token': storedRefreshToken } : {},
          body: JSON.stringify({ refreshToken: storedRefreshToken })
        });

        const token = data.accessToken || data.token;
        if (token) {
          setAccessToken(token);
          if (data.refreshToken) setRefreshToken(data.refreshToken);
          const profile = await apiRequest('/users/profile');
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        }
      } catch (err: any) {
        if (
          err.message &&
          (err.message.includes('Refresh token') ||
            err.message.includes('Unauthorized') ||
            err.message.includes('Invalid'))
        ) {
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Listen for global unauthorized API signals to trigger logout
  useEffect(() => {
    const handleUnauthorized = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem('user');
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    console.log('[AuthContext] Initiating login request for:', email);
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true
    });

    const token = data.accessToken || data.token;
    if (!token || !data.user) {
      console.error('[AuthContext] Login response missing token or user object:', data);
      throw new Error('Server response missing authentication credentials or user details.');
    }

    console.log(`[AuthContext] Login verified for user: ${data.user.email} (${data.user.role})`);
    setAccessToken(token);
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
