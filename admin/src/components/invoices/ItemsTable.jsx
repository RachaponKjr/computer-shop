import React from 'react';
import { X } from 'lucide-react';

const ItemsTable = ({ items, onRemove, onUpdateQuantity, onUpdateItem }) => {
  const formatNumber = (num) => {
    return num.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handlePriceChange = (item, newPrice) => {
    if (newPrice < 0) return;
    
    const updatedItem = {
      ...item,
      unitPrice: newPrice,
      total: newPrice * item.quantity
    };
    
    onUpdateItem(item.id, updatedItem);
  };

  const renderImage = (item) => {
    if (item.imageFile instanceof File) {
      return (
        <img
          src={URL.createObjectURL(item.imageFile)}
          alt={item.description}
          className="h-16 w-16 object-cover rounded"
        />
      );
    }

    if (item.imageFormData) {
      const imageFile = item.imageFormData.get('image');
      if (imageFile instanceof File) {
        return (
          <img
            src={URL.createObjectURL(imageFile)}
            alt={item.description}
            className="h-16 w-16 object-cover rounded"
          />
        );
      }
    }
    
    if (typeof item.image === 'string' && item.image.trim() !== '') {
      return (
        <img
          src={item.image}
          alt={item.description}
          className="h-16 w-16 object-cover rounded"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+';
          }}
        />
      );
    }

    return (
      <div className="h-16 w-16 flex items-center justify-center bg-gray-50 text-gray-400 text-xs rounded">
        ไม่มีภาพ
      </div>
    );
  };

  return (
    <table className="w-full mb-6 print:hidden">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-2 text-left">รายการ</th>
          <th className="p-2 text-left">ภาพสินค้า</th>
          <th className="p-2 text-right">จำนวน</th>
          <th className="p-2 text-right">ราคา/หน่วย (รวม VAT)</th>
          <th className="p-2 text-right">ราคา/หน่วย (ไม่รวม VAT)</th>
          <th className="p-2 text-right">รวม</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const beforeVAT = (item.unitPrice / 1.07);

          return (
            <tr key={item.id || index} className="border-b">
              <td className="py-2">
                <div>
                  <div className="font-medium">{item.description}</div>
                  {item.specifications && (
                    <div className="text-sm text-gray-600 whitespace-pre-line mt-1">
                      {item.specifications}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-2">
                {renderImage(item)}
              </td>
              <td className="p-2 text-right">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                  className="w-20 text-right border rounded p-1"
                />
              </td>
              <td className="p-2 text-right">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handlePriceChange(item, parseFloat(e.target.value))}
                  className="w-32 text-right border rounded p-1"
                />
              </td>
              <td className="p-2 text-right">{formatNumber(beforeVAT)}</td>
              <td className="p-2 text-right">{formatNumber(item.total)}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={20} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ItemsTable;