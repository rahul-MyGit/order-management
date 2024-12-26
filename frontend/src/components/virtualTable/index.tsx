import React, { useCallback, useMemo, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Order, SortConfig } from '../../types/order';
import { TableRow } from './TableRow';
import { TableHeader } from './TableHeader';
import { SkeletonRow } from './SkeletonRow';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { ErrorBoundary } from 'react-error-boundary';

interface Column {
  key: keyof Order;
  label: string;
  sortable: boolean;
}

interface VirtualTableProps {
  data: Order[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  sort: SortConfig;
  onSort: (newSort: SortConfig) => void;
}

const ROW_HEIGHT = 48;
const OVERSCAN = 20; // Increased for smoother scrolling
const SCROLL_DELAY = 10; // Reduced delay for faster response
const PRELOAD_MARGIN = '800px'; // Increased preload margin further
const SCROLL_THRESHOLD = 0.8; // Load more when 80% scrolled
const SKELETON_COUNT = 2; // Number of skeleton rows to show

export const VirtualTable = React.memo(function VirtualTable({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  sort,
  onSort,
}: VirtualTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const prevDataLength = useRef(data.length);
  const [isScrolling, setIsScrolling] = useState(false);

  // Calculate total items including skeleton rows
  const totalItems = data.length + (isFetchingNextPage && hasNextPage ? SKELETON_COUNT : 0);

  // Memoize column configuration
  const columns = useMemo<Column[]>(() => [
    { key: 'customerName', label: 'Customer Name', sortable: true },
    { key: 'orderAmount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Date', sortable: true },
  ], []);

  // Virtual row calculation with optimized config
  const virtualizer = useVirtualizer({
    count: totalItems,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    overscan: OVERSCAN,
    initialRect: { width: 0, height: ROW_HEIGHT },
  });

  // Reset scroll position when sorting
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
      virtualizer.scrollToIndex(0);
    }
  }, [sort, virtualizer]);

  // Handle scroll events for loading more data
  const handleScroll = useCallback(() => {
    if (!parentRef.current || !hasNextPage || isFetchingNextPage) return;

    setIsScrolling(true);
    if (scrollTimeout) clearTimeout(scrollTimeout);

    const timeout = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
    setScrollTimeout(timeout);

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > SCROLL_THRESHOLD) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore, scrollTimeout]);

  // Add scroll event listener
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Optimized intersection observer with early loading
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: useCallback(() => {
      if (!isFetchingNextPage && hasNextPage && !isScrolling) {
        onLoadMore();
      }
    }, [onLoadMore, isFetchingNextPage, hasNextPage, isScrolling]),
    enabled: hasNextPage && !isFetchingNextPage && !isScrolling,
    rootMargin: PRELOAD_MARGIN,
    threshold: 0.1,
  });

  // Cleanup scroll timeout
  useEffect(() => {
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  // Memoized sort handler with debounce
  const handleSort = useCallback((field: keyof Order) => {
    if (isFetchingNextPage) return; // Prevent sorting while loading more data
    
    requestAnimationFrame(() => {
      onSort({
        field,
        direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
      });
    });
  }, [sort, onSort, isFetchingNextPage]);

  // Calculate total height
  const totalHeight = totalItems * ROW_HEIGHT;

  // Memoized virtual items
  const virtualItems = virtualizer.getVirtualItems();

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
        <TableHeader 
          columns={columns}
          sort={sort}
          onSort={handleSort}
        />
        
        <div 
          ref={parentRef}
          className="overflow-auto will-change-transform"
          style={{ 
            height: 'calc(100vh - 200px)',
            WebkitOverflowScrolling: 'touch',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
        >
          <div
            style={{
              height: `${totalHeight}px`,
              width: '100%',
              position: 'relative',
              willChange: 'transform', // Optimize animations
            }}
          >
            {virtualItems.map((virtualRow) => {
              const isSkeletonRow = virtualRow.index >= data.length;
              
              if (isSkeletonRow) {
                return (
                  <SkeletonRow
                    key={`skeleton-${virtualRow.index}`}
                    height={ROW_HEIGHT}
                    top={virtualRow.start}
                  />
                );
              }

              return (
                <TableRow
                  key={data[virtualRow.index].id}
                  item={data[virtualRow.index]}
                  height={ROW_HEIGHT}
                  top={virtualRow.start}
                />
              );
            })}
          </div>
          
          <div ref={loadMoreRef} className="h-4">
            {isFetchingNextPage && !hasNextPage && (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});
