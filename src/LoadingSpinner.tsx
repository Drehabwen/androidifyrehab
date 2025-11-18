import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '正在处理...', 
  size = 'medium' 
}) => {
  // 根据size确定样式类
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };
  
  const textClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-emerald-500 mb-4`}></div>
      <p className={`text-emerald-700 ${textClasses[size]}`}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;