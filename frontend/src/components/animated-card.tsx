import React from 'react';
import { cn } from '../lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'glow' | 'bounce' | 'wiggle' | 'none';
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hoverEffect = 'none',
  delay = 0,
}) => {
  const hoverClasses = {
    glow: 'card-hover-glow',
    bounce: 'card-hover-bounce',
    wiggle: 'card-hover-wiggle',
    none: '',
  };

  const delayClass = delay > 0 ? `animate-delay-${delay}` : '';

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg shadow-md transition-all duration-300',
        hoverClasses[hoverEffect],
        delayClass,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};