import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import RepairInvoiceHeader from '../../components/repairs/RepairInvoiceHeader';
import RepairInvoiceFilter from '../../components/repairs/RepairInvoiceFilter';
import RepairInvoiceTable from '../../components/repairs/RepairInvoiceTable';
import RepairInvoicePagination from '../../components/repairs/RepairInvoicePagination';
import RepairInvoicePreviewModal from '../../components/repairs/RepairInvoicePreviewModal';

const RepairInvoiceList = ({ token }) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/repair/list`);

      if (response.data.success) {
        setInvoices(response.data.repairInvoices);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching repair invoices:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/repair/delete/${id}`, { headers: { token } });
      if (response.data.success) {
        toast.success('ลบใบส่งของเรียบร้อยแล้ว');
        fetchInvoices();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('ไม่สามารถลบใบส่งของได้');
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/repair/${id}`);
      if (response.data.success) {
        const items = response.data.repairInvoice.items;
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const vat = subtotal * 0.07;
        const total = subtotal + vat;

        setSelectedInvoice({
          ...response.data.repairInvoice,
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
    fetchInvoices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase());

    const invoiceDate = new Date(invoice.date);
    const matchesDateRange =
      (!dateRange.start || invoiceDate >= new Date(dateRange.start)) &&
      (!dateRange.end || invoiceDate <= new Date(dateRange.end));

    return matchesSearch && matchesDateRange;
  });

  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);


  useEffect(() => {
    if (categoryFilter) {
      setInvoices(invoices.filter(invoice => invoice.category === categoryFilter));
    } else {
      fetchInvoices();
    }
  }, [categoryFilter]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-base sm:text-lg text-gray-600">กำลังโหลดใบส่งของ...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 w-full max-w-7xl mx-auto print:hidden">
      <RepairInvoiceHeader
        totalItems={totalItems}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {showFilters && (
        <div className="p-2 sm:p-4">
          <RepairInvoiceFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-base sm:text-lg text-gray-600">กำลังโหลดใบส่งของ...</div>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4 bg-gray-50 rounded-lg">
          <p className="text-sm sm:text-base text-gray-600">
            {searchTerm || dateRange.start || dateRange.end
              ? 'ไม่พบรายการที่ค้นหา'
              : 'ไม่พบรายการใบส่งของ'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <RepairInvoiceTable
                invoices={currentInvoices}
                onDownload={handleDownload}
                onNavigate={(path) => navigate(`/repairs/${path}`)}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            {totalPages > 1 && (
              <RepairInvoicePagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
              />
            )}
          </div>
        </>
      )}

      {selectedInvoice && (
        <RepairInvoicePreviewModal
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

export default RepairInvoiceList;