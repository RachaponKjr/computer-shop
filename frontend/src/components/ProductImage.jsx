import React from "react";
import { useState } from "react";

const ProductImage = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <img 
          src={images[selectedImage]} 
          alt="Product" 
          className="w-full aspect-square object-contain bg-white rounded-lg"
        />
      </div>
      <div className="flex gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 border rounded-lg p-2 ${
              selectedImage === index ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImage