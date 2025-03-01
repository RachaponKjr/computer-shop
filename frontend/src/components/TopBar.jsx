import { useState } from 'react';

const TopBar = ({ totalProducts, onSortChange, onViewChange }) => {
  const [viewMode, setViewMode] = useState('grid');

  const handleViewChange = (mode) => {
    setViewMode(mode);
    onViewChange(mode);
  };

  return (
    <div className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>สินค้า</span>
          <span className="text-gray-400">จำนวน {totalProducts} รายการ</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>เรียงโดย: </span>
            <select 
              className="border rounded px-2 py-1 text-sm"
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="price-asc">ราคาต่ำ-สูง</option>
              <option value="price-desc">ราคาสูง-ต่ำ</option>
              <option value="name-asc">ชื่อ A-Z</option>
              <option value="name-desc">ชื่อ Z-A</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span>View: </span>
            <button 
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleViewChange('grid')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button 
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleViewChange('list')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;