import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductsGrid2';
import Pagination from '../components/Pagination';
import { ShopContext } from '../context/ShopContext';

const Category = () => {
  const { category } = useParams();
  const { fetchProductsByCategory } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [stockFilter, setStockFilter] = useState('inStock');
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [viewMode, setViewMode] = useState('grid');
  
  const productsPerPage = 16;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProductsByCategory(category);
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, fetchProductsByCategory]);

  // Apply all filters
  const filteredProducts = products.filter(product => {
    const price = product.ราคา || 0;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.แบรนด์);
    const matchesPrice = price >= priceRange[0] && (priceRange[1] === Infinity || price <= priceRange[1]);
    const matchesStock = stockFilter === 'inStock' ? product['มีสินค้า'] : !product['มีสินค้า'];
    
    return matchesBrand && matchesPrice && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.ราคา || 0;
    const priceB = b.ราคา || 0;
    const nameA = a.ชื่อ || '';
    const nameB = b.ชื่อ || '';
    
    switch(sortOrder) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return nameA.localeCompare(nameB);
      case 'name-desc':
        return nameB.localeCompare(nameA);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TopBar 
          totalProducts={filteredProducts.length}
          onSortChange={setSortOrder}
          onViewChange={setViewMode}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <FilterSidebar 
            category={category}
            onBrandFilter={setSelectedBrands}
            onPriceRangeFilter={setPriceRange}
            onStockFilter={setStockFilter}
          />
          <div className="flex-1">
            <ProductGrid 
              products={displayedProducts} 
              category={category}
              viewMode={viewMode}
            />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;