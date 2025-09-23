import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedCard } from '../components/animated-card';
import { Button3D } from '../components/3d-button';
// import SimpleLuckyWheel from '../components/simple-lucky-wheel';
// import TestWheel from '../components/test-wheel';
// import LuckyWheel18 from '../components/lucky-wheel-18';
// import BeautifulLuckyWheel from '../components/beautiful-lucky-wheel';
import WorkingLuckyWheel from '../components/working-lucky-wheel';
import { luckyWheelService } from '../services';
import type { LuckyWheel, SpinResult } from '../types';

const LuckyWheelPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [wheels, setWheels] = useState<LuckyWheel[]>([]);
  const [selectedWheel, setSelectedWheel] = useState<LuckyWheel | null>(null);
  // const [prizes, setPrizes] = useState<LuckyWheelPrize[]>([]);
  // const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  // const [userSpins, setUserSpins] = useState(0);
  // const [maxSpins] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load wheels and prizes
  useEffect(() => {
    const loadWheels = async () => {
      try {
        setIsLoading(true);
        const response = await luckyWheelService.getAllLuckyWheels();
        if (response.success && response.data) {
          setWheels(response.data.luckyWheels);
          if (response.data.luckyWheels.length > 0) {
            setSelectedWheel(response.data.luckyWheels[0]);
            await loadPrizes(response.data.luckyWheels[0]._id);
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
  }, [isAuthenticated]);

  // Load prizes for selected wheel
  const loadPrizes = async (wheelId: string) => {
    try {
      const response = await luckyWheelService.getLuckyWheelPrizes(wheelId);
      if (response.success && response.data) {
        // setPrizes(response.data.prizes);
        console.log('Prizes loaded:', response.data.prizes);
      }
    } catch {
      console.error('Error loading prizes');
    }
  };

  // Handle wheel selection
  const handleWheelSelect = async (wheel: LuckyWheel) => {
    setSelectedWheel(wheel);
    await loadPrizes(wheel._id);
    setSpinResult(null);
  };

  // Handle spin (legacy function - not used anymore)
  // const handleSpin = async () => {
  //   if (!selectedWheel || isSpinning || userSpins >= maxSpins) return;

  //   try {
  //     setIsSpinning(true);
  //     setError(null);
      
  //     const response = await luckyWheelService.spinLuckyWheel(selectedWheel._id);
  //     if (response.success && response.data) {
  //       setSpinResult(response.data);
  //       setUserSpins(prev => prev + 1);
  //     } else {
  //       setError(response.message || 'Không thể quay vòng quay');
  //     }
  //   } catch {
  //     setError('Có lỗi xảy ra khi quay vòng quay');
  //   } finally {
  //     setIsSpinning(false);
  //   }
  // };

  // Handle wheel spin start
  // const handleWheelSpinStart = () => {
  //   setIsSpinning(true);
  //   setError(null);
  // };

  // Handle wheel spin complete
  // const handleWheelSpinComplete = (segment: { id: string; text: string; color: string; icon: string }) => {
  //   // Tạo kết quả giả lập từ segment được chọn
  //   const mockResult: SpinResult = {
  //     spinResult: segment.text,
  //     prize: {
  //       name: segment.text,
  //       type: 'points', // Sử dụng type hợp lệ
  //       value: 10,
  //       itemId: undefined
  //     },
  //     remainingSpins: maxSpins - userSpins - 1
  //   };
    
  //   setSpinResult(mockResult);
  //   setUserSpins(prev => prev + 1);
  //   setIsSpinning(false);
  // };

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
        <div className="w-full h-[90px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl animate-bounce-gentle">
                <span className="text-2xl">🎰</span>
              </div>
              <h1 className="ml-4 text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vòng Quay May Mắn
              </h1>
            </div>
            <Button3D variant="secondary" onClick={() => (window.location.href = "/")} icon="🏠">
              Về trang chủ
            </Button3D>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-8 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wheel Selection */}
            <div className="lg:col-span-1">
              <AnimatedCard className="bg-card p-6 mb-6">
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  Chọn Vòng Quay
                </h2>
                <div className="space-y-3">
                  {wheels.map((wheel) => (
                    <Button3D
                      key={wheel._id}
                      variant={selectedWheel?._id === wheel._id ? "primary" : "secondary"}
                      onClick={() => handleWheelSelect(wheel)}
                      className="w-full text-left p-4"
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
              <AnimatedCard className="bg-card p-6">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Thống Kê
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Lần quay hôm nay:</span>
                    <span className="font-bold text-primary">0/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Điểm hiện tại:</span>
                    <span className="font-bold text-primary">{user?.points || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Wheel Display */}
            <div className="lg:col-span-2">
              <AnimatedCard className="bg-card p-8 text-center">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center justify-center">
                  <span className="text-4xl mr-3">🎰</span>
                  {selectedWheel?.wheelTitle || 'Chọn vòng quay'}
                </h2>
                
                <div className="mb-8">
                {selectedWheel && (
                    <div className="text-lg text-foreground mb-4">
                      {selectedWheel.wheelDescription}
                    </div>
                  )}
                    
                    {/* Wheel Visual */}
                  <div className="mb-8">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        {selectedWheel ? selectedWheel.wheelTitle : 'Vòng quay may mắn'}
                      </p>
                    </div>
                    <WorkingLuckyWheel
                      pointerOffsetDeg={260}
                      onSpinStart={() => console.log('Spin started')}
                      onSpinComplete={(segment) => {
                        console.log('Won:', segment.text);
                        // Tạo kết quả giả lập
                        const mockResult: SpinResult = {
                          spinResult: segment.text,
                          prize: {
                            name: segment.text,
                            type: 'points',
                            value: 10,
                            itemId: undefined
                          },
                          remainingSpins: 4
                        };
                        setSpinResult(mockResult);
                      }}
                      isSpinning={false}
                      disabled={false}
                    />
                      </div>
                      
                  {/* Spin Status */}
                  <div className="text-center">
                    <div className="text-lg text-primary font-bold">
                      Vòng quay sẵn sàng!
                    </div>
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
