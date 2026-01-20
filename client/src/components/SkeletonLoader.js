import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-[400px] flex flex-col ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8 mx-auto"></div>
        <div className="flex-1 bg-gray-100 rounded-xl w-full"></div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
