import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import CategoryForm from '../../components/categories/CategoryForm';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../../App';

const CategoryEdit = ({token}) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/edit/${name}`);
        
        console.log(response);
        
        if (response.data.success) {
          setCategory(response.data.category);
        } else {
          toast.error('ไม่พบหมวดหมู่ที่ต้องการแก้ไข');
          //navigate('/categories');
        }
      } catch (error) {
        console.error(error);
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        navigate('/categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [name, navigate]);

  const handleSubmit = async (categoryData) => {
    try {
      const response = await axios.post(`${backendUrl}/api/category/update/${name}`, categoryData, {headers:{token}});
      
      if (response.data.success) {
        toast.success('บันทึกการเปลี่ยนแปลงเรียบร้อย');
        navigate('/categories');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-lg">ไม่พบข้อมูลหมวดหมู่</p>
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            กลับไปหน้าหมวดหมู่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="space-y-4 sm:space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 sm:mb-0"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">กลับ</span>
          </button>
          
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            แก้ไขหมวดหมู่: {category.name}
          </h1>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                แก้ไขรายละเอียดหมวดหมู่และฟิลด์ต่างๆ ด้านล่าง
              </p>
            </div>

            <div className="mt-4">
              <CategoryForm 
                isEdit={true}
                initialData={category}
                onSubmit={handleSubmit}
                className="max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEdit;