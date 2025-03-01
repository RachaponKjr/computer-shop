import React from 'react';
import { X, Printer } from 'lucide-react';
import {
  RepairInvoiceTitle,
  RepairInvoiceHeader,
  RepairInvoiceDetails,
  RepairInvoiceTable,
  RepairInvoiceSummary,
  RepairInvoiceSignatures,
} from './RepairInvoiceContent';

const RepairInvoicePreviewModal = ({ isOpen, onClose, formData, totals }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `invoice-${formData.invoiceNumber}.pdf`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 
                    sm:p-6 md:p-8 
                    print:static print:bg-white print:bg-opacity-10 print:p-0">
      <div className="bg-white w-full max-w-[210mm] h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)]
                    overflow-y-auto rounded-lg shadow-xl 
                    print:max-h-none print:overflow-visible print:shadow-none 
                    print:m-0 print:p-0 print:w-[210mm] print:h-[297mm]">
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 sm:px-6 sm:py-4 
                      flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 
                      print:hidden">
          <h2 className="text-lg sm:text-xl font-bold">ตัวอย่างใบกำกับภาษี</h2>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 
                       bg-blue-600 text-white rounded hover:bg-blue-700 
                       text-sm sm:text-base flex-1 sm:flex-none"
            >
              <Printer size={18} className="hidden sm:block" />
              <Printer size={16} className="sm:hidden" />
              พิมพ์ PDF
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1.5"
              aria-label="ปิด"
            >
              <X size={20} className="sm:size-24" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-8 print:p-6 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <RepairInvoiceTitle />
            <RepairInvoiceHeader />
          </div>

          <RepairInvoiceDetails
            title={formData.title}
            invoiceNumber={formData.invoiceNumber}
            date={formData.date}
          />

          <div className="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 print:mx-0">
            <div className="min-w-[640px] px-4 sm:px-6 md:px-8 print:px-0">
              <RepairInvoiceTable items={formData.items} />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <RepairInvoiceSummary
              subtotal={totals.subtotal}
              vat={totals.vat}
              total={totals.total}
            />
            <RepairInvoiceSignatures />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairInvoicePreviewModal;