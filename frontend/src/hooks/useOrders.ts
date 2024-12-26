import { useInfiniteQuery, UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';
import { Order, OrdersResponse, SortConfig } from '../types/order';

interface UseOrdersOptions {
  limit?: number;
  sort?: SortConfig;
}

const BASE_URL = "http://localhost:4000/api/v1";
const BATCH_SIZE = 50; // Batch size for pagination

type OrdersQueryKey = ['orders', number, SortConfig];

export function useOrders({
  limit = BATCH_SIZE,
  sort = { field: 'createdAt', direction: 'desc' }
}: UseOrdersOptions = {}): UseInfiniteQueryResult<OrdersResponse, Error> {
  return useInfiniteQuery<OrdersResponse, Error, OrdersResponse, OrdersQueryKey, string | null>({
    queryKey: ['orders', limit, sort],
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams({
        limit: String(limit),
        sort: sort.field,
        sortDirection: sort.direction,
      });
      
      if (pageParam) {
        searchParams.append('cursor', pageParam);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(`${BASE_URL}/orders?${searchParams.toString()}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        return response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnMount: true, // Refetch when component mounts
  });
}