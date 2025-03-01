import React, { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { CalendarIcon, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import InvoicePreviewModal from './previewModal';
import ProductSelector from './ProductSelector';
import ItemsTable from './ItemsTable';
import ManualItemForm from './ManualItemForm';
import { backendUrl } from '../../App';
import axios from 'axios';

const InvoiceForm = ({ isEdit = false, initialData = null, onSubmit }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [focusCustomerName, setFocusCustomerName] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialData || {
    customerName: '',
    address: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    items: []
  });

  const nameCustomer = useDeferredValue(formData.customerName);

  const filteredCustomer = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/customer?name=${nameCustomer}`);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [nameCustomer]);

  useEffect(() => {
    if (nameCustomer) {
      const timer = setTimeout(() => {
        filteredCustomer();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setFilteredCustomers([]);
    }
  }, [nameCustomer, filteredCustomer]);

  const onClickCustomer = (customer) => {
    setFormData({ ...formData, customerName: customer.name, address: customer.address });
    setFilteredCustomers([]);
  }


  const calculateVAT = (amount) => {
    const beforeVAT = amount / 1.07;
    const VAT = amount - beforeVAT;
    return { beforeVAT, VAT };
  };

  const calculateTotals = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);
    const { beforeVAT, VAT } = calculateVAT(totalAmount);
    return {
      subtotal: beforeVAT,
      vat: VAT,
      total: totalAmount
    };
  };

  const onUpdateItem = (id, updatedItem) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? updatedItem : item
      )
    }));
  };

  const addItem = (item, imageFormData) => {
    setFormData(prev => {
      const existingItemIndex = prev.items.findIndex(
        existing => existing.id === item.id || existing.description === item.description
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prev.items];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
          total: (existingItem.quantity + item.quantity) * existingItem.unitPrice
        };
        return { ...prev, items: updatedItems };
      }

      if (imageFormData) {
        item.imageFormData = imageFormData;
      }

      return {
        ...prev,
        items: [...prev.items, {
          ...item,
          id: item.id || Date.now(),
          total: item.quantity * item.unitPrice
        }]
      };
    });
  };

  const updateItemQuantity = (id, newQuantity) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id
          ? {
            ...item,
            quantity: Math.max(1, newQuantity),
            total: Math.max(1, newQuantity) * item.unitPrice
          }
          : item
      )
    }));
  };

  const removeItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return 'กรุณาระบุชื่อลูกค้า';
    if (!formData.address.trim()) return 'กรุณาระบุที่อยู่';
    if (!formData.invoiceNumber.trim()) return 'กรุณาระบุเลขที่ใบกำกับภาษี';
    if (!formData.date) return 'กรุณาระบุวันที่';
    if (!isEdit && formData.items.length === 0) {
      return 'กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const totals = calculateTotals();

      const mainFormData = new FormData();

      mainFormData.append('customerName', formData.customerName);
      mainFormData.append('address', formData.address);
      mainFormData.append('invoiceNumber', formData.invoiceNumber);
      mainFormData.append('date', formData.date);

      const itemsWithoutFormData = formData.items.map((item, index) => {
        if (item.imageFormData) {
          const image = item.imageFormData.get('image');
          mainFormData.append(`images[${index}]`, image);
        }

        const { imageFormData, ...itemData } = item;
        return itemData;
      });

      mainFormData.append('items', JSON.stringify(itemsWithoutFormData));
      mainFormData.append('subtotal', totals.subtotal);
      mainFormData.append('vat', totals.vat);
      mainFormData.append('total', totals.total);

      if (onSubmit) {
        await onSubmit(mainFormData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg print:hidden">
          {error}
        </div>
      )}

      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-4 print:hidden">
        <div className='relative'>
          <label className="block mb-2">นามผู้ซื้อ</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            onFocus={() => setFocusCustomerName(true)}
          />
          {/* กล่องแสดงผลที่อยู่ด้านล่างสุด */}
          {filteredCustomers.length > 0 && focusCustomerName && (
            <div className='absolute left-0 w-full bg-white border border-gray-300 shadow-md z-10'>
              <div className="max-h-[20rem] h-max overflow-y-auto">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className='p-2 hover:bg-gray-100 cursor-pointer' onClick={() => onClickCustomer(customer)}>
                    {customer.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2">ที่อยู่</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">เลขที่</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData.invoiceNumber}
            onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2">วันที่</label>
          <div className="relative">
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
            <CalendarIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <div className="flex justify-between mb-4 print:hidden">
          <h2 className="text-xl font-semibold print:hidden">รายการสินค้า</h2>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setShowProductSelector(false)}
              className={`px-4 py-2 rounded ${!showProductSelector
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'}`}
            >
              เพิ่มรายการแบบ Manual
            </button>
            <button
              type="button"
              onClick={() => setShowProductSelector(true)}
              className={`px-4 py-2 rounded ${showProductSelector
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'}`}
            >
              เลือกจากฐานข้อมูล
            </button>
          </div>
        </div>

        {showProductSelector ? (
          <ProductSelector
            onSelect={(item) => {
              addItem(item);
              setShowProductSelector(false);
            }}
            onClose={() => setShowProductSelector(false)}
          />
        ) : (
          <ManualItemForm
            onAdd={addItem}
            onError={setError}
          />
        )}

        <ItemsTable
          items={formData.items}
          onRemove={removeItem}
          onUpdateQuantity={updateItemQuantity}
          onUpdateItem={onUpdateItem}  // Add this line
        />
      </div>

      {/* Totals Section */}
      <div className="flex justify-end print:hidden">
        <div className="w-64">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-right">มูลค่าสินค้า:</div>
            <div className="text-right">{totals.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
            <div className="text-right">ภาษีมูลค่าเพิ่ม 7%:</div>
            <div className="text-right">{totals.vat.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
            <div className="text-right font-bold">รวมทั้งสิ้น:</div>
            <div className="text-right font-bold">{totals.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 print:hidden">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          disabled={isSubmitting}
          className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          ดูตัวอย่าง
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังบันทึก...
            </>
          ) : (
            isEdit ? 'บันทึกการแก้ไข' : 'บันทึกใบกำกับภาษี'
          )}
        </button>
      </div>

      {/* Preview Modal */}
      <InvoicePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
        totals={totals}
      />
    </form>
  );
};

export default InvoiceForm;