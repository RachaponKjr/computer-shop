import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, ImageOff, ArrowLeftRight } from 'lucide-react';
import DeleteProductDialog from './DeleteProductDialog';

const ProductTable = ({
  products,
  sortOrder,
  toggleSort,
  handleDelete,
  deleteDialogOpen,
  selectedProduct,
  setDeleteDialogOpen,
  setSelectedProduct
}) => {
  return (
    <div>
      {/* Desktop and Tablet View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รูปภาพ</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={toggleSort}
              >
                <div className="flex items-center gap-2">
                  ชื่อสินค้า
                  <ArrowLeftRight size={14} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้าในคลัง</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    {product.categoryName || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {product.รูปภาพ && product.รูปภาพ[0] ? (
                      <img
                        src={product.รูปภาพ[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageOff size={24} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.ชื่อ}</div>
                  {product.แบรนด์ && (
                    <div className="text-sm text-gray-500">{product.แบรนด์}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.ราคา ? `฿${Number(product.ราคา).toLocaleString()}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.มีสินค้า
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.มีสินค้า ? 'มี' : 'หมด'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/products/edit/${product.categoryName}/${product._id}`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Pencil size={18} />
                    </Link>
                    <DeleteProductDialog
                      product={product}
                      onDelete={handleDelete}
                      open={deleteDialogOpen && selectedProduct?._id === product._id}
                      onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (open) {
                          setSelectedProduct(product);
                        } else {
                          setSelectedProduct(null);
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        <div 
          className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
          onClick={toggleSort}
        >
          <span className="text-sm font-medium text-gray-500 uppercase">ชื่อสินค้า</span>
          <ArrowLeftRight size={14} className="text-gray-500" />
        </div>
        
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {product.รูปภาพ && product.รูปภาพ[0] ? (
                  <img
                    src={product.รูปภาพ[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageOff size={24} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">{product.ชื่อ}</h3>
                    {product.แบรนด์ && (
                      <p className="text-sm text-gray-500">{product.แบรนด์}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/edit/${product.categoryName}/${product._id}`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Pencil size={18} />
                    </Link>
                    <DeleteProductDialog
                      product={product}
                      onDelete={handleDelete}
                      open={deleteDialogOpen && selectedProduct?._id === product._id}
                      onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (open) {
                          setSelectedProduct(product);
                        } else {
                          setSelectedProduct(null);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    {product.categoryName || 'Uncategorized'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.มีสินค้า
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.มีสินค้า ? 'มี' : 'หมด'}
                  </span>
                </div>
                
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {product.ราคา ? `฿${Number(product.ราคา).toLocaleString()}` : '-'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;