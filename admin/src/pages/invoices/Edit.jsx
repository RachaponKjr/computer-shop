import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import CardComponents from '../../components/shared/Card';
import InvoiceForm from '../../components/invoices/InvoiceForm';

const InvoiceEdit = ({token}) => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { Card } = CardComponents;

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/invoice/${invoiceId}`);
        if (response.data.success) {
          const formattedInvoice = {
            ...response.data.invoice,
            date: response.data.invoice.date.split('T')[0],
            items: response.data.invoice.items.map(item => ({
              ...item,
              id: item._id || item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              total: item.quantity * item.unitPrice
            }))
          };
          setInvoice(formattedInvoice);
        } else {
          toast.error(response.data.message || 'ไม่พบข้อมูลใบกำกับภาษี');
          navigate('/invoices');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('ไม่สามารถดึงข้อมูลใบกำกับภาษีได้');
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.put(`${backendUrl}/api/invoice/update/${invoiceId}`, formData, {headers:{token}});
      
      if (response.data.success) {
        toast.success('แก้ไขใบกำกับภาษีเรียบร้อยแล้ว');
        navigate('/invoices');
      } else {
        toast.error(response.data.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">กำลังโหลดข้อมูล...</span>
        </div>
      </Card>
    );
  }

  if (!invoice && !loading) {
    return (
      <Card>
        <div className="text-center p-8">
          <p className="text-gray-600">ไม่พบข้อมูลใบกำกับภาษี</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="แก้ไขใบกำกับภาษี">
      <InvoiceForm
        isEdit={true}
        initialData={invoice}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default InvoiceEdit;