import React from 'react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products, category  }) => {
  
  return (
    <div className="flex-1">
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} category={category} />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;