export interface OrderItem {
    name: string
    quantity: number
    price: number
}

export interface Order {
    id: string;
    customerName: string;
    orderAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    items: OrderItem[];
    createdAt: string;
}

export interface OrdersResponse {
    data: Order[];
    nextCursor: string | null;
    totalCount: number;
}
  
export interface SortConfig {
    field: keyof Order;
    direction: 'asc' | 'desc';
}