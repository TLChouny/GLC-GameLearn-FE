import React from 'react';
import type { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md border border-gray-200';
  const hoverClasses = hoverable ? 'hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick} {...props}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
