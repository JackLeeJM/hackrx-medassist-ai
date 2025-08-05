import React from 'react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ className, size = 'default', ...props }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-gray-900',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

const LoadingScreen = ({ message = 'Loading...', className }) => {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-gray-50', className)}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

const LoadingCard = ({ message = 'Loading...', className }) => {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export { LoadingSpinner, LoadingScreen, LoadingCard };
