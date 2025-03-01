import CardComponents from '../../components/shared/Card'
import ProductForm from '../../components/products/ProductForm';
import axios from 'axios';
import { backendUrl } from '../../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductNew = ({token}) => {
  const { Card } = CardComponents;
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', token
          },
        }
      );

      if (response.data.success) {
        toast.success('เพิ่มสินค้าสำเร็จ');
        navigate('/products');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'เพิ่มสินค้าไม่สำเร็จ');
    }
  };

  return (
    <Card title="เพิ่มสินค้าใหม่">
      <ProductForm onSubmit={handleSubmit} />
    </Card>
  );
};

export default ProductNew;