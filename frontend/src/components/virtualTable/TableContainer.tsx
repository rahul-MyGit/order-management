import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface TableContainerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isPending?: boolean;
  className?: string;
}

export const TableContainer = React.memo(function TableContainer({
  children,
  isLoading,
  isPending,
  className = '',
}: TableContainerProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="text-red-500 p-4">Something went wrong</div>}>
      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
        <div className={`${className} ${isPending ? 'opacity-70' : ''}`}>
          {children}
        </div>
      </div>
    </ErrorBoundary>
  );
}); 