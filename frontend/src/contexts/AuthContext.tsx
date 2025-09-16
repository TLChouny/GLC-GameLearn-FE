/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  // Normalize minimal auth user payload to full User shape
  const mapAuthUserToUser = (authUser: AuthResponse['user']): User => {
    return {
      _id: authUser.id,
      userName: authUser.userName,
      email: authUser.email,
      gender: 'male',
      address: '',
      role: authUser.role,
      avatar: authUser.avatar,
      userDescription: '',
      points: authUser.points,
      listFriend: [],
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: authUser.stats || {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        averageScore: 0,
      },
    };
  };

  // Force re-render when user changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Create new user object to ensure reference change
        const newUser: User = {
          _id: parsedUser._id || parsedUser.id || '',
          userName: parsedUser.userName || '',
          email: parsedUser.email || '',
          gender: parsedUser.gender || 'male',
          address: parsedUser.address || '',
          role: parsedUser.role || 'student',
          avatar: parsedUser.avatar,
          userDescription: parsedUser.userDescription,
          points: parsedUser.points || 0,
          listFriend: parsedUser.listFriend || [],
          isVerified: parsedUser.isVerified || false,
          createdAt: parsedUser.createdAt || new Date().toISOString(),
          updatedAt: parsedUser.updatedAt || new Date().toISOString(),
          stats: parsedUser.stats
        };
        
        setToken(savedToken);
        setUser(newUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.login(credentials.email, credentials.password);
      
      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }

      const data = response.data as AuthResponse;
      
      // Create new user object to ensure reference change
      const apiUser = data.user as AuthResponse['user'];
      const newUser: User = mapAuthUserToUser(apiUser);
      
      setUser(newUser);
      setToken(data.token);
      
      // Save to localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithToken = async (token: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user info from token by calling the /me endpoint
      const response = await apiService.getCurrentUser(token);
      
      if (!response.success) {
        throw new Error(response.message || 'Xác thực token thất bại');
      }

      const apiUser = response.data as User;
      const newUser: User = {
        _id: apiUser._id || '',
        userName: apiUser.userName || '',
        email: apiUser.email || '',
        gender: apiUser.gender || 'male',
        address: apiUser.address || '',
        role: apiUser.role || 'student',
        avatar: apiUser.avatar,
        userDescription: apiUser.userDescription,
        points: apiUser.points || 0,
        listFriend: apiUser.listFriend || [],
        isVerified: apiUser.isVerified || false,
        createdAt: apiUser.createdAt || new Date().toISOString(),
        updatedAt: apiUser.updatedAt || new Date().toISOString(),
        stats: apiUser.stats || {
          gamesPlayed: 0,
          gamesWon: 0,
          totalScore: 0,
          averageScore: 0
        }
      };
      
      setUser(newUser);
      setToken(token);
      
      // Save to localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Xác thực token thất bại';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.register(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Đăng ký thất bại');
      }

      const data = response.data as AuthResponse;
      
      // Create new user object to ensure reference change
      const apiUser = data.user as AuthResponse['user'];
      const newUser: User = mapAuthUserToUser(apiUser);
      
      setUser(newUser);
      setToken(data.token);
      
      // Save to localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithToken,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
