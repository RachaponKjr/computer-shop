import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import ProductHeader from '../../components/products/ProductHeader';
import ProductFilter from '../../components/products/ProductFilter';
import ProductTable from '../../components/products/ProductTable';
import Pagination from '../../components/products/Pagination';
import { Link } from 'react-router-dom';

const ProductList = ({token}) => {
  // State Management (unchanged)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Search, Pagination, and Sorting States (unchanged)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Filter States (unchanged)
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockStatus, setStockStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const itemsPerPage = 10;

  // Fetch Products (unchanged)
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
        setLoading(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.message);
    }
  };

  // Handle Product Deletion (unchanged)
  const handleDelete = async (categoryName, productId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/product/remove/${categoryName}/${productId}`, {headers:{token}}
      );
      if (response.data.success) {
        toast.success('ลบสินค้าเรียบร้อยแล้ว');
        fetchProducts();
        setDeleteDialogOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Effects (unchanged)
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, stockStatus]);

  // Sort and Filter Logic (unchanged)
  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  const categories = [...new Set(products.map(product => product.categoryName))].filter(Boolean);

  // Filtering logic (unchanged)
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.ชื่อ.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.แบรนด์ && product.แบรนด์.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = !selectedCategory || product.categoryName === selectedCategory;

    const price = Number(product.ราคา);
    const matchesPrice = 
      (!priceRange.min || price >= Number(priceRange.min)) &&
      (!priceRange.max || price <= Number(priceRange.max));

    const matchesStock = stockStatus === 'all' || 
      (stockStatus === 'inStock' && product.มีสินค้า) ||
      (stockStatus === 'outOfStock' && !product.มีสินค้า);

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const compareResult = a.ชื่อ.localeCompare(b.ชื่อ);
    return sortOrder === 'asc' ? compareResult : -compareResult;
  });

  // Pagination Logic (unchanged)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-base sm:text-lg text-gray-600">โหลดรายการสินค้า...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-7xl mx-auto">
      <div className="sticky top-0 z-10 bg-white pb-2">
        <ProductHeader 
          filteredCount={filteredProducts.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      {showFilters && (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            stockStatus={stockStatus}
            setStockStatus={setStockStatus}
          />
        </div>
      )}

      {currentProducts.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg mx-2 sm:mx-0">
          <p className="text-gray-600 text-sm sm:text-base">
            {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ไม่พบรายการสินค้า'}
          </p>
          {!searchTerm && (
            <Link 
              to="/products/new"
              className="text-blue-600 hover:text-blue-800 mt-2 inline-block text-sm sm:text-base"
            >
              เพิ่มสินค้าชิ้นแรก
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <ProductTable
              products={currentProducts}
              sortOrder={sortOrder}
              toggleSort={toggleSort}
              handleDelete={handleDelete}
              deleteDialogOpen={deleteDialogOpen}
              selectedProduct={selectedProduct}
              setDeleteDialogOpen={setDeleteDialogOpen}
              setSelectedProduct={setSelectedProduct}
            />
          </div>

          {totalPages > 1 && (
            <div className="mt-4 sm:mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={filteredProducts.length}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;