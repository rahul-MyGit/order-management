import React from 'react';
import { Order, SortConfig } from '../../types/order';

interface Column {
  key: keyof Order;
  label: string;
  sortable: boolean;
}

interface TableHeaderProps {
  columns: Column[];
  sort: SortConfig;
  onSort: (field: keyof Order) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = React.memo(({ columns, sort, onSort }) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-medium text-gray-700">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`flex items-center space-x-1 ${
              column.sortable ? 'cursor-pointer hover:text-gray-900' : ''
            }`}
            onClick={() => column.sortable && onSort(column.key)}
          >
            <span>{column.label}</span>
            {column.sortable && sort.field === column.key && (
              <span className="ml-1">
                {sort.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}); 