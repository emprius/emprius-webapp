import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '../../../constants';
import type { UserProfile } from '../../../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    setIsLoading(false);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();

  const login = useCallback((token: string, userData: UserProfile) => {
    setIsLoading(true);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      navigate('/login');
      toast({
        title: t('auth.logoutSuccess'),
        status: 'success',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast, t]);

  const updateUser = useCallback((userData: UserProfile) => {
    setIsLoading(true);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
