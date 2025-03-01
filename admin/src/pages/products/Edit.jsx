import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import CardComponents from '../../components/shared/Card'
import ProductForm from '../../components/products/ProductForm';

const ProductEdit = ({token}) => {
  const { categoryName, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { Card } = CardComponents;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/${categoryName}/${productId}`);
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (categoryName && productId) {
      fetchProduct();
    }
  }, [categoryName, productId]);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/product/update/${categoryName}/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token
          },
        }
      );

      if (response.data.success) {
        toast.success('Product updated successfully');
        navigate('/products');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">กำลังโหลดรายละเอียดสินค้า...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">ไม่พบรายการสินค้า</p>
      </div>
    );
  }

  return (
    <Card title={`แก้ไขสินค้า - ${product.ชื่อ}`}>
      <ProductForm
        isEdit={true}
        initialData={product}
        categorySlug={categoryName}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ProductEdit;