import React, { memo } from 'react';

// Performance optimized component wrapper
export const OptimizedComponent = memo(({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
});

OptimizedComponent.displayName = 'OptimizedComponent';

// Loading state component with skeleton
export const LoadingState: React.FC<{ type?: 'card' | 'list' | 'table' }> = memo(({ type = 'card' }) => {
  const skeletonClass = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";
  
  switch (type) {
    case 'card':
      return (
        <div className="space-y-4 p-4">
          <div className={`h-4 ${skeletonClass} w-3/4`}></div>
          <div className={`h-4 ${skeletonClass} w-1/2`}></div>
          <div className={`h-20 ${skeletonClass} w-full`}></div>
        </div>
      );
    
    case 'list':
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-4 ${skeletonClass} w-full`}></div>
          ))}
        </div>
      );
    
    case 'table':
      return (
        <div className="space-y-2">
          <div className={`h-8 ${skeletonClass} w-full`}></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className={`h-4 ${skeletonClass} w-1/4`}></div>
              <div className={`h-4 ${skeletonClass} w-1/4`}></div>
              <div className={`h-4 ${skeletonClass} w-1/4`}></div>
              <div className={`h-4 ${skeletonClass} w-1/4`}></div>
            </div>
          ))}
        </div>
      );
    
    default:
      return <div className={`h-4 ${skeletonClass} w-full`}></div>;
  }
});

LoadingState.displayName = 'LoadingState';

// Image lazy loading component
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}> = memo(({ src, alt, className, fallback = '/placeholder-image.png' }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={`relative ${className || ''}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
      )}
      <img
        src={hasError ? fallback : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Debounced search hook
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling helper for large lists
export const VirtualList: React.FC<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}> = memo(({ items, itemHeight, containerHeight, renderItem }) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';