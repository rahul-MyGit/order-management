import { useCallback, useTransition } from 'react';
import { Order, SortConfig } from '../types/order';

interface UseTableSortOptions {
  sort: SortConfig;
  onSort: (newSort: SortConfig) => void;
  isFetchingNextPage: boolean;
}

export const useTableSort = ({
  sort,
  onSort,
  isFetchingNextPage,
}: UseTableSortOptions) => {
  const [isPending, startTransition] = useTransition();

  const handleSort = useCallback((field: keyof Order) => {
    if (isFetchingNextPage) return;
    
    startTransition(() => {
      onSort({
        field,
        direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
      });
    });
  }, [sort, onSort, isFetchingNextPage]);

  return {
    isPending,
    handleSort,
  };
}; 