import type React from "react"
import { FloatingIcons } from "../components/floating-icons"
import { AnimatedCard } from "../components/animated-card"
import { Button3D } from "../components/3d-button"
import { useAuth } from "../contexts/AuthContext"

const HomePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden">
      <FloatingIcons />

      {/* Header */}
      <header className="bg-card backdrop-blur-sm shadow-xl border-b-4 border-primary/20 relative z-10">
        <div className="w-full h-[90px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl animate-bounce-gentle">
                <span className="text-2xl">🎮</span>
              </div>
              <h1 className="ml-4 text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Game Learning
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="text-lg text-card-foreground font-medium flex items-center">
                    <span className="text-3xl mr-3 animate-wiggle">👋</span>
                    <span>
                      Xin chào, <span className="font-bold text-primary">{user?.userName || 'Người dùng'}</span>
                    </span>
                  </div>
                  <Button3D variant="danger" onClick={logout} icon="👋">
                    Đăng xuất
                  </Button3D>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button3D variant="primary" onClick={() => (window.location.href = "/login")} icon="🚀">
                    Đăng nhập
                  </Button3D>
                  <Button3D variant="secondary" onClick={() => (window.location.href = "/register")} icon="🎉">
                    Đăng ký
                  </Button3D>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-8 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedCard
              className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-card to-primary/10 border-4 border-primary/20 shadow-2xl relative overflow-hidden min-h-[300px]"
              hoverEffect="glow"
            >
              <div className="absolute top-4 right-4 text-6xl animate-float animate-delay-100">🌈</div>
              <div className="absolute bottom-4 left-4 text-4xl animate-bounce-gentle animate-delay-200">⭐</div>
              <div className="text-center p-12 lg:p-16 relative z-10 h-full flex flex-col justify-center">
                <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8 text-balance">
                  🎉 Chào mừng đến với Game Learning! 🎉
                </h2>
                <p className="text-2xl lg:text-3xl text-foreground/80 mb-10 font-medium text-pretty">
                  🌟 Học tập thông qua các trò chơi thú vị và tương tác! 🌟
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                  <Button3D variant="primary" size="lg" icon="🚀" className="w-full sm:w-auto text-xl py-4 px-8">
                    Bắt đầu học ngay!
                  </Button3D>
                  <Button3D variant="warning" size="lg" icon="📊" className="w-full sm:w-auto text-xl py-4 px-8">
                    Xem thống kê
                  </Button3D>
                </div>
              </div>
            </AnimatedCard>

            {isAuthenticated ? (
              <>
                <AnimatedCard
                  className="bg-gradient-to-br from-pink-100 to-pink-200 border-4 border-pink-300 shadow-xl min-h-[200px]"
                  hoverEffect="bounce"
                  delay={100}
                >
                  <div className="text-center p-8 h-full flex flex-col justify-center">
                    <div className="text-7xl mb-6 animate-bounce-gentle">🏆</div>
                    <div className="text-6xl font-bold text-pink-600 mb-4">{user?.points || 0}</div>
                    <p className="text-foreground font-bold text-2xl">Điểm tích lũy</p>
                  </div>
                </AnimatedCard>

                <AnimatedCard
                  className="bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300 shadow-xl min-h-[200px]"
                  hoverEffect="wiggle"
                  delay={200}
                >
                  <div className="text-center p-8 h-full flex flex-col justify-center">
                    <div className="text-7xl mb-6 animate-float">🎮</div>
                    <div className="text-6xl font-bold text-green-600 mb-4">{user?.stats?.gamesPlayed || 0}</div>
                    <p className="text-foreground font-bold text-2xl">Trận đã chơi</p>
                  </div>
                </AnimatedCard>

                <AnimatedCard
                  className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-300 shadow-xl min-h-[200px]"
                  hoverEffect="glow"
                  delay={300}
                >
                  <div className="text-center p-8 h-full flex flex-col justify-center">
                    <div className="text-7xl mb-6 animate-wiggle">🎯</div>
                    <div className="text-6xl font-bold text-yellow-600 mb-4">{user?.stats?.gamesWon || 0}</div>
                    <p className="text-foreground font-bold text-2xl">Trận thắng</p>
                  </div>
                </AnimatedCard>
              </>
            ) : (
              <>
                <AnimatedCard
                  className="bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300 shadow-xl min-h-[200px]"
                  hoverEffect="bounce"
                  delay={100}
                >
                  <div className="text-center p-8 h-full flex flex-col justify-center">
                    <div className="text-7xl mb-6 animate-float">🌟</div>
                    <div className="text-4xl font-bold text-blue-600 mb-4">Học tập vui vẻ</div>
                    <p className="text-foreground font-bold text-2xl">Tham gia ngay!</p>
                  </div>
                </AnimatedCard>

                <AnimatedCard
                  className="bg-gradient-to-br from-purple-100 to-purple-200 border-4 border-purple-300 shadow-xl min-h-[200px]"
                  hoverEffect="wiggle"
                  delay={200}
                >
                  <div className="text-center p-8 h-full flex flex-col justify-center">
                    <div className="text-7xl mb-6 animate-bounce-gentle">🎨</div>
                    <div className="text-4xl font-bold text-purple-600 mb-4">Sáng tạo</div>
                    <p className="text-foreground font-bold text-2xl">Khám phá thế giới</p>
                  </div>
                </AnimatedCard>

                <AnimatedCard
                  className="bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300 shadow-xl min-h-[200px]"
                  hoverEffect="glow"
                  delay={300}
                >
                  <div className="text-center p-8 h-full flex flex-col justify-center">
                    <div className="text-7xl mb-6 animate-float">🚀</div>
                    <div className="text-4xl font-bold text-green-600 mb-4">Phát triển</div>
                    <p className="text-foreground font-bold text-2xl">Học hỏi mỗi ngày</p>
                  </div>
                </AnimatedCard>
              </>
            )}

            <AnimatedCard
              className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-card to-secondary/10 border-4 border-secondary/20 shadow-2xl relative overflow-hidden"
              hoverEffect="glow"
            >
              <div className="absolute top-6 left-6 text-5xl animate-wiggle animate-delay-100">⚡</div>
              <div className="absolute top-6 right-6 text-5xl animate-wiggle animate-delay-300">⚡</div>
              <div className="text-center mb-8 p-8">
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center justify-center gap-4">
                  Hành động nhanh
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 pt-0">
                <Button3D
                  variant="primary"
                  className="h-36 flex flex-col items-center justify-center text-white font-bold rounded-2xl"
                >
                  <span className="text-6xl mb-3 animate-bounce-gentle">📚</span>
                  <span className="text-xl font-bold">Bài học</span>
                </Button3D>

                <Button3D
                  variant="success"
                  className="h-36 flex flex-col items-center justify-center text-white font-bold rounded-2xl"
                >
                  <span className="text-6xl mb-3 animate-float animate-delay-100">🎯</span>
                  <span className="text-xl font-bold">Thử thách</span>
                </Button3D>

                <Button3D
                  variant="warning"
                  className="h-36 flex flex-col items-center justify-center text-white font-bold rounded-2xl"
                >
                  <span className="text-6xl mb-3 animate-wiggle animate-delay-200">👥</span>
                  <span className="text-xl font-bold">Đấu với bạn</span>
                </Button3D>

                <Button3D
                  variant="danger"
                  className="h-36 flex flex-col items-center justify-center text-white font-bold rounded-2xl"
                >
                  <span className="text-6xl mb-3 animate-bounce-gentle animate-delay-300">🏆</span>
                  <span className="text-xl font-bold">Bảng xếp hạng</span>
                </Button3D>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 right-10 text-8xl animate-float animate-delay-200 pointer-events-none opacity-20">
        🎪
      </div>
      <div className="fixed bottom-20 left-10 text-6xl animate-bounce-gentle animate-delay-100 pointer-events-none opacity-20">
        🎨
      </div>
    </div>
  )
}

export default HomePage
