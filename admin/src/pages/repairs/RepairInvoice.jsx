import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import { RepairInvoiceTitle, RepairInvoiceHeader, RepairInvoiceDetails, RepairInvoiceTable, RepairInvoiceSummary, RepairInvoiceSignatures } from '../../components/repairs/repairInvoiceContent';

const RepairInvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + `/api/repair/${id}`);
      if (response.data.success) {
        setInvoice(response.data.repairInvoice);
      } else {
        toast.error('Failed to fetch invoice details');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const originalTitle = document.title;
    document.title = `invoice-${invoice.invoiceNumber}.pdf`;
    window.print();
    document.title = originalTitle;
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 mb-4">ไม่พบข้อมูลใบกำกับภาษี</div>
        <Link to="/repairs" className="text-blue-600 hover:text-blue-800">
          กลับไปหน้ารายการใบกำกับภาษี
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Responsive Header Bar */}
      <div className="bg-white border-b shadow-sm p-4 print:hidden">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              to="/repairs"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span className="text-sm sm:text-base">กลับไปหน้ารายการ</span>
            </Link>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base"
              >
                <Download size={18} />
                <span>ดาวน์โหลด PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
              >
                <Printer size={18} />
                <span>พิมพ์</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Invoice Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto my-4 sm:my-6 lg:my-8 bg-white shadow-lg print:shadow-none print:my-0">
          <div className="p-4 sm:p-6 lg:p-8 print:p-6 overflow-x-auto">
            <RepairInvoiceTitle />
            <RepairInvoiceHeader />
            <RepairInvoiceDetails
              title={invoice.title}
              invoiceNumber={invoice.invoiceNumber}
              date={invoice.date}
            />
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <RepairInvoiceTable items={invoice.items} />
              </div>
            </div>
            <RepairInvoiceSummary
              subtotal={invoice.subtotal}
              vat={invoice.vat}
              total={invoice.total}
            />
            <RepairInvoiceSignatures />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairInvoiceView;