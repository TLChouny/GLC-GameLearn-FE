import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Select, Card } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import type { RegisterRequest, Gender, UserRole } from '../../types';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
  role: UserRole;
}

const RegisterPage: React.FC = () => {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male' as Gender,
    address: '',
    role: 'student' as UserRole
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
  ];

  const roleOptions = [
    { value: 'student', label: 'Học sinh' },
    { value: 'teacher', label: 'Giáo viên' },
    { value: 'admin', label: 'Quản trị viên' }
  ];

  const handleInputChange = (field: keyof RegisterFormData) => (value: string) => {
    setFormData((prev: RegisterFormData) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName) {
      newErrors.userName = 'Tên người dùng là bắt buộc';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Tên người dùng phải có ít nhất 3 ký tự';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.address) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-orange-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-20 right-20 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
      
      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-orange-400 to-green-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
          </div>
          <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            🎉 Tạo tài khoản mới!
          </h2>
          <p className="mt-2 text-lg text-gray-700 font-medium">
            Tham gia cùng chúng tôi trong hành trình học tập thú vị! 🌟
          </p>
        </div>

        {/* Register Form */}
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center">
                  <span className="text-xl mr-2">👤</span>
                  Tên người dùng
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  placeholder="Nhập tên người dùng"
                  value={formData.userName}
                  onChange={handleInputChange('userName')}
                  error={errors.userName}
                  required
                  className="border-2 border-orange-200 focus:border-orange-400 rounded-xl py-3 px-4 text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center">
                  <span className="text-xl mr-2">⚧</span>
                  Giới tính
                </label>
                <Select
                  options={genderOptions}
                  value={formData.gender}
                  onChange={handleInputChange('gender')}
                  error={errors.gender}
                  className="border-2 border-orange-200 focus:border-orange-400 rounded-xl py-3 px-4 text-lg"
                />
              </div>
            </div>

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
                className="border-2 border-orange-200 focus:border-orange-400 rounded-xl py-3 px-4 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  className="border-2 border-orange-200 focus:border-orange-400 rounded-xl py-3 px-4 text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center">
                  <span className="text-xl mr-2">🔐</span>
                  Xác nhận mật khẩu
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                  required
                  className="border-2 border-orange-200 focus:border-orange-400 rounded-xl py-3 px-4 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <span className="text-xl mr-2">🏠</span>
                Địa chỉ
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="Nhập địa chỉ của bạn"
                value={formData.address}
                onChange={handleInputChange('address')}
                error={errors.address}
                required
                className="border-2 border-orange-200 focus:border-orange-400 rounded-xl py-3 px-4 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center">
                <span className="text-xl mr-2">🎭</span>
                Vai trò
              </label>
              <Select
                options={roleOptions}
                value={formData.role}
                onChange={handleInputChange('role')}
                error={errors.role}
                className="border-2 border-orange-200 focus:border-orange-400 rounded-xl py-3 px-4 text-lg"
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-orange-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-3 block text-sm font-medium text-gray-700">
                <span className="text-lg mr-1">✅</span>
                Tôi đồng ý với{' '}
                <Link to="/terms" className="text-orange-600 hover:text-orange-500 font-bold">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="text-orange-600 hover:text-orange-500 font-bold">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="success"
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              loading={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tạo tài khoản...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-xl mr-2">🎊</span>
                  Tạo tài khoản ngay!
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-orange-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-orange-600 font-bold text-lg">🌟 Hoặc 🌟</span>
              </div>
            </div>
          </div>

          {/* Social Register */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              variant="secondary"
              className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={authService.loginWithGoogle}
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
              onClick={authService.loginWithFacebook}
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

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-lg text-gray-700 font-medium">
            <span className="text-2xl mr-2">🤔</span>
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-500 text-xl"
            >
              <span className="text-2xl mr-1">🚀</span>
              Đăng nhập ngay!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
