import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const FilterSidebar = ({ category, onBrandFilter, onPriceRangeFilter, onStockFilter }) => {
  const { fetchProductsByCategory } = useContext(ShopContext);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [stockFilter, setStockFilter] = useState('inStock');
  const [categoryFields, setCategoryFields] = useState(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        // ใช้ fetchProductsByCategory จาก context แทน
        const products = await fetchProductsByCategory(category);
        
        // Get unique brands
        const brands = [...new Set(products.map(product => product.แบรนด์))];
        setAvailableBrands(brands);
        
        // Get price range
        const prices = products.map(product => product.ราคา || 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        onPriceRangeFilter([minPrice, maxPrice]);
        
        // ดึง fields จาก products[0] แทน (ถ้ามี schema field)
        if (products[0]?.fields) {
          setCategoryFields(products[0].fields);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      }
    };

    if (category) {
      loadCategoryData();
    }
  }, [category, fetchProductsByCategory]);

  // Generate category-specific filters based on schema fields
  const getCategoryFilters = () => {
    if (!categoryFields) return null;

    const filterFields = categoryFields.filter(field => field.config?.isFilter);
    
    return filterFields.map(field => {
      switch (field.type) {
        case 'select':
        case 'multiselect':
          return (
            <div key={field.id} className="mb-4">
              <h4 className="font-medium mb-2">{field.display.label}</h4>
              <div className="space-y-2">
                {field.validation.options.map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <input type="checkbox" /> {option}
                  </label>
                ))}
              </div>
            </div>
          );
        case 'boolean':
          return (
            <div key={field.id} className="mb-4">
              <h4 className="font-medium mb-2">{field.display.label}</h4>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> {field.display.label}
              </label>
            </div>
          );
        default:
          return null;
      }
    });
  };

  const handleBrandChange = (brand, checked) => {
    const newSelectedBrands = checked 
      ? [...selectedBrands, brand]
      : selectedBrands.filter(b => b !== brand);
    
    setSelectedBrands(newSelectedBrands);
    onBrandFilter(newSelectedBrands);
  };

  const handleStockChange = (value) => {
    setStockFilter(value);
    onStockFilter(value);
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="border rounded-lg bg-white p-4">
        <h3 className="font-medium mb-4">เลือกการแสดงสินค้า</h3>
        
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              name="stock" 
              value="inStock"
              checked={stockFilter === 'inStock'}
              onChange={(e) => handleStockChange(e.target.value)}
            />
            <span>มีในสต็อก</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              name="stock"
              value="outOfStock"
              checked={stockFilter === 'outOfStock'}
              onChange={(e) => handleStockChange(e.target.value)}
            />
            <span>ไม่มีในสต็อก</span>
          </label>
        </div>

        <div className="mb-6">
          <h4 className="text-sm text-gray-600 mb-2">ช่วงราคา</h4>
          <div className="flex items-center gap-2 mb-2">
            <input 
              type="number" 
              value={priceRange[0]}
              onChange={(e) => {
                const newRange = [parseInt(e.target.value), priceRange[1]];
                setPriceRange(newRange);
                onPriceRangeFilter(newRange);
              }}
              className="w-24 border rounded px-2 py-1"
            />
            <span>-</span>
            <input 
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const newRange = [priceRange[0], parseInt(e.target.value)];
                setPriceRange(newRange);
                onPriceRangeFilter(newRange);
              }}
              className="w-24 border rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm text-gray-600 mb-2">Brand</h4>
          {availableBrands.map(brand => (
            <label key={brand} className="flex items-center gap-2 mb-2">
              <input 
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleBrandChange(brand, e.target.checked)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>

        {/* Category-specific filters */}
        {getCategoryFilters()}
      </div>
    </div>
  );
};

export default FilterSidebar;