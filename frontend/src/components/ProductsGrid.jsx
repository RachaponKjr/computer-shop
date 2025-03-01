import React from 'react';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';

const ProductsGrid = ({ title, products, loading, category }) => {
  if (loading) {
    return (
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          No products found in this category
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">{title}</h2>
        <a href={`/category/${title}`} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ดูทั้งหมด
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            category={category} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;