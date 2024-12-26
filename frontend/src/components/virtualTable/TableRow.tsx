import React from 'react';
import { Order } from '../../types/order';

interface TableRowProps {
  item: Order;
  height: number;
  top: number;
}

export const TableRow: React.FC<TableRowProps> = React.memo(({ item, height, top }) => {
  const formattedDate = new Date(item.createdAt).toLocaleDateString();
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(item.orderAmount);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="absolute w-full border-b border-gray-100 hover:bg-gray-50 transition-colors"
      style={{
        height: `${height}px`,
        transform: `translateY(${top}px)`,
      }}
    >
      <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
        <div className="truncate">{item.customerName}</div>
        <div>{formattedAmount}</div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
        <div>{formattedDate}</div>
      </div>
    </div>
  );
});