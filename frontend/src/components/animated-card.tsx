import type React from "react"
import { cn } from "../lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className, delay = 0 }) => {
  return (
    <div
      className={cn(
        "transform transition-all duration-700 ease-out",
        "hover:scale-[1.02] hover:shadow-2xl",
        "animate-fade-in-up",
        className,
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
