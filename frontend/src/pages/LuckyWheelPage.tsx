import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedCard } from '../components/animated-card';
import { Button3D } from '../components/3d-button';
// import SimpleLuckyWheel from '../components/simple-lucky-wheel';
// import TestWheel from '../components/test-wheel';
// import LuckyWheel18 from '../components/lucky-wheel-18';
// import BeautifulLuckyWheel from '../components/beautiful-lucky-wheel';
import WorkingLuckyWheel from '../components/working-lucky-wheel';
import type { WheelSegment } from '../components/working-lucky-wheel';
import { luckyWheelService } from '../services';
import type { LuckyWheel, LuckyWheelPrizeWithItem, SpinResult, LuckyWheelSpinWithDetails } from '../types';

const LuckyWheelPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [wheels, setWheels] = useState<LuckyWheel[]>([]);
  const [selectedWheel, setSelectedWheel] = useState<LuckyWheel | null>(null);
  const [prizes, setPrizes] = useState<LuckyWheelPrizeWithItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  // const [userSpins, setUserSpins] = useState(0);
  // const [maxSpins] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todaySpins, setTodaySpins] = useState<number>(0);
  // const [remainingSpins, setRemainingSpins] = useState<number>(0);
  const [history, setHistory] = useState<LuckyWheelSpinWithDetails[]>([]);
  const [totalSpinsCap, setTotalSpinsCap] = useState<number>(0);
  const pendingSpinDataRef = useRef<SpinResult | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Legend segments mặc định (nếu chưa có prize từ API)
  const segments = React.useMemo<WheelSegment[]>(() => [
    { id: '1', text: '1.000 VND', color: '#FF4444', icon: '📱' },
    { id: '2', text: '2.000 VND', color: '#CC0000', icon: '📞' },
    { id: '3', text: '5.000 VND', color: '#FF8800', icon: '🌐' },
    { id: '4', text: '10.000 VND', color: '#FFDD00', icon: '☁️' },
    { id: '5', text: '20.000 VND', color: '#88FF88', icon: '💰' },
    { id: '6', text: '50.000 VND', color: '#4488FF', icon: '💎' },
    { id: '7', text: 'THÊM LƯỢT', color: '#AA44FF', icon: '🔄' },
    { id: '8', text: 'x1 mảnh quần áo', color: '#0044AA', icon: '🔗' },
    { id: '9', text: 'x1 mảnh quần áo', color: '#006600', icon: '😄' },
    { id: '10', text: 'x1 mảnh túi xách', color: '#4488FF', icon: '🍀' },
    { id: '11', text: 'x1 mảnh túi xách', color: '#AA44FF', icon: '📧' },
    { id: '12', text: 'x1 mảnh dây chuyền', color: '#CC8844', icon: '✉️' },
    { id: '13', text: 'x1 mảnh dây chuyền', color: '#FF6B6B', icon: '📲' },
    { id: '14', text: 'x1 mảnh vòng tay', color: '#4ECDC4', icon: '📶' },
    { id: '15', text: 'x1 mảnh vòng tay', color: '#45B7D1', icon: '💵' },
    { id: '16', text: 'x1 mảnh 100.000 VND', color: '#F7DC6F', icon: '🏆' },
    { id: '17', text: 'x1 mảnh 200.000 VND', color: '#BB8FCE', icon: '💌' },
    { id: '18', text: 'x1 mảnh 500.000 VND', color: '#85C1E9', icon: '🎁' }
  ], []);

  // Load wheels and prizes
  useEffect(() => {
    const loadWheels = async () => {
      try {
        setIsLoading(true);
        const response = await luckyWheelService.getAllLuckyWheels();
        if (response.success && response.data) {
          setWheels(response.data.luckyWheels);
          if (response.data.luckyWheels.length > 0) {
            const first = response.data.luckyWheels[0];
            setSelectedWheel(first);
            setTotalSpinsCap(first.maxSpinPerDay);
            await loadPrizes(first._id);
            await loadStatsAndHistory(first._id);
          }
        }
      } catch {
        setError('Không thể tải danh sách vòng quay');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadWheels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Load prizes for selected wheel
  const loadPrizes = async (wheelId: string) => {
    try {
      const response = await luckyWheelService.getLuckyWheelPrizes(wheelId);
      if (response.success && response.data) {
        setPrizes(response.data.prizes);
      }
    } catch {
      console.error('Error loading prizes');
    }
  };

  // Load stats & history
  const loadStatsAndHistory = async (wheelId: string) => {
    try {
      const [statsRes, infoRes, historyRes] = await Promise.all([
        luckyWheelService.getUserSpinStatsByWheel(wheelId),
        luckyWheelService.getWheelInfo(wheelId),
        luckyWheelService.getUserSpinHistoryByWheel(wheelId, { page: 1, limit: 10 })
      ]);

      if (statsRes.success && statsRes.data) {
        setTodaySpins(statsRes.data.todaySpins);
      }
      // remainingSpins được tính gián tiếp qua infoRes để tính tổng giới hạn động
      let newRemain = 0;
      if (infoRes.success && infoRes.data) {
        newRemain = infoRes.data.remainingSpins;
      }
      const newToday = statsRes.success && statsRes.data ? statsRes.data.todaySpins : 0;
      const dynamicTotal = newToday + newRemain;
      const baseCap = (selectedWheel?.maxSpinPerDay ?? 0);
      setTotalSpinsCap(Math.max(baseCap, dynamicTotal));

      if (historyRes.success && historyRes.data) {
        setHistory(historyRes.data.spinHistory);
      }
    } catch {
      // ignore
    }
  };

  // Map prizes API -> segments cho wheel (id là prize._id)
  const apiSegments: WheelSegment[] = React.useMemo(() => {
    if (!prizes || prizes.length === 0) return segments;
    const palette = ['#FF4444','#CC0000','#FF8800','#FFDD00','#88FF88','#4488FF','#AA44FF','#0044AA','#006600','#4488FF','#AA44FF','#CC8844','#FF6B6B','#4ECDC4','#45B7D1','#F7DC6F','#BB8FCE','#85C1E9'];
    const icons    = ['🎁','💎','💰','🍀','🏆','🎫','🔮','🎉','🧩','⭐','🎈','🎲','🎯','🎵','🎀','📦','🪙','💌'];
    return prizes.map((p, idx) => ({
      id: p._id,
      text: p.prizeName,
      color: palette[idx % palette.length],
      icon: icons[idx % icons.length]
    }));
  }, [prizes, segments]);

  const handleSpinRequest = async (): Promise<string> => {
    if (!selectedWheel) throw new Error('No wheel selected');
    setIsSpinning(true);
    setError(null);
    const response = await luckyWheelService.spinLuckyWheel(selectedWheel._id);
    if (!response.success || !response.data) {
      setIsSpinning(false);
      throw new Error(response.message || 'Không thể quay vòng quay');
    }
    // Lưu tạm, đợi bánh xe dừng mới hiển thị
    pendingSpinDataRef.current = response.data as SpinResult;
    // Trả về prizeId để wheel quay đúng ô
    // @ts-expect-error spin BE mới đã trả prizeId
    return (response.data.prizeId as string) || '';
  };


  // Handle wheel selection
  const handleWheelSelect = async (wheel: LuckyWheel) => {
    setSelectedWheel(wheel);
    setTotalSpinsCap(wheel.maxSpinPerDay);
    await loadPrizes(wheel._id);
    await loadStatsAndHistory(wheel._id);
    setSpinResult(null);
  };

  // Reset spin result
  const resetSpinResult = () => {
    setSpinResult(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <AnimatedCard className="bg-card p-12 text-center max-w-md">
            <div className="text-8xl mb-6 animate-spin-slow">🎰</div>
            <h1 className="text-4xl font-bold text-primary mb-4">Vòng Quay May Mắn</h1>
            <p className="text-lg text-foreground mb-8">
              Bạn cần đăng nhập để sử dụng tính năng vòng quay may mắn
            </p>
            <Button3D 
              variant="primary" 
              onClick={() => (window.location.href = "/login")}
              className="w-full"
            >
              Đăng nhập ngay
            </Button3D>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-spin-slow">🎰</div>
            <h1 className="text-4xl font-bold text-primary mb-4">Đang tải...</h1>
            <p className="text-lg text-foreground">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden">
      {/* Header */}
      <header className="bg-card backdrop-blur-sm shadow-xl border-b-4 border-primary/20 relative z-10">
        <div className="w-full h-[72px] sm:h-[90px] px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl animate-bounce-gentle">
                <span className="text-2xl">🎰</span>
              </div>
              <h1 className="ml-3 sm:ml-4 text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vòng Quay May Mắn
              </h1>
            </div>
            <Button3D variant="secondary" onClick={() => (window.location.href = "/")} icon="🏠" className="hidden sm:inline-flex">
              Về trang chủ
            </Button3D>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-8 relative z-10">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Wheel Selection */}
            <div className="lg:col-span-1">
              <AnimatedCard className="bg-card p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  Chọn Vòng Quay
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {wheels.map((wheel) => (
                    <Button3D
                      key={wheel._id}
                      variant={selectedWheel?._id === wheel._id ? "primary" : "secondary"}
                      onClick={() => handleWheelSelect(wheel)}
                      className="w-full text-left p-3 sm:p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">{wheel.wheelTitle}</div>
                          <div className="text-sm opacity-80">{wheel.wheelDescription}</div>
                        </div>
                        <div className="text-2xl">🎰</div>
                      </div>
                    </Button3D>
                  ))}
                </div>
              </AnimatedCard>

              {/* User Stats */}
              <AnimatedCard className="bg-card p-4 sm:p-6">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Thống Kê
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Lần quay hôm nay:</span>
                    <span className="font-bold text-primary">{todaySpins}/{totalSpinsCap}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Điểm hiện tại:</span>
                    <span className="font-bold text-primary">{user?.points || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalSpinsCap > 0 ? (todaySpins / totalSpinsCap) * 100 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Spin History */}
              <AnimatedCard className="bg-card p-4 sm:p-6 mt-4 sm:mt-6">
                <div className="flex items-center justify-between sm:mb-4">
                  <h3 className="hidden sm:flex text-lg sm:text-xl font-bold text-primary items-center">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🕒</span>
                    Lịch sử quay gần đây
                  </h3>
                  {/* Toggle button (mobile) */}
                  <button
                    type="button"
                    className="sm:hidden w-full flex items-center justify-between text-xs px-3 py-2 rounded-full border text-primary border-primary/40 bg-white/70 backdrop-blur hover:bg-primary/10 transition-colors"
                    onClick={() => setShowHistory(v => !v)}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">🕒</span>
                      <span className="font-semibold">Lịch sử quay gần đây</span>
                    </span>
                    <span
                      className={`${showHistory ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`}
                      aria-hidden
                    >▾</span>
                  </button>
                </div>
                {/* Desktop label below to align spacing */}
                <div className="hidden sm:block mb-2 text-sm text-foreground/70">Những lượt quay mới nhất của bạn</div>

                {/* Collapsible content on mobile; always visible on >= sm */}
                <div className={`sm:block overflow-hidden ${showHistory ? 'max-h-[480px]' : 'max-h-0'} sm:max-h-none transition-[max-height] duration-300 ease-in-out`}>
                  <div className="space-y-2 sm:space-y-3">
                    {history.length === 0 && (
                      <div className="text-sm text-foreground">Chưa có lượt quay nào</div>
                    )}
                    {history.map(h => (
                      <div key={h._id} className="flex items-center justify-between text-xs sm:text-sm p-2 sm:p-3 rounded-lg border bg-white/70 backdrop-blur">
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{h.spinResult}</div>
                          <div className="opacity-70">{new Date(h.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="ml-3 text-primary text-base sm:text-lg">🎁</div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Wheel Display */}
            <div className="lg:col-span-2">
              <AnimatedCard className="bg-card p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl mr-2 sm:mr-3">🎰</span>
                  {selectedWheel?.wheelTitle || 'Chọn vòng quay'}
                </h2>
                
                <div className="mb-4 sm:mb-8">
                {selectedWheel && (
                    <div className="text-base sm:text-lg text-foreground mb-3 sm:mb-4">
                      {selectedWheel.wheelDescription}
                    </div>
                  )}
                    
                    {/* Wheel Visual */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-center mb-4">
                      <p className="text-xs sm:text-sm text-gray-600">
                        {selectedWheel ? selectedWheel.wheelTitle : 'Vòng quay may mắn'}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <WorkingLuckyWheel
                        pointerOffsetDeg={260}
                        segments={apiSegments}
                        onSpinStart={() => setIsSpinning(true)}
                        onSpinRequest={handleSpinRequest}
                        onSpinComplete={async () => {
                          if (pendingSpinDataRef.current) {
                            const data = pendingSpinDataRef.current as SpinResult;
                            setSpinResult(data);
                            if (typeof data.bonusAdded !== 'undefined') {
                              console.log(`+${data.bonusAdded} lượt quay!`);
                            }
                            if (selectedWheel) {
                              await loadStatsAndHistory(selectedWheel._id);
                            }
                            pendingSpinDataRef.current = null;
                          }
                          setIsSpinning(false);
                        }}
                        isSpinning={isSpinning}
                        disabled={!selectedWheel}
                      />
                    </div>
                      </div>
                      
                  {/* Spin Status */}
                  <div className="text-center">
                    <div className="text-base sm:text-lg text-primary font-bold">
                      Vòng quay sẵn sàng!
                    </div>
                      </div>
                    
                    {/* Legend danh sách phần thưởng (lấy từ API prizes) */}
                    <div className="mt-6 sm:mt-8 text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4 flex items-center">
                        <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🎁</span>
                        Danh sách phần thưởng
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {apiSegments.map((s) => (
                          <div key={s.id} className="flex items-center p-2 sm:p-3 rounded-lg border bg-white/60 backdrop-blur-sm">
                            <span className="mr-2 text-lg sm:text-xl">{s.icon}</span>
                            <span className="text-xs sm:text-sm font-medium text-foreground">{s.text}</span>
                            <span className="ml-auto w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quy luật đổi thưởng */}
                    <div className="mt-4 sm:mt-6 text-left">
                      <h4 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3">Quy luật đổi thưởng</h4>
                      <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-xs sm:text-sm text-foreground">
                        <li>Ghép 4 mảnh "100.000 VND" ➜ đổi 100.000 VND</li>
                        <li>Ghép 5 mảnh "200.000 VND" ➜ đổi 200.000 VND</li>
                        <li>Ghép 6 mảnh "500.000 VND" ➜ đổi 500.000 VND</li>
                        <li>Ghép 4 mảnh "quần áo" ➜ đổi 1 phần quà quần áo</li>
                        <li>Ghép 5 mảnh "túi xách" ➜ đổi 1 phần quà túi xách</li>
                        <li>Ghép 5 mảnh "dây chuyền" ➜ đổi 1 phần quà dây chuyền</li>
                        <li>Ghép 5 mảnh "vòng tay" ➜ đổi 1 phần quà vòng tay</li>
                      </ul>
                    </div>
                    </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {/* Spin Result */}
                {spinResult && (
                  <AnimatedCard className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-300 mt-6">
                    <div className="text-center p-6">
                      <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
                      <h3 className="text-3xl font-bold text-yellow-600 mb-2">Chúc mừng!</h3>
                      <p className="text-xl text-foreground mb-4">
                        Bạn đã nhận được: <span className="font-bold text-yellow-600">{spinResult.prize.name}</span>
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button3D variant="primary" onClick={resetSpinResult}>
                          Quay tiếp
                        </Button3D>
                        <Button3D variant="secondary" onClick={() => (window.location.href = "/")}>
                          Về trang chủ
                        </Button3D>
                      </div>
                    </div>
                  </AnimatedCard>
                )}
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LuckyWheelPage;
