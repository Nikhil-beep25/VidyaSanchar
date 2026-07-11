import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAccessToken } from '../lib/api';

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
        const data = await apiRequest('/auth/refresh', { method: 'POST', skipAuth: true });
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          // Fetch user profile
          const profile = await apiRequest('/users/profile');
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        }
      } catch (err: any) {
        // Silent catch: user is not authenticated or refresh token expired
        // Clean up storage and state only if it was an auth error
        if (err.message && (err.message.includes('Refresh token') || err.message.includes('Unauthorized') || err.message.includes('Invalid'))) {
          setAccessToken(null);
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
      setUser(null);
      localStorage.removeItem('user');
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    
    setAccessToken(data.accessToken);
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
