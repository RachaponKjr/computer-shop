import React, { useState, useEffect } from 'react';
import { Search, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../../App';

const ProductSelector = ({ onSelect, onClose }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState({});
  const productsPerPage = 10;

  const filteredProducts = products.filter(product => 
    product.ชื่อ?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.แบรนด์?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
        const initialQuantities = {};
        response.data.products.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">รูปภาพ</th>
              <th className="p-3 text-left">ชื่อสินค้า</th>
              <th className="p-3 text-left">แบรนด์</th>
              <th className="p-3 text-right">ราคา</th>
              <th className="p-3 text-center">จำนวน</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">กำลังโหลดข้อมูล...</td>
              </tr>
            ) : currentProducts.map(product => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-3 w-20">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    {product.รูปภาพ && product.รูปภาพ[0] ? (
                      <img
                        src={product.รูปภาพ[0]}
                        alt={product.ชื่อ}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span className="font-medium">{product.ชื่อ}</span>
                </td>
                <td className="p-3 text-gray-600">{product.แบรนด์ || '-'}</td>
                <td className="p-3 text-right font-medium">
                  ฿{Number(product.ราคา).toLocaleString()}
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product._id]}
                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                    className="w-20 text-center border rounded p-1"
                  />
                </td>
                <td className="p-3 text-right">
                <button
                  onClick={() => onSelect({
                    id: product._id,
                    description: product.ชื่อ,
                    specifications: product.สเปค || '',
                    unitPrice: product.ราคา,
                    quantity: quantities[product._id],
                    image: product.รูปภาพ && product.รูปภาพ[0] ? product.รูปภาพ[0] : null,
                  })}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  เพิ่ม
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่พบสินค้าที่ค้นหา
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            แสดง {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} จาก {filteredProducts.length} รายการ
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-2">
              หน้า {currentPage} จาก {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;