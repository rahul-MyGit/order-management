import { SortConfig, Order } from "@/types/order";

export function sortOrders(orders: Order[], sort: SortConfig): Order[] {
    return [...orders].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      const multiplier = sort.direction === 'asc' ? 1 : -1;
      
      if (sort.field === 'createdAt') {
        return multiplier * (new Date(String(aValue)).getTime() - new Date(String(bValue)).getTime());
      }
      if (sort.field === 'orderAmount') {
        return multiplier * (Number(aValue) - Number(bValue));
      }
      return multiplier * String(aValue).localeCompare(String(bValue));
    });
  }