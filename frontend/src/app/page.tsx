import { Suspense } from 'react';
import OrdersWrapper from '../components/orders/OrdersWrapper';
import { OrdersLoading } from '../components/orders/OrdersLoading';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <Suspense fallback={<OrdersLoading />}>
        <OrdersWrapper />
      </Suspense>
    </div>
  );
}
