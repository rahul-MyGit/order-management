import { Order } from "@/types/order";
import React from "react";

export const StatusBadge = React.memo(function StatusBadge({ 
    status 
  }: { 
    status: Order['status'] 
  }) {
    const config = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[status]}`}>
        {status}
      </span>
    );
  });