import React from 'react';
import CategoryIcon  from './CategoryIcon';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ icon, name, path, customIcon }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div 
      onClick={handleClick} 
      className="bg-white p-4 rounded-lg flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow duration-200"
    >
      <div className="text-gray-600 mb-2">
        <CategoryIcon name={icon} customIcon={customIcon} className="w-6 h-6" />
      </div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
  );
};

export default CategoryCard;