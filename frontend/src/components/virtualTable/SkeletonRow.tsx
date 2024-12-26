import React from 'react';

interface SkeletonRowProps {
  height: number;
  top: number;
}

export const SkeletonRow: React.FC<SkeletonRowProps> = React.memo(({ height, top }) => {
  return (
    <div
      className="absolute w-full border-b border-gray-100"
      style={{
        height: `${height}px`,
        transform: `translateY(${top}px)`,
      }}
    >
      <div className="grid grid-cols-4 gap-4 px-4 py-3">
        <div className="animate-pulse bg-gray-200 rounded h-5 w-3/4" />
        <div className="animate-pulse bg-gray-200 rounded h-5 w-1/2" />
        <div className="animate-pulse bg-gray-200 rounded h-5 w-24" />
        <div className="animate-pulse bg-gray-200 rounded h-5 w-32" />
      </div>
    </div>
  );
}); 