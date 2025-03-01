import React from 'react';

const RepairInvoiceFilter = ({
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">จากวันที่</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ถึงวันที่</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepairInvoiceFilter;