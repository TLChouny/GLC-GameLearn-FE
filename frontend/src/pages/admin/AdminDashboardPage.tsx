import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatedCard } from '../../components/animated-card';
import { Button3D } from '../../components/3d-button';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  rankingService, 
  luckyWheelService,
  subjectService,
  certificateService,
  tradeService,
  houseDecorService
} from '../../services';

// Sử dụng type chuẩn từ `src/types`

const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  // const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data states (đã tách trang con nên không dùng ở Dashboard)
  // const [users, setUsers] = useState<User[]>([]);
  // const [gameChallenges, setGameChallenges] = useState<GameChallenge[]>([]);
  // const [items, setItems] = useState<Item[]>([]);

  // Stats states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGameChallenges: 0,
    totalItems: 0,
    totalRankings: 0,
    totalLuckyWheels: 0,
    totalSubjects: 0,
    totalCertificates: 0,
    totalTrades: 0,
    totalHouseDecorations: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      window.location.href = '/';
    }
  }, [isAuthenticated, user]);

  // Load all data
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadAllData();
    }
  }, [isAuthenticated, user]);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [
        /* usersRes, */
        /* gameChallengesRes, */
        /* itemsRes, */
        rankingsRes,
        luckyWheelsRes,
        subjectsRes,
        certificatesRes,
        tradesRes,
        houseDecorationsRes
      ] = await Promise.all([
        // userService.getAllUsers(),
        // gameService.getAllGameChallenges(),
        // itemService.getAllItems(),
        rankingService.getAllRankings(),
        luckyWheelService.getAllLuckyWheels(),
        subjectService.getAllSubjects(),
        certificateService.getAllCertificates(),
        tradeService.getAllTrades(),
        houseDecorService.getAllHouseDecorations()
      ]);

      // Dashboard chỉ hiển thị số liệu tổng; danh sách chi tiết xem ở trang con

      // Calculate stats
      setStats({
        totalUsers: 0,
        totalGameChallenges: 0,
        totalItems: 0,
        totalRankings: rankingsRes.data?.rankings?.length || 0,
        totalLuckyWheels: luckyWheelsRes.data?.luckyWheels?.length || 0,
        totalSubjects: subjectsRes.data?.subjects?.length || 0,
        totalCertificates: certificatesRes.data?.certificates?.length || 0,
        totalTrades: tradesRes.data?.trades?.length || 0,
        totalHouseDecorations: houseDecorationsRes.data?.houseDecorations?.length || 0
      });

    } catch {
      setError('Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  // Các tab đã được di chuyển sang AdminLayout

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <AnimatedCard className="bg-card p-12 text-center max-w-md">
            <div className="text-8xl mb-6 animate-bounce-gentle">🔒</div>
            <h1 className="text-4xl font-bold text-primary mb-4">Truy cập bị từ chối</h1>
            <p className="text-lg text-foreground mb-8">
              Bạn cần đăng nhập để truy cập trang quản trị
            </p>
            <Button3D 
              variant="primary" 
              onClick={() => (window.location.href = "/login")}
              className="w-full"
            >
              Đăng nhập
            </Button3D>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <AnimatedCard className="bg-card p-12 text-center max-w-md">
            <div className="text-8xl mb-6 animate-wiggle">⚠️</div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
            <p className="text-lg text-foreground mb-8">
              Chỉ admin mới có thể truy cập trang quản trị
            </p>
            <Button3D 
              variant="secondary" 
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Về trang chủ
            </Button3D>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatedCard className="bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-float">👥</div>
          <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalUsers}</div>
          <p className="text-foreground font-bold text-xl">Người dùng</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-bounce-gentle">🎮</div>
          <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalGameChallenges}</div>
          <p className="text-foreground font-bold text-xl">Thử thách</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-purple-100 to-purple-200 border-4 border-purple-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-wiggle">🎁</div>
          <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalItems}</div>
          <p className="text-foreground font-bold text-xl">Vật phẩm</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-float">🏆</div>
          <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.totalRankings}</div>
          <p className="text-foreground font-bold text-xl">Xếp hạng</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-pink-100 to-pink-200 border-4 border-pink-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-spin-slow">🎰</div>
          <div className="text-4xl font-bold text-pink-600 mb-2">{stats.totalLuckyWheels}</div>
          <p className="text-foreground font-bold text-xl">Vòng quay</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-4 border-indigo-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-bounce-gentle">📚</div>
          <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.totalSubjects}</div>
          <p className="text-foreground font-bold text-xl">Môn học</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-teal-100 to-teal-200 border-4 border-teal-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-wiggle">📜</div>
          <div className="text-4xl font-bold text-teal-600 mb-2">{stats.totalCertificates}</div>
          <p className="text-foreground font-bold text-xl">Chứng chỉ</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-orange-100 to-orange-200 border-4 border-orange-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-float">💱</div>
          <div className="text-4xl font-bold text-orange-600 mb-2">{stats.totalTrades}</div>
          <p className="text-foreground font-bold text-xl">Giao dịch</p>
        </div>
      </AnimatedCard>

      <AnimatedCard className="bg-gradient-to-br from-cyan-100 to-cyan-200 border-4 border-cyan-300 shadow-xl">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-bounce-gentle">🏠</div>
          <div className="text-4xl font-bold text-cyan-600 mb-2">{stats.totalHouseDecorations}</div>
          <p className="text-foreground font-bold text-xl">Trang trí</p>
        </div>
      </AnimatedCard>
    </div>
  );

  /* const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-primary">Quản lý người dùng</h3>
        <Button3D variant="primary" icon="➕">
          Thêm người dùng
        </Button3D>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <AnimatedCard key={user._id} className="bg-card p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {user.userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{user.userName || 'Unknown'}</h4>
                <p className="text-sm text-foreground/70">{user.email || 'No email'}</p>
                <p className="text-sm text-primary">{user.role || 'No role'}</p>
              </div>
              <div className="flex space-x-2">
                <Button3D variant="secondary" size="sm">✏️</Button3D>
                <Button3D variant="danger" size="sm">🗑️</Button3D>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  ); */

  /* const renderGameChallenges = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-primary">Quản lý thử thách</h3>
        <Button3D variant="primary" icon="➕">
          Thêm thử thách
        </Button3D>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameChallenges.map((challenge) => (
          <AnimatedCard key={challenge._id} className="bg-card p-4">
            <div className="mb-4">
              <h4 className="font-bold text-lg mb-2">{challenge.title || 'No title'}</h4>
              <p className="text-sm text-foreground/70 mb-2">{challenge.title || 'No description'}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty || 'unknown'}
                </span>
                <span className="text-sm font-bold text-primary">{challenge.rewardPoints || 0} điểm</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button3D variant="secondary" size="sm">✏️</Button3D>
              <Button3D variant="danger" size="sm">🗑️</Button3D>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  ); */

  /* const renderItems = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-primary">Quản lý vật phẩm</h3>
        <Button3D variant="primary" icon="➕">
          Thêm vật phẩm
        </Button3D>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <AnimatedCard key={item._id} className="bg-card p-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎁</div>
              <h4 className="font-bold text-lg mb-2">{item.itemName || 'No name'}</h4>
              <p className="text-sm text-foreground/70 mb-2">{item.itemName || 'No description'}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-primary">{item.itemPrice || 0} điểm</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.itemType || 'unknown'}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button3D variant="secondary" size="sm">✏️</Button3D>
              <Button3D variant="danger" size="sm">🗑️</Button3D>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  ); */

  const renderContent = () => renderOverview();

  return (
    <AdminLayout title="Admin Dashboard">
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-spin-slow">⏳</div>
          <h3 className="text-2xl font-bold text-primary mb-2">Đang tải...</h3>
          <p className="text-foreground/70">Vui lòng chờ trong giây lát</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">Có lỗi xảy ra</h3>
          <p className="text-foreground/70 mb-4">{error}</p>
          <Button3D variant="primary" onClick={loadAllData}>
            Thử lại
          </Button3D>
        </div>
      ) : (
        renderContent()
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
