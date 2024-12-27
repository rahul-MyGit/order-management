import { useCallback } from 'react';
import { Order, SortConfig } from '../types/order';

export const useTableSort = ({
  sort,
  onSort,
  isFetchingNextPage,
}: {
  sort: SortConfig;
  onSort: (newSort: SortConfig) => void;
  isFetchingNextPage: boolean;
}) => {
  const handleSort = useCallback((field: keyof Order) => {
    if (isFetchingNextPage) return;
    onSort({
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    });
  }, [sort, onSort, isFetchingNextPage]);

  return { handleSort };
}; 