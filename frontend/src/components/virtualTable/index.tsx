import React, { useEffect, useMemo } from 'react';
import { Order, SortConfig } from '../../types/order';
import { TableRow } from './TableRow';
import { TableHeader } from './TableHeader';
import { SkeletonRow } from './SkeletonRow';
// import { TableContainer } from './TableContainer';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { useTableSort } from '../../hooks/useTableSort';

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
const SKELETON_COUNT = 2;

export const VirtualTable = React.memo(function VirtualTable({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  sort,
  onSort,
}: VirtualTableProps) {
  // Calculate total items including skeleton rows
  const totalItems = data.length + (isFetchingNextPage && hasNextPage ? SKELETON_COUNT : 0);

  // Setup virtual scrolling
  const {
    parentRef,
    virtualizer,
    // isScrolling,
    handleScroll,
  } = useVirtualScroll({
    itemHeight: ROW_HEIGHT,
    totalItems,
    onLoadMore,
    hasNextPage,
    isFetchingNextPage,
  });

  // Setup sorting
  const { isPending, handleSort } = useTableSort({
    sort,
    onSort,
    isFetchingNextPage,
  });

  // Memo column configuration
  const columns = useMemo(() => [
    { key: 'customerName' as const, label: 'Customer Name', sortable: true },
    { key: 'orderAmount' as const, label: 'Amount', sortable: true },
    { key: 'status' as const, label: 'Status', sortable: true },
    { key: 'createdAt' as const, label: 'Date', sortable: true },
  ], []);

  // Add scroll event listener
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (isLoading && !data.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
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
          transform: 'translateZ(0)',
          opacity: isPending ? 0.7 : 1,
          transition: 'opacity 0.15s ease-in-out',
        }}
      >
        <div
          style={{
            height: `${totalItems * ROW_HEIGHT}px`,
            width: '100%',
            position: 'relative',
            willChange: 'transform',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
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
      </div>
    </div>
  );
});
