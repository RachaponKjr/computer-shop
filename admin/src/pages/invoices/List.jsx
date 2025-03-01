import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import InvoicePreviewModal from '../../components/invoices/previewModal';
import InvoiceHeader from '../../components/invoices/InvoiceHeader';
import InvoiceFilter from '../../components/invoices/InvoiceFilter';
import InvoiceTable from '../../components/invoices/InvoiceTable';
import InvoicePagination from '../../components/invoices/InvoicePagination';

const InvoiceList = ({token}) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/invoice/list?page=${page}&limit=${itemsPerPage}`);
      
      if (response.data.success) {
        setInvoices(response.data.invoices);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/invoice/delete/${id}`, {headers:{token}});
      if (response.data.success) {
        toast.success('ลบใบส่งของเรียบร้อยแล้ว');
        // Use currentPage state directly instead of pagination object
        fetchInvoices(currentPage);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('ไม่สามารถลบใบส่งของได้');
    }
    setIsDeleteOpen(false);
    setInvoiceToDelete(null);
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/invoice/${id}`);
      if (response.data.success) {
        // Calculate totals
        const items = response.data.invoice.items;
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const vat = subtotal * 0.07;
        const total = subtotal + vat;

        setSelectedInvoice({
          ...response.data.invoice,
          totals: { subtotal, vat, total }
        });
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('ไม่สามารถดาวน์โหลดใบกำกับภาษีได้');
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange]);

  // Filter invoices based on search term and date range
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const invoiceDate = new Date(invoice.date);
    const matchesDateRange = 
      (!dateRange.start || invoiceDate >= new Date(dateRange.start)) &&
      (!dateRange.end || invoiceDate <= new Date(dateRange.end));

    return matchesSearch && matchesDateRange;
  });

  // Pagination calculations
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">กำลังโหลดใบส่งของ...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto print:hidden">
      <InvoiceHeader 
        totalItems={totalItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {showFilters && (
        <InvoiceFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">กำลังโหลดใบส่งของ...</div>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {searchTerm || dateRange.start || dateRange.end 
              ? 'ไม่พบรายการที่ค้นหา' 
              : 'ไม่พบรายการใบส่งของ'}
          </p>
        </div>
      ) : (
        <>
          <InvoiceTable
            invoices={currentInvoices}
            onDownload={handleDownload}
            onNavigate={(path) => navigate(`/invoices/${path}`)}
            onDelete={handleDelete}
          />
          
          {totalPages > 1 && (
            <InvoicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
            />
          )}
        </>
      )}

      {selectedInvoice && (
        <InvoicePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedInvoice(null);
          }}
          formData={selectedInvoice}
          totals={selectedInvoice.totals}
        />
      )}
    </div>
  );
};

export default InvoiceList;