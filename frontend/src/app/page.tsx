'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, InfiniteData } from '@tanstack/react-query';
import { VirtualTable } from '../components/virtualTable';
import { useOrders } from '../hooks/useOrders';
import { Order, OrdersResponse, SortConfig } from '../types/order';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

function OrdersPage() {
  const [sort, setSort] = useState<SortConfig>({
    field: 'createdAt',
    direction: 'desc',
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useOrders({ sort });

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error loading orders. Please try again later.</div>
      </div>
    );
  }

  const infiniteData = data as InfiniteData<OrdersResponse> | undefined;
  const orders = infiniteData?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <VirtualTable
        data={orders}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        onLoadMore={fetchNextPage}
        sort={sort}
        onSort={setSort}
      />
    </div>
  );
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrdersPage />
    </QueryClientProvider>
  );
}
