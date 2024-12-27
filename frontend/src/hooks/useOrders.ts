import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { OrdersResponse, SortConfig } from '../types/order';

interface UseOrdersOptions {
  limit?: number;
  sort?: SortConfig;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
const BATCH_SIZE = 50;

type OrdersQueryKey = ['orders', number, SortConfig];

const fetchOrders = async (
  limit: number,
  sort: SortConfig,
  cursor: string | null
): Promise<OrdersResponse> => {
  const searchParams = new URLSearchParams({
    limit: String(limit),
    sort: sort.field,
    sortDirection: sort.direction,
  });
  
  if (cursor) {
    searchParams.append('cursor', cursor);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://api-omara.isujith.dev/api/v1/orders?${searchParams.toString()}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

export function useOrders({
  limit = BATCH_SIZE,
  sort = { field: 'createdAt', direction: 'desc' }
}: UseOrdersOptions = {}): UseInfiniteQueryResult<OrdersResponse, Error> {
  return useInfiniteQuery<OrdersResponse, Error, OrdersResponse, OrdersQueryKey, string | null>({
    queryKey: ['orders', limit, sort],
    queryFn: ({ pageParam }) => fetchOrders(limit, sort, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}