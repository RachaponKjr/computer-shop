import React, { useState, useRef } from 'react';

const ManualItemForm = ({ onAdd, onError }) => {
  const [item, setItem] = useState({
    description: '',
    specifications: '',
    quantity: 1,
    unitPrice: 0,
    imageFile: null,
    imageUrl: ''
  });

  const fileInputRef = useRef(null);

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

    const formData = new FormData();
    if (item.imageFile) {
      formData.append('image', item.imageFile);
    }

    const itemToAdd = {
      description: item.description,
      specifications: item.specifications,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      image: item.imageFile || item.imageUrl || null // ส่ง File object หรือ URL
    };

    onAdd(itemToAdd, formData);

    setItem({ 
      description: '',
      specifications: '',
      quantity: 1, 
      unitPrice: 0, 
      imageFile: null, 
      imageUrl: '' 
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onError(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 print:hidden">
      <div>
        <label className="block mb-1">รายการสินค้า</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={item.description}
          onChange={(e) => {
            setItem({ ...item, description: e.target.value });
            onError(null);
          }}
        />
      </div>

      <div className="lg:col-span-2">
        <label className="block mb-1">รายละเอียดสเปค</label>
        <textarea
          className="w-full border rounded p-2"
          value={item.specifications}
          onChange={(e) => {
            setItem({ ...item, specifications: e.target.value });
            onError(null);
          }}
          rows={3}
          placeholder="กรอกรายละเอียดสเปคสินค้า..."
        />
      </div>

      <div>
        <label className="block mb-1">จำนวน</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={item.quantity}
          onChange={(e) => {
            setItem({ ...item, quantity: parseInt(e.target.value) || 1 });
            onError(null);
          }}
          min="1"
        />
      </div>

      <div>
        <label className="block mb-1">ราคาต่อหน่วย (รวม VAT)</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={item.unitPrice}
          onChange={(e) => {
            setItem({ ...item, unitPrice: parseFloat(e.target.value) || 0 });
            onError(null);
          }}
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block mb-1">เพิ่มภาพสินค้า</label>
        <input
          type="file"
          ref={fileInputRef}
          className="w-full border rounded p-2"
          onChange={(e) => {
            setItem({ ...item, imageFile: e.target.files[0], imageUrl: '' });
            onError(null);
          }}
          accept="image/*"
        />
      </div>

      <div>
        <label className="block mb-1">หรือ URL รูปภาพ</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={item.imageUrl}
          onChange={(e) => {
            setItem({ ...item, imageUrl: e.target.value, imageFile: null });
            onError(null);
          }}
          placeholder="https://"
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