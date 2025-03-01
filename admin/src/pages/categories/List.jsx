import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, ArrowLeftRight, Search, Pencil } from 'lucide-react';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import CategoryIcon from '../../components/shared/CategoryIcon';
import DeleteCategoryDialog from '../../components/categories/DeleteCategoryDialog';

const CategoryList = ({token}) => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list');
      if (response.data.success) {
        setCategories(response.data.categories);
        setTotalCategories(response.data.categories.length);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryName) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/category/delete/${categoryName}`, {headers:{token}});
      if (response.data.success) {
        toast.success('หมวดหมู่ถูกลบเรียบร้อยแล้ว');
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'ไม่สามารถลบหมวดหมู่ได้');
    }
    setIsDeleteOpen(false);
    setCategoryToDelete(null);
  };

  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  // Filter, sort and paginate categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const compareResult = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? compareResult : -compareResult;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = sortedCategories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">หมวดหมู่สินค้า</h1>
          <p className="text-gray-600 mt-1">
            {filteredCategories.length} รายการ
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block  rounded-md w-full pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="ค้นหาหมวดหมู่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link 
            to="/categories/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            เพิ่มหมวดหมู่
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <div className="min-w-full divide-y divide-gray-200">
          <table className="min-w-full divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-16">
                  สัญลักษณ์
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    ชื่อหมวดหมู่
                    <ArrowLeftRight size={14} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCategories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CategoryIcon 
                      name={category.icon}
                      className="h-6 w-6" 
                      customIcon={category.customIcon}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-4">
                      <Link 
                        to={`/categories/edit/${category.name}`}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                       <Pencil size={18} />
                      </Link>
                      <DeleteCategoryDialog 
                        category={category}
                        onDelete={handleDelete}
                        open={isDeleteOpen && categoryToDelete?._id === category._id}
                        onOpenChange={(open) => {
                          setIsDeleteOpen(open);
                          setCategoryToDelete(open ? category : null);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {currentCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ไม่พบรายการหมวดหมู่'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              ก่อนหน้า
            </button>
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              ถัดไป
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                แสดง{' '}
                <span className="font-medium">{startIndex + 1}</span>
                {' '}ถึง{' '}
                <span className="font-medium">
                  {Math.min(endIndex, filteredCategories.length)}
                </span>
                {' '}จาก{' '}
                <span className="font-medium">{filteredCategories.length}</span>
                {' '}รายการ
              </p>
            </div>
            <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Add page numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;