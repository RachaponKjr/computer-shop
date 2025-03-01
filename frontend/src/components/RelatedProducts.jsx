import React from "react";
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RelatedProducts = ({ products, category }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const productsToShow = 4;
  
  const nextSlide = () => {
    setCurrentIndex((prev) => 
      Math.min(prev + 1, products.length - productsToShow)
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  
  return (
    <div className="w-full mt-12">
      <h2 className="text-lg font-semibold mb-6">สินค้าที่เกี่ยวข้อง</h2>
      <div className="relative">
        {currentIndex > 0 && (
          <button 
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        <div className="flex gap-6 overflow-hidden">
          {products.slice(currentIndex, currentIndex + productsToShow).map((product) => (
            <div key={product._id} className="w-64 flex-shrink-0">
              <ProductCard product={product} category={category} />
            </div>
          ))}
        </div>
        
        {currentIndex < products.length - productsToShow && (
          <button 
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;