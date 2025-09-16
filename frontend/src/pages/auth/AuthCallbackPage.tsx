import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true' && token) {
      // OAuth login successful
      handleOAuthSuccess(token);
    } else {
      // OAuth login failed
      handleOAuthError(error || 'Authentication failed');
    }
  }, [searchParams]);

  const handleOAuthSuccess = async (token: string) => {
    try {
      // Save token to localStorage
      localStorage.setItem('auth_token', token);
      
      // Call loginWithToken function from AuthContext to update user state
      await loginWithToken(token);
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('OAuth success handling error:', error);
      navigate('/login?error=oauth_error');
    }
  };

  const handleOAuthError = (error: string) => {
    console.error('OAuth error:', error);
    navigate(`/login?error=${encodeURIComponent(error)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔄 Đang xử lý đăng nhập...
        </h2>
        <p className="text-gray-600">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
