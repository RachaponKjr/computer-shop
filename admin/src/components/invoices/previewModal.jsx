import React from 'react';
import { X, Printer } from 'lucide-react';
import {
  InvoiceTitle,
  InvoiceHeader,
  InvoiceDetails,
  InvoiceTable,
  InvoiceSummary,
  InvoiceSignatures,
} from './InvoiceContent';

const InvoicePreviewModal = ({ isOpen, onClose, formData, totals }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `invoice-${formData.invoiceNumber}.pdf`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:static print:bg-white print:bg-opacity-10">
      <div className="bg-white w-full max-w-[210mm] max-h-[90vh] overflow-y-auto rounded-lg 
                      print:max-h-none print:overflow-visible print:shadow-none 
                      print:m-0 print:p-0 print:w-[210mm] print:h-[297mm]">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center print:hidden">
          <h2 className="text-xl font-bold">ตัวอย่างใบกำกับภาษี</h2>
          <div className="flex gap-4">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Printer size={20} />
              พิมพ์ PDF
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 print:p-6">
          <InvoiceTitle />
          <InvoiceHeader />
          <InvoiceDetails
            customerName={formData.customerName}
            address={formData.address}
            invoiceNumber={formData.invoiceNumber}
            date={formData.date}
          />
          <InvoiceTable items={formData.items} />
          <InvoiceSummary
            subtotal={totals.subtotal}
            vat={totals.vat}
            total={totals.total}
          />
          <InvoiceSignatures />
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;