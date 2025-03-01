import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import CategoryForm from '../../components/categories/CategoryForm';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';

const CategoryNew = ({token}) => {
  const navigate = useNavigate();
  
  const handleSubmit = async (categoryData) => {
    try {
      const response = await axios.post(backendUrl + "/api/category/create", categoryData, {headers:{token}});
      
      if (response.data.success) {
        toast.success('สร้างหมวดหมู่สำเร็จ');
        navigate('/categories');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="space-y-4 sm:space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">กลับ</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                สร้างหมวดหมู่สินค้า
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                กรอกข้อมูลด้านล่างเพื่อสร้างหมวดหมู่สินค้าใหม่
              </p>
            </div>

            {/* Form */}
            <div className="mt-4">
              <CategoryForm 
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

export default CategoryNew;