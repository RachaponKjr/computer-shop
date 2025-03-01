import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import {
  InvoiceTitle,
  InvoiceHeader,
  InvoiceDetails,
  InvoiceTable,
  InvoiceSummary,
  InvoiceSignatures,
} from '../../components/invoices/InvoiceContent';

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/invoice/${id}`);
      if (response.data.success) {
        setInvoice(response.data.invoice);
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
        <Link to="/invoices" className="text-blue-600 hover:text-blue-800">
          กลับไปหน้ารายการใบกำกับภาษี
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b shadow-sm p-4 print:hidden">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/invoices"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              กลับไปหน้ารายการ
            </Link>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download size={20} />
              ดาวน์โหลด PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Printer size={20} />
              พิมพ์
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto my-8 bg-white shadow-lg print:shadow-none print:my-0">
        <div className="p-8 print:p-6">
          <InvoiceTitle />
          <InvoiceHeader />
          <InvoiceDetails
            customerName={invoice.customerName}
            address={invoice.address}
            invoiceNumber={invoice.invoiceNumber}
            date={invoice.date}
          />
          <InvoiceTable items={invoice.items} />
          <InvoiceSummary
            subtotal={invoice.subtotal}
            vat={invoice.vat}
            total={invoice.total}
          />
          <InvoiceSignatures />
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;