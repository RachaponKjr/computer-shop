import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, category }) => {
  const getFirstImage = () => {
    for (const [key, value] of Object.entries(product)) {
      
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' && value[0].startsWith('http')) {
        return value[0];
      }
    }
    return '/placeholder-product.png';
  };

  return (
    <Link to={`/product/${category}/${product._id}`}>
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
        <img 
          src={getFirstImage()} 
          alt={product.ชื่อ || 'Product'}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="font-medium text-gray-900 mb-1 truncate">
          {product.ชื่อ || 'Product Name'}
        </h3>
        <p className="text-gray-500 text-sm">
          {product.ราคา ? `฿${product.ราคา.toLocaleString()}` : 'Price not available'}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;