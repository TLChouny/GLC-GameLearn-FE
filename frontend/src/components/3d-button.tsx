import type React from "react"
import { cn } from "../lib/utils"

interface Button3DProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  icon?: string
  className?: string
  onClick?: () => void
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  onClick,
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-0"

  const variantClasses = {
    primary: "bg-gradient-to-br from-pink-300 to-purple-400 text-white hover:from-pink-400 hover:to-purple-500",
    secondary: "bg-gradient-to-br from-blue-300 to-mint-400 text-white hover:from-blue-400 hover:to-mint-500",
    success: "bg-gradient-to-br from-mint-300 to-yellow-400 text-white hover:from-mint-400 hover:to-yellow-500",
    warning: "bg-gradient-to-br from-yellow-300 to-pink-400 text-white hover:from-yellow-400 hover:to-pink-500",
    danger: "bg-gradient-to-br from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "hover:translate-y-[-2px] active:translate-y-[1px]",
        className,
      )}
    >
      {icon && <span className="mr-2 animate-kawaii-bounce">{icon}</span>}
      {children}
    </button>
  )
}
