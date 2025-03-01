import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import CardComponents from '../../components/shared/Card';
import InvoiceForm from '../../components/invoices/InvoiceForm';

const InvoiceNew = ({token}) => {
  const navigate = useNavigate();
  const { Card } = CardComponents;

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(`${backendUrl}/api/invoice/create`, formData, {headers: {'Content-Type': 'multipart/form-data', token}});
      
      if (response.data.success) {
        toast.success('บันทึกใบกำกับภาษีเรียบร้อยแล้ว');
        navigate('/invoices');
      } else {
        toast.error(response.data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <Card title="สร้างใบกำกับภาษีใหม่">
      <InvoiceForm onSubmit={handleSubmit} />
    </Card>
  );
};

export default InvoiceNew;