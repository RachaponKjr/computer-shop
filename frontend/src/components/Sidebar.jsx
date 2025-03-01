import { useContext } from 'react';
import CategoryIcon from './CategoryIcon';
import { Scissors } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const Sidebar = ({ activeCategoryId, onCategoryClick }) => {
  const { categories, loading } = useContext(ShopContext);

  if (loading) {
    return (
      <div className="w-56 flex-shrink-0">
        <div className="bg-white rounded-lg">
          <div className="p-4 border-b flex items-center gap-2">
            <Scissors className="w-5 h-5 text-red-500" />
            <span className="font-medium">สินค้า</span>
          </div>
          <div className="py-2 flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 flex-shrink-0">
      <div className="bg-white rounded-lg">
        <div className="p-4 border-b flex items-center gap-2">
          <Scissors className="w-5 h-5 text-red-500" />
          <span className="font-medium">สินค้า</span>
        </div>
        <div className="py-2">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryClick(category)}
              className={`w-full flex items-center gap-3 px-4 py-2 ${
                category._id === activeCategoryId
                  ? 'bg-gray-50 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <CategoryIcon name={category.icon || 'cpu'} customIcon={category.customIcon} className="w-5 h-5" />
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;