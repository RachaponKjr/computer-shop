import React, { useContext } from 'react';
import CategoryCard from './CategoryCard';
import { ShopContext } from '../context/ShopContext';

const CategoriesGrid = ({ title }) => {
  const { categories, loading, error } = useContext(ShopContext);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  // Filter categories based on their properties if needed
  const mainCategories = categories.filter(category => 
    // Add your filtering logic here if needed
    // For now, showing all categories in a single grid
    category
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path 
            d="M4 6h16M4 12h16M4 18h16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {mainCategories.map((category) => (
          <CategoryCard 
            key={category._id} 
            id={category._id}
            name={category.name}
            icon={category.icon}
            path={'/category/' + category.name}
            customIcon={category.customIcon}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;