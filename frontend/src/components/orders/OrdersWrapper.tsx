'use client';

import React, { useState, useMemo } from 'react';
import { QueryClientProvider, InfiniteData } from '@tanstack/react-query';
import { VirtualTable } from '../virtualTable/index';
import { useOrders } from '../../hooks/useOrders';
import { sortOrders } from '../../utils/sorting';
import { OrdersResponse, SortConfig } from '../../types/order';
import { queryClient } from '../../lib/queryClient';

function OrdersContent() {
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
  } = useOrders();

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error loading orders. Please try again later.</div>
      </div>
    );
  }

  const infiniteData = data as InfiniteData<OrdersResponse> | undefined;
  const unsortedOrders = infiniteData?.pages.flatMap(page => page.data) ?? [];
  
  const sortedOrders = useMemo(() => 
    sortOrders(unsortedOrders, sort),
    [unsortedOrders, sort]
  );

  return (
    <VirtualTable
      data={sortedOrders}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      onLoadMore={fetchNextPage}
      sort={sort}
      onSort={setSort}
    />
  );
}

export default function OrdersWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrdersContent />
    </QueryClientProvider>
  );
} 