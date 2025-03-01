import React from 'react';
import { X } from 'lucide-react';

const RepairItemsTable = ({ items, onRemove, onUpdateQuantity, onUpdateItem }) => {
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

  // Mobile card view for each item
  const MobileItemCard = ({ item, index }) => {
    const beforeVAT = (item.unitPrice / 1.07);
    
    return (
      <div className="bg-white p-4 rounded shadow-sm border mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="font-medium">{item.description}</div>
            {item.specifications && (
              <div className="text-sm text-gray-600 whitespace-pre-line mt-1">
                {item.specifications}
              </div>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-800 ml-2"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">จำนวน:</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
              className="w-24 text-right border rounded p-1"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ราคา/หน่วย (รวม VAT):</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.unitPrice}
              onChange={(e) => handlePriceChange(item, parseFloat(e.target.value))}
              className="w-24 text-right border rounded p-1"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ราคา/หน่วย (ไม่รวม VAT):</span>
            <span>{formatNumber(beforeVAT)}</span>
          </div>
          
          <div className="flex justify-between items-center font-medium">
            <span>รวม:</span>
            <span>{formatNumber(item.total)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto print:block">
        <table className="w-full mb-6">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">รายการ</th>
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {items.map((item, index) => (
          <MobileItemCard key={item.id || index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RepairItemsTable;