"use client"

import type React from "react"
import { FloatingIcons } from "../components/floating-icons"
import { AnimatedCard } from "../components/animated-card"
import { Button3D } from "../components/3d-button"
import { useAuth } from "../contexts/AuthContext"
import "../styles/home.css"

const HomePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <div className="homepage-container">
      <div className="fixed top-20 left-10 text-6xl animate-kawaii-float pointer-events-none z-20 opacity-70">☁️</div>
      <div className="fixed top-40 right-10 text-6xl animate-kawaii-bounce pointer-events-none z-20 opacity-70">🎀</div>
      <div className="fixed bottom-20 left-20 text-5xl animate-kawaii-wiggle pointer-events-none z-20 opacity-60">
        🌸
      </div>
      <div className="fixed bottom-40 right-20 text-5xl animate-kawaii-float pointer-events-none z-20 opacity-60">
        ✨
      </div>

      <FloatingIcons />

      <header className="homepage-header container-padding">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center animate-kawaii-bounce">
              <span className="text-2xl">🐰</span>
            </div>
            <h1 className="ml-4 homepage-title text-3xl lg:text-4xl">Game Learning</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="homepage-text flex items-center">
                  <span className="text-2xl mr-2 animate-kawaii-wiggle">🌸</span>
                  <span className="hidden sm:inline">Xin chào, </span>
                  <span className="font-bold text-pink-600">{user?.userName || "Người dùng"}</span>
                </div>
                {user?.role === "admin" && (
                  <Button3D
                    variant="warning"
                    onClick={() => (window.location.href = "/admin")}
                    icon="👑"
                    className="homepage-btn homepage-btn-purple px-4 py-2"
                  >
                    Admin
                  </Button3D>
                )}
                <Button3D
                  variant="danger"
                  onClick={logout}
                  icon="🌙"
                  className="homepage-btn homepage-btn-pink px-4 py-2"
                >
                  Đăng xuất
                </Button3D>
              </>
            ) : (
              <>
                <Button3D
                  variant="primary"
                  onClick={() => (window.location.href = "/login")}
                  icon="☁️"
                  className="homepage-btn homepage-btn-blue px-4 py-2"
                >
                  Đăng nhập
                </Button3D>
                <Button3D
                  variant="secondary"
                  onClick={() => (window.location.href = "/register")}
                  icon="✨"
                  className="homepage-btn homepage-btn-purple px-4 py-2"
                >
                  Đăng ký
                </Button3D>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container-padding py-8">
        {/* Hero Section - Full width and height */}
        <AnimatedCard className="homepage-hero">
          <div className="relative h-full flex flex-col justify-center items-center text-center p-8 lg:p-16">
            <div className="absolute top-6 right-6 text-5xl animate-kawaii-float">☁️</div>
            <div className="absolute bottom-6 left-6 text-4xl animate-kawaii-bounce">🌟</div>
            <div className="absolute top-1/2 right-8 text-3xl animate-kawaii-wiggle">🐰</div>

            <h2 className="homepage-hero-title mb-6 text-balance">🌸 Chào mừng đến với Game Learning! 🌸</h2>
            <p className="homepage-hero-subtitle mb-8 text-pretty max-w-4xl">
              ☁️ Học tập cùng Cinnamoroll và Kuromi thật vui vẻ! ☁️
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button3D
                variant="primary"
                size="lg"
                icon="☁️"
                className="homepage-btn homepage-btn-blue text-xl py-4 px-8"
              >
                Bắt đầu học ngay!
              </Button3D>
              <Button3D
                variant="warning"
                size="lg"
                icon="📊"
                className="homepage-btn homepage-btn-pink text-xl py-4 px-8"
              >
                Xem thống kê
              </Button3D>
            </div>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <AnimatedCard className="homepage-card" delay={100}>
            <div className="text-center p-8 h-full flex flex-col justify-center">
              <div className="text-6xl mb-4 animate-kawaii-bounce">☁️</div>
              {isAuthenticated ? (
                <>
                  <div className="homepage-stat-number text-5xl font-bold mb-2">{user?.points || 0}</div>
                  <p className="homepage-stat-label text-lg">Điểm tích lũy</p>
                </>
              ) : (
                <>
                  <div className="homepage-stat-number text-3xl font-bold mb-2">Học tập vui vẻ</div>
                  <p className="homepage-stat-label text-lg">Cùng Cinnamoroll!</p>
                </>
              )}
            </div>
          </AnimatedCard>

          <AnimatedCard className="homepage-card" delay={200}>
            <div className="text-center p-8 h-full flex flex-col justify-center">
              <div className="text-6xl mb-4 animate-kawaii-float">🎀</div>
              {isAuthenticated ? (
                <>
                  <div className="homepage-stat-number-pink text-5xl font-bold mb-2">
                    {user?.stats?.gamesPlayed || 0}
                  </div>
                  <p className="homepage-stat-label text-lg">Trận đã chơi</p>
                </>
              ) : (
                <>
                  <div className="homepage-stat-number-pink text-3xl font-bold mb-2">Sáng tạo</div>
                  <p className="homepage-stat-label text-lg">Cùng Kuromi!</p>
                </>
              )}
            </div>
          </AnimatedCard>

          <AnimatedCard className="homepage-card" delay={300}>
            <div className="text-center p-8 h-full flex flex-col justify-center">
              <div className="text-6xl mb-4 animate-kawaii-wiggle">👑</div>
              {isAuthenticated ? (
                <>
                  <div className="homepage-stat-number-purple text-5xl font-bold mb-2">
                    {user?.stats?.gamesWon || 0}
                  </div>
                  <p className="homepage-stat-label text-lg">Trận thắng</p>
                </>
              ) : (
                <>
                  <div className="homepage-stat-number-purple text-3xl font-bold mb-2">Phát triển</div>
                  <p className="homepage-stat-label text-lg">Mỗi ngày!</p>
                </>
              )}
            </div>
          </AnimatedCard>

          <AnimatedCard className="homepage-card" delay={400}>
            <div className="text-center p-8 h-full flex flex-col justify-center">
              <div className="text-6xl mb-4 animate-spin-slow">🎰</div>
              <div className="homepage-stat-number-pink text-3xl font-bold mb-2">Vòng quay may mắn</div>
              <p className="homepage-stat-label text-lg">Thử vận may!</p>
            </div>
          </AnimatedCard>
        </div>

        <AnimatedCard className="homepage-actions-card">
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="homepage-section-title text-3xl lg:text-4xl flex items-center justify-center gap-4">
                <span className="animate-kawaii-wiggle">🌸</span>
                Hành động nhanh
                <span className="animate-kawaii-wiggle">🌸</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <Button3D
                variant="primary"
                className="homepage-btn homepage-btn-blue h-32 flex flex-col items-center justify-center"
              >
                <span className="text-5xl mb-2 animate-kawaii-bounce">☁️</span>
                <span className="text-lg font-bold">Bài học</span>
              </Button3D>

              <Button3D
                variant="success"
                className="homepage-btn homepage-btn-pink h-32 flex flex-col items-center justify-center"
              >
                <span className="text-5xl mb-2 animate-kawaii-float">🎀</span>
                <span className="text-lg font-bold">Thử thách</span>
              </Button3D>

              <Button3D
                variant="warning"
                className="homepage-btn homepage-btn-purple h-32 flex flex-col items-center justify-center"
              >
                <span className="text-5xl mb-2 animate-kawaii-wiggle">🌙</span>
                <span className="text-lg font-bold">Đấu với bạn</span>
              </Button3D>

              <Button3D
                variant="danger"
                className="homepage-btn homepage-btn-blue h-32 flex flex-col items-center justify-center"
              >
                <span className="text-5xl mb-2 animate-kawaii-bounce">👑</span>
                <span className="text-lg font-bold">Bảng xếp hạng</span>
              </Button3D>

              <Button3D
                variant="secondary"
                className="homepage-btn homepage-btn-pink h-32 flex flex-col items-center justify-center"
                onClick={() => (window.location.href = "/lucky-wheel")}
              >
                <span className="text-5xl mb-2 animate-spin-slow">🎰</span>
                <span className="text-lg font-bold">Vòng quay may mắn</span>
              </Button3D>
            </div>
          </div>
        </AnimatedCard>
      </main>

      <footer className="homepage-footer container-padding">
        <div className="text-center p-8">
          <div className="flex items-center justify-center mb-6">
            <h3 className="homepage-footer-title text-3xl">Kawaii Learning</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-2 animate-kawaii-float">☁️</div>
              <p className="homepage-footer-text">Học tập vui vẻ</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 animate-kawaii-bounce">🎀</div>
              <p className="homepage-footer-text">Sáng tạo</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 animate-kawaii-wiggle">🌙</div>
              <p className="homepage-footer-text">Phát triển</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 animate-kawaii-float">👑</div>
              <p className="homepage-footer-text">Thành tích</p>
            </div>
          </div>

          <div className="border-t border-white/30 pt-6">
            <p className="homepage-footer-text">© 2024 Kawaii Learning. Made with 💖 by Cinnamoroll & Kuromi</p>
            <div className="flex justify-center mt-4 space-x-6">
              <span className="text-2xl animate-kawaii-float">🌸</span>
              <span className="text-2xl animate-kawaii-bounce">✨</span>
              <span className="text-2xl animate-kawaii-wiggle">🎨</span>
              <span className="text-2xl animate-kawaii-float">💖</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
