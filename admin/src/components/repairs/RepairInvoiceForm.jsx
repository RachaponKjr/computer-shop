import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import InvoicePreviewModal from './RepairInvoicePreviewModal';
import ItemsTable from './RepairItemsTable';
import ManualItemForm from './ManualItemForm';

const RepairInvoiceForm = ({ isEdit = false, initialData = null, onSubmit }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    items: []
  });

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

  const addItem = (item) => {
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
    if (!formData.title.trim()) return 'กรุณาระบุหัวเรื่อง';
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
      const itemsWithoutFormData = formData.items.map(({ id, description, specifications, quantity, unitPrice, total }) => ({
        id, description, specifications, quantity, unitPrice, total
      }));

      const submissionData = {
        title: formData.title,
        invoiceNumber: formData.invoiceNumber,
        date: formData.date,
        items: itemsWithoutFormData,
        category: formData.category,
        subtotal: totals.subtotal,
        vat: totals.vat,
        total: totals.total
      };

      if (onSubmit) {
        await onSubmit(submissionData);
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Error Alert */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm sm:text-base print:hidden">
          {error}
        </div>
      )}

      {/* Form Header Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 print:hidden">
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-sm font-medium text-gray-700">เรื่อง</label>
          <input
            type="text"
            className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-sm font-medium text-gray-700">เลขที่</label>
          <input
            type="text"
            className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={formData.invoiceNumber}
            onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 sm:space-y-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">วันที่</label>
          <div className="relative">
            <input
              type="date"
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
            <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </div>
        </div>
        <div className="space-y-1.5 sm:space-y-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
          <select
            className="w-full border p-2 h-11 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">เลือกหมวดหมู่</option>
            <option value="อุปกรณ์คอมพิวเตอร์">อุปกรณ์คอมพิวเตอร์</option>
            <option value="อุปกรณ์คอมพิวเตอร์">อื่นๆ</option>
          </select>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 print:hidden">
          <h2 className="text-lg sm:text-xl font-semibold print:hidden mb-2 sm:mb-0">
            รายการซ่อมอุปกรณ์
          </h2>
        </div>

        {/* Manual Item Form */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <ManualItemForm
            onAdd={addItem}
            onError={setError}
          />
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm -mx-2 sm:mx-0">
          <div className="min-w-[640px] sm:min-w-full">
            <ItemsTable
              items={formData.items}
              onRemove={removeItem}
              onUpdateQuantity={updateItemQuantity}
              onUpdateItem={onUpdateItem}
            />
          </div>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex flex-col sm:flex-row justify-end print:hidden">
        <div className="w-full sm:w-72 md:w-80 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
            <div className="text-right text-gray-600">มูลค่าสินค้า:</div>
            <div className="text-right font-medium">{totals.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
            <div className="text-right text-gray-600">ภาษีมูลค่าเพิ่ม 7%:</div>
            <div className="text-right font-medium">{totals.vat.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
            <div className="text-right font-semibold">รวมทั้งสิ้น:</div>
            <div className="text-right font-semibold">{totals.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 print:hidden mt-4 sm:mt-6">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          disabled={isSubmitting}
          className="w-full sm:flex-1 py-2.5 px-4 bg-gray-600 text-white text-sm sm:text-base rounded shadow-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          ดูตัวอย่าง
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:flex-1 py-2.5 px-4 bg-blue-600 text-white text-sm sm:text-base rounded shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm sm:text-base">กำลังบันทึก...</span>
            </>
          ) : (
            <span className="text-sm sm:text-base">
              {isEdit ? 'บันทึกการแก้ไข' : 'บันทึกใบเสนอราคา'}
            </span>
          )}
        </button>
      </div>

      <InvoicePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
        totals={totals}
      />
    </form>
  );
};

export default RepairInvoiceForm;