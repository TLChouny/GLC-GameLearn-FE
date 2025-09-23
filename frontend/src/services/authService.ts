import apiService from './api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse
} from '../types';

const BASE_URL = '/users';

export const authService = {
  // ===== AUTHENTICATION =====
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiService.post(`${BASE_URL}/login`, data);
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiService.post(`${BASE_URL}/register`, data);
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiService.get(`${BASE_URL}/me`);
  },

  // ===== OAUTH =====
  loginWithGoogle: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${BASE_URL}/google`;
  },

  loginWithFacebook: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${BASE_URL}/facebook`;
  },

  handleOAuthCallback: (token: string): { success: boolean; token: string } => {
    if (token) {
      localStorage.setItem('token', token);
      return { success: true, token };
    }
    return { success: false, token: '' };
  },

  // ===== FACEBOOK DATA DELETION =====
  requestFacebookDataDeletion: async (): Promise<ApiResponse<{
    url: string;
    confirmation_code: string;
  }>> => {
    return apiService.post(`${BASE_URL}/facebook/data-deletion`);
  },

  checkFacebookDataDeletionStatus: async (code: string): Promise<ApiResponse<{
    success: boolean;
    code: string;
    status: string;
  }>> => {
    return apiService.get(`${BASE_URL}/facebook/data-deletion-status?code=${code}`);
  },

  // ===== TOKEN MANAGEMENT =====
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // ===== LOGOUT =====
  logout: (): void => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // ===== PASSWORD RESET =====
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post(`${BASE_URL}/forgot-password`, { email });
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post(`${BASE_URL}/reset-password`, { token, password });
  },

  // ===== EMAIL VERIFICATION =====
  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post(`${BASE_URL}/verify-email`, { token });
  },

  resendVerificationEmail: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post(`${BASE_URL}/resend-verification`);
  },

  // ===== CHANGE PASSWORD =====
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post(`${BASE_URL}/change-password`, { currentPassword, newPassword });
  },

  // ===== REFRESH TOKEN =====
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiService.post(`${BASE_URL}/refresh-token`);
  },

  // ===== UTILITY METHODS =====
  getAuthHeaders: (): Record<string, string> => {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // ===== VALIDATION HELPERS =====
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 số');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateUserName: (userName: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (userName.length < 3) {
      errors.push('Tên người dùng phải có ít nhất 3 ký tự');
    }
    
    if (userName.length > 30) {
      errors.push('Tên người dùng không được quá 30 ký tự');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
      errors.push('Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
