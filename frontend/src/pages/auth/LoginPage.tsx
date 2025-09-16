import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginRequest } from '../../types';

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof LoginRequest) => (value: string) => {
    setFormData((prev: LoginRequest) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎮 Chào mừng trở lại!
          </h2>
          <p className="mt-2 text-lg text-gray-700 font-medium">
            Hãy đăng nhập để tiếp tục cuộc phiêu lưu học tập thú vị! ✨
          </p>
        </div>

        {/* Login Form */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl">
              <div className="flex items-center">
                <span className="text-2xl mr-2">😅</span>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <span className="text-xl mr-2">📧</span>
                Email của bạn
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                required
                className="border-2 border-pink-200 focus:border-pink-400 rounded-xl py-3 px-4 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <span className="text-xl mr-2">🔒</span>
                Mật khẩu
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
                className="border-2 border-pink-200 focus:border-pink-400 rounded-xl py-3 px-4 text-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-pink-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700">
                  <span className="text-lg mr-1">💾</span>
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-bold text-pink-600 hover:text-pink-500 flex items-center"
                >
                  <span className="text-lg mr-1">🤔</span>
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              loading={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-xl mr-2">🚀</span>
                  Đăng nhập ngay!
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-pink-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-pink-600 font-bold text-lg">🌟 Hoặc 🌟</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              variant="secondary"
              className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </div>
            </Button>

            <Button
              variant="secondary"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </div>
            </Button>
          </div>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-lg text-gray-700 font-medium">
            <span className="text-2xl mr-2">🤔</span>
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="font-bold text-pink-600 hover:text-pink-500 text-xl"
            >
              <span className="text-2xl mr-1">🎉</span>
              Đăng ký ngay!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
