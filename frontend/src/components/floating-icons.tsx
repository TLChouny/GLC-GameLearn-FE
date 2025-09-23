import type React from "react"

export const FloatingIcons: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <div className="absolute top-1/4 left-1/3 text-4xl opacity-40 animate-kawaii-float">🌸</div>
      <div
        className="absolute top-3/4 right-1/4 text-3xl opacity-35 animate-kawaii-bounce"
        style={{ animationDelay: "0.5s" }}
      >
        ✨
      </div>
      <div
        className="absolute top-1/2 left-1/5 text-5xl opacity-30 animate-kawaii-wiggle"
        style={{ animationDelay: "1s" }}
      >
        🎀
      </div>
      <div
        className="absolute bottom-1/4 right-1/3 text-4xl opacity-45 animate-kawaii-float"
        style={{ animationDelay: "1.5s" }}
      >
        💖
      </div>
      <div
        className="absolute top-1/3 right-1/5 text-3xl opacity-35 animate-kawaii-bounce"
        style={{ animationDelay: "2s" }}
      >
        🌙
      </div>
      <div
        className="absolute bottom-1/3 left-1/4 text-4xl opacity-40 animate-kawaii-wiggle"
        style={{ animationDelay: "2.5s" }}
      >
        ⭐
      </div>
      <div
        className="absolute top-2/3 left-2/3 text-3xl opacity-30 animate-kawaii-float"
        style={{ animationDelay: "3s" }}
      >
        ☁️
      </div>
      <div
        className="absolute bottom-2/3 right-2/3 text-4xl opacity-35 animate-kawaii-bounce"
        style={{ animationDelay: "3.5s" }}
      >
        🦄
      </div>
    </div>
  )
}
