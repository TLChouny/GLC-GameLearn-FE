import React from 'react';
import { AnimatedCard } from '../components/animated-card';
import { Button3D } from '../components/3d-button';

interface AdminLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const links: Array<{ path: string; label: string; icon: string }> = [
  { path: '/admin/users', label: 'Người dùng', icon: '👥' },
  { path: '/admin/games', label: 'Trò chơi', icon: '🎮' },
  { path: '/admin/items', label: 'Vật phẩm', icon: '🎁' },
  { path: '/admin/rankings', label: 'Xếp hạng', icon: '🏆' },
  { path: '/admin/lucky-wheels', label: 'Vòng quay', icon: '🎰' },
  { path: '/admin/subjects', label: 'Môn học', icon: '📚' },
  { path: '/admin/certificates', label: 'Chứng chỉ', icon: '📜' },
  { path: '/admin/trades', label: 'Giao dịch', icon: '💱' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden">
      <header className="bg-card backdrop-blur-sm shadow-xl border-b-4 border-primary/20 relative z-10">
        <div className="w-full h-[90px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl animate-bounce-gentle">
                <span className="text-2xl">⚙️</span>
              </div>
              <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title || 'Admin'}
              </h1>
            </div>
            <Button3D variant="secondary" onClick={() => (window.location.href = '/') } icon="🏠">
              Về trang chủ
            </Button3D>
          </div>
        </div>
      </header>

      <main className="w-full py-8 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AnimatedCard className="bg-card p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Quản lý</h2>
                <div className="space-y-2">
                  {links.map((l) => (
                    <Button3D
                      key={l.path}
                      variant={window.location.pathname.startsWith(l.path) ? 'primary' : 'secondary'}
                      onClick={() => (window.location.href = l.path)}
                      className="w-full text-left p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{l.icon}</span>
                        <span className="font-medium">{l.label}</span>
                      </div>
                    </Button3D>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            <div className="lg:col-span-3">
              <AnimatedCard className="bg-card p-6">
                {children}
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;


