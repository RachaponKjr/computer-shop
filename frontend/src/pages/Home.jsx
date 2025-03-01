import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import CategoriesGrid from '../components/CategoriesGrid';
import Sidebar from '../components/Sidebar';
import ProductsGrid from '../components/ProductsGrid';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Home = () => {
  const { categories, loading: categoriesLoading } = useContext(ShopContext);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    if (!categoriesLoading && categories.length > 0 && !activeCategory) {
      setActiveCategory({
        _id: categories[0]._id,
        name: categories[0].name,
        icon: categories[0].icon
      });
    }
  }, [categories, categoriesLoading]);

  useEffect(() => {
    if (activeCategory) {
      fetchProducts(activeCategory.name === "ทั้งหมด" ? "" : activeCategory.name);
    }
  }, [activeCategory]);

  const fetchProducts = async (categoryName) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list/${categoryName}`);

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory({
      _id: category._id,
      name: category.name,
      icon: category.icon
    });
  };

  if (categoriesLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* หมวดหมู่สินค้า */}
      <CategoriesGrid title="หมวดหมู่สินค้า" />

      {/* ส่วน DIY */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <Sidebar
            activeCategoryId={activeCategory?._id}
            onCategoryClick={handleCategoryClick}
          />

          {/* สินค้า */}
          {activeCategory && (
            <ProductsGrid
              title={activeCategory.name}
              products={products}
              loading={loading}
              category={activeCategory.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;