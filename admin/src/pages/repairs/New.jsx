import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import CardComponents from '../../components/shared/Card';
import RepairInvoiceForm from '../../components/repairs/RepairInvoiceForm';

const RepairInvoiceNew = ({token}) => {
  const navigate = useNavigate();
  const { Card } = CardComponents;

  const handleSubmit = async (formData) => {
    try {
      console.log(formData);
      
      const response = await axios.post(`${backendUrl}/api/repair/create`, formData, {headers:{token}});
      
      if (response.data.success) {
        toast.success('บันทึกใบเสนอราคาเรียบร้อยแล้ว');
        navigate('/repairs');
      } else {
        toast.error(response.data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error creating repair invoice:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <Card title="สร้างใบเสนอราคาซ่อมอุปกรณ์">
      <RepairInvoiceForm onSubmit={handleSubmit} />
    </Card>
  );
};

export default RepairInvoiceNew;