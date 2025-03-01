import React, { useState } from 'react';

const ManualItemForm = ({ onAdd, onError }) => {
  const [item, setItem] = useState({
    description: '',
    specifications: '',
    quantity: 1,
    unitPrice: 0,
  });

  const validateItem = () => {
    if (!item.description.trim()) {
      return 'กรุณาระบุรายการสินค้า';
    }
    if (item.quantity <= 0) {
      return 'จำนวนสินค้าต้องมากกว่า 0';
    }
    if (item.unitPrice <= 0) {
      return 'ราคาต่อหน่วยต้องมากกว่า 0';
    }
    return null;
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const error = validateItem();

    if (error) {
      onError(error);
      return;
    }

    const itemToAdd = {
      id: Date.now(),
      description: item.description,
      specifications: item.specifications,
      quantity: parseInt(item.quantity),
      unitPrice: parseFloat(item.unitPrice),
      total: parseInt(item.quantity) * parseFloat(item.unitPrice),
    };

    onAdd(itemToAdd);

    setItem({
      description: '',
      specifications: '',
      quantity: 1,
      unitPrice: 0,
    });
    
    onError(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:hidden">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            รายการซ่อมอุปกรณ์
          </label>
          <input
            id="description"
            type="text"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={item.description}
            onChange={(e) => {
              setItem({ ...item, description: e.target.value });
              onError(null);
            }}
          />
        </div>

       {/* Unit Price Field */}
       <div className="sm:col-span-1">
          <label className="block text-sm font-medium mb-1" htmlFor="unitPrice">
            ราคาต่อหน่วย (รวม VAT)
          </label>
          <input
            id="unitPrice"
            type="number"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={item.unitPrice}
            onChange={(e) => {
              setItem({ ...item, unitPrice: parseFloat(e.target.value) || 0 });
              onError(null);
            }}
            min="0"
            step="0.01"
          />
        </div>

        {/* Specifications Field - Full width across all screens */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1" htmlFor="specifications">
            รายละเอียดการซ่อม
          </label>
          <textarea
            id="specifications"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={item.specifications}
            onChange={(e) => {
              setItem({ ...item, specifications: e.target.value });
              onError(null);
            }}
            rows={3}
            placeholder="กรอกรายละเอียดการซ่อม..."
          />
        </div>

        {/* Quantity Field */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium mb-1" htmlFor="quantity">
            จำนวน
          </label>
          <input
            id="quantity"
            type="number"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={item.quantity}
            onChange={(e) => {
              setItem({ ...item, quantity: parseInt(e.target.value) || 1 });
              onError(null);
            }}
            min="1"
          />
        </div>

      <div className="flex items-end">
        <button
          onClick={handleAddItem}
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          เพิ่มสินค้า
        </button>
      </div>
    </div>
  );
};

export default ManualItemForm;