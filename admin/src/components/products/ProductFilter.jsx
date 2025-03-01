import React from 'react';

const ProductFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  stockStatus,
  setStockStatus
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            <option value="">ทั้งหมด</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">ช่วงราคา</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="ต่ำสุด"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
            <input
              type="number"
              placeholder="สูงสุด"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">สถานะสินค้า</label>
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            <option value="all">ทั้งหมด</option>
            <option value="inStock">มีสินค้า</option>
            <option value="outOfStock">สินค้าหมด</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedCategory('');
              setPriceRange({ min: '', max: '' });
              setStockStatus('all');
            }}
            className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;